export type JwtPayload = {
    userId:string,
    [key:string]:any
}

export interface CryptoConfg{
    privateKey:string
    publicKey:string
}