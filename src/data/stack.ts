export type Category = 'frontend' | 'backend' | 'mobile' | 'databases' | 'cloud' | 'ai'

export type Tech = {
  id: string
  name: string
  brandColor: string
  monogram: string
  docsUrl: string
  category: Category
}

export const CATEGORIES: Category[] = [
  'frontend',
  'backend',
  'mobile',
  'databases',
  'cloud',
  'ai',
]

export const TECHS: Tech[] = [
  // ── Frontend (7) ──
  {
    id: 'typescript',
    name: 'TypeScript',
    brandColor: '#3178C6',
    monogram: 'TS',
    docsUrl: 'https://www.typescriptlang.org/docs/',
    category: 'frontend',
  },
  {
    id: 'react',
    name: 'React',
    brandColor: '#61DAFB',
    monogram: 'Re',
    docsUrl: 'https://react.dev/',
    category: 'frontend',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    brandColor: '#A0A0A0',
    monogram: 'Nx',
    docsUrl: 'https://nextjs.org/docs',
    category: 'frontend',
  },
  {
    id: 'astro',
    name: 'Astro',
    brandColor: '#FF5D01',
    monogram: 'As',
    docsUrl: 'https://docs.astro.build/',
    category: 'frontend',
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    brandColor: '#38BDF8',
    monogram: 'Tw',
    docsUrl: 'https://tailwindcss.com/docs',
    category: 'frontend',
  },
  {
    id: 'vue',
    name: 'Vue',
    brandColor: '#42B883',
    monogram: 'Vue',
    docsUrl: 'https://vuejs.org/guide/introduction.html',
    category: 'frontend',
  },
  {
    id: 'sass',
    name: 'Sass',
    brandColor: '#CC6699',
    monogram: 'Sa',
    docsUrl: 'https://sass-lang.com/documentation/',
    category: 'frontend',
  },
  // ── Backend (7) ──
  {
    id: 'nodejs',
    name: 'Node.js',
    brandColor: '#5FA04E',
    monogram: 'No',
    docsUrl: 'https://nodejs.org/docs/latest/api/',
    category: 'backend',
  },
  {
    id: 'python',
    name: 'Python',
    brandColor: '#3776AB',
    monogram: 'Py',
    docsUrl: 'https://docs.python.org/3/',
    category: 'backend',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    brandColor: '#009688',
    monogram: 'Fa',
    docsUrl: 'https://fastapi.tiangolo.com/',
    category: 'backend',
  },
  {
    id: 'fastify',
    name: 'Fastify',
    brandColor: '#A0A0A0',
    monogram: 'Ft',
    docsUrl: 'https://fastify.dev/docs/latest/',
    category: 'backend',
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    brandColor: '#E0234E',
    monogram: 'Ne',
    docsUrl: 'https://docs.nestjs.com/',
    category: 'backend',
  },
  {
    id: 'spring',
    name: 'Java Spring',
    brandColor: '#6DB33F',
    monogram: 'Sp',
    docsUrl: 'https://spring.io/projects/spring-boot',
    category: 'backend',
  },
  {
    id: 'flask',
    name: 'Flask',
    brandColor: '#A0A0A0',
    monogram: 'Fk',
    docsUrl: 'https://flask.palletsprojects.com/',
    category: 'backend',
  },
  // ── Mobile (3) ──
  {
    id: 'react-native',
    name: 'React Native',
    brandColor: '#61DAFB',
    monogram: 'RN',
    docsUrl: 'https://reactnative.dev/docs/getting-started',
    category: 'mobile',
  },
  {
    id: 'expo',
    name: 'Expo',
    brandColor: '#A0A0A0',
    monogram: 'Ex',
    docsUrl: 'https://docs.expo.dev/',
    category: 'mobile',
  },
  {
    id: 'flutter',
    name: 'Flutter',
    brandColor: '#02569B',
    monogram: 'Fl',
    docsUrl: 'https://docs.flutter.dev/',
    category: 'mobile',
  },
  // ── Databases (7) ──
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    brandColor: '#4169E1',
    monogram: 'Pg',
    docsUrl: 'https://www.postgresql.org/docs/',
    category: 'databases',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    brandColor: '#47A248',
    monogram: 'Mo',
    docsUrl: 'https://www.mongodb.com/docs/',
    category: 'databases',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    brandColor: '#4479A1',
    monogram: 'My',
    docsUrl: 'https://dev.mysql.com/doc/',
    category: 'databases',
  },
  {
    id: 'redis',
    name: 'Redis',
    brandColor: '#FF4438',
    monogram: 'Rd',
    docsUrl: 'https://redis.io/docs/latest/',
    category: 'databases',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    brandColor: '#3FCF8E',
    monogram: 'Su',
    docsUrl: 'https://supabase.com/docs',
    category: 'databases',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    brandColor: '#FFCA28',
    monogram: 'Fb',
    docsUrl: 'https://firebase.google.com/docs',
    category: 'databases',
  },
  {
    id: 'turso',
    name: 'Turso',
    brandColor: '#4FF8D2',
    monogram: 'Tu',
    docsUrl: 'https://docs.turso.tech/',
    category: 'databases',
  },
  // ── Cloud / DevOps (6) ──
  {
    id: 'aws',
    name: 'AWS',
    brandColor: '#FF9900',
    monogram: 'AWS',
    docsUrl: 'https://docs.aws.amazon.com/',
    category: 'cloud',
  },
  {
    id: 'docker',
    name: 'Docker',
    brandColor: '#2496ED',
    monogram: 'Dk',
    docsUrl: 'https://docs.docker.com/',
    category: 'cloud',
  },
  {
    id: 'terraform',
    name: 'Terraform',
    brandColor: '#7B42BC',
    monogram: 'Tf',
    docsUrl: 'https://developer.hashicorp.com/terraform/docs',
    category: 'cloud',
  },
  {
    id: 'pulumi',
    name: 'Pulumi',
    brandColor: '#8A3391',
    monogram: 'Pu',
    docsUrl: 'https://www.pulumi.com/docs/',
    category: 'cloud',
  },
  {
    id: 'gcp',
    name: 'GCP',
    brandColor: '#4285F4',
    monogram: 'GCP',
    docsUrl: 'https://cloud.google.com/docs',
    category: 'cloud',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    brandColor: '#A0A0A0',
    monogram: 'Vc',
    docsUrl: 'https://vercel.com/docs',
    category: 'cloud',
  },
  // ── AI & Automation (5) ──
  {
    id: 'agno',
    name: 'Agno',
    brandColor: '#00BFA5',
    monogram: 'Ag',
    docsUrl: 'https://docs.agno.com/',
    category: 'ai',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    brandColor: '#8E75F8',
    monogram: 'Ge',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    category: 'ai',
  },
  {
    id: 'google-adk',
    name: 'Google ADK',
    brandColor: '#4285F4',
    monogram: 'ADK',
    docsUrl: 'https://google.github.io/adk-docs/',
    category: 'ai',
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    brandColor: '#DC244C',
    monogram: 'Qd',
    docsUrl: 'https://qdrant.tech/documentation/',
    category: 'ai',
  },
  {
    id: 'inngest',
    name: 'Inngest',
    brandColor: '#A0A0A0',
    monogram: 'In',
    docsUrl: 'https://www.inngest.com/docs',
    category: 'ai',
  },
]

export function getTech(id: string): Tech | undefined {
  return TECHS.find((t) => t.id === id)
}

export function groupByCategory(techs: Tech[]): { category: Category; techs: Tech[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    techs: techs.filter((t) => t.category === category),
  })).filter((g) => g.techs.length > 0)
}
