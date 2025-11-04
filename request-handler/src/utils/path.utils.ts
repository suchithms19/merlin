const getContentType = (filePath: string): string => {
    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.js')) return 'application/javascript';
    if (filePath.endsWith('.json')) return 'application/json';
    if (filePath.endsWith('.png')) return 'image/png';
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
    if (filePath.endsWith('.svg')) return 'image/svg+xml';
    return 'application/octet-stream';
};

const extractDeploymentId = (hostname: string): string => {
    return hostname.split('.')[0];
};

const normalizePath = (path: string): string => {
    return path === '/' ? '/index.html' : path;
};

export {
    getContentType,
    extractDeploymentId,
    normalizePath
};