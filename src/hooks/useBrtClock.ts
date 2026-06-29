import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatBrt(date: Date): string {
  return fmt.format(date).replace('24:', '00:')
}

export function useBrtClock(): string {
  const [time, setTime] = useState(() => formatBrt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(formatBrt(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])
  return time
}
