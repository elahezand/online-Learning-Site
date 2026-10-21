import "axios"

declare module "axios" {
    interface AxiosRequestConfig {
        /** Don't try to refresh the token when this request returns 401 */
        skipRefresh?: boolean
        /** Don't show the "Please log in" toast if the session is over */
        silentAuth?: boolean
        /** Set once a request has been retried after a refresh */
        _retry?: boolean
    }
}
