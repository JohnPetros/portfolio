import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProjectLayout } from '@/data/projects'
import { useCarousel } from '@/hooks/useCarousel'
import { cn } from '@/lib/utils'

export function Carousel({
  images,
  layout,
  alt,
}: {
  images: string[]
  layout: ProjectLayout
  alt: string
}) {
  const { t } = useTranslation()
  const { index, next, prev, goTo } = useCarousel(images.length, {
    intervalMs: 2500,
  })
  const startX = useRef<number | null>(null)
  const multiple = images.length > 1

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (dx > 40) prev()
    else if (dx < -40) next()
    startX.current = null
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') prev()
    else if (e.key === 'ArrowRight') next()
  }

  return (
    <div className='flex flex-col gap-3'>
      <div
        role='group'
        aria-roledescription='carousel'
        aria-label={alt}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: carousel needs tabIndex for keyboard arrow navigation
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className={cn(
          'relative overflow-hidden rounded-md border-[0.5px] border-border bg-bg-card',
          layout === 'mobile'
            ? 'mx-auto aspect-[9/16] w-full max-w-[340px]'
            : 'aspect-video w-full',
        )}
      >
        <div
          className='flex size-full transition-transform duration-[var(--dur-theme)]'
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${alt} — ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className='size-full shrink-0 object-contain'
            />
          ))}
        </div>

        {multiple && (
          <>
            <button
              type='button'
              onClick={prev}
              aria-label={t('projects.prevImage')}
              className='absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-pill border-[0.5px] border-border bg-bg-elevated text-text-secondary shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconChevronLeft size={18} stroke={1.5} aria-hidden />
            </button>
            <button
              type='button'
              onClick={next}
              aria-label={t('projects.nextImage')}
              className='absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-pill border-[0.5px] border-border bg-bg-elevated text-text-secondary shadow-[var(--shadow-card)] transition-all duration-[var(--dur-micro)] hover:border-accent-tint-20 hover:text-accent'
            >
              <IconChevronRight size={18} stroke={1.5} aria-hidden />
            </button>
            <span
              aria-live='polite'
              className='absolute bottom-2 right-2 rounded-pill bg-bg-elevated px-2 py-0.5 font-mono text-micro tracking-meta uppercase text-text-muted'
            >
              {t('projects.counter', {
                current: index + 1,
                total: images.length,
              })}
            </span>
          </>
        )}
      </div>

      {multiple && (
        <div className='flex flex-wrap gap-2'>
          {images.map((src, i) => (
            <button
              key={src}
              type='button'
              onClick={() => goTo(i)}
              aria-label={t('projects.goToImage', { index: i + 1 })}
              aria-current={i === index}
              className={cn(
                'size-12 overflow-hidden rounded-sm border-[0.5px] transition-all duration-[var(--dur-micro)]',
                i === index
                  ? 'border-accent-tint-20'
                  : 'border-border opacity-60 hover:opacity-100',
              )}
            >
              <img src={src} alt='' loading='lazy' className='size-full object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
