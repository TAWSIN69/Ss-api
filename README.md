# Puppeteer Screenshot API with Browser Pooling & Caching

This is a Node.js API service built with Express and Puppeteer that captures full-page screenshots of any URL. It uses a browser pool for efficient resource management and an in-memory LRU cache to speed up repeated requests.

---

## Features

- Capture full-page screenshots of webpages
- Automatic `https://` prefixing for URLs missing a scheme
- Browser pooling to reuse Chromium instances and improve performance
- LRU caching of screenshots with configurable TTL (default 5 minutes)
- Rate limiting to prevent abuse (30 requests per 15 minutes per IP)
- Customizable viewport size, screenshot delay, and full-page toggle via query parameters
- Graceful error handling with meaningful HTTP responses

---

## Installation

1. Clone this repository or copy the source files.
2. Run `npm install` to install dependencies.

```bash
npm install
