import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { parseISO, isAfter, isSameDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import AppError from '../errors/AppError';

interface IClienteLicenca {
    sucess: boolean;
    error?: string;
    result?: {
        cliente: number;
        validade: string;
        baixarxml: string;
        autorizados: string[];
    };
}

class AuthController {
    async authenticate(req: Request, res: Response) {
        const { cliente, cnpj } = req.body;
        const url = process.env.AUTH_API || null;
        const tokenAuth = process.env.AUTH_TOKEN || null;
        const secret =
            process.env.JWT_SECRET || '~m|ZMw5xc_xc]r=fY6|K<=.@uyIaFO';

        if (!cliente && !cnpj) {
            throw new AppError('Não autorizado', 401);
        }

        if (!url || !tokenAuth || !secret) {
            throw new AppError('Não autorizado', 401);
        }

        const path = cnpj ? `licenca/cnpj/${cnpj}` : `licenca/${cliente}`;

        const request = await axios.get(`${url}/${path}`, {
            headers: {
                'X-Token': tokenAuth,
            },
        });

        const data: IClienteLicenca = request.data as IClienteLicenca;
        if (!data.sucess || !data.result) {
            throw new AppError(data.error || 'Não autorizado', 401);
        }

        const { validade, baixarxml, autorizados } = data.result;

        const parsedDate = parseISO(validade);
        const znDate = zonedTimeToUtc(new Date(), 'America/Sao_Paulo');

        const isValid =
            isAfter(parsedDate, znDate) || isSameDay(parsedDate, znDate);

        if (!isValid || baixarxml !== 'S')
            throw new AppError('Não autorizado', 401);

        const token = jwt.sign({ id: cliente, autorizados }, secret, {
            expiresIn: '1d',
        });

        return res.json({ token });
    }
}

export default new AuthController();
