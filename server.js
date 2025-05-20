const express = require('express');
const puppeteer = require('puppeteer');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const { sanitizeUrl, isValidUrl } = require('./utils');
const { DEFAULTS } = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { error: 'Too many requests, try again later.' }
});
app.use('/api/ss', limiter);

app.get('/api/ss', async (req, res) => {
    let rawUrl = req.query.url;
    if (!rawUrl) return res.status(400).json({ error: 'Missing url parameter' });

    const url = sanitizeUrl(rawUrl);
    if (!isValidUrl(url)) return res.status(400).json({ error: 'Invalid URL format' });

    const delay = parseInt(req.query.delay) || DEFAULTS.delay;
    const fullPage = req.query.fullPage !== 'false';
    const format = req.query.format === 'jpeg' ? 'jpeg' : 'png';
    const width = parseInt(req.query.width) || DEFAULTS.width;
    const height = parseInt(req.query.height) || DEFAULTS.height;
    const saveToFile = req.query.save === 'true';

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width, height });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(resolve => setTimeout(resolve, delay));

        const screenshotOptions = {
            type: format,
            fullPage,
            encoding: 'binary'
        };

        if (saveToFile) {
            const fileName = `${Date.now()}.${format}`;
            const savePath = path.join(__dirname, 'screenshots', fileName);
            screenshotOptions.path = savePath;
        }

        const image = await page.screenshot(screenshotOptions);
        res.set('Content-Type', `image/${format}`);
        res.send(image);
    } catch (err) {
        console.error('Screenshot Error:', err.message);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
