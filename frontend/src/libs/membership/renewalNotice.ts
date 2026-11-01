const STORAGE_KEY = "membership-renewal-notice-dismissed"

export const wasRenewalNoticeDismissedToday = () => {
    if (typeof window === "undefined") return true
    return localStorage.getItem(STORAGE_KEY) === new Date().toDateString()
    }

export const dismissRenewalNoticeToday = () => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, new Date().toDateString())
    }