export interface IAuthState {
    user : JWTPayload  | null,
    userPassword : {},
    registerResult:APIResultType,
    loginResult:APIResultType,
    isAuthenticated: boolean;
    msg:string
}

export type APIResultType =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'fail'; message: string }

export interface JWTPayload {
    id: number,
    username: string,
}