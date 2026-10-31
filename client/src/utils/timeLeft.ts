export const timeLeft = (endsAt: string, now = Date.now()) => {
    const ms = new Date(endsAt).getTime() - now
    if (ms <= 0) return null

    const minutes = Math.floor(ms / 60000)
    const days = Math.floor(minutes / 1440)
    const hours = Math.floor((minutes % 1440) / 60)
    const mins = minutes % 60

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${Math.max(mins, 1)}m`
}
