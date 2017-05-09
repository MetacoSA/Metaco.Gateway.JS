declare module 'base58check'
{
    export function encode(hexStr : string, prefix: string) : string;

    export function decode(hex : string, format?: string) : {
        prefix: string,
        data: string
    };
}