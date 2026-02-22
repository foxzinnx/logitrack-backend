export interface ITokenProvider{
    generate(payload: { userId: string; role: string; email: string; }): string;
    verify(token: string): { userId: string; role: string; email: string; };
}