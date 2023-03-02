
export function loginSuccess() {
    return {
        type: "@@Auth/LOGIN" as const
    }
}

export function logoutAction() {
    return {
        type: "@@Auth/LOGOUT" as const
    }
}

export type IAuthAction = ReturnType<typeof loginSuccess | typeof logoutAction>
