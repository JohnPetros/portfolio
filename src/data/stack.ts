export type Category = 'frontend' | 'backend' | 'mobile' | 'databases' | 'cloud' | 'tests'

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
  'tests',
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
    id: 'sass',
    name: 'Sass',
    brandColor: '#CC6699',
    monogram: 'Sa',
    docsUrl: 'https://sass-lang.com/documentation/',
    category: 'frontend',
  },
  {
    id: 'vite',
    name: 'Vite',
    brandColor: '#646CFF',
    monogram: 'Vt',
    docsUrl: 'https://vitejs.dev/',
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
    id: 'turso',
    name: 'Turso',
    brandColor: '#4FF8D2',
    monogram: 'Tu',
    docsUrl: 'https://docs.turso.tech/',
    category: 'databases',
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    brandColor: '#DC244C',
    monogram: 'Qd',
    docsUrl: 'https://qdrant.tech/documentation/',
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
    id: 'gcp',
    name: 'GCP',
    brandColor: '#4285F4',
    monogram: 'GCP',
    docsUrl: 'https://cloud.google.com/docs',
    category: 'cloud',
  },
  // ── Tests (3) ──
  {
    id: 'jest',
    name: 'Jest',
    brandColor: '#C21325',
    monogram: 'Je',
    docsUrl: 'https://jestjs.io/docs/getting-started',
    category: 'tests',
  },
  {
    id: 'playwright',
    name: 'Playwright',
    brandColor: '#2EAD33',
    monogram: 'Pw',
    docsUrl: 'https://playwright.dev/docs/intro',
    category: 'tests',
  },
  {
    id: 'pytest',
    name: 'Pytest',
    brandColor: '#0A9EDC',
    monogram: 'Pt',
    docsUrl: 'https://docs.pytest.org/',
    category: 'tests',
  },
  {
    id: 'vitest',
    name: 'Vitest',
    brandColor: '#6E9F18',
    monogram: 'Vi',
    docsUrl: 'https://vitest.dev/',
    category: 'tests',
  },
]

export function getTech(id: string): Tech | undefined {
  return TECHS.find((t) => t.id === id)
}

/**
 * Maps a tech id to its brand icon under /public/images/techs. Most ids match
 * the filename verbatim — this map only covers the mismatches. Returns null
 * when there's no icon so the caller can fall back to the monogram badge.
 */
const ICON_FILENAME: Record<string, string> = {
  astro: 'astrojs',
  mongodb: 'mongo',
  playwright: 'playright',
}
const ICON_SET = new Set([
  'astrojs',
  'aws',
  'bun',
  'css',
  'discord',
  'docker',
  'expo',
  'express',
  'fastapi',
  'fastify',
  'figma',
  'flask',
  'flutter',
  'gcp',
  'github',
  'html',
  'javascript',
  'jest',
  'linkedin',
  'mongo',
  'mysql',
  'nestjs',
  'nextjs',
  'nodejs',
  'playright',
  'postgresql',
  'pytest',
  'python',
  'qdrant',
  'react',
  'react-native',
  'redis',
  'sass',
  'spring',
  'styled-components',
  'supabase',
  'tailwind',
  'terraform',
  'turso',
  'typescript',
  'vite',
  'vitest',
])

export function techIconPath(id: string): string | null {
  const filename = ICON_FILENAME[id] ?? id
  return ICON_SET.has(filename) ? `/images/techs/${filename}.svg` : null
}

export function groupByCategory(techs: Tech[]): { category: Category; techs: Tech[] }[] {
  return CATEGORIES.map((category) => ({
    category,
    techs: techs.filter((t) => t.category === category),
  })).filter((g) => g.techs.length > 0)
}
