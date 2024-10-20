import { promises as fs } from 'fs';
import pdf2md from '@opendocsg/pdf2md';

async function getPdfBuffer(browser, url) {
    const pdfPage = await browser.newPage();
    try {
        try {
            const response = await pdfPage.goto(url, { waitUntil: 'networkidle' });

            // Check if the response is a PDF
            const contentType = response.headers()['content-type'];
            if (contentType && contentType.includes('application/pdf')) {
                const buffer = await response.body();
                return buffer;
            }
        } catch (e) {}

        const downloadPromise = pdfPage.waitForEvent('download');
        // Dropbox specific handling
        if (url.includes("dropbox.com")) {
            url = url + "&dl=1"
        }
        try {
            await pdfPage.goto(url, { waitUntil: 'networkidle' });
        } catch (e) { }
        const download = await downloadPromise;
        const path = await download.path();
        const buffer = await fs.readFile(path);
        await fs.unlink(path);
        return buffer;
    } catch (error) {
        console.error(`Error downloading PDF from ${url}:`, error);
        throw error;
    } finally {
        await pdfPage.close();
    }
}

async function getMdContent(buffer) {
    try {
        const text = await pdf2md(new Uint8Array(buffer));
        return text;
    } catch (error) {
        console.error('Error converting PDF to Markdown:', error);
        throw error;
    }
}

export async function parse(browser, url) {
    const buffer = await getPdfBuffer(browser, url);
    const content = await getMdContent(buffer);
    return content;
}
