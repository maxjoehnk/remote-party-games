import onResponse from 'on-response';

export const loggingMiddleware = (req, res, next) => {
    const start = Date.now();
    onResponse(req, res, () => {
        const duration = Date.now() - start;
        console.log(`[HTTP] ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);
    });
    next();
};