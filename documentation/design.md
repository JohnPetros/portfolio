---
description: "Editorial canvas in two modes — a dark base (#0A0A0A) and a warm light paper (#EAE3D6) — with a single bamboo-green accent that carries every signal: the dot in `Petros.`, eyebrow bullets, italic accent words, hover borders. Five schemes (Bambuzal, Sakura, Glaciar, Crepúsculo, Pelagem) swap ONLY the accent pair + panda gradient; mode (dark/light) swaps ONLY the surface + text ramp. The two dimensions are independent — 2 modes × 5 schemes = 10 combinations. Typography pairs Inter (display + body, weight 500, tight tracking) with DM Serif Display (always italic, always accent color, one word per headline) and JetBrains Mono (eyebrows + metadata). In dark mode, elevation is achieved with accent glow — never heavy box-shadows; in light mode, glow recedes and a whisper-soft hairline shadow takes over. All structural lines are 0.5px hairlines."

# ── MODE: DARK (default) ── superfícies + rampa de texto para data-mode="dark"
colors:
  # Superfícies (mudam só com o modo, nunca com o esquema)
  bg-base:        "#0A0A0A"     # page background
  bg-card:        "#0D0D0C"     # cards / panels
  bg-input:       "#0F0F0E"     # form inputs
  bg-elevated:    "#111110"     # hovered / raised surface

  # Bordas (sempre 0.5px, nunca brilhantes)
  border:         "#2A2A2A"
  border-strong:  "#3A3A3A"

  # Texto (rampa quente sobre fundo escuro)
  text-primary:   "#F5F0E8"     # cream-white — corpo e headlines
  text-secondary: "#A8A59D"     # warm gray — copy de apoio
  text-muted:     "#888888"     # metadados
  text-faint:     "#666666"     # eyebrows / faintest

  # Accent (Bambuzal — default; sobrescrito por [data-scheme])
  accent:         "#5B8C3E"     # bamboo green — todo o sinal
  accent-italic:  "#8FB872"     # mais claro — APENAS itálicos serifados
  accent-tint-06: "rgba(91,140,62,0.06)"  # wash de pills/painéis
  accent-tint-12: "rgba(91,140,62,0.12)"  # wash mais forte
  accent-tint-20: "rgba(91,140,62,0.20)"  # tint de borda
  accent-glow:    "rgba(91,140,62,0.55)"  # drop-shadow glow

  # Gradiente do avatar do panda (substituído por esquema)
  panda-from:     "#1A2818"
  panda-to:       "#2A3D24"

  # Sombra (dark: não há — só glow)
  card-shadow:    "none"

  # Cores de marca (somente painel AGORA — fixas, externas)
  brand-vscode:   "#4C8DF6"     # VS Code blue — "Codando"
  brand-steam:    "#9B6BD9"     # Steam purple — "Jogando"
  brand-spotify:  "#1DB954"     # Spotify green — "Ouvindo"

# ── MODE: LIGHT ── superfícies + rampa de texto para data-mode="light"
# Papel quente editorial. Eleva em direção ao branco (inverso do dark).
# Marcas externas (VS Code/Steam/Spotify) NÃO mudam — herdam do bloco dark.
colors-light:
  # Superfícies (papel quente; elevação clareia em direção ao branco)
  bg-base:        "#EAE3D6"     # warm paper — page background
  bg-card:        "#F1EBE0"     # cards / panels
  bg-input:       "#F6F1E8"     # form inputs
  bg-elevated:    "#FBF7F0"     # hovered / raised surface

  # Bordas (hairline mais escura que o papel, ainda quente)
  border:         "#D6CDBD"
  border-strong:  "#C2B8A4"

  # Texto (rampa quente quase-preta sobre papel)
  text-primary:   "#1A1712"     # warm near-black — corpo e headlines (AAA)
  text-secondary: "#514C42"     # warm gray escuro — copy de apoio
  text-muted:     "#6E6857"     # metadados
  text-faint:     "#8C8675"     # eyebrows / faintest

  # Accent (Bambuzal escurecido p/ contraste no papel; sobrescrito por [data-scheme])
  accent:         "#4A7330"     # bamboo green escurecido — todo o sinal
  accent-italic:  "#5B8C3E"     # par mais escuro p/ itálico legível no papel
  accent-tint-06: "rgba(74,115,48,0.08)"   # wash de pills/painéis
  accent-tint-12: "rgba(74,115,48,0.14)"   # wash mais forte
  accent-tint-20: "rgba(74,115,48,0.24)"   # tint de borda
  accent-glow:    "rgba(74,115,48,0.18)"   # glow quase imperceptível no claro

  # Gradiente do avatar do panda (tints claros; substituído por esquema)
  panda-from:     "#D6E0CC"
  panda-to:       "#B8CBA8"

  # Sombra (light: glow some, hairline shadow assume)
  card-shadow:    "0 1px 3px rgba(0,0,0,0.04)"

# ── ESQUEMAS (data-scheme) ── trocam SÓ accent + italic + panda, em ambos os modos
themes:
  default-scheme: "bambuzal"
  default-mode:   "dark"
  rule:    "Esquema troca SÓ accent/italic/panda. Modo troca SÓ superfícies/texto/sombra. 2 modos × 5 esquemes = 10 combinações independentes."
  # accent pairs por modo: { dark: {accent, italic}, light: {accent, italic} }
  bambuzal:   { dark: { accent: "#5B8C3E", italic: "#8FB872" }, light: { accent: "#4A7330", italic: "#5B8C3E" } }   # bambuzal — default
  sakura:     { dark: { accent: "#D9608A", italic: "#E89AB5" }, light: { accent: "#C24472", italic: "#D9608A" } }   # cerejeira
  glaciar:    { dark: { accent: "#5BB5D9", italic: "#8FCCDF" }, light: { accent: "#2F7C9E", italic: "#4A9BBF" } }   # lago congelado
  crepusculo: { dark: { accent: "#9B5BD9", italic: "#B889E5" }, light: { accent: "#7E40BA", italic: "#9B5BD9" } }   # entardecer
  pelagem:    { dark: { accent: "#D9A05B", italic: "#E5BB7E" }, light: { accent: "#9A6B28", italic: "#BC842F" } }   # bambu seco / pelagem

  # Gradiente do panda por esquema (dark / light)
  panda:
    bambuzal:   { dark: ["#1A2818", "#2A3D24"], light: ["#D6E0CC", "#B8CBA8"] }
    sakura:     { dark: ["#2A1820", "#3D2430"], light: ["#F0D6E0", "#E0B8CB"] }
    glaciar:    { dark: ["#16242A", "#22363D"], light: ["#CCDEE6", "#A8C7D4"] }
    crepusculo: { dark: ["#221830", "#332445"], light: ["#E0D6F0", "#CBB8E0"] }
    pelagem:    { dark: ["#2A2418", "#3D3424"], light: ["#F0E6CC", "#E0D0A8"] }

typography:
  sans:
    fontFamily: "Inter, system-ui, sans-serif"
    usage: "Display e corpo. Headlines weight 500 com tracking apertado; corpo 400."
  serif:
    fontFamily: "DM Serif Display, Georgia, serif"
    usage: "SOMENTE em itálico e SOMENTE em --accent-italic — uma palavra por headline."
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    usage: "Eyebrows, metadados, labels. UPPERCASE, 9.5–11px, tracking 1.5–2px."
  source: "Google Fonts"
  scale:
    text-hero:    "108px"   # "Petros." hero
    text-display: "88px"    # "Bora construir?" closers
    text-h1:      "54px"    # section headlines
    text-h2:      "40px"
    text-h3:      "28px"
    text-title:   "22px"    # card titles
    text-lead:    "16px"    # section intro paragraph
    text-body:    "14px"
    text-body-sm: "13px"
    text-nav:     "13.5px"
    text-eyebrow: "11px"
    text-meta:    "10px"
    text-micro:   "9.5px"
  tracking:
    hero:    "-3.5px"
    display: "-2.5px"
    h1:      "-2px"
    tight:   "-0.5px"
    eyebrow: "+2px"     # mono uppercase
    meta:    "+1.5px"
  leading:
    display: "0.96"
    tight:   "1.1"
    body:    "1.6"

spacing:
  scale:
    space-1: "4px"
    space-2: "8px"
    space-3: "12px"
    space-4: "16px"
    space-5: "24px"
    space-6: "32px"
    space-7: "48px"
    space-8: "64px"
    space-9: "96px"
  section-pad:     "48px"    # desktop (36–48)
  section-pad-sm:  "28px"    # mobile (~30% menor)
  section-gap:     "96px"    # entre seções (56–96)

radius:
  sm:   "8px"      # inputs / cards pequenos
  md:   "12px"     # cards
  lg:   "14px"     # cards grandes (MÁXIMO em cards)
  pill: "9999px"   # pills / status / tags
  divider: "0"     # divisores são sharp
  rule: "Nunca exceder 16px em cards."

borders:
  width: "0.5px"
  hair:  "0.5px solid var(--border)"            # estrutura padrão
  tint:  "0.5px solid var(--accent-tint-20)"    # hover de cards interativos
  rule: "Sempre hairline. Nunca 1px+, nunca cores brilhantes."

shadows:
  strategy: "Não há box-shadow pesado. A única 'sombra' é o glow do accent."
  glow-dot:  "0 0 5px var(--accent-glow)"        # ponto da marca / bullet do eyebrow
  glow-soft: "0 0 12px var(--accent-tint-20)"    # bordas destacadas
  rule: "Cards interativos sobem 2px e ganham --border-tint no hover. Nunca shadow cinza."

motion:
  ease-spring: "cubic-bezier(0.2, 1, 0.3, 1)"
  dur-micro:    "220ms"   # hover/press
  dur-theme:    "400ms"   # troca de tema
  dur-entrance: "600ms"   # fade-up de seção
  dur-loop:     "2400ms"  # pulso do segmento central do bambu
  keyframes:
    petros-stalk-in: "scaleY 0 → 1 (entrada dos segmentos de bambu)"
    petros-pulse:    "opacity 1 ↔ 0.55 (segmento central + dots ao vivo)"
    petros-fade-up:  "translateY 16px → 0, opacity 0 → 1 (seções)"
    petros-swing:    "rotate -4° ↔ 4° (panda balançando)"
  reduced-motion: "prefers-reduced-motion respeitado — loops/entradas off, estado final mantido."

iconography:
  system: "Tabler Icons (webfont CDN: @tabler/icons-webfont) — uso como <i class='ti ti-name' />."
  rule:   "Ícones aparecem soltos (sem fundo). Exceção: Serviços usa glifo em quadrado --accent-tint-12."
  brand:  "Linhas de live-status pintam o glifo com a cor da marca externa (VS Code, Steam, Spotify)."
  emoji:  "Apenas 🐼 (mascote) e ♥ (rodapé). 1–2 por seção, no máximo."
---

## Visão Geral

**Petros.** é o sistema de design do portfólio pessoal de **João Pedro Carvalho dos Santos** — full stack em São José dos Campos. A identidade tem três frentes que precisam soar como a mesma voz: **Identidade** (hero, wordmark, contato), **Portfólio** (trajetória, stack, serviços, projetos, AGORA, sobre) e **Sistema** (esta página de design system, BOUND_DS.json, biblioteca de prompts).

O nome é **sempre** escrito `Petros.` — com o ponto no final na cor accent. Esse ponto é a assinatura central. Quando ele aparece, carrega o `--glow-dot`; quando some, a marca se descaracteriza.

O canvas é **editorial em dois modos**. No **modo escuro** (padrão), `--bg-base` é `#0A0A0A`, cards `#0D0D0C`, inputs `#0F0F0E` — hierarquia por elevação sutil em direção ao cinza-claro. No **modo claro**, `--bg-base` é o papel quente `#EAE3D6` e a elevação clareia em direção ao branco (`#FBF7F0`) — o inverso do escuro. Os cinco **esquemas** (Bambuzal, Sakura, Glaciar, Crepúsculo, Pelagem) trocam **apenas** o par de accent + o gradiente do panda; o **modo** troca **apenas** as superfícies, a rampa de texto e a estratégia de sombra. As duas dimensões são independentes: **2 modos × 5 esquemes = 10 combinações**. Cada troca anima em 400ms (`--dur-theme`).

A voz é **português brasileiro coloquial-mas-culto, em primeira pessoa, falando *com* o leitor** ("Vamos *conversar*?", "Como te chamo?"). Nunca corporativa, nunca kawaii. EN/ES suportados; pt-BR é a alma.

## 1. Sistema de Cores

### Paleta principal
- **Accent** (verde-bambu por padrão, hue ~110): carrega **todo** o sinal — ponto da marca, bullet do eyebrow, hover de borda, ícone de Serviços, botão primário. **Um único accent**, nunca dois competindo.
- **Accent-italic** (tom mais claro do mesmo hue): exclusivo da serif itálica. Nenhuma outra coisa usa essa cor — nem texto comum, nem ícones.
- **Tints (06/12/20)**: washes translúcidos para pills, painéis e bordas com tinge de marca. Funcionam sobre superfície escura (alpha menor) e clara (alpha levemente maior, par `colors-light`).
- **Glow**: `--accent-glow` é o formato de "sombra" no modo escuro. No claro o glow recua quase a zero e uma hairline-shadow `0 1px 3px rgba(0,0,0,0.04)` assume.

### Superfícies (mudam com o modo, não com o esquema)
Há duas rampas verticais, uma por modo. O esquema (accent) nunca toca nelas.

**Modo escuro** (`data-mode="dark"`):
1. `--bg-base` `#0A0A0A` — página
2. `--bg-card` `#0D0D0C` — cards e painéis
3. `--bg-input` `#0F0F0E` — campos de formulário
4. `--bg-elevated` `#111110` — hover, raised state

**Modo claro** (`data-mode="light"`) — papel quente, elevação clareia em direção ao branco:
1. `--bg-base` `#EAE3D6` — página
2. `--bg-card` `#F1EBE0` — cards e painéis
3. `--bg-input` `#F6F1E8` — campos de formulário
4. `--bg-elevated` `#FBF7F0` — hover, raised state

Hierarquia vem da diferença mínima entre os degraus + da hairline `--border` (`#2A2A2A` no escuro, `#D6CDBD` no claro). No escuro, cards e popovers nunca usam branco; no claro, nunca usam branco puro `#FFFFFF` — sempre o papel quente.

### Cores de marca externa
Apenas no painel **AGORA** (live-status via Lanyard API). Pinta o glifo do Tabler com o azul do VS Code, o roxo do Steam, o verde do Spotify. São **fixas** — não respondem a tema, porque pertencem ao produto de fora.

### Modo + Esquema (2 atributos independentes)
`<html data-mode="dark | light" data-scheme="bambuzal | sakura | glaciar | crepusculo | pelagem">`.

- **`data-mode`** controla a rampa de superfícies + texto + sombra (bloco `colors` para dark, `colors-light` para light).
- **`data-scheme`** controla só `--accent`, `--accent-italic` e o gradiente do panda — e tem um par por modo (o accent escurece no claro para garantir contraste sobre o papel).

As duas dimensões são ortogonais: trocar esquema não mexe no modo e vice-versa. Total de **10 combinações**, todas validadas para contraste (ver §6). O legado `data-theme="<esquema>"` (sem `data-mode`) é alias de `data-mode="dark" data-scheme="<esquema>"`.

#### Implementação em 3 camadas de CSS Variables
1. **Tokens de modo** — `[data-mode="dark"]` / `[data-mode="light"]` definem superfícies, texto, borda, `--card-shadow`.
2. **Tokens de esquema** — `[data-scheme="..."]` definem `--accent`, `--accent-italic`, `--panda-*`; os seletores combinam com o modo (`[data-mode="light"][data-scheme="sakura"]`) para o par de accent correto.
3. **Tokens de componente** — consomem 1+2 via `var()`. Nenhum componente referencia hex cru.

## 2. Tipografia

Três famílias via Google Fonts, papéis estritos.

- **Inter** (`--font-sans`): display e corpo. Headlines em weight 500 com tracking apertado (`-2px` a `-3.5px`); corpo em 400, leading `1.6`.
- **DM Serif Display** (`--font-serif`): **somente em itálico** e **somente** em `--accent-italic`. Uma palavra por headline, a palavra emocionalmente carregada (*conversar, construir, respira, chegar*). Nunca upright, nunca em branco, nunca decorativa.
- **JetBrains Mono** (`--font-mono`): eyebrows, metadados, labels. `9.5–11px`, `UPPERCASE`, tracking `+1.5px` a `+2px`. **A única coisa em caixa alta** — nunca em parágrafos.

### Padrão de headline
O movimento de assinatura é sempre o mesmo, em três batidas:

```
— TRAJETÓRIA              ← eyebrow mono UPPERCASE com bullet de glow
Como cheguei *aqui.*      ← sans 500 + serif italic accent + ponto accent
Texto em Inter 400, com <b>palavras-chave</b> em --text-primary
e a ocasional locução *em serif italic accent*.
```

### Ênfase no corpo
`<b>` em `--text-primary` (cream-white) para keywords e techs (**Python**, **React Native**, **arquitetura limpa**). Itálica serifada accent para frases emocionais. Ambos podem coexistir no mesmo parágrafo.

## 3. Sombras

A decisão mais distintiva: **não há box-shadow pesado**. A única "sombra" é o **glow do accent**.

- `--glow-dot` — `drop-shadow(0 0 5px var(--accent-glow))` — no ponto de `Petros.`, no bullet do Eyebrow, em cada segmento do BambooIndicator.
- `--glow-soft` — `0 0 12px var(--accent-tint-20)` — em bordas destacadas (`Card[accentBar]`, painel AGORA).

Cards interativos não ganham sombra no hover; sobem **2px** e a borda aquece para `--border-tint` (a hairline com tinge accent). Esse é o feedback *quieto* da casa — visível, mas nunca dramático.

Nada de gradientes em botões, nada de neon, nada de elevation com sombra cinza. Em fundo `#0A0A0A`, sombras escuras desaparecem; o glow do accent é o que realmente eleva.

### Modo claro
No papel `#EAE3D6` o glow do accent some quase por completo (`--accent-glow` cai para `rgba(...,0.18)`). Para não perder a hierarquia, o modo claro reintroduz **uma** sombra mínima: `--card-shadow: 0 1px 3px rgba(0,0,0,0.04)` em cards e popovers. O ponto de `Petros.`, bullets e o BambooIndicator perdem o `--glow-dot` e compensam com **saturação ×1.1** no accent (já escurecido). Continua proibido: sombra dramática, gradiente, neon. A regra editorial é a mesma — só o veículo de elevação muda (glow no escuro, hairline-shadow no claro).

## 4. Forma (Radius)

Escala enxuta, intencionalmente conservadora:

- `--radius-sm` **8px** — inputs e cards pequenos
- `--radius-md` **12px** — cards padrão
- `--radius-lg` **14px** — cards grandes (**teto** para cards)
- `--radius-pill` **9999px** — pills, status, tags
- **0** — divisores (sharp, sempre 0.5px de altura)

**Nunca passar de 16px em cards**. Cantos muito arredondados quebram o registro editorial. Pills são pill puros (999); cards são cards (12–14); divisores são linhas (0). Esses três modos cobrem tudo.

## 5. Stack Técnico (Frontend)

- **TanStack Start (React 19) + Vite + Tailwind** — stack do redesign (SSR, server functions, type-safe routing). `motion` (Framer Motion) sutil para entradas e o pulso do bambu.
- **shadcn/ui não é usado**. Os 9 componentes do sistema (Brand, Card, DotHeading, Eyebrow, StatusPill, Tag, Button, Input, BambooIndicator) são primitivas próprias do `PetrosDesignSystem_7efa3c`. Sempre compor via `<x-import>` — nunca recriar com HTML cru.
- **Tabler Icons** via webfont CDN (`@tabler/icons-webfont`). `<i class="ti ti-name" />`. Em React de produção, swap para `@tabler/icons-react`.
- **Lanyard API** — feed live do Discord/Spotify no painel AGORA. As cores VS Code/Steam/Spotify nascem daqui.
- **i18next** — pt-BR (alma), en, es. `<html lang>` reflete o locale; tokens de CSS são content-agnostic.
- **Tema** persiste em `localStorage` (`petros-theme` = `{ mode, scheme, lang }`); na primeira visita o **modo** cai em `prefers-color-scheme` (dica) e o esquema em `bambuzal`, antes de qualquer override do usuário. Um script inline no `<head>` aplica `data-mode`/`data-scheme` antes do paint para evitar FOUC.

## 6. Acessibilidade

### Contraste — modo escuro
- `--text-primary` `#F5F0E8` (cream) sobre `--bg-base` `#0A0A0A`: **alto contraste**, passa AAA.
- `--text-secondary` `#A8A59D` sobre `--bg-base`: contraste moderado, OK para body de apoio em corpo ≥ 14px.
- `--text-muted` `#888888` e `--text-faint` `#666666`: **somente** para metadados, eyebrows, micro-labels. Nunca para texto crítico.
- `--accent` em texto sobre `--bg-base`: verificar AA por esquema — Bambuzal e Crepúsculo passam confortavelmente; Pelagem (`#D9A05B`) é o mais forte; Sakura/Glaciar exigem cuidado em corpo muito pequeno. Em prática, `--accent` aparece em **dot**, **bullet**, **borda**, **fill de botão com texto branco**, **ícones**: quase nunca como texto longo.
- `--accent-italic` é mais claro propositalmente para garantir leitura da palavra acentuada em headline.

### Contraste — modo claro
- `--text-primary` `#1A1712` (warm near-black) sobre `--bg-base` `#EAE3D6` (papel): **alto contraste** (~13:1), passa AAA.
- `--text-secondary` `#514C42` sobre o papel: contraste forte, AAA para corpo.
- `--text-muted` `#6E6857` e `--text-faint` `#8C8675`: **somente** metadados/eyebrows/micro-labels.
- **Accents escurecidos** garantem o salto de contraste sobre papel: cada esquema tem um par `light` mais escuro que o `dark` (ex. Sakura `#C24472`, Glaciar `#2F7C9E`, Pelagem `#9A6B28`). Mesmo assim, accent segue reservado a dot/bullet/borda/fill/ícone — quase nunca texto longo.
- O texto sobre **fill de botão accent** no claro permanece branco (`#FFFFFF`) ou o papel, o que vencer o contraste por esquema — validar caso a caso.
- **As 10 combinações** (2 modos × 5 esquemes) são testadas individualmente com axe/Lighthouse; nenhuma fica abaixo da meta da §requisito de acessibilidade.

### Motion
`prefers-reduced-motion: reduce` desliga loops e entradas, mantendo o estado final (já implementado em `tokens/animations.css`). O segmento central do bambu para de pulsar; sections aparecem sem fade-up.

### Recomendações
- Não usar `--accent` como cor de texto sobre fundo escuro em parágrafos. Reservar para destaque pontual (ponto, bullet, headline italic via `--accent-italic`) e para fill de botão primário com texto branco.
- `--text-muted` e `--text-faint` são só para metadados e eyebrows.
- Touch targets ≥ **44px** (mobile-first). O sticky header colapsa para wordmark + BambooIndicator em mobile.
- Nunca reivindicar certificação WCAG — o sistema é projetado *com* acessibilidade em mente, mas não foi auditado.