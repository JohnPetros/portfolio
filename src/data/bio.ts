import type { L } from '@/i18n/useLocalized'

export type Stat = { value: string; suffix: string; label: L; meta: L }
export type Bio = { paragraphs: L[]; photoCaption: L; stats: Stat[] }

export const BIO: Bio = {
  paragraphs: [
    {
      pt: 'Quase virei **engenheiro mecânico**, mas tive juízo. Passei pela **contabilidade** — e foi automatizando planilhas de Excel com **Python** que me apaixonei pelo poder da tecnologia.',
      en: 'I almost became a **mechanical engineer** — thankfully, sense prevailed. Detoured through **accounting** — and it was automating Excel sheets with **Python** that made me fall for the power of tech.',
      es: 'Casi fui **ingeniero mecánico**, pero tuve juicio. Pasé por la **contabilidad** — y fue automatizando planillas de Excel con **Python** que me enamoré del poder de la tecnología.',
    },
    {
      pt: 'Pouco depois conheci o **desenvolvimento web** com **JavaScript** e mergulhei de vez. Na **ETEC** peguei também o mobile e um *networking* que abre portas até hoje.',
      en: 'Not long after, I met **web development** with **JavaScript** and went all in. At **ETEC** I picked up mobile too, plus a *network* that keeps opening doors.',
      es: 'Poco después conocí el **desarrollo web** con **JavaScript** y me sumergí. En la **ETEC** también agarré el mobile y un *networking* que sigue abriendo puertas.',
    },
    {
      pt: 'Formado na ETEC, comecei como **freelancer**: um e-commerce em *low-code* para a empresa de um amigo — **SEO técnico**, configuração de **DNS** e domínio, e engajamento via **Google Ads**.',
      en: 'Fresh out of ETEC, I went **freelance**: a *low-code* e-commerce for a friend’s company — **technical SEO**, **DNS** and domain setup, and reach via **Google Ads**.',
      es: 'Recién salido de la ETEC, empecé como **freelancer**: un e-commerce en *low-code* para la empresa de un amigo — **SEO técnico**, configuración de **DNS** y dominio, y alcance vía **Google Ads**.',
    },
    {
      pt: 'Depois vieram o **app mobile** desse mesmo e-commerce e uma **API própria de frete**, com base no **CEP** e nas dimensões dos produtos — mergulhei em **backend**, *design patterns*, cache, **OAuth** e arquitetura. Meus três primeiros projetos profissionais se conectam de alguma forma 😜.',
      en: 'Then came a **mobile app** for that same e-commerce and a **shipping API** I built from scratch — based on **ZIP code** and product dimensions. A deep dive into **backend**, *design patterns*, cache, **OAuth** and architecture. My first three professional projects are all connected 😜.',
      es: 'Después vinieron el **app mobile** de ese mismo e-commerce y una **API de envío propia**, basada en **CEP** y en las dimensiones de los productos — un buceo profundo en **backend**, *design patterns*, caché, **OAuth** y arquitectura. Mis primeros tres proyectos profesionales están conectados de alguna forma 😜.',
    },
    {
      pt: 'Pelo caminho, cursos que moldaram o dev que sou hoje: **Rocketseat**, **Origamid** e **B7Web**. E o TCC da ETEC virou o **StarDust**, uma aplicação que ensina lógica de programação — a coisa que eu mais me orgulho de ter feito.',
      en: 'Along the way, courses that shaped the dev I am today: **Rocketseat**, **Origamid** and **B7Web**. And my ETEC senior thesis turned into **StarDust**, an app that teaches programming logic — the thing I’m proudest of.',
      es: 'En el camino, cursos que moldearon al dev que soy hoy: **Rocketseat**, **Origamid** y **B7Web**. Y mi TCC de la ETEC se convirtió en **StarDust**, una app que enseña lógica de programación — lo que más orgullo me da.',
    },
    {
      pt: 'Hoje, na **FATEC São José dos Campos** curso desenvolvimento de software multiplataforma, e na **Lumetis** transformo ideias em produtos *full stack* todos os dias.',
      en: 'Today, at **FATEC São José dos Campos** I study cross-platform software, and at **Lumetis** I turn ideas into *full stack* products every day.',
      es: 'Hoy, en la **FATEC São José dos Campos** curso desarrollo de software multiplataforma, y en **Lumetis** transformo ideas en productos *full stack* todos los días.',
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
      value: '2,154',
      suffix: '',
      label: {
        pt: 'dias de streak no **Duolingo**',
        en: 'day streak on **Duolingo**',
        es: 'días de racha en **Duolingo**',
      },
      meta: {
        pt: 'EN · ES · DESDE 2020',
        en: 'EN · ES · SINCE 2020',
        es: 'EN · ES · DESDE 2020',
      },
    },
    {
      value: '100',
      suffix: '%',
      label: {
        pt: 'de presença escolar',
        en: 'school attendance',
        es: 'de asistencia escolar',
      },
      meta: {
        pt: 'DESDE 1º ANO DO EM',
        en: 'SINCE 1ST YEAR OF HS',
        es: 'DESDE 1.ER AÑO DE LA SEC.',
      },
    },
    {
      value: '5',
      suffix: '+',
      label: {
        pt: 'anos ouvindo **Lofi** enquanto codo',
        en: 'years listening to **Lofi** while coding',
        es: 'años escuchando **Lofi** mientras codo',
      },
      meta: {
        pt: 'ROTINA DIÁRIA',
        en: 'DAILY ROUTINE',
        es: 'RUTINA DIARIA',
      },
    },
    {
      value: '3',
      suffix: '+',
      label: {
        pt: 'anos entregando software em produção',
        en: 'years shipping software to production',
        es: 'años entregando software en producción',
      },
      meta: {
        pt: 'DESDE 2023',
        en: 'SINCE 2023',
        es: 'DESDE 2023',
      },
    },
  ],
}

export function statTarget(stat: Stat): number {
  const digits = stat.value.replace(/[^0-9]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}
