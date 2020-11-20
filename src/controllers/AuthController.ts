import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { parseISO, isAfter, isSameDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

interface IClienteLicenca {
    sucess: boolean;
    error?: string;
    result?: {
        cliente: number;
        validade: string;
        baixarxml: string;
    };
}

class AuthController {
    async authenticate(req: Request, res: Response) {
        const { cliente } = req.body;
        const url = process.env.AUTH_API || null;
        const tokenAuth = process.env.AUTH_TOKEN || null;
        const secret =
            process.env.JWT_SECRET || '~m|ZMw5xc_xc]r=fY6|K<=.@uyIaFO';

        if (!cliente || !url || !tokenAuth || !secret) {
            return res.json({ error: 'Não autorizado' }).status(401);
        }

        const request = await axios.get(`${url}/licenca/${cliente}`, {
            headers: {
                'X-Token': tokenAuth,
            },
        });

        const data: IClienteLicenca = request.data as IClienteLicenca;
        if (!data.sucess || !data.result) {
            return res.json({ error: data.error }).status(401);
        }

        const { validade, baixarxml } = data.result;

        const parsedDate = parseISO(validade);
        const znDate = zonedTimeToUtc(new Date(), 'America/Sao_Paulo');

        const isValid =
            isAfter(parsedDate, znDate) || isSameDay(parsedDate, znDate);

        if (!isValid || baixarxml !== 'S')
            return res.json({ error: 'Não autorizado' }).status(401);

        const token = jwt.sign({ id: cliente }, secret, {
            expiresIn: '1d',
        });

        return res.json({ token });
    }
}

export default new AuthController();