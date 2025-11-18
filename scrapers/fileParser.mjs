import { promises as fs } from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

async function downloadFile(browser, url) {
    const page = await browser.newPage();
    try {
        // Dropbox path
        let downloadPromise;
        let download;
        if (url.includes('sharepoint.com')) {
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' });
                try {
                    downloadPromise = page.waitForEvent('download');
                    const clickPromoise =  page.locator('#WacFrame_Word_0').contentFrame().getByRole('button', { name: 'Download' }).click();
                    download = await Promise.all([downloadPromise, clickPromoise]);
                } catch (error) {
                    throw error;
                }
            } catch (error) {}
        } else {
            if (url.includes('dropbox.com')) {
                url = url + '&dl=1';
            }
            downloadPromise = page.waitForEvent('download');
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded' });
            } catch (error) {}
            download = await downloadPromise;
        }
        await download.saveAs(download.suggestedFilename());
        const buffer = await fs.readFile(download.suggestedFilename());
        await page.close();
        await fs.unlink(download.suggestedFilename());
        return { type: download.suggestedFilename().split('.').pop(), buffer: buffer };
    } catch (error) {
        console.error(`Error downloading file from ${url}:`, error);
        return null;
    } finally {
        await page.close();
    }
}

async function getContent(buffer, type) {
    if (type === 'pdf') {
        try {
            const uint8Array = new Uint8Array(buffer);
            const pdf = await pdfjsLib.getDocument({ data: uint8Array, verbosity: pdfjsLib.VerbosityLevel.ERRORS }).promise;
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
    } else if (type === 'docx') {
        try {
            const result = await mammoth.extractRawText({ buffer: buffer });
            return result.value;
        } catch (error) {
            console.error('Error reading DOCX content:', error);
            throw error;
        }
    }
}

export async function parse(browser, url) {
    const file = await downloadFile(browser, url);
    if (!file) {
        console.warn(`Skipping file parsing for ${url} due to download failure`);
        return null;
    }
    const content = await getContent(file.buffer, file.type);
    return content;
}
