import type { L } from '@/i18n/useLocalized'
import { DAYS_IN_LAST_YEAR, type GithubStats } from '@/lib/githubStats'
import githubStats from './github-stats.json'

export type Stat = { value: string; suffix: string; label: L; meta: L }
/** One stop of the About story. `imageHint` is the placeholder text, or the alt once `image` is set. */
export type Milestone = {
  id: string
  title: L
  body: L
  imageHint: L
  image?: string
  /** Wide photos get a landscape frame so nobody is cropped out. */
  landscape?: boolean
  /** Width ÷ height of a wide-column photo that is not 9 / 5. */
  imageAspect?: number
}
export type Bio = { milestones: Milestone[]; photoCaption: L; stats: Stat[] }

export const BIO: Bio = {
  milestones: [
    {
      id: 'dream',
      title: { pt: 'O sonho na véspera', en: 'The dream the night before', es: 'El sueño de la víspera' },
      body: {
        pt: 'Quase virei **engenheiro mecânico**. Passei nas faculdades públicas da minha região, escolhi o curso e, na véspera da matrícula, sonhei que era infeliz na profissão. Desisti.',
        en: 'I almost became a **mechanical engineer**. I got into the public universities near home, picked the course and, the night before enrolling, dreamed I was miserable in that career. So I dropped it.',
        es: 'Casi fui **ingeniero mecánico**. Aprobé en las universidades públicas de mi región, elegí la carrera y, la víspera de la matrícula, soñé que era infeliz en esa profesión. Desistí.',
      },
      image: '/images/petros/panda-sonho.webp',
      imageHint: { pt: 'Ilustração de um panda dormindo e sonhando que está infeliz em uma oficina mecânica', en: 'Illustration of a panda asleep, dreaming of being miserable in a mechanical workshop', es: 'Ilustración de un panda dormido que sueña que es infeliz en un taller mecánico' },
    },
    {
      id: 'python',
      title: { pt: 'Da contabilidade ao Python', en: 'From accounting to Python', es: 'De la contabilidad a Python' },
      body: {
        pt: 'Fui estudar **contabilidade** por conta própria e, para me destacar, aprendi a automatizar planilhas com **Python**. Logo estava gostando mais do Python do que da contabilidade. Mergulhei de vez na programação, estudando sozinho com cursos da **Rocketseat**, **Origamid** e **B7Web**.',
        en: 'I started studying **accounting** on my own and, to stand out, learned to automate spreadsheets with **Python**. Soon I liked Python more than accounting. I went all in on programming, teaching myself through **Rocketseat**, **Origamid** and **B7Web** courses.',
        es: 'Empecé a estudiar **contabilidad** por mi cuenta y, para destacarme, aprendí a automatizar planillas con **Python**. Pronto me gustaba más Python que la contabilidad. Me sumergí de lleno en la programación, estudiando solo con cursos de **Rocketseat**, **Origamid** y **B7Web**.',
      },
      image: '/images/petros/panda-python.webp',
      imageHint: { pt: 'Ilustração de um panda encantado com uma cobra píton sobre o teclado, ao lado de uma planilha e de livros de contabilidade', en: 'Illustration of a delighted panda looking at a python snake on the keyboard, next to a spreadsheet and accounting books', es: 'Ilustración de un panda encantado con una serpiente pitón sobre el teclado, junto a una planilla y libros de contabilidad' },
    },
    {
      id: 'etec',
      title: { pt: 'A recomendação da professora', en: 'A teacher’s recommendation', es: 'La recomendación de la profesora' },
      body: {
        pt: 'Então lembrei que uma professora do ensino médio tinha me recomendado a **ETEC**. Fui para lá, aprendi também *mobile* e comecei um *networking* que abre portas até hoje.',
        en: 'Then I remembered that a high school teacher had recommended **ETEC**. I enrolled, picked up *mobile* too and started building a *network* that still opens doors today.',
        es: 'Entonces recordé que una profesora de la secundaria me había recomendado la **ETEC**. Fui, aprendí también *mobile* y empecé un *networking* que sigue abriendo puertas.',
      },
      image: '/images/petros/fatec-classroom.webp',
      landscape: true,
      imageAspect: 4 / 3,
      imageHint: { pt: 'Selfie da turma em um laboratório de informática', en: 'Class selfie in a computer lab', es: 'Selfie del grupo en un laboratorio de informática' },
    },
    {
      id: 'stardust',
      title: { pt: 'O TCC que virou emprego', en: 'The final project that became a job', es: 'El TCC que se volvió empleo' },
      body: {
        pt: 'No TCC criei o **StarDust**, um app que ensina **lógica de programação** para crianças e o projeto de que mais me orgulho. Ele usa a **Delégua**, da **Design Líquido**, empresa que conheci no Discord quando pedi ajuda para entender a tecnologia. Depois de formado, mostrei o app pronto para eles e fui contratado.',
        en: 'For my final project I built **StarDust**, an app that teaches **programming logic** to kids and the project I’m proudest of. It runs on **Delégua**, by **Design Líquido**, a company I met on Discord when I asked for help understanding the technology. After graduating, I showed them the finished app and they hired me.',
        es: 'En mi TCC creé **StarDust**, una app que enseña **lógica de programación** a niños y el proyecto del que más orgullo siento. Usa **Delégua**, de **Design Líquido**, empresa que conocí en Discord cuando pedí ayuda para entender la tecnología. Después de graduarme, les mostré la app terminada y me contrataron.',
      },
      image: '/images/petros/panda-tcc.webp',
      imageHint: { pt: 'Ilustração de um panda mostrando em um tablet um jogo espacial de lógica para dois pandas que aplaudem, com um crachá sobre a mesa', en: 'Illustration of a panda showing a space-themed logic game on a tablet to two applauding pandas, with an ID badge on the table', es: 'Ilustración de un panda que muestra en una tableta un juego espacial de lógica a dos pandas que aplauden, con una credencial sobre la mesa' },
    },
    {
      id: 'fatec',
      title: { pt: 'O grupo da FATEC', en: 'The FATEC crew', es: 'El grupo de la FATEC' },
      body: {
        pt: 'Na **FATEC São José dos Campos**, onde me formo em **desenvolvimento de software multiplataforma** no fim de 2026, encontrei os cinco colegas com quem fiz os projetos de **API** ao longo do curso.',
        en: 'At **FATEC São José dos Campos**, where I graduate in **multiplatform software development** at the end of 2026, I found the five classmates I built my **API** projects with throughout the program.',
        es: 'En la **FATEC São José dos Campos**, donde me gradúo en **desarrollo de software multiplataforma** a fines de 2026, encontré a los cinco compañeros con los que hice los proyectos de **API** a lo largo de la carrera.',
      },
      image: '/images/petros/fatec-group.webp',
      landscape: true,
      imageHint: { pt: 'Petros e os cinco colegas do grupo da FATEC', en: 'Petros and the five classmates from the FATEC team', es: 'Petros y los cinco compañeros del grupo de la FATEC' },
    },
    {
      id: 'monitor',
      title: { pt: 'Monitoria e Interfatec', en: 'Teaching and Interfatec', es: 'Monitoría e Interfatec' },
      body: {
        pt: 'A partir do terceiro semestre, fui **monitor** de **Algoritmos e Lógica de Programação**, vaga que fica com o aluno de melhor desempenho acadêmico e melhor média na disciplina, e ajudei os alunos do primeiro semestre a melhorar suas notas. Encarei a **Interfatec** e fiquei em 2º lugar na primeira fase.',
        en: 'From my third semester on, I was a **teaching assistant** for **Algorithms and Programming Logic**, a position awarded to the student with the best academic record and the highest grade in the course, and I helped first-semester students raise their grades. I took on **Interfatec** and placed 2nd in the first round.',
        es: 'A partir del tercer semestre, fui **monitor** de **Algoritmos y Lógica de Programación**, puesto que se otorga al alumno con el mejor desempeño académico y la mejor nota en la asignatura, y ayudé a los alumnos del primer semestre a mejorar sus notas. Enfrenté la **Interfatec** y quedé en 2.º lugar en la primera fase.',
      },
      image: '/images/petros/interfatecs-2026-sem-patrocinadores.webp',
      landscape: true,
      imageHint: { pt: 'Petros, à esquerda, com um colega em frente ao banner da InterFatecs 2026', en: 'Petros, on the left, with a classmate in front of the InterFatecs 2026 banner', es: 'Petros, a la izquierda, con un compañero frente al banner de InterFatecs 2026' },
    },
    {
      id: 'freelance',
      title: { pt: 'Freelas e um SaaS próprio', en: 'Freelance work and our own SaaS', es: 'Freelance y un SaaS propio' },
      body: {
        pt: 'Também comecei como **freelancer**: um e-commerce para a empresa de um amigo, depois o **app mobile** dele e uma **API própria de frete**, que me levou a fundo em **backend**, *design patterns*, cache e **OAuth**. Mais tarde, com o **Vitor Spinelli**, colega da ETEC, fiz os projetos **Vehoway** e **Wex Business**, e criamos nosso próprio SaaS, o **Scoops**.',
        en: 'I also started as a **freelancer**: an e-commerce for a friend’s company, then its **mobile app** and a custom **shipping API** that took me deep into **backend**, *design patterns*, cache and **OAuth**. Later, with **Vitor Spinelli**, a classmate from ETEC, I built **Vehoway** and **Wex Business**, and we launched our own SaaS, **Scoops**.',
        es: 'También empecé como **freelancer**: un e-commerce para la empresa de un amigo, después su **app mobile** y una **API de envío propia** que me llevó a fondo en **backend**, *design patterns*, caché y **OAuth**. Más tarde, con **Vitor Spinelli**, compañero de la ETEC, hice **Vehoway** y **Wex Business**, y creamos nuestro propio SaaS, **Scoops**.',
      },
      image: '/images/petros/vitor-petros-montagem-3.webp',
      landscape: true,
      imageAspect: 1,
      imageHint: { pt: 'Petros e Vitor Spinelli juntos ao ar livre', en: 'Petros and Vitor Spinelli together outdoors', es: 'Petros y Vitor Spinelli juntos al aire libre' },
    },
    {
      id: 'lumetis',
      title: { pt: 'O reencontro', en: 'The reunion', es: 'El reencuentro' },
      body: {
        pt: 'No penúltimo semestre, reencontrei o professor **Gildarcio**, que me deu aula na ETEC, e ele me ofereceu uma vaga na **Lumetis**. Hoje desenvolvo lá a **HMS**, uma plataforma de gestão jurídica com IA. Aquele *networking* continua abrindo portas.',
        en: 'In my second-to-last semester, I ran into Professor **Gildarcio**, who taught me at ETEC, and he offered me a position at **Lumetis**. Today I build **HMS** there, a legal management platform with AI. That *network* keeps opening doors.',
        es: 'En el penúltimo semestre, me reencontré con el profesor **Gildarcio**, que me dio clases en la ETEC, y me ofreció un puesto en **Lumetis**. Hoy desarrollo allí **HMS**, una plataforma de gestión jurídica con IA. Aquel *networking* sigue abriendo puertas.',
      },
      image: '/images/petros/panda-reencontro.webp',
      imageHint: { pt: 'Ilustração de dois pandas se cumprimentando em um campus: um de moletom e mochila, o outro um professor de terno e óculos', en: 'Illustration of two pandas shaking hands on a campus: one in a hoodie with a backpack, the other a teacher in a suit and glasses', es: 'Ilustración de dos pandas saludándose en un campus: uno con sudadera y mochila, el otro un profesor con traje y gafas' },
    },
  ],
  photoCaption: {
    // TODO(petros): the panda explanation
    pt: 'O panda? Uma *longa* história — pergunte quando nos falarmos.',
    en: 'The panda? A *long* story — ask me when we talk.',
    es: '¿El panda? Una *larga* historia — pregúntame cuando hablemos.',
  },
  stats: buildStats(githubStats),
}

