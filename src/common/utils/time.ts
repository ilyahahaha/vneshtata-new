import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatDistanceDay = (date: Date): string => {
  const oneHour = 1000 * 3600
  const oneDay = oneHour * 24

  const distance = Date.now() - date.getTime()

  if (distance < oneDay && distance > 0) {
    if (distance < oneHour) {
      return formatDistanceToNow(date, { locale: ru, addSuffix: true })
    } else if (distance < oneDay) {
      return format(date, 'hh:mm', { locale: ru })
    }
  }
  return format(date, 'd MMM Y hh:mm', { locale: ru })
}
