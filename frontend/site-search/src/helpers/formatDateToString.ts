export default function formatDateToString(date: Date): string {
    return date?.toISOString().split('T')[0]
}