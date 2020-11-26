import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';

interface TokenPayload {
    id: string;
    autorizados: string[];
    iat: number;
    exp: number;
}

export default function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { authorization } = req.headers;
    const cnpj = req.headers['x-doc'];

    if (!authorization || !cnpj) {
        throw new AppError('Não autorizado', 401);
    }

    const secret = process.env.JWT_SECRET || '~m|ZMw5xc_xc]r=fY6|K<=.@uyIaFO';
    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, secret);
        const { id, autorizados } = data as TokenPayload;

        if (!autorizados.includes(`${cnpj}`)) return res.sendStatus(401);

        req.user = { id, autorizados, doc: `${cnpj}` };

        return next();
    } catch (e) {
        // console.log(e.message);
        throw new AppError('Não autorizado', 401);
    }
}
