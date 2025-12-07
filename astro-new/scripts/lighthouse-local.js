
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import fs from 'fs';

(async () => {
    const chrome = await launch({ chromeFlags: ['--headless'] });
    const options = {
        logLevel: 'info',
        output: 'html',
        onlyCategories: ['performance'],
        port: chrome.port,
        strategy: 'mobile', // Force mobile testing
    };

    const pages = [
        '/',
        '/tools',
        '/blog',
        '/resume-maker',
        '/bmi-calculator',
        '/emi-calculator'
    ];

    for (const page of pages) {
        const url = `http://localhost:4321${page}`;
        console.log(`\nRunning Lighthouse on ${url}...`);

        const runnerResult = await lighthouse(url, {
            ...options,
            onlyCategories: ['accessibility'], // Focus on accessibility
        });

        const reportHtml = runnerResult.report;
        const filename = `lighthouse-a11y-${page.replace(/\//g, '') || 'home'}.html`;
        fs.writeFileSync(filename, reportHtml);

        const score = runnerResult.lhr.categories.accessibility.score * 100;
        console.log(`Accessibility score for ${page}: ${score}`);

        // Log failing audits specifically for contrast
        const audits = runnerResult.lhr.audits;
        if (audits['color-contrast'] && audits['color-contrast'].score !== 1) {
            console.log(`Color contrast issues found on ${page}:`);
            console.log(audits['color-contrast'].displayValue);
        }
    }

    await chrome.kill();
})();
