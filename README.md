<!-- Math Quest — README principal -->
<p align="center">
  <img src="assets/brand/math-quest-logo.svg" alt="Mascote Math Quest: robô educador" width="190" />
</p>
<h1 align="center">Math Quest</h1>
<p align="center"><strong>Aprender matemática. Resolver desafios. Criar possibilidades.</strong></p>
<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-MVP%20em%20constru%C3%A7%C3%A3o-orange" />
  <img alt="Plataforma" src="https://img.shields.io/badge/plataforma-PWA%20%7C%20Mobile--first-2563eb" />
  <img alt="Stack" src="https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Vite-0f766e" />
  <img alt="License" src="https://img.shields.io/badge/license-propriet%C3%A1ria-111827" />
</p>
<p align="center">
  <a href="https://viniciusandradde.github.io/math-quest/">Abrir aplicativo</a> ·
  <a href="docs/PRODUCT.md">Produto</a> ·
  <a href="docs/PEDAGOGY.md">Metodologia</a> ·
  <a href="docs/ASSESSMENT.md">Diagnóstico</a> ·
  <a href="docs/ARCHITECTURE.md">Arquitetura</a> ·
  <a href="docs/CREATIVE-PIPELINE.md">Esteira criativa e multimídia</a> ·
  <a href="LICENSE">Licença</a>
</p>

---

## Sobre o Math Quest

**Math Quest é uma plataforma de aprendizagem matemática baseada em jogos, desafios e progressão individual.** O primeiro percurso é dedicado à compreensão e ao domínio da multiplicação e das tabuadas de 1 a 10.

O produto foi concebido para crianças e pré-adolescentes, com experiência mobile-first, linguagem visual tecnológica e atividades que transformam conceitos matemáticos em missões, enigmas e experimentos.

Não é apenas um quiz de tabuada. O objetivo é ajudar o estudante a:
- compreender o significado da multiplicação;
- visualizar grupos, quantidades, linhas e colunas;
- identificar padrões e relações numéricas;
- desenvolver fluência por meio de recuperação ativa;
- manter o conhecimento com revisões espaçadas;
- aplicar a matemática em problemas contextualizados;
- ganhar confiança para enfrentar novos desafios.

> **Princípio do produto:** compreensão antes da velocidade. O estudante precisa entender o que está fazendo antes de ser cobrado por respostas rápidas.

## Identidade

O universo do Math Quest combina robótica, exploração, laboratório, tecnologia e resolução de mistérios. O mascote acompanha a jornada como um guia, sem infantilizar a experiência de crianças mais velhas.

<p align="center"><img src="assets/brand/math-quest-logo.svg" alt="Logo Math Quest" width="150" /></p>

**Assinatura:** Aprender matemática. Resolver desafios. Criar possibilidades.\n\nA identidade oficial usa o mascote robô frontal com visor azul-marinho, olhos e sorriso ciano, fones laranja, antena e aro tecnológico azul. Ilustrações promocionais não substituem o logo mestre.

## Metodologia de aprendizagem

O Math Quest adota uma abordagem própria, provisoriamente chamada **Jornada de Domínio Matemático**, fundamentada em práticas educacionais conhecidas e adaptadas para uma experiência digital.

| Referência | O que aproveitamos |
|---|---|
| Olimpíada Kanguru | Problemas contextualizados, raciocínio, interpretação e descoberta |
| Montessori | Manipulação, agrupamento e representação concreta |
| Singapura (CPA) | Progressão concreto → pictórico → abstrato |
| Kumon | Progressão gradual e prática individualizada |
| Retrieval Practice | Recuperação ativa da memória, em vez de mera releitura |
| Spaced Practice | Revisões distribuídas ao longo do tempo |
| Game-based Learning | Missões, feedback, exploração e recompensas ligadas à aprendizagem |

Essas referências são inspirações pedagógicas, não afiliações ou endossos. O Math Quest não é produto oficial, parceiro ou representante da Olimpíada Kanguru, do método Kumon, de Montessori, de Singapura ou do Scratch.

### Ciclo pedagógico

1. **Descobrir:** compreender a ideia matemática com situações concretas.
2. **Visualizar:** representar quantidades com objetos, grupos, desenhos e matrizes.
3. **Explorar:** descobrir padrões e propriedades.
4. **Praticar:** resolver operações com apoio progressivamente reduzido.
5. **Recuperar:** responder sem consultar a solução, fortalecendo a memória.
6. **Aplicar:** resolver problemas novos, enigmas e desafios de raciocínio.
7. **Revisar:** retomar conteúdos em intervalos adaptados ao desempenho.

Mais detalhes em [docs/PEDAGOGY.md](docs/PEDAGOGY.md).

## Jornada inicial: domínio da multiplicação

| Etapa | Objetivo |
|---|---|
| 01 — Laboratório dos números | Entender grupos iguais, adição repetida e matrizes |
| 02 — Construindo as tabuadas | Explorar as tabuadas de 1 a 10 |
| 03 — Código secreto | Descobrir padrões e números ausentes |
| 04 — Memória matemática | Desenvolver recuperação e fluência |
| 05 — Desafios de inteligência | Aplicar multiplicação em problemas contextualizados |
| 06 — Mestre da multiplicação | Verificar compreensão, precisão, fluência e retenção |

O avanço não depende apenas de pontuação ou de uma sequência curta de acertos. O sistema deve considerar evidências de compreensão, precisão, recuperação e retenção.

## Experiência do estudante

- Missões curtas e objetivos claros.
- Jogos de memória, circuitos, fábrica de robôs e enigmas.
- Personagem e territórios que evoluem com a aprendizagem.
- Feedback que explica o raciocínio, não apenas informa certo ou errado.
- Dificuldade progressiva e retomada de habilidades ainda não consolidadas.
- Sem punição por errar e sem pressão por velocidade no início.

## Scratch Lab — ponte para programação

O Math Quest poderá oferecer uma área complementar chamada **Scratch Lab**, com atividades para a criança criar seus próprios jogos matemáticos usando programação em blocos.

O Scratch é uma plataforma independente desenvolvida pelo MIT. A integração será feita por projetos incorporados ou links, respeitando os termos e a identidade da plataforma. O editor Scratch não faz parte deste repositório.

A proposta é conectar duas competências:
- Math Quest: aprender e aplicar matemática.
- Scratch Lab: construir jogos e desenvolver pensamento computacional.

## Tecnologia

### Aplicação MVP

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | React + TypeScript | Interface e componentes |
| Build | Vite | Desenvolvimento e compilação |
| Estilos | Tailwind CSS | Design responsivo |
| Jogos | Phaser (integração progressiva) | Motor previsto para experiências interativas 2D |
| Estado | Zustand | Estado da experiência |
| Persistência local | Dexie + IndexedDB | Perfil e progresso no dispositivo |
| PWA | vite-plugin-pwa | Instalação e recursos offline |
| Testes | Vitest + Testing Library | Testes automatizados |
| CI/CD | GitHub Actions | Qualidade e publicação |
| Hospedagem MVP | GitHub Pages | Distribuição estática |

### Evolução da plataforma

O MVP começa sem backend obrigatório, para reduzir custo e acelerar a validação. A evolução para uma plataforma multiusuário poderá adotar:
- API: FastAPI + Python + Pydantic;
- banco central: PostgreSQL;
- autenticação: Supabase Auth ou OAuth2/OIDC;
- autorização: RBAC e perfis de responsável/estudante;
- armazenamento de mídia: MinIO/S3;
- cache e filas: Redis, quando necessário;
- deploy de serviços: Docker, Dokploy e Traefik;
- integrações: APIs e eventos versionados.

A escolha definitiva da infraestrutura de produção será registrada em ADRs. Não armazenar segredos, tokens privados ou dados sensíveis no frontend.

## Privacidade e proteção de crianças

