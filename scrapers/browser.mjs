import { chromium } from 'patchright';
import fs from 'fs';

export async function startBrowser() {
    const tmpDir = fs.mkdtempSync(`/tmp/pwtest`);
    fs.mkdirSync(`${tmpDir}/userdir/Default`, { recursive: true });

    const defaultPreferences = {
        plugins: {
            always_open_pdf_externally: true,
        },
    }

    fs.writeFileSync(`${tmpDir}/userdir/Default/Preferences`, JSON.stringify(defaultPreferences));

    const browser = await chromium.launchPersistentContext(`${tmpDir}/userdir`, {
        channel: "chrome",
        headless: false,
        viewport: null,
        acceptDownloads: true,
    });
    return browser;
}
