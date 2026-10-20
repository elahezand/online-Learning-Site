import swal from 'sweetalert'
import { errorMessage } from '../api/client'

/*
 * One place for user feedback. Step 2 (UI kit) swaps sweetalert for the
 * app's own toast/dialog components here, without touching the pages.
 */
export const notifySuccess = (title) => swal({ title, icon: "success", buttons: "ok" })

export const notifyError = (error, fallback = "Something went wrong, please try again") =>
    swal({ title: errorMessage(error, fallback), icon: "error", buttons: "ok" })