O produto é destinado a crianças e pré-adolescentes. Privacidade e segurança devem ser requisitos de produto desde o início.
- Coletar somente os dados estritamente necessários.
- No MVP local, manter o progresso no dispositivo.
- Não incluir publicidade comportamental.
- Não criar rankings públicos de crianças.
- Não solicitar localização, contatos ou dados desnecessários.
- Oferecer área de responsáveis e controles adequados na evolução multiusuário.
- Avaliar requisitos da LGPD, especialmente o melhor interesse e o consentimento aplicável a crianças e adolescentes, antes de qualquer operação com contas e dados em nuvem.
- Definir política de privacidade, retenção e exclusão antes de abrir o serviço ao público.

Consulte [docs/PRIVACY.md](docs/PRIVACY.md).

## Executar localmente

Requisitos: Node.js 22.12 ou superior e npm 10 ou superior.

~~~bash
git clone https://github.com/viniciusandradde/math-quest.git
cd math-quest
npm install
npm run dev
~~~

A aplicação ficará disponível no endereço informado pelo Vite, normalmente http://localhost:5173.

~~~bash
npm run dev       # desenvolvimento
npm run typecheck # verificação TypeScript
npm run test      # testes
npm run build     # build de produção
npm run preview   # visualizar build local
~~~

## Publicação no GitHub Pages

O workflow em .github/workflows/deploy.yml compila e publica o aplicativo quando há push na branch main.

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Faça push na branch main.
4. Acompanhe o workflow na aba **Actions**.

URL esperada: https://viniciusandradde.github.io/math-quest/

O Vite está configurado com base /math-quest/, necessário para publicação em um subcaminho do GitHub Pages.

## Estrutura do repositório

~~~text
math-quest/
├── .github/workflows/     # CI e GitHub Pages
├── assets/brand/          # identidade visual
├── docs/                  # produto, pedagogia, arquitetura e privacidade
├── public/                # manifest, ícones e recursos públicos
├── src/
│   ├── app/               # aplicação e navegação
│   ├── components/        # componentes compartilhados
│   ├── features/          # diagnóstico, prática e missões
│   ├── games/             # experiências de jogo
│   ├── learning/          # regras pedagógicas e domínio
│   ├── lib/               # persistência e utilitários
│   └── styles/            # estilos globais
├── tests/
├── LICENSE
└── README.md
~~~

## Licença e propriedade intelectual

**Math Quest é um projeto proprietário da VSA Tecnologia.** O código-fonte, identidade visual, textos, conteúdos pedagógicos, personagens, mecânicas originais e materiais próprios são protegidos por direitos autorais.

A licença deste repositório é proprietária e não concede autorização para copiar, modificar, redistribuir, sublicenciar ou explorar comercialmente o software sem autorização escrita da VSA Tecnologia.

Bibliotecas e componentes de terceiros permanecem sujeitos às respectivas licenças. Consulte [LICENSE](LICENSE) e os avisos de terceiros antes de distribuir uma versão do produto.

A publicação de um repositório no GitHub não significa que seu conteúdo esteja em domínio público. A licença proprietária também não substitui a revisão jurídica necessária para comercialização.

## Roadmap

- [x] Definição inicial do produto e público.
- [x] Direcionamento pedagógico da multiplicação.
- [x] Arquitetura inicial compatível com GitHub Pages.
- [x] Diagnóstico inicial de conhecimentos prévios (amostra de 6 questões).
- [x] Laboratório visual da multiplicação com matrizes interativas.
- [ ] Tabuadas adaptativas de 1 a 10.
- [ ] Jogos e missões.
- [ ] Persistência e backup local.
- [ ] Revisão espaçada e avaliação de retenção.
- [ ] Painel de responsáveis.
- [ ] Scratch Lab.
- [ ] Piloto com crianças e validação pedagógica.

## Governança do projeto

O desenvolvimento seguirá um fluxo documentado:

**Investigar → Projetar → Fundamentar → Construir → Testar → Validar → Evoluir.**

Toda funcionalidade pedagógica deve possuir objetivo de aprendizagem, habilidade matemática, instrução e feedback, critérios de sucesso, testes funcionais e evidência de aprendizagem esperada.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e a documentação em [docs/](docs/).

---

<p align="center">
  <strong>Math Quest</strong><br/>
  Um produto educacional da <strong>VSA Tecnologia</strong>.<br/>
  <sub>Aprender matemática. Resolver desafios. Criar possibilidades.</sub>
</p>
