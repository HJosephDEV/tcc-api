import jwt from 'jsonwebtoken';

export function gerarToken(payload: any): string {
    return jwt.sign(payload, process.env.SECRET!, { expiresIn: '1h' });
}

export function verificarToken(token: string): any | null {
    try {
        const decoded = jwt.verify(token, process.env.SECRET!);
        return decoded;
    } catch (error) {
        return null;
    }
}