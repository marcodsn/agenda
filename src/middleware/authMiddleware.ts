import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey || apiKey !== process.env.API_KEY) {
        console.log(`Unauthorized access attempt from IP: ${req.ip}`);
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    // console.log(`Authorized access from IP: ${req.ip}`);

    next();
};

export default authMiddleware;