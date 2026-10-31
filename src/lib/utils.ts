import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Custom text sizes must not be mistaken for text colors and merged away.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'hero',
        'display',
        'h1',
        'h2',
        'h3',
        'title',
        'lead',
        'body',
        'body-sm',
        'nav',
        'eyebrow',
        'meta',
        'micro',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
