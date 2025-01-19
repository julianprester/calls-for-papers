import { promises as fs } from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function getPdfBuffer(browser, url) {
    const page = await browser.newPage();
    if (url.includes('sharepoint.com')) {
        return null;
    }
    if (url.includes('dropbox.com')) {
        url = url + '&dl=1';
    }
    try {
        const downloadPromise = page.waitForEvent('download');
        try {
            await page.goto(url);
        } catch (error) { }
        const download = await downloadPromise;
        await download.saveAs(download.suggestedFilename());
        const pdfBuffer = await fs.readFile(download.suggestedFilename());
        await page.close();
        await fs.unlink(download.suggestedFilename());
        return pdfBuffer;
    } catch (error) {
        console.error(`Error downloading PDF from ${url}:`, error);
        throw error;
    } finally {
        await page.close();
    }
}

async function getPdfContent(buffer) {
    try {
        const uint8Array = new Uint8Array(buffer);
        const pdf = await pdfjsLib.getDocument(uint8Array).promise;
        let content = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        return content;
    } catch (error) {
        console.error('Error reading PDF content:', error);
        throw error;
    }
}

export async function parse(browser, url) {
    const buffer = await getPdfBuffer(browser, url);
    if (!buffer) {
        return '';
    }
    const content = await getPdfContent(buffer);
    return content;
}