function monthYear(date: string): string {
  const [year, month] = date.split('-')
  return `${month}/${year}`
}

export function buildStats(github: GithubStats): Stat[] {
  const { longestStreak } = github
  const streakPeriod = `${monthYear(longestStreak.from)} – ${monthYear(longestStreak.to)}`
  const activeShare = Math.round(
    (github.activeDaysLastYear / DAYS_IN_LAST_YEAR) * 100,
  )
  const lastYearPt = github.contributionsLastYear.toLocaleString('pt-BR')
  const lastYearEn = github.contributionsLastYear.toLocaleString('en-US')

  return [
    {
      value: github.contributions.toLocaleString('en-US'),
      suffix: '',
      label: {
        pt: 'contribuições no **GitHub**',
        en: '**GitHub** contributions',
        es: 'contribuciones en **GitHub**',
      },
      meta: {
        pt: `${lastYearPt} NOS ÚLTIMOS 12 MESES`,
        en: `${lastYearEn} IN THE LAST 12 MONTHS`,
        es: `${lastYearPt} EN LOS ÚLTIMOS 12 MESES`,
      },
    },
    {
      value: longestStreak.days.toLocaleString('en-US'),
      suffix: '',
      label: {
        pt: 'dias seguidos contribuindo, minha **maior sequência**',
        en: 'days in a row contributing, my **longest streak**',
        es: 'días seguidos contribuyendo, mi **racha más larga**',
      },
      meta: { pt: streakPeriod, en: streakPeriod, es: streakPeriod },
    },
    {
      value: String(activeShare),
      suffix: '%',
      label: {
        pt: 'dos dias do último ano com **contribuição**',
        en: 'of the days in the past year with a **contribution**',
        es: 'de los días del último año con **contribución**',
      },
      meta: {
        pt: `${github.activeDaysLastYear} DE ${DAYS_IN_LAST_YEAR} DIAS`,
        en: `${github.activeDaysLastYear} OF ${DAYS_IN_LAST_YEAR} DAYS`,
        es: `${github.activeDaysLastYear} DE ${DAYS_IN_LAST_YEAR} DÍAS`,
      },
    },
    {
      value: github.mergedPullRequests.toLocaleString('en-US'),
      suffix: '',
      label: {
        pt: '**pull requests** públicos mergeados',
        en: 'public **pull requests** merged',
        es: '**pull requests** públicos fusionados',
      },
      meta: {
        pt: `${github.mergedOutsideOwnRepos} FORA DOS MEUS REPOS`,
        en: `${github.mergedOutsideOwnRepos} OUTSIDE MY OWN REPOS`,
        es: `${github.mergedOutsideOwnRepos} FUERA DE MIS REPOS`,
      },
    },
  ]
}

export function statTarget(stat: Stat): number {
  const digits = stat.value.replace(/[^0-9]/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}
