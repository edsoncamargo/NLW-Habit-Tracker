export function generateProgressPercentage(completed: number = 0, amount: number = 0,) {
    return Math.round((completed / amount) * 100)
}