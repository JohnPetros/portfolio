import type { L } from '@/i18n/useLocalized'
import { getTech } from './stack'

export type ProjectKind = 'academic' | 'professional'
export type ProjectLayout = 'web' | 'mobile'

export type DetailSkill = { icon: string; label: L }

export type ProjectDetail = {
  about: L
  features: L[]
  techGroups: { label: L; techs: string[] }[]
  contributions: L[]
  lessons: L[]
  hardSkills: DetailSkill[]
  softSkills: DetailSkill[]
}

export type Project = {
  id: string
  kind: ProjectKind
  order: number
  eyebrow: L
  title: string
  tagline: L
  layout: ProjectLayout
  cover: string
  gallery: string[]
  techs: string[]
  links?: { code?: string; live?: string }
  detail: ProjectDetail
}

export const PROJECTS: Project[] = [
  // ── Academic (5) ── order = semester sequence
  {
    id: 'smart-farming',
    kind: 'academic',
    order: 1,
    eyebrow: {
      pt: '2024/1 · FATEC SJC',
      en: '2024/1 · FATEC SJC',
      es: '2024/1 · FATEC SJC',
    },
    title: 'Smart Farming',
    tagline: {
      pt: 'Agricultura inteligente — projeto de 1º semestre.', // TODO(petros)
      en: 'Smart agriculture — 1st-semester project.',
      es: 'Agricultura inteligente — proyecto de 1.º semestre.',
    },
    layout: 'web',
    cover: '/images/projects/smart-farming/checklist-records-dashboard-page.png',
    gallery: [
      '/images/projects/smart-farming/checklist-records-dashboard-page.png',
      '/images/projects/smart-farming/checklist-records-form.png',
      '/images/projects/smart-farming/last-sensors-record-page.png',
      '/images/projects/smart-farming/sensors-records-dashboard-page.png',
      '/images/projects/smart-farming/sensors-records-table-page.png',
    ],
    techs: ['flask', 'python', 'postgresql', 'docker', 'aws'],
    links: { code: 'https://github.com/CtrI-Alt-Del/smart-farming' },
    detail: {
      about: {
        pt: 'Aplicação web para monitoramento da **estufa inteligente** mantida pela Fatec de São José dos Campos. Coleta e visualiza dados de sensores (temperatura, umidade, pH), executa checklists de manutenção e gera relatórios, com transferência automática de dados via placa **ESP32**.',
        en: 'Web app for monitoring the **smart greenhouse** maintained by Fatec São José dos Campos. Collects and visualizes sensor data (temperature, humidity, pH), runs maintenance checklists and generates reports, with automatic data transfer through an **ESP32** board.',
        es: 'Aplicación web para monitoreo del **invernadero inteligente** mantenido por la Fatec São José dos Campos. Recolecta y visualiza datos de sensores (temperatura, humedad, pH), ejecuta checklists de mantenimiento y genera reportes, con transferencia automática de datos vía placa **ESP32**.',
      },
      features: [
        {
          pt: '**Gerenciamento de sensores** com dashboard interativo de temperatura, umidade do ar/solo e volume de água, incluindo importação de dados via CSV.',
          en: '**Sensor management** with an interactive dashboard for temperature, air/soil humidity and water volume, including CSV data import.',
          es: '**Gestión de sensores** con dashboard interactivo de temperatura, humedad del aire/suelo y volumen de agua, incluyendo importación de datos vía CSV.',
        },
        {
          pt: '**Checklist de manutenção** com formulário interno, edição, exclusão e importação em lote, exibido em tabela paginada.',
          en: '**Maintenance checklist** with in-app form, editing, deletion and batch import, displayed in a paginated table.',
          es: '**Checklist de mantenimiento** con formulario interno, edición, exclusión e importación en lote, mostrado en tabla paginada.',
        },
        {
          pt: '**Gerenciamento de plantas** da estufa com ciclo completo de cadastro, edição e desativação.',
          en: '**Greenhouse plant management** with full create, edit and deactivate lifecycle.',
          es: '**Gestión de plantas** del invernadero con ciclo completo de registro, edición y desactivación.',
        },
        {
          pt: '**Integração com placa ESP32** para transferência contínua e automática de dados entre a estufa e a aplicação web.',
          en: '**ESP32 board integration** for continuous and automatic data transfer between the greenhouse and the web app.',
          es: '**Integración con placa ESP32** para transferencia continua y automática de datos entre el invernadero y la aplicación web.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
          techs: ['python', 'flask'],
        },
        {
          label: { pt: 'Banco de dados', en: 'Database', es: 'Base de datos' },
          techs: ['postgresql'],
        },
        {
          label: { pt: 'Infraestrutura', en: 'Infrastructure', es: 'Infraestructura' },
          techs: ['docker', 'aws'],
        },
      ],
      contributions: [
        {
          pt: 'Atuei como **Product Owner**, articulando a visão do produto, priorizando o backlog e mantendo o alinhamento entre cliente e time de desenvolvimento.',
          en: 'Acted as **Product Owner**, articulating the product vision, prioritizing the backlog and keeping alignment between client and development team.',
          es: 'Actué como **Product Owner**, articulando la visión del producto, priorizando el backlog y manteniendo la alineación entre cliente y equipo de desarrollo.',
        },
        {
          pt: 'Assumi a **liderança técnica**, definindo a arquitetura do sistema, conduzindo revisões de código e orientando decisões sobre tecnologias e boas práticas.',
          en: 'Took on **technical leadership**, defining the system architecture, running code reviews and guiding decisions on technology and best practices.',
          es: 'Asumí el **liderazgo técnico**, definiendo la arquitectura del sistema, conduciendo revisiones de código y orientando decisiones sobre tecnologías y buenas prácticas.',
        },
        {
          pt: 'Resolvi o **maior desafio técnico do projeto**: a integração entre o sistema web e a placa ESP32 para automação da coleta de dados da estufa.',
          en: 'Solved the **project’s biggest technical challenge**: the integration between the web system and the ESP32 board to automate greenhouse data collection.',
          es: 'Resolví el **mayor desafío técnico del proyecto**: la integración entre el sistema web y la placa ESP32 para automatizar la recolección de datos del invernadero.',
        },
      ],
      lessons: [
        {
          pt: 'Um time bem organizado é muito mais eficaz do que tentar resolver tudo sozinho — a combinação de ideias e experiências acelera a solução e traz alternativas mais criativas.',
          en: 'A well-organized team is far more effective than trying to solve everything alone — combining ideas and experiences speeds up solutions and yields more creative alternatives.',
          es: 'Un equipo bien organizado es mucho más eficaz que intentar resolver todo solo — combinar ideas y experiencias acelera la solución y trae alternativas más creativas.',
        },
        {
          pt: 'Ensinar outras pessoas solidifica e aprofunda o próprio aprendizado, revelando lacunas que passariam despercebidas ao estudar sozinho.',
          en: 'Teaching others solidifies and deepens your own learning, exposing gaps that would go unnoticed when studying alone.',
          es: 'Enseñar a otros solidifica y profundiza el propio aprendizaje, revelando lagunas que pasarían desapercibidas al estudiar en solitario.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconCode',
          label: {
            pt: 'Python + Flask',
            en: 'Python + Flask',
            es: 'Python + Flask',
          },
        },
        {
          icon: 'IconStack2',
          label: {
            pt: 'Separação de responsabilidades',
            en: 'Separation of concerns',
            es: 'Separación de responsabilidades',
          },
        },
        {
          icon: 'IconServer',
          label: {
            pt: 'Gunicorn + Nginx',
            en: 'Gunicorn + Nginx',
            es: 'Gunicorn + Nginx',
          },
        },
        {
          icon: 'IconCloud',
          label: {
            pt: 'AWS EC2 e RDS',
            en: 'AWS EC2 and RDS',
            es: 'AWS EC2 y RDS',
          },
        },
        {
          icon: 'IconBolt',
          label: { pt: 'HTMX + HyperScript', en: 'HTMX + HyperScript', es: 'HTMX + HyperScript' },
        },
      ],
      softSkills: [
        {
          icon: 'IconUsers',
          label: {
            pt: 'Delegação e confiança no time',
            en: 'Delegation and trust in the team',
            es: 'Delegación y confianza en el equipo',
          },
        },
        {
          icon: 'IconMessageCircle',
          label: {
            pt: 'Escuta ativa',
            en: 'Active listening',
            es: 'Escucha activa',
          },
        },
        {
          icon: 'IconTarget',
          label: {
            pt: 'Argumentação e persuasão',
            en: 'Argumentation and persuasion',
            es: 'Argumentación y persuasión',
          },
        },
      ],
    },
  },
  {
    id: 'stocker',
    kind: 'academic',
    order: 2,
    eyebrow: {
      pt: '2024/2 · FATEC SJC',
      en: '2024/2 · FATEC SJC',
      es: '2024/2 · FATEC SJC',
    },
    title: 'Stocker',
    tagline: {
      pt: 'Controle de estoque — projeto de 2º semestre.', // TODO(petros)
      en: 'Inventory control — 2nd-semester project.',
      es: 'Control de inventario — proyecto de 2.º semestre.',
    },
    layout: 'web',
    cover: '/images/projects/stocker/dashboard-page.jpeg',
    gallery: [
      '/images/projects/stocker/dashboard-page.jpeg',
      '/images/projects/stocker/inventory-page.jpeg',
      '/images/projects/stocker/products-page.jpeg',
      '/images/projects/stocker/chatbot-ai.jpeg',
      '/images/projects/stocker/notifications-modal.jpeg',
      '/images/projects/stocker/profile-page.jpeg',
    ],
    techs: ['nextjs', 'typescript', 'fastify', 'fastapi', 'postgresql', 'supabase'],
    links: { code: 'https://github.com/CtrI-Alt-Del/stocker' },
    detail: {
      about: {
        pt: 'Aplicação web moderna para **gerenciamento de estoque**, com controle de produtos e lotes em tempo real, permissões granulares por usuário, relatório de analytics gerado com IA e chatbot assistente para os funcionários da empresa.',
        en: 'Modern web app for **inventory management**, with real-time product and batch control, granular per-user permissions, AI-generated analytics reports and an in-app assistant chatbot for employees.',
        es: 'Aplicación web moderna para **gestión de inventario**, con control de productos y lotes en tiempo real, permisos granulares por usuario, informes de analítica generados con IA y chatbot asistente para los empleados de la empresa.',
      },
      features: [
        {
          pt: '**Controle de estoque** com gestão de produtos e lotes, notificações de estoque baixo e alertas de proximidade da data de validade.',
          en: '**Inventory control** with product and batch management, low-stock notifications and expiration-date proximity alerts.',
          es: '**Control de inventario** con gestión de productos y lotes, notificaciones de stock bajo y alertas por proximidad de fecha de vencimiento.',
        },
        {
          pt: '**Controle de permissões** granular, definindo exatamente o que cada colaborador pode acessar e manipular.',
          en: 'Granular **permission control**, defining exactly what each collaborator can access and manipulate.',
          es: '**Control de permisos** granular, definiendo exactamente lo que cada colaborador puede acceder y manipular.',
        },
        {
          pt: '**Relatório de analytics** com IA integrada que gera insights mensais sobre o andamento do estoque.',
          en: '**Analytics report** with integrated AI that produces monthly insights on inventory trends.',
          es: '**Informe de analítica** con IA integrada que genera insights mensuales sobre la evolución del inventario.',
        },
        {
          pt: '**Chatbot assistente** com IA para tirar dúvidas internas, guiar processos da empresa e resolver problemas rotineiros dos colaboradores.',
          en: '**AI assistant chatbot** to answer internal questions, guide company processes and solve routine employee issues.',
          es: '**Chatbot asistente** con IA para responder dudas internas, guiar procesos de la empresa y resolver problemas rutinarios de los colaboradores.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Frontend', en: 'Frontend', es: 'Frontend' },
          techs: ['nextjs', 'react', 'typescript', 'tailwind'],
        },
        {
          label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
          techs: ['nodejs', 'fastify', 'fastapi'],
        },
        {
          label: {
            pt: 'Banco de dados e cache',
            en: 'Database and cache',
            es: 'Base de datos y caché',
          },
          techs: ['postgresql', 'supabase', 'redis'],
        },
      ],
      contributions: [
        {
          pt: 'Atuei novamente como **Product Owner**, mas com foco na negociação de requisitos: fui o único PO da turma a questionar ativamente funcionalidades desalinhadas com os objetivos do projeto e propor soluções alternativas.',
          en: 'Acted again as **Product Owner**, but focused on requirement negotiation: I was the only PO in the class to actively challenge features misaligned with the project’s goals and propose alternative solutions.',
          es: 'Actué nuevamente como **Product Owner**, pero con foco en la negociación de requisitos: fui el único PO de la clase en cuestionar activamente funcionalidades desalineadas con los objetivos del proyecto y proponer soluciones alternativas.',
        },
        {
          pt: 'Assumi a **liderança técnica** conduzindo a seleção de tecnologias, orientando colegas em boas práticas e descrevendo tecnicamente as tarefas do backlog.',
          en: 'Took on **technical leadership**, driving technology selection, guiding peers on best practices and writing the technical breakdown of backlog items.',
          es: 'Asumí el **liderazgo técnico** conduciendo la selección de tecnologías, orientando a los compañeros en buenas prácticas y describiendo técnicamente las tareas del backlog.',
        },
        {
          pt: 'Desenvolvi com autonomia as funcionalidades de **notificações**, **controle de permissões** e o **chatbot com IA**, além do **manual do usuário** do sistema.',
          en: 'Autonomously built the **notifications**, **permission control** and **AI chatbot** features, plus the system’s **user manual**.',
          es: 'Desarrollé con autonomía las funcionalidades de **notificaciones**, **control de permisos** y el **chatbot con IA**, además del **manual del usuario** del sistema.',
        },
      ],
      lessons: [
        {
          pt: 'Adicionar requisitos por capricho pessoal — em busca de visibilidade ou provas de conceito — desperdiça o tempo do time e afasta o produto da dor real do cliente.',
          en: 'Adding requirements out of personal whim — chasing visibility or proofs of concept — wastes the team’s time and drags the product away from the client’s real pain.',
          es: 'Agregar requisitos por capricho personal — buscando visibilidad o pruebas de concepto — desperdicia el tiempo del equipo y aleja al producto del dolor real del cliente.',
        },
        {
          pt: 'Alinhar cada requisito com o **valor de negócio** e a **necessidade concreta do cliente** entrega mais impacto do que aumentar a superfície do escopo.',
          en: 'Aligning each requirement with **business value** and the **client’s concrete need** delivers more impact than expanding the scope surface.',
          es: 'Alinear cada requisito con el **valor de negocio** y la **necesidad concreta del cliente** entrega más impacto que ampliar la superficie del alcance.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconStack2',
          label: {
            pt: 'Projetos monorepo',
            en: 'Monorepo projects',
            es: 'Proyectos monorepo',
          },
        },
        {
          icon: 'IconBolt',
          label: {
            pt: 'Comunicação em tempo real via WebSocket',
            en: 'Real-time communication via WebSocket',
            es: 'Comunicación en tiempo real vía WebSocket',
          },
        },
        {
          icon: 'IconDatabase',
          label: {
            pt: 'Versionamento de banco com ORM e migrations',
            en: 'Database versioning with ORM and migrations',
            es: 'Versionado de base con ORM y migraciones',
          },
        },
        {
          icon: 'IconRobot',
          label: {
            pt: 'Agentes de IA com Google ADK',
            en: 'AI agents with Google ADK',
            es: 'Agentes de IA con Google ADK',
          },
        },
        {
          icon: 'IconCode',
          label: {
            pt: 'CSR, SSR e SSG com Next.js',
            en: 'CSR, SSR and SSG with Next.js',
            es: 'CSR, SSR y SSG con Next.js',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconTarget',
          label: {
            pt: 'Assertividade na tomada de decisão',
            en: 'Assertive decision-making',
            es: 'Asertividad en la toma de decisiones',
          },
        },
        {
          icon: 'IconRocket',
          label: {
            pt: 'Liderança firme e escuta ativa',
            en: 'Firm leadership with active listening',
            es: 'Liderazgo firme con escucha activa',
          },
        },
        {
          icon: 'IconChartBar',
          label: {
            pt: 'Argumentação baseada em dados',
            en: 'Data-driven argumentation',
            es: 'Argumentación basada en datos',
          },
        },
      ],
    },
  },
  {
    id: 'chronos',
    kind: 'academic',
    order: 3,
    eyebrow: {
      pt: '2025/1 · Necto Systems',
      en: '2025/1 · Necto Systems',
      es: '2025/1 · Necto Systems',
    },
    title: 'Chronos',
    tagline: {
      pt: 'Gestão de tempo — projeto de 3º semestre.', // TODO(petros)
      en: 'Time management — 3rd-semester project.',
      es: 'Gestión del tiempo — proyecto de 3.º semestre.',
    },
    layout: 'web',
    cover: '/images/projects/chronos/dashboard-page.jpeg',
    gallery: [
      '/images/projects/chronos/dashboard-page.jpeg',
      '/images/projects/chronos/time-punch-page.jpeg',
      '/images/projects/chronos/hour-bank-page.jpeg',
      '/images/projects/chronos/solicitations-page.jpeg',
      '/images/projects/chronos/day-off-schedule-page.jpeg',
      '/images/projects/chronos/work-leave-calendar-page.jpeg',
      '/images/projects/chronos/collaboration-sector-history-page.jpeg',
    ],
    techs: ['spring', 'nextjs', 'typescript', 'postgresql', 'mongodb', 'redis'],
    links: { code: 'https://github.com/CtrI-Alt-Del/chronos' },
    detail: {
      about: {
        pt: 'Aplicação web moderna para **gerenciamento de ponto online**, com registro eletrônico da jornada, cálculo automático de horas extras e faltas, gestão de ausências com fluxos de aprovação e conformidade com a legislação trabalhista.',
        en: 'Modern web app for **online time-clock management**, with electronic workday tracking, automatic overtime and absence calculation, absence management with approval flows and compliance with labor law.',
        es: 'Aplicación web moderna para **gestión de fichaje online**, con registro electrónico de la jornada, cálculo automático de horas extras y faltas, gestión de ausencias con flujos de aprobación y cumplimiento de la legislación laboral.',
      },
      features: [
        {
          pt: '**Gerenciamento de jornada** com horário flexível, escala mensal de folgas e histórico detalhado das batidas de ponto por setor.',
          en: '**Workday management** with flexible schedules, monthly day-off rota and detailed per-sector time-clock history.',
          es: '**Gestión de jornada** con horario flexible, escala mensual de descansos e historial detallado de fichajes por sector.',
        },
        {
          pt: '**Portal de solicitações** centralizando férias, abono de falta, reajuste de escala e outros pedidos em fluxo totalmente digital.',
          en: '**Requests portal** centralizing vacation, absence justification, schedule adjustments and other petitions in a fully digital flow.',
          es: '**Portal de solicitudes** centralizando vacaciones, justificación de faltas, reajuste de escala y otros pedidos en un flujo totalmente digital.',
        },
        {
          pt: '**Banco de horas** com acúmulo e compensação automática, garantindo flexibilidade e controle claro do saldo de cada colaborador.',
          en: '**Hour bank** with automatic accrual and compensation, ensuring flexibility and a clear balance per collaborator.',
          es: '**Banco de horas** con acumulación y compensación automática, garantizando flexibilidad y control claro del saldo de cada colaborador.',
        },
        {
          pt: '**Autenticação via OTP** e sistema de **notificação por e-mail** para eventos-chave do fluxo trabalhista.',
          en: '**OTP-based authentication** and an **email notification system** for key events in the workday flow.',
          es: '**Autenticación vía OTP** y sistema de **notificación por correo** para eventos clave del flujo laboral.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
          techs: ['spring'],
        },
        {
          label: { pt: 'Frontend', en: 'Frontend', es: 'Frontend' },
          techs: ['nextjs', 'typescript'],
        },
        {
          label: {
            pt: 'Persistência e mensageria',
            en: 'Persistence and messaging',
            es: 'Persistencia y mensajería',
          },
          techs: ['postgresql', 'mongodb', 'redis'],
        },
      ],
      contributions: [
        {
          pt: 'Atuei como **Scrum Team e desenvolvedor full-stack** com foco no backend, planejando e implementando o **banco de dados híbrido** (PostgreSQL + MongoDB).',
          en: 'Worked as **Scrum Team member and full-stack developer** focused on the backend, planning and implementing the **hybrid database** (PostgreSQL + MongoDB).',
          es: 'Actué como **integrante del Scrum Team y desarrollador full-stack** con foco en el backend, planificando e implementando la **base de datos híbrida** (PostgreSQL + MongoDB).',
        },
        {
          pt: 'Implementei o **processamento assíncrono e mensageria em fila** com RabbitMQ e todo o **sistema de notificação por e-mail**.',
          en: 'Built the **asynchronous processing and queue messaging** with RabbitMQ and the entire **email notification system**.',
          es: 'Implementé el **procesamiento asíncrono y mensajería en cola** con RabbitMQ y todo el **sistema de notificación por correo**.',
        },
        {
          pt: 'Desenvolvi o **fluxo do banco de horas** e a **autenticação por código OTP**, além de refatorar páginas do frontend e a interface do calendário de férias.',
          en: 'Developed the **hour-bank flow** and **OTP-code authentication**, and refactored frontend pages and the vacation calendar UI.',
          es: 'Desarrollé el **flujo del banco de horas** y la **autenticación por código OTP**, además de refactorizar páginas del frontend y la interfaz del calendario de vacaciones.',
        },
      ],
      lessons: [
        {
          pt: 'O **planejamento de sprint bem feito** é o que impede desalinhamento de expectativas, retrabalho e atrasos — investir tempo no refinamento do backlog compensa em toda a execução.',
          en: 'A **well-run sprint planning** is what prevents misaligned expectations, rework and delays — time spent refining the backlog pays off throughout the execution.',
          es: 'La **planificación de sprint bien hecha** es lo que evita expectativas desalineadas, retrabajo y atrasos — invertir tiempo en refinar el backlog compensa durante toda la ejecución.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconStack2',
          label: {
            pt: 'Clean Architecture e DDD',
            en: 'Clean Architecture and DDD',
            es: 'Clean Architecture y DDD',
          },
        },
        {
          icon: 'IconBolt',
          label: {
            pt: 'Processamento assíncrono',
            en: 'Asynchronous processing',
            es: 'Procesamiento asíncrono',
          },
        },
        {
          icon: 'IconServer',
          label: {
            pt: 'Mensageria com RabbitMQ',
            en: 'Messaging with RabbitMQ',
            es: 'Mensajería con RabbitMQ',
          },
        },
        {
          icon: 'IconDatabase',
          label: {
            pt: 'Banco de dados híbrido',
            en: 'Hybrid database strategy',
            es: 'Base de datos híbrida',
          },
        },
        {
          icon: 'IconCode',
          label: { pt: 'Java Spring Boot', en: 'Java Spring Boot', es: 'Java Spring Boot' },
        },
      ],
      softSkills: [
        {
          icon: 'IconMessageCircle',
          label: {
            pt: 'Comunicação técnica para leigos',
            en: 'Technical communication for non-technical audiences',
            es: 'Comunicación técnica para audiencias no técnicas',
          },
        },
        {
          icon: 'IconBulb',
          label: {
            pt: 'Uso de analogias e exemplos práticos',
            en: 'Analogies and practical examples',
            es: 'Uso de analogías y ejemplos prácticos',
          },
        },
        {
          icon: 'IconUsers',
          label: {
            pt: 'Colaboração transversal no time',
            en: 'Cross-team collaboration',
            es: 'Colaboración transversal en el equipo',
          },
        },
      ],
    },
  },
  {
    id: 'gaia',
    kind: 'academic',
    order: 4,
    eyebrow: { pt: '2025/2 · Tecsus', en: '2025/2 · Tecsus', es: '2025/2 · Tecsus' },
    title: 'Gaia',
    tagline: {
      pt: 'Sustentabilidade — projeto de 4º semestre.', // TODO(petros)
      en: 'Sustainability — 4th-semester project.',
      es: 'Sostenibilidad — proyecto de 4.º semestre.',
    },
    layout: 'web',
    cover: '/images/projects/gaia/gaia-dashboard-page.png',
    gallery: [
      '/images/projects/gaia/gaia-dashboard-page.png',
      '/images/projects/gaia/gaia-station-page.png',
      '/images/projects/gaia/gaia-alerts-page.png',
      '/images/projects/gaia/gaia-alarms-page.png',
      '/images/projects/gaia/gaia-portal-page.png',
    ],
    techs: ['nestjs', 'react', 'astro', 'postgresql', 'mongodb', 'terraform', 'aws'],
    detail: {
      about: {
        pt: 'Aplicação web para **monitoramento de estações meteorológicas de baixo custo** desenvolvida em parceria com a Tecsus. Coleta e processa dados de sensores físicos via **protocolo MQTT** e disponibiliza dashboards em tempo real, alarmes configuráveis e um **portal educacional** com modelos 3D dos dispositivos.',
        en: 'Web app for **monitoring low-cost weather stations** built in partnership with Tecsus. Collects and processes physical-sensor data via the **MQTT protocol** and delivers real-time dashboards, configurable alarms and an **educational portal** with 3D device models.',
        es: 'Aplicación web para **monitoreo de estaciones meteorológicas de bajo costo** desarrollada en alianza con Tecsus. Recolecta y procesa datos de sensores físicos vía **protocolo MQTT** y ofrece dashboards en tiempo real, alarmas configurables y un **portal educativo** con modelos 3D de los dispositivos.',
      },
      features: [
        {
          pt: '**Dashboard consolidado** com percentual de estações ativas, contagem de alertas, evolução dos últimos 12 meses e mapa geográfico interativo.',
          en: '**Consolidated dashboard** with active-station percentage, alert counts, 12-month evolution and an interactive geographic map.',
          es: '**Dashboard consolidado** con porcentaje de estaciones activas, conteo de alertas, evolución de los últimos 12 meses y mapa geográfico interactivo.',
        },
        {
          pt: '**Gerenciamento de estações** com localização em mapa, histórico detalhado de medições e exportação de relatórios em PDF.',
          en: '**Station management** with map-based location, detailed measurement history and PDF report export.',
          es: '**Gestión de estaciones** con localización en mapa, historial detallado de mediciones y exportación de informes en PDF.',
        },
        {
          pt: '**Alarmes configuráveis por parâmetro** com regras de comparação e níveis de severidade (**Aviso** ou **Crítico**), gerando alertas em tempo real.',
          en: 'Per-parameter **configurable alarms** with comparison rules and severity levels (**Warning** or **Critical**), generating real-time alerts.',
          es: '**Alarmas configurables por parámetro** con reglas de comparación y niveles de severidad (**Aviso** o **Crítico**), generando alertas en tiempo real.',
        },
        {
          pt: '**Portal educacional** estático em Astro com modelos 3D das placas e explicações matemáticas por trás de cada variável monitorada.',
          en: 'Static **educational portal** in Astro with 3D board models and math explanations behind each monitored variable.',
          es: '**Portal educativo** estático en Astro con modelos 3D de las placas y explicaciones matemáticas detrás de cada variable monitoreada.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Frontend', en: 'Frontend', es: 'Frontend' },
          techs: ['react', 'astro', 'tailwind'],
        },
        {
          label: { pt: 'Backend e ingestão', en: 'Backend and ingestion', es: 'Backend e ingesta' },
          techs: ['nestjs', 'nodejs'],
        },
        {
          label: {
            pt: 'Persistência poliglota',
            en: 'Polyglot persistence',
            es: 'Persistencia políglota',
          },
          techs: ['postgresql', 'mongodb', 'redis'],
        },
        {
          label: {
            pt: 'Infraestrutura',
            en: 'Infrastructure',
            es: 'Infraestructura',
          },
          techs: ['aws', 'terraform', 'docker'],
        },
      ],
      contributions: [
        {
          pt: 'Assumi pela primeira vez o papel de **Scrum Master**, facilitando as cerimônias ágeis e cultivando autonomia, foco e cultura de melhoria contínua no time.',
          en: 'Took on the **Scrum Master** role for the first time, facilitating agile ceremonies and cultivating autonomy, focus and a continuous-improvement culture in the team.',
          es: 'Asumí por primera vez el rol de **Scrum Master**, facilitando las ceremonias ágiles y cultivando autonomía, foco y cultura de mejora continua en el equipo.',
        },
        {
          pt: 'Conduzi um **impedimento de natureza humana**: mediando de forma respeitosa e transparente a redefinição da composição do time, com base no consenso do grupo.',
          en: 'Managed a **human-related impediment**: mediating in a respectful and transparent way the team composition change, driven by group consensus.',
          es: 'Conduje un **impedimento de naturaleza humana**: mediando de forma respetuosa y transparente la redefinición de la composición del equipo, con base en el consenso del grupo.',
        },
        {
          pt: 'Fui integralmente responsável pela **infraestrutura em AWS com Terraform (IaC)**, provisionando banco de dados, servidores, rede e o **pipeline de Continuous Deployment**.',
          en: 'Was fully responsible for the **AWS infrastructure with Terraform (IaC)**, provisioning databases, servers, network and the **Continuous Deployment pipeline**.',
          es: 'Fui íntegramente responsable de la **infraestructura en AWS con Terraform (IaC)**, aprovisionando base de datos, servidores, red y el **pipeline de Continuous Deployment**.',
        },
      ],
      lessons: [
        {
          pt: 'O **Scrum Master é líder servidor**: sua autoridade vem de remover obstáculos e proteger o time, não de tomar decisões técnicas ou de priorização.',
          en: 'The **Scrum Master is a servant leader**: authority comes from removing obstacles and protecting the team, not from making technical or prioritization decisions.',
          es: 'El **Scrum Master es líder servidor**: su autoridad viene de remover obstáculos y proteger al equipo, no de tomar decisiones técnicas o de priorización.',
        },
        {
          pt: 'A **ausência de pipeline de entrega desde o início** gera um custo crescente a cada sprint — configurar CD nas primeiras semanas é tão estratégico quanto entregar features.',
          en: 'The **lack of a delivery pipeline from the start** compounds cost each sprint — setting up CD in the first weeks is as strategic as shipping features.',
          es: 'La **ausencia de un pipeline de entrega desde el inicio** genera un costo creciente cada sprint — configurar CD en las primeras semanas es tan estratégico como entregar features.',
        },
        {
          pt: '**Clientes corporativos** exigem um nível de rastreabilidade e documentação de processo que reflete a maturidade do time — não é burocracia, é comunicação profissional.',
          en: '**Corporate clients** require a level of traceability and process documentation that reflects team maturity — not bureaucracy, but professional communication.',
          es: 'Los **clientes corporativos** exigen un nivel de trazabilidad y documentación de proceso que refleja la madurez del equipo — no es burocracia, es comunicación profesional.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconBolt',
          label: {
            pt: 'MQTT e arquitetura event-driven',
            en: 'MQTT and event-driven architecture',
            es: 'MQTT y arquitectura event-driven',
          },
        },
        {
          icon: 'IconDatabase',
          label: {
            pt: 'Persistência poliglota',
            en: 'Polyglot persistence',
            es: 'Persistencia políglota',
          },
        },
        {
          icon: 'IconCloud',
          label: {
            pt: 'Infrastructure as Code com Terraform na AWS',
            en: 'Infrastructure as Code with Terraform on AWS',
            es: 'Infrastructure as Code con Terraform en AWS',
          },
        },
        {
          icon: 'IconRocket',
          label: {
            pt: 'Pipeline de Continuous Deployment',
            en: 'Continuous Deployment pipeline',
            es: 'Pipeline de Continuous Deployment',
          },
        },
        {
          icon: 'IconServer',
          label: {
            pt: 'Filas assíncronas com Bull e Redis',
            en: 'Async queues with Bull and Redis',
            es: 'Colas asíncronas con Bull y Redis',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconHeart',
          label: {
            pt: 'Liderança servidora',
            en: 'Servant leadership',
            es: 'Liderazgo servidor',
          },
        },
        {
          icon: 'IconClock',
          label: {
            pt: 'Paciência estratégica',
            en: 'Strategic patience',
            es: 'Paciencia estratégica',
          },
        },
        {
          icon: 'IconUsers',
          label: {
            pt: 'Decisões difíceis com empatia',
            en: 'Difficult decisions with empathy',
            es: 'Decisiones difíciles con empatía',
          },
        },
      ],
    },
  },
  {
    id: 'animus',
    kind: 'academic',
    order: 5,
    eyebrow: { pt: '2026/1 · Xertica', en: '2026/1 · Xertica', es: '2026/1 · Xertica' },
    title: 'Animus',
    tagline: {
      pt: 'Projeto de 5º semestre.', // TODO(petros)
      en: '5th-semester project.',
      es: 'Proyecto de 5.º semestre.',
    },
    layout: 'mobile',
    cover: '/images/projects/animus/home-screen.jpeg',
    gallery: [
      '/images/projects/animus/home-screen.jpeg',
      '/images/projects/animus/lawer-case-screen.png',
      '/images/projects/animus/first-instance-case-screen.jpeg',
      '/images/projects/animus/second-instance-case-screen.png',
    ],
    techs: ['flutter', 'fastapi', 'python', 'postgresql', 'qdrant', 'gcp'],
    links: { code: 'https://github.com/CtrI-Alt-Del/animus' },
    detail: {
      about: {
        pt: 'Aplicação **mobile em Flutter** integrada à nuvem, desenvolvida com a Xertica, que automatiza a **pesquisa e análise de precedentes jurídicos** por meio de IA generativa e busca semântica vetorial. Atende juízes de 1ª e 2ª instância na fundamentação de decisões e advogados na avaliação da viabilidade de teses.',
        en: 'Cloud-integrated **mobile app in Flutter**, built with Xertica, that automates **legal-precedent search and analysis** through generative AI and vector semantic search. Supports first- and second-instance judges in grounding decisions and lawyers in assessing the viability of their theses.',
        es: 'Aplicación **móvil en Flutter** integrada a la nube, desarrollada con Xertica, que automatiza la **búsqueda y análisis de precedentes jurídicos** mediante IA generativa y búsqueda semántica vectorial. Atiende a jueces de 1.ª y 2.ª instancia en la fundamentación de decisiones y a abogados en la evaluación de la viabilidad de sus tesis.',
      },
      features: [
        {
          pt: '**Análise de 1ª instância**: o juiz faz upload da petição inicial em PDF e recebe precedentes classificados como **Aplicável** ou **Possivelmente aplicável**.',
          en: '**First-instance analysis**: the judge uploads the initial petition as PDF and receives precedents classified as **Applicable** or **Possibly applicable**.',
          es: '**Análisis de 1.ª instancia**: el juez carga la petición inicial en PDF y recibe precedentes clasificados como **Aplicable** o **Posiblemente aplicable**.',
        },
        {
          pt: '**Análise de 2ª instância**: a IA extrai a petição inicial dos autos completos e gera uma **minuta estruturada de sentença** (Relatório, Análise do Mérito, Aderência aos Precedentes e Dispositivo).',
          en: '**Second-instance analysis**: the AI extracts the initial petition from the full case file and generates a **structured draft ruling** (Report, Merit Analysis, Precedent Adherence and Disposition).',
          es: '**Análisis de 2.ª instancia**: la IA extrae la petición inicial de los autos completos y genera un **borrador estructurado de sentencia** (Informe, Análisis del Fondo, Adherencia a Precedentes y Fallo).',
        },
        {
          pt: '**Análise via briefing** para advogados avaliarem a viabilidade da tese a partir de um formulário estruturado, mesmo sem a petição formalizada.',
          en: '**Briefing-based analysis** for lawyers to evaluate thesis viability from a structured form, even without a drafted petition.',
          es: '**Análisis vía briefing** para que los abogados evalúen la viabilidad de la tesis desde un formulario estructurado, incluso sin la petición formalizada.',
        },
        {
          pt: '**Biblioteca e histórico** de análises organizados por tipo, status e pastas temáticas, com exportação em DOCX.',
          en: '**Library and history** of analyses organized by type, status and thematic folders, with DOCX export.',
          es: '**Biblioteca e historial** de análisis organizados por tipo, estado y carpetas temáticas, con exportación en DOCX.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Mobile', en: 'Mobile', es: 'Mobile' },
          techs: ['flutter'],
        },
        {
          label: { pt: 'Backend', en: 'Backend', es: 'Backend' },
          techs: ['python', 'fastapi'],
        },
        {
          label: {
            pt: 'Persistência e busca vetorial',
            en: 'Persistence and vector search',
            es: 'Persistencia y búsqueda vectorial',
          },
          techs: ['postgresql', 'qdrant'],
        },
        {
          label: { pt: 'Infraestrutura', en: 'Infrastructure', es: 'Infraestructura' },
          techs: ['gcp', 'docker'],
        },
      ],
      contributions: [
        {
          pt: 'Atuei integralmente como **Dev Team**, concentrando a energia técnica nas funcionalidades de maior complexidade — todos os fluxos de análise de documentos jurídicos.',
          en: 'Worked entirely as **Dev Team**, focusing my technical effort on the most complex features — every legal-document analysis flow.',
          es: 'Actué íntegramente como **Dev Team**, concentrando la energía técnica en las funcionalidades más complejas — todos los flujos de análisis de documentos jurídicos.',
        },
        {
          pt: 'Desenvolvi a camada de **busca vetorial semântica com Qdrant**, incluindo o design e a otimização do pipeline de embeddings para textos jurídicos.',
          en: 'Built the **semantic vector search layer with Qdrant**, including the design and optimization of the embedding pipeline for legal texts.',
          es: 'Desarrollé la capa de **búsqueda vectorial semántica con Qdrant**, incluyendo el diseño y la optimización del pipeline de embeddings para textos jurídicos.',
        },
        {
          pt: 'Construí os **agentes de IA com o framework Agno** e integrei o **Google Gemini** para a geração de minutas fundamentadas nos precedentes identificados.',
          en: 'Built the **AI agents with the Agno framework** and integrated **Google Gemini** to generate drafts grounded on the identified precedents.',
          es: 'Construí los **agentes de IA con el framework Agno** e integré **Google Gemini** para la generación de borradores fundamentados en los precedentes identificados.',
        },
        {
          pt: 'Orquestrei os **fluxos assíncronos com Inngest**, garantindo que análises de documentos extensos não bloqueassem a experiência do usuário no app.',
          en: 'Orchestrated the **asynchronous flows with Inngest**, ensuring that long-document analyses never blocked the in-app user experience.',
          es: 'Orquesté los **flujos asíncronos con Inngest**, garantizando que los análisis de documentos extensos no bloqueen la experiencia del usuario en la app.',
        },
      ],
      lessons: [
        {
          pt: 'Existe um **limite claro para a compensação individual** em um time disfuncional — absorver o trabalho alheio garante entrega no curto prazo, mas desincentiva o comprometimento do grupo.',
          en: 'There’s a **clear limit to individual compensation** in a dysfunctional team — absorbing others’ work secures short-term delivery but discourages group commitment.',
          es: 'Existe un **límite claro para la compensación individual** en un equipo disfuncional — absorber el trabajo ajeno garantiza la entrega a corto plazo, pero desincentiva el compromiso del grupo.',
        },
        {
          pt: 'Em projetos com **IA generativa aplicada a domínios especializados**, ambiguidade de requisitos custa caro — a validação contínua com o cliente precisa ser sistemática, não pontual.',
          en: 'In projects with **generative AI applied to specialized domains**, ambiguous requirements are expensive — continuous client validation must be systematic, not occasional.',
          es: 'En proyectos con **IA generativa aplicada a dominios especializados**, la ambigüedad de requisitos sale cara — la validación continua con el cliente debe ser sistemática, no puntual.',
        },
        {
          pt: 'O maior valor em sistemas com IA não está na integração com os modelos, mas na **engenharia do contexto**: estruturar prompts, escolher o que incluir e orientar o agente para outputs coerentes com o domínio.',
          en: 'The biggest value in AI systems isn’t in model integration but in **context engineering**: structuring prompts, deciding what to include and guiding the agent toward domain-coherent outputs.',
          es: 'El mayor valor en sistemas con IA no está en la integración con los modelos, sino en la **ingeniería del contexto**: estructurar prompts, decidir qué incluir y orientar al agente hacia outputs coherentes con el dominio.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconDatabase',
          label: {
            pt: 'Busca semântica com embeddings no Qdrant',
            en: 'Semantic search with embeddings on Qdrant',
            es: 'Búsqueda semántica con embeddings en Qdrant',
          },
        },
        {
          icon: 'IconRobot',
          label: {
            pt: 'Agentes de IA multi-etapa com Agno',
            en: 'Multi-step AI agents with Agno',
            es: 'Agentes de IA multi-etapa con Agno',
          },
        },
        {
          icon: 'IconBrain',
          label: {
            pt: 'Engenharia de contexto para IA generativa',
            en: 'Context engineering for generative AI',
            es: 'Ingeniería de contexto para IA generativa',
          },
        },
        {
          icon: 'IconCloud',
          label: {
            pt: 'IaC no GCP com Pulumi',
            en: 'IaC on GCP with Pulumi',
            es: 'IaC en GCP con Pulumi',
          },
        },
        {
          icon: 'IconCode',
          label: {
            pt: 'Flutter com Riverpod',
            en: 'Flutter with Riverpod',
            es: 'Flutter con Riverpod',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconTarget',
          label: {
            pt: 'Comunicação firme de expectativas',
            en: 'Firm expectation-setting',
            es: 'Comunicación firme de expectativas',
          },
        },
        {
          icon: 'IconEye',
          label: {
            pt: 'Neutralidade em conflitos de time',
            en: 'Neutrality in team conflicts',
            es: 'Neutralidad en conflictos de equipo',
          },
        },
        {
          icon: 'IconMessageCircle',
          label: {
            pt: 'Aproveitamento estratégico da parceria com o cliente',
            en: 'Strategic use of client partnership',
            es: 'Aprovechamiento estratégico de la alianza con el cliente',
          },
        },
      ],
    },
  },
  // ── Professional (4) ──
  {
    id: 'stardust',
    kind: 'professional',
    order: 1,
    eyebrow: {
      pt: '2022–2024 · Tese ETEC',
      en: '2022–2024 · ETEC Thesis',
      es: '2022–2024 · Tesis ETEC',
    },
    title: 'StarDust',
    tagline: {
      pt: 'Plataforma educativa gamificada para o ensino de **lógica de programação**, com editor da linguagem **Delégua** integrado.',
      en: 'Gamified learning platform for **programming logic**, with an embedded editor for the **Delégua** language.',
      es: 'Plataforma educativa gamificada para la enseñanza de **lógica de programación**, con editor de la lengua **Delégua** integrado.',
    },
    layout: 'web',
    cover: '/images/projects/stardust/space-page.png',
    gallery: [
      '/images/projects/stardust/space-page.png',
      '/images/projects/stardust/challenges-page.png',
      '/images/projects/stardust/challenge-page.png',
      '/images/projects/stardust/lesson-page.png',
      '/images/projects/stardust/quiz-stage.png',
      '/images/projects/stardust/congratulations-stage.png',
      '/images/projects/stardust/profile-page.png',
      '/images/projects/stardust/shop-avatars-page.png',
      '/images/projects/stardust/shop-rockets-page.png',
      '/images/projects/stardust/login-page.png',
    ],
    techs: ['typescript', 'nextjs', 'react', 'tailwind', 'nodejs', 'supabase', 'jest'],
    links: {
      code: 'https://github.com/JohnPetros/stardust',
      live: 'https://www.stardust-app.com.br/landing',
    },
    detail: {
      about: {
        pt: 'Plataforma educativa **gamificada** desenvolvida como TCC da ETEC para o ensino de **lógica de programação** a iniciantes. Utiliza uma **metáfora espacial** — planetas (temas) e estrelas (fases) — combinada com XP, StarCoins, ofensiva diária e conquistas para engajar os estudantes em uma jornada estruturada.',
        en: '**Gamified** educational platform built as my ETEC thesis for teaching **programming logic** to beginners. It uses a **space metaphor** — planets (topics) and stars (levels) — combined with XP, StarCoins, daily streaks and achievements to engage students in a structured journey.',
        es: 'Plataforma educativa **gamificada** desarrollada como TCC de la ETEC para la enseñanza de **lógica de programación** a principiantes. Utiliza una **metáfora espacial** — planetas (temas) y estrellas (niveles) — combinada con XP, StarCoins, racha diaria y logros para enganchar a los estudiantes en un recorrido estructurado.',
      },
      features: [
        {
          pt: '**Sistema de gamificação completo** com XP, moedas StarCoins, ofensiva diária (streak), conquistas e loja de avatares e foguetes.',
          en: 'Complete **gamification system** with XP, StarCoins, daily streak, achievements and a shop for avatars and rockets.',
          es: 'Sistema de **gamificación completo** con XP, monedas StarCoins, racha diaria, logros y tienda de avatares y cohetes.',
        },
        {
          pt: '**Jornada espacial** organizando o conteúdo em planetas (temas) e estrelas (fases), com progressão desbloqueada por desempenho.',
          en: '**Space journey** organizing content into planets (topics) and stars (levels), with progression unlocked by performance.',
          es: '**Viaje espacial** que organiza el contenido en planetas (temas) y estrellas (niveles), con progresión desbloqueada por rendimiento.',
        },
        {
          pt: '**Ambiente completo em três aplicações**: plataforma de estudo (Web), painel administrativo (Studio) e API (Server), tudo em um mesmo monorepo.',
          en: 'Complete **three-app environment**: study platform (Web), admin panel (Studio) and API (Server), all in a single monorepo.',
          es: 'Ambiente completo en **tres aplicaciones**: plataforma de estudio (Web), panel administrativo (Studio) y API (Server), todo en un mismo monorepo.',
        },
        {
          pt: '**Editor de código integrado** com Language Server Protocol próprio para a linguagem **Delégua** (linguagem 100% em português).',
          en: 'Integrated **in-browser code editor** with a custom Language Server Protocol for the **Delégua** language (a fully Portuguese-based language).',
          es: '**Editor de código integrado** con un Language Server Protocol propio para el lenguaje **Delégua** (lenguaje 100% en portugués).',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Frontend Web', en: 'Web frontend', es: 'Frontend Web' },
          techs: ['nextjs', 'react', 'typescript', 'tailwind'],
        },
        {
          label: {
            pt: 'Backend e mensageria',
            en: 'Backend and messaging',
            es: 'Backend y mensajería',
          },
          techs: ['nodejs'],
        },
        {
          label: {
            pt: 'Painel administrativo',
            en: 'Admin panel',
            es: 'Panel administrativo',
          },
          techs: ['react', 'typescript'],
        },
        {
          label: {
            pt: 'Persistência',
            en: 'Persistence',
            es: 'Persistencia',
          },
          techs: ['supabase', 'postgresql'],
        },
        {
          label: { pt: 'Testes', en: 'Testing', es: 'Pruebas' },
          techs: ['jest'],
        },
      ],
      contributions: [
        {
          pt: 'Concebi, projetei e implementei **toda a plataforma sozinho** como TCC da ETEC — do produto e da UI até o backend e a infraestrutura.',
          en: 'Conceived, designed and built the **entire platform on my own** as my ETEC thesis — from product and UI to backend and infrastructure.',
          es: 'Concebí, diseñé e implementé **toda la plataforma solo** como TCC de la ETEC — del producto y la UI al backend y la infraestructura.',
        },
        {
          pt: 'Modelei o **core de negócio** com **Clean Architecture** + **DDD** em arquitetura **hexagonal**, mantendo o pacote `@stardust/core` totalmente independente de frameworks.',
          en: 'Modeled the **business core** with **Clean Architecture** + **DDD** in a **hexagonal** architecture, keeping the `@stardust/core` package fully framework-agnostic.',
          es: 'Modelé el **núcleo de negocio** con **Clean Architecture** + **DDD** en arquitectura **hexagonal**, manteniendo el paquete `@stardust/core` totalmente independiente de frameworks.',
        },
        {
          pt: 'Estruturei o **monorepo com TurboRepo** separando as três aplicações (`web`, `server`, `studio`) e pacotes compartilhados (`core`, `validation`, `email`, `lsp`).',
          en: 'Structured the **TurboRepo monorepo** splitting the three apps (`web`, `server`, `studio`) and shared packages (`core`, `validation`, `email`, `lsp`).',
          es: 'Estructuré el **monorepo con TurboRepo** separando las tres aplicaciones (`web`, `server`, `studio`) y paquetes compartidos (`core`, `validation`, `email`, `lsp`).',
        },
        {
          pt: 'Desenvolvi um **Language Server Protocol** próprio para a linguagem Delégua, viabilizando autocomplete e diagnóstico dentro do editor de código integrado.',
          en: 'Built a custom **Language Server Protocol** for the Delégua language, enabling autocomplete and diagnostics inside the embedded code editor.',
          es: 'Desarrollé un **Language Server Protocol** propio para el lenguaje Delégua, habilitando autocompletado y diagnóstico dentro del editor integrado.',
        },
        {
          pt: 'Projetei todo o **sistema de gamificação** — XP, StarCoins, streak, conquistas e loja — como regras de domínio no core.',
          en: 'Designed the whole **gamification system** — XP, StarCoins, streak, achievements and shop — as domain rules inside the core.',
          es: 'Diseñé todo el **sistema de gamificación** — XP, StarCoins, racha, logros y tienda — como reglas de dominio dentro del core.',
        },
      ],
      lessons: [
        {
          pt: 'Um **projeto solo de longa duração** exige documentação sistemática das decisões técnicas — sem a memória compartilhada de um time, o próprio autor perde contexto ao longo do tempo.',
          en: 'A **long-running solo project** demands systematic documentation of technical decisions — without a team’s shared memory, even the author loses context over time.',
          es: 'Un **proyecto solo de larga duración** exige documentación sistemática de las decisiones técnicas — sin la memoria compartida de un equipo, hasta el autor pierde contexto con el tiempo.',
        },
        {
          pt: '**Clean Architecture** e **DDD** têm custo inicial alto, mas compensam quando o domínio é rico em regras — no StarDust, isolar o core permitiu reutilizar toda a lógica em web, server e studio.',
          en: '**Clean Architecture** and **DDD** have a high upfront cost, but pay off when the domain has rich rules — in StarDust, isolating the core let me reuse all logic across web, server and studio.',
          es: '**Clean Architecture** y **DDD** tienen un costo inicial alto, pero se compensan cuando el dominio tiene reglas ricas — en StarDust, aislar el core permitió reutilizar toda la lógica en web, server y studio.',
        },
        {
          pt: 'Construir um produto de ponta a ponta — do editor de código à economia de moedas virtuais — ensinou que **decisões de produto e de código são inseparáveis**.',
          en: 'Building a product end to end — from the code editor to the virtual-coin economy — taught me that **product and code decisions are inseparable**.',
          es: 'Construir un producto de punta a punta — del editor de código a la economía de monedas virtuales — enseñó que las **decisiones de producto y de código son inseparables**.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconStack2',
          label: {
            pt: 'Clean Architecture, DDD e arquitetura hexagonal',
            en: 'Clean Architecture, DDD and hexagonal architecture',
            es: 'Clean Architecture, DDD y arquitectura hexagonal',
          },
        },
        {
          icon: 'IconCode',
          label: {
            pt: 'Monorepo com TurboRepo',
            en: 'Monorepo with TurboRepo',
            es: 'Monorepo con TurboRepo',
          },
        },
        {
          icon: 'IconBrain',
          label: {
            pt: 'Language Server Protocol customizado',
            en: 'Custom Language Server Protocol',
            es: 'Language Server Protocol personalizado',
          },
        },
        {
          icon: 'IconServer',
          label: {
            pt: 'Filas e jobs com Inngest',
            en: 'Queues and jobs with Inngest',
            es: 'Colas y jobs con Inngest',
          },
        },
        {
          icon: 'IconBolt',
          label: {
            pt: 'Design de sistema gamificado',
            en: 'Gamified system design',
            es: 'Diseño de sistema gamificado',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconRocket',
          label: {
            pt: 'Autonomia em projeto solo de longo prazo',
            en: 'Autonomy in a long-term solo project',
            es: 'Autonomía en proyecto solo de largo plazo',
          },
        },
        {
          icon: 'IconBulb',
          label: {
            pt: 'Design de produto e UX',
            en: 'Product design and UX',
            es: 'Diseño de producto y UX',
          },
        },
        {
          icon: 'IconTarget',
          label: {
            pt: 'Documentação técnica sistemática',
            en: 'Systematic technical documentation',
            es: 'Documentación técnica sistemática',
          },
        },
      ],
    },
  },
  {
    id: 'pulo-do-gato-news',
    kind: 'professional',
    order: 2,
    eyebrow: { pt: '2024 · Blog SEO', en: '2024 · SEO Blog', es: '2024 · Blog SEO' },
    title: 'Pulo do Gato News',
    tagline: {
      pt: 'Blog de notícias da **região de São Paulo** com foco em **SEO técnico** e distribuição por **CDN**.',
      en: 'News blog for the **São Paulo region** focused on **technical SEO** and **CDN**-based delivery.',
      es: 'Blog de noticias de la **región de São Paulo** con foco en **SEO técnico** y distribución por **CDN**.',
    },
    layout: 'web',
    cover: '/images/projects/pulo-do-gato-news/home-page.png',
    gallery: [
      '/images/projects/pulo-do-gato-news/home-page.png',
      '/images/projects/pulo-do-gato-news/posts-page.jpg',
      '/images/projects/pulo-do-gato-news/columns-section-page.jpg',
      '/images/projects/pulo-do-gato-news/about-page.jpg',
    ],
    techs: ['astro', 'react', 'typescript', 'tailwind'],
    links: {
      code: 'https://github.com/JohnPetros/pulo-do-gato-news',
      live: 'https://pulodogatonews.com.br/',
    },
    detail: {
      about: {
        pt: 'Blog de notícias **freelance** desenvolvido para a empresa Pulo do Gato News, com acervo sobre educação, tecnologia, esporte e cultura pop da região de São Paulo. Site **estático de alta performance** com **Astro**, servido via **CDN** e otimizado para **SEO técnico**, com conteúdo administrado por CMS headless.',
        en: 'Freelance news blog built for the Pulo do Gato News company, covering education, technology, sports and pop culture in the São Paulo region. **High-performance static site** built with **Astro**, delivered through a **CDN** and optimized for **technical SEO**, with content managed via a headless CMS.',
        es: 'Blog de noticias **freelance** desarrollado para la empresa Pulo do Gato News, con acervo sobre educación, tecnología, deporte y cultura pop de la región de São Paulo. Sitio **estático de alto rendimiento** con **Astro**, servido vía **CDN** y optimizado para **SEO técnico**, con contenido administrado por CMS headless.',
      },
      features: [
        {
          pt: '**Listagem e filtragem** de notícias por título, categorias ou tags, com paginação e destaque para a manchete do dia na home.',
          en: 'News **listing and filtering** by title, category or tag, with pagination and a daily headline highlighted on the home page.',
          es: '**Listado y filtrado** de noticias por título, categorías o tags, con paginación y destaque para el titular del día en la home.',
        },
        {
          pt: '**Indicador de progresso de leitura** no topo da página da notícia, que cresce conforme o leitor percorre o conteúdo.',
          en: '**Reading progress indicator** at the top of each article, growing as the reader scrolls through the content.',
          es: '**Indicador de progreso de lectura** en la parte superior de la noticia, que crece a medida que el lector recorre el contenido.',
        },
        {
          pt: '**Compartilhamento nativo** por WhatsApp, Facebook, X, Reddit, LinkedIn, Gmail, Yahoo e Medium para ampliar o alcance orgânico e gerar backlinks.',
          en: '**Native sharing** to WhatsApp, Facebook, X, Reddit, LinkedIn, Gmail, Yahoo and Medium to boost organic reach and generate backlinks.',
          es: '**Compartir nativo** por WhatsApp, Facebook, X, Reddit, LinkedIn, Gmail, Yahoo y Medium para ampliar el alcance orgánico y generar backlinks.',
        },
        {
          pt: '**Sistema de comentários** com paginação em estilo "Load More" e formulário com nome, e-mail e conteúdo do leitor.',
          en: '**Comment system** with "Load More" pagination and a form capturing name, email and reader content.',
          es: '**Sistema de comentarios** con paginación tipo "Load More" y formulario con nombre, correo y contenido del lector.',
        },
        {
          pt: '**Seção de colunistas** com envio de coluna via **editor Rich Text**, permitindo que leitores enviem histórias com potencial jornalístico.',
          en: '**Columnists section** with column submission through a **Rich Text editor**, letting readers send stories with journalistic potential.',
          es: '**Sección de columnistas** con envío de columna vía **editor Rich Text**, permitiendo que los lectores envíen historias con potencial periodístico.',
        },
      ],
      techGroups: [
        {
          label: {
            pt: 'Frontend e SSG',
            en: 'Frontend and SSG',
            es: 'Frontend y SSG',
          },
          techs: ['astro', 'react', 'typescript', 'tailwind'],
        },
      ],
      contributions: [
        {
          pt: 'Entreguei o blog **de ponta a ponta** como desenvolvedor freelancer — do design técnico até o deploy em produção com CDN.',
          en: 'Delivered the blog **end to end** as a freelance developer — from technical design to production deploy on a CDN.',
          es: 'Entregué el blog **de punta a punta** como desarrollador freelance — del diseño técnico al deploy en producción con CDN.',
        },
        {
          pt: 'Escolhi a stack pensando em **SEO técnico e performance**: Astro para gerar HTML estático, React apenas em ilhas interativas e Sanity como CMS headless entregando conteúdo via **CDN**.',
          en: 'Chose the stack with **technical SEO and performance** in mind: Astro for static HTML, React only in interactive islands, and Sanity as a headless CMS serving content via **CDN**.',
          es: 'Elegí la stack pensando en **SEO técnico y rendimiento**: Astro para generar HTML estático, React solo en islas interactivas y Sanity como CMS headless entregando contenido vía **CDN**.',
        },
        {
          pt: 'Implementei todas as **boas práticas de SEO on-page**: HTML semântico correto, imagens otimizadas com alt text descritivo, layout mobile-friendly e alta velocidade de carregamento.',
          en: 'Implemented every **on-page SEO best practice**: correct semantic HTML, optimized images with descriptive alt text, mobile-friendly layout and high load speed.',
          es: 'Implementé todas las **buenas prácticas de SEO on-page**: HTML semántico correcto, imágenes optimizadas con alt text descriptivo, layout mobile-friendly y alta velocidad de carga.',
        },
        {
          pt: 'Instrumentei o blog com **Google Analytics** e **Google Search Console** para monitorar tráfego, indexação e ajustar a estratégia de SEO com base em dados reais.',
          en: 'Instrumented the blog with **Google Analytics** and **Google Search Console** to monitor traffic and indexing, and tune the SEO strategy based on real data.',
          es: 'Instrumenté el blog con **Google Analytics** y **Google Search Console** para monitorear tráfico e indexación, y ajustar la estrategia de SEO con datos reales.',
        },
      ],
      lessons: [
        {
          pt: '**SEO técnico** é decisão de arquitetura, não retrabalho: escolher SSG + CDN desde o início entregou métricas de performance que dificilmente seriam alcançadas em uma stack SPA tradicional.',
          en: '**Technical SEO** is an architecture decision, not a rework: choosing SSG + CDN from day one delivered performance metrics that would be hard to reach in a traditional SPA stack.',
          es: 'El **SEO técnico** es una decisión de arquitectura, no un retrabajo: elegir SSG + CDN desde el inicio entregó métricas de rendimiento difíciles de alcanzar en una stack SPA tradicional.',
        },
        {
          pt: 'A **arquitetura de ilhas** do Astro obriga a pensar cedo o que precisa ser interativo e o que pode ser HTML puro — um filtro saudável contra JavaScript desnecessário.',
          en: 'Astro’s **island architecture** forces you to decide early what needs to be interactive and what can stay as pure HTML — a healthy filter against unnecessary JavaScript.',
          es: 'La **arquitectura de islas** de Astro obliga a decidir temprano qué necesita ser interactivo y qué puede quedarse como HTML puro — un filtro saludable contra JavaScript innecesario.',
        },
        {
          pt: 'Um **CMS headless (Sanity)** transfere a autonomia editorial para o cliente e libera o desenvolvedor de virar gargalo em publicações e correções pontuais de conteúdo.',
          en: 'A **headless CMS (Sanity)** hands editorial autonomy to the client and frees the developer from becoming a bottleneck for publishing and small content fixes.',
          es: 'Un **CMS headless (Sanity)** transfiere la autonomía editorial al cliente y libera al desarrollador de convertirse en cuello de botella para publicaciones y correcciones puntuales de contenido.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconCode',
          label: {
            pt: 'Sites estáticos com Astro',
            en: 'Static sites with Astro',
            es: 'Sitios estáticos con Astro',
          },
        },
        {
          icon: 'IconBolt',
          label: {
            pt: 'SEO técnico e Core Web Vitals',
            en: 'Technical SEO and Core Web Vitals',
            es: 'SEO técnico y Core Web Vitals',
          },
        },
        {
          icon: 'IconCloud',
          label: {
            pt: 'Distribuição por CDN',
            en: 'CDN-based delivery',
            es: 'Distribución por CDN',
          },
        },
        {
          icon: 'IconDatabase',
          label: {
            pt: 'CMS headless com Sanity',
            en: 'Headless CMS with Sanity',
            es: 'CMS headless con Sanity',
          },
        },
        {
          icon: 'IconChartBar',
          label: {
            pt: 'Analytics e Search Console',
            en: 'Analytics and Search Console',
            es: 'Analytics y Search Console',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconRocket',
          label: {
            pt: 'Autonomia como freelancer',
            en: 'Freelance autonomy',
            es: 'Autonomía como freelance',
          },
        },
        {
          icon: 'IconMessageCircle',
          label: {
            pt: 'Comunicação direta com cliente',
            en: 'Direct client communication',
            es: 'Comunicación directa con el cliente',
          },
        },
        {
          icon: 'IconTarget',
          label: {
            pt: 'Foco em resultados de negócio',
            en: 'Focus on business outcomes',
            es: 'Foco en resultados de negocio',
          },
        },
      ],
    },
  },
  {
    id: 'sertton-mobile',
    kind: 'professional',
    order: 3,
    eyebrow: {
      pt: '2023–2024 · E-commerce mobile',
      en: '2023–2024 · Mobile e-commerce',
      es: '2023–2024 · E-commerce móvil',
    },
    title: 'Sertton',
    tagline: {
      pt: 'App **nativo em Flutter** para a loja **Sertton**, com integração à plataforma **Yampi** e checkout completo (Pix e Boleto).',
      en: 'Native **Flutter app** for the **Sertton** store, with **Yampi** integration and full checkout (Pix and Boleto).',
      es: 'App **nativa en Flutter** para la tienda **Sertton**, con integración a la plataforma **Yampi** y checkout completo (Pix y Boleto).',
    },
    layout: 'mobile',
    cover: '/images/projects/sertton/home-screen.jpeg',
    gallery: [
      '/images/projects/sertton/home-screen.jpeg',
      '/images/projects/sertton/products-list-screen.jpeg',
      '/images/projects/sertton/product-details-screen.jpeg',
      '/images/projects/sertton/cart-screen.jpeg',
      '/images/projects/sertton/orders-list-screen.jpeg',
    ],
    techs: ['flutter'],
    links: {
      code: 'https://github.com/JohnPetros/sertton',
      live: 'https://play.google.com/store/apps/details?id=com.joaopcarvalho.sertton',
    },
    detail: {
      about: {
        pt: 'Aplicativo de **e-commerce nativo** desenvolvido em **Flutter** para a marca Sertton, publicado na Play Store. Foco em alta performance, fluidez de navegação e integração robusta com a plataforma **Yampi** para gestão de produtos, pedidos e pagamentos.',
        en: 'Native **e-commerce app** built in **Flutter** for the Sertton brand, published on the Play Store. Focus on high performance, smooth navigation and robust integration with the **Yampi** platform for products, orders and payments.',
        es: 'Aplicación de **e-commerce nativa** desarrollada en **Flutter** para la marca Sertton, publicada en Play Store. Enfoque en alto rendimiento, fluidez de navegación e integración robusta con la plataforma **Yampi** para gestión de productos, pedidos y pagos.',
      },
      features: [
        {
          pt: '**Navegação híbrida** combinando menu lateral (Drawer) e navegação inferior (Tabbar) para acesso rápido às áreas principais.',
          en: '**Hybrid navigation** combining side drawer and bottom tabbar for fast access to the main areas.',
          es: '**Navegación híbrida** combinando menú lateral (Drawer) y navegación inferior (Tabbar) para acceso rápido a las áreas principales.',
        },
        {
          pt: '**Vitrine interativa** com banners dinâmicos e coleções em destaque na home.',
          en: '**Interactive storefront** with dynamic banners and featured collections on the home screen.',
          es: '**Escaparate interactivo** con banners dinámicos y colecciones destacadas en la home.',
        },
        {
          pt: '**Catálogo completo** com busca avançada, filtros inteligentes e detalhes ricos de produto (variações e SKUs).',
          en: '**Complete catalog** with advanced search, smart filters and rich product details (variants and SKUs).',
          es: '**Catálogo completo** con búsqueda avanzada, filtros inteligentes y detalles ricos de producto (variantes y SKUs).',
        },
        {
          pt: '**Checkout transparente** com cálculo de frete e pagamentos integrados (**Pix** e **Boleto**).',
          en: '**Transparent checkout** with shipping calculation and integrated payments (**Pix** and **Boleto**).',
          es: '**Checkout transparente** con cálculo de flete y pagos integrados (**Pix** y **Boleto**).',
        },
        {
          pt: '**Área do cliente** com histórico completo de pedidos e acompanhamento de status.',
          en: '**Customer area** with a full order history and status tracking.',
          es: '**Área del cliente** con historial completo de pedidos y seguimiento de estados.',
        },
      ],
      techGroups: [
        {
          label: { pt: 'Mobile', en: 'Mobile', es: 'Mobile' },
          techs: ['flutter'],
        },
      ],
      contributions: [
        {
          pt: 'Entreguei o app **de ponta a ponta** como desenvolvedor freelancer — do design da arquitetura até a publicação na Play Store.',
          en: 'Delivered the app **end to end** as a freelance developer — from architecture design to Play Store publishing.',
          es: 'Entregué la app **de punta a punta** como desarrollador freelance — del diseño de la arquitectura hasta la publicación en Play Store.',
        },
        {
          pt: 'Modelei uma **arquitetura em camadas** inspirada em **Clean Architecture** e **MVP** (Model-View-Presenter), separando UI, Core (regras de negócio), REST (comunicação com API) e Drivers (infraestrutura).',
          en: 'Designed a **layered architecture** inspired by **Clean Architecture** and **MVP** (Model-View-Presenter), splitting UI, Core (business rules), REST (API communication) and Drivers (infrastructure).',
          es: 'Modelé una **arquitectura en capas** inspirada en **Clean Architecture** y **MVP** (Model-View-Presenter), separando UI, Core (reglas de negocio), REST (comunicación con API) y Drivers (infraestructura).',
        },
        {
          pt: 'Implementei toda a **integração REST com a plataforma Yampi** para catálogo, checkout, pagamentos e acompanhamento de pedidos.',
          en: 'Built the full **REST integration with the Yampi platform** for catalog, checkout, payments and order tracking.',
          es: 'Implementé toda la **integración REST con la plataforma Yampi** para catálogo, checkout, pagos y seguimiento de pedidos.',
        },
        {
          pt: 'Estruturei o **gerenciamento de estado com Riverpod + Signals** e a **navegação com GoRouter**, garantindo previsibilidade em toda a jornada de compra.',
          en: 'Structured **state management with Riverpod + Signals** and **navigation with GoRouter**, ensuring predictability throughout the purchase journey.',
          es: 'Estructuré el **manejo de estado con Riverpod + Signals** y la **navegación con GoRouter**, garantizando previsibilidad en todo el recorrido de compra.',
        },
      ],
      lessons: [
        {
          pt: 'Depender de uma **plataforma externa (Yampi)** exige mapear cuidadosamente contratos de API — mudanças upstream que fogem do meu controle podem quebrar o app se a camada REST não estiver bem isolada.',
          en: 'Relying on an **external platform (Yampi)** requires carefully mapping API contracts — upstream changes outside my control can break the app if the REST layer isn’t well isolated.',
          es: 'Depender de una **plataforma externa (Yampi)** exige mapear cuidadosamente los contratos de API — cambios upstream fuera de mi control pueden romper la app si la capa REST no está bien aislada.',
        },
        {
          pt: 'Aplicar **arquitetura em camadas em Flutter** desde o início compensa: mesmo em app comercial de escopo médio, o custo inicial se paga na primeira mudança grande de requisito.',
          en: 'Applying **layered architecture in Flutter** from the start pays off: even in a medium-scope commercial app, the upfront cost pays back on the first big requirement change.',
          es: 'Aplicar **arquitectura en capas en Flutter** desde el inicio compensa: incluso en una app comercial de alcance medio, el costo inicial se paga en el primer cambio grande de requisito.',
        },
        {
          pt: 'Publicar na **Play Store** ensinou que a jornada não termina no build — há revisão da loja, política de conteúdo, screenshots e ciclos de aprovação a considerar no prazo.',
          en: 'Publishing on the **Play Store** taught me that the journey doesn’t end at the build — there’s store review, content policy, screenshots and approval cycles to account for in the timeline.',
          es: 'Publicar en la **Play Store** enseñó que el recorrido no termina en el build — hay revisión de la tienda, política de contenido, capturas y ciclos de aprobación que considerar en el plazo.',
        },
      ],
      hardSkills: [
        {
          icon: 'IconCode',
          label: {
            pt: 'Flutter e Dart',
            en: 'Flutter and Dart',
            es: 'Flutter y Dart',
          },
        },
        {
          icon: 'IconStack2',
          label: {
            pt: 'Arquitetura em camadas com MVP',
            en: 'Layered architecture with MVP',
            es: 'Arquitectura en capas con MVP',
          },
        },
        {
          icon: 'IconBolt',
          label: {
            pt: 'Estado reativo com Riverpod e Signals',
            en: 'Reactive state with Riverpod and Signals',
            es: 'Estado reactivo con Riverpod y Signals',
          },
        },
        {
          icon: 'IconServer',
          label: {
            pt: 'Integração REST com Dio',
            en: 'REST integration with Dio',
            es: 'Integración REST con Dio',
          },
        },
        {
          icon: 'IconRocket',
          label: {
            pt: 'Publicação na Play Store',
            en: 'Play Store publishing',
            es: 'Publicación en Play Store',
          },
        },
      ],
      softSkills: [
        {
          icon: 'IconRocket',
          label: {
            pt: 'Autonomia como freelancer',
            en: 'Freelance autonomy',
            es: 'Autonomía como freelance',
          },
        },
        {
          icon: 'IconMessageCircle',
          label: {
            pt: 'Comunicação direta com cliente',
            en: 'Direct client communication',
            es: 'Comunicación directa con el cliente',
          },
        },
        {
          icon: 'IconTarget',
          label: {
            pt: 'Gestão de escopo e prazo',
            en: 'Scope and deadline management',
            es: 'Gestión de alcance y plazo',
          },
        },
      ],
    },
  },
]

export function projectsByKind(kind: ProjectKind): Project[] {
  return PROJECTS.filter((p) => p.kind === kind).sort((a, b) => a.order - b.order)
}

export function projectNav(project: Project): {
  prev: Project | null
  next: Project | null
} {
  const siblings = projectsByKind(project.kind)
  const i = siblings.findIndex((p) => p.id === project.id)
  return {
    prev: i > 0 ? siblings[i - 1] : null,
    next: i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : null,
  }
}

export function unknownProjectTechIds(): string[] {
  const ids = PROJECTS.flatMap((p) => [
    ...p.techs,
    ...p.detail.techGroups.flatMap((g) => g.techs),
  ])
  return ids.filter((id) => !getTech(id))
}
