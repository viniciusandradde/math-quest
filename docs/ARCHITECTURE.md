# Arquitetura

## Princípios
- Frontend estático para o MVP.
- Separação entre interface, conteúdo, motor pedagógico e jogos.
- Regras matemáticas determinísticas e testáveis.
- Persistência local por padrão.
- Nenhum segredo no bundle do navegador.
- Evolução para backend sem acoplamento prematuro.

## MVP
~~~text
React + TypeScript
       |
       +-- Features (diagnóstico, aprender, praticar, responsáveis)
       +-- Learning Engine (regras, fatos, domínio, revisão)
       +-- Game Modules (Phaser e experiências interativas)
       +-- Zustand (estado da interface)
       +-- Dexie / IndexedDB (dados locais)
       +-- PWA Service Worker (cache e instalação)
       +-- GitHub Pages (hospedagem estática)
~~~

## Evolução
Quando houver necessidade de contas, sincronização entre dispositivos e gestão de turmas:
- Web: React/TypeScript, mantendo contratos de domínio.
- API: FastAPI, Pydantic e SQLAlchemy.
- Dados: PostgreSQL.
- Identidade: OAuth2/OIDC e RBAC.
- Arquivos: MinIO/S3.
- Cache e tarefas: Redis, conforme necessidade.
- Observabilidade: logs estruturados, métricas e tracing.
- Deploy: containers e pipeline CI/CD.

## Módulos de domínio
- Student Profile: perfil mínimo e preferências.
- Assessment: diagnóstico e avaliações.
- Learning: fatos matemáticos e habilidades.
- Practice Scheduler: seleção e revisão.
- Progress: evidências de aprendizagem.
- Game Session: estado das missões e recompensas.
- Parent View: resumo local ou sincronizado no futuro.

## Dados locais
A versão inicial persiste em IndexedDB (Dexie, schema v3) as tentativas de multiplicação, o diagnóstico, as tentativas dos desafios estratégicos e as partidas de memória concluídas. Regras de resumo ficam em src/learning e são testáveis sem banco; src/lib/db apenas lê e grava. Não armazenar nome completo, data de nascimento, endereço ou outros dados sensíveis no MVP.

## GitHub Pages
O projeto é publicado em /math-quest/. Por isso:
- base do Vite deve ser /math-quest/;
- manifest e ícones usam o mesmo prefixo;
- rotas futuras devem ser compatíveis com hospedagem estática;
- o workflow deve publicar somente o diretório dist.

## Segurança
GitHub Pages publica arquivos estáticos. Qualquer chave incluída no frontend é pública. Serviços futuros devem ser acessados por API protegida e políticas adequadas.
