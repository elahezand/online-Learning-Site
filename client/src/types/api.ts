import type { AxiosError } from "axios"

export interface ApiErrorBody {
    message?: string
    errors?: { message?: string; field?: string }[]
}

export type ApiError = AxiosError<ApiErrorBody> & { _authToastShown?: boolean }
