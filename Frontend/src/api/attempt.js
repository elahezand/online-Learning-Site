import { isAbortError } from "./client"
import { notifyError } from "../utils/notify"

export default async function attempt(promise, { silent = false, errorTitle } = {}) {
    try {
        return { ok: true, data: await promise, error: null }
    } catch (error) {
        if (!isAbortError(error) && !silent) notifyError(error, errorTitle)
        return { ok: false, data: null, error }
    }
}
