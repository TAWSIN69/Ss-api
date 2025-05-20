function sanitizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
        return 'https://' + url;
    }
    return url;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    sanitizeUrl,
    isValidUrl
};
