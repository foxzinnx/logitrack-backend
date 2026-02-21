import type { ITokenProvider } from "@/application/providers/ITokenProvider.js";
import jwt from 'jsonwebtoken';

export class JWTTokenProvider implements ITokenProvider{
    constructor(private secret: string, private expiresIn: string = '7d' ){}
    
    generate(payload: { userId: string; role: string; email: string; }): string {
        const signOptions = {
            expiresIn: this.expiresIn as any
        }
        
        return jwt.sign(
            {
                sub: payload.userId,
                role: payload.role,
                email: payload.email
            },
            this.secret,
            signOptions
        );
    }
    verify(token: string): { userId: string; role: string; email: string; } {
        const decoded = jwt.verify(token, this.secret) as any;
        return {
            userId: decoded.sub,
            role: decoded.role,
            email: decoded.email
        };
    }

}