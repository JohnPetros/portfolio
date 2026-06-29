import type { L } from '@/i18n/useLocalized'

export type Stat = { value: string; suffix: string; label: L }
export type Bio = { paragraphs: L[]; photoCaption: L; stats: Stat[] }

export const BIO: Bio = {
  paragraphs: [
    {
      // TODO(petros): confirm wording
      pt: 'Quase fui *engenheiro*, passei pela **contabilidade**, e foi automatizando planilhas com **Python** que me apaixonei por programar.',
      en: 'I almost became an *engineer*, passed through **accounting**, and it was automating spreadsheets with **Python** that made me fall in love with programming.',
      es: 'Casi fui *ingeniero*, pasé por la **contabilidad**, y fue automatizando hojas de cálculo con **Python** que me enamoré de programar.',
    },
    {
      pt: 'De Python para **JavaScript** e a **web**, descobri que podia construir produtos inteiros do zero.', // TODO(petros)
      en: 'From Python to **JavaScript** and the **web**, I found I could build whole products from scratch.',
      es: 'De Python a **JavaScript** y la **web**, descubrí que podía construir productos enteros desde cero.',
    },
    {
      pt: 'Na **ETEC** veio a base; na **FATEC**, a profundidade — e a pesquisa que virou a tese *StarDust*.', // TODO(petros)
      en: 'At **ETEC** came the foundation; at **FATEC**, the depth — and the research that became the *StarDust* thesis.',
      es: 'En la **ETEC** llegó la base; en la **FATEC**, la profundidad — y la investigación que se volvió la tesis *StarDust*.',
    },
    {
      pt: 'Hoje, na **Lumetis**, transformo ideias em produtos *full stack* todos os dias.', // TODO(petros)
      en: 'Today, at **Lumetis**, I turn ideas into *full stack* products every day.',
      es: 'Hoy, en **Lumetis**, transformo ideas en productos *full stack* todos los días.',
    },
  ],
  photoCaption: {
    // TODO(petros): the panda explanation
    pt: 'O panda? Uma *longa* história — pergunte quando nos falarmos.',
    en: 'The panda? A *long* story — ask me when we talk.',
    es: '¿El panda? Una *larga* historia — pregúntame cuando hablemos.',
  },
  stats: [
    {
      value: '2,154', // TODO(petros): confirm exact Duolingo streak
      suffix: '',
      label: { pt: 'dias de Duolingo', en: 'days of Duolingo', es: 'días de Duolingo' },
    },
    {
      value: '100',
      suffix: '%',
      label: {
        pt: 'de presença desde o 1º ano',
        en: 'attendance since 1st year',
        es: 'de asistencia desde 1.er año',
      },
    },
    {
      value: '5',
      suffix: '+',
      label: {
        pt: 'anos de lofi diário',
        en: 'years of daily lofi',
        es: 'años de lofi diario',
      },
    },
    {
      value: '3',
      suffix: '+',
      label: { pt: 'anos de software', en: 'years of software', es: 'años de software' },
    },
  ],
}

export function statTarget(stat: Stat): number {
  const digits = stat.value.replace(/[^0-9]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}
