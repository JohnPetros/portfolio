import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { RichText } from '@/components/common/RichText'
import { BIO, type Milestone } from '@/data/bio'
import { useStoryScroll } from '@/hooks/useStoryScroll'
import { useLocalized } from '@/i18n/useLocalized'

const CORNERS = [
  '-left-2 -top-2 border-l-2 border-t-2',
  '-right-2 -top-2 border-r-2 border-t-2',
  '-bottom-2 -left-2 border-b-2 border-l-2',
  '-bottom-2 -right-2 border-b-2 border-r-2',
]

function StoryMedia({ milestone }: { milestone: Milestone }) {
  const localize = useLocalized()
  const hint = localize(milestone.imageHint)

  return (
    <div
      data-landscape={milestone.landscape || undefined}
      style={
        milestone.imageAspect
          ? ({ '--story-ratio': milestone.imageAspect } as CSSProperties)
          : undefined
      }
      className='story-frame relative mx-auto aspect-[4/5] w-full max-w-sm md:col-start-1'
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={`absolute size-6 border-accent ${corner}`}
        />
      ))}
      <div className='story-media size-full'>
        {milestone.image ? (
          <img
            src={milestone.image}
            alt={hint}
            loading='lazy'
            decoding='async'
            className='size-full rounded-md object-cover shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]'
          />
        ) : (
          <div className='flex size-full items-center justify-center rounded-md border border-dashed border-border bg-bg-elevated p-6 text-center font-mono text-micro tracking-meta uppercase text-text-muted'>
            {`{ ${hint} }`}
          </div>
        )}
      </div>
    </div>
  )
}

export function AboutStory() {
  const { t } = useTranslation()
  const localize = useLocalized()
  const { milestones } = BIO
  const last = milestones.length - 1
  const { trackRef, story, ready, goTo } = useStoryScroll(milestones.length)
  const reached = Math.max(story.active, 0) / last

  return (
    <div
      ref={trackRef}
      className='story story-track mt-12'
      data-ready={ready || undefined}
      data-direction={story.direction}
      style={{ '--story-steps': milestones.length } as CSSProperties}
    >
      <div data-story-stage className='story-stage'>
        <div className='story-items'>
          {milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              data-story
              data-active={story.active === index}
              data-wide={milestone.landscape || undefined}
              className='story-item story-columns'
            >
              <StoryMedia milestone={milestone} />
              <div className='story-copy max-w-xl md:col-start-3'>
                <p className='font-mono text-eyebrow tracking-eyebrow uppercase text-text-faint'>
                  {index + 1} / {milestones.length}
                </p>
                <h3 className='mt-3 text-[clamp(1.625rem,2.8vw,2.375rem)] font-medium leading-tight tracking-tight text-text-primary'>
                  {localize(milestone.title)}
                </h3>
                <p className='mt-4 font-sans text-body leading-body text-text-secondary'>
                  <RichText>{localize(milestone.body)}</RichText>
                </p>
              </div>
            </article>
          ))}

          <nav
            aria-label={t('about.storyNav')}
            data-wide={milestones[story.active]?.landscape || undefined}
            className='story-rail story-columns'
          >
            <div className='story-line relative mx-auto w-px bg-border md:col-start-2'>
              <span
                aria-hidden
                className='absolute inset-0 origin-top bg-accent transition-transform duration-500'
                style={{ transform: `scaleY(${reached})` }}
              />
              {milestones.map((milestone, index) => (
                <button
                  key={milestone.id}
                  type='button'
                  aria-label={localize(milestone.title)}
                  aria-current={story.active === index ? 'step' : undefined}
                  onClick={() => goTo(index)}
                  className='group absolute left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
                  style={{ top: `${(index / last) * 100}%` }}
                >
                  <span
                    className={`size-2 rounded-full transition-colors group-hover:bg-accent ${
                      index <= story.active ? 'bg-accent' : 'bg-text-faint'
                    }`}
                  />
                </button>
              ))}
              <img
                src='/images/pandas/panda-jumping.gif'
                alt=''
                aria-hidden
                className='story-panda petros-panda pointer-events-none absolute left-1/2 size-16 max-w-none -translate-x-1/2 -translate-y-[62%]'
                style={{ top: `${reached * 100}%` }}
              />
            </div>
          </nav>
        </div>

        <div className='story-foot flex flex-wrap items-center justify-between gap-4 pt-8 md:pt-4 md:pb-6'>
          <p className='font-serif text-body-sm italic text-text-muted'>
            <RichText>{localize(BIO.photoCaption)}</RichText>
          </p>
          <a
            href='#about-stats'
            className='story-skip rounded-pill border-[0.5px] border-border px-3 py-1 font-mono text-micro tracking-meta uppercase text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          >
            {t('about.skipStory')}
          </a>
        </div>
      </div>
    </div>
  )
}
