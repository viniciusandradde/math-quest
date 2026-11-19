# Esteira criativa e multimídia — Math Quest

## Objetivo
Produzir personagens, cenários, ilustrações, animações, narração, efeitos sonoros e trilhas com consistência visual e controle de custos.

## Fontes oficiais da marca
- Logo oficial vetorial: `public/brand/math-quest-logo.svg`
- Arquivo-fonte da marca: `assets/brand/math-quest-logo.svg`
- Favicon: `public/favicon.svg`
- Ícones PWA: `public/icons/`

A logo oficial é o mascote frontal de visor azul-marinho, olhos e sorriso ciano, conchas laranja, antena e aro tecnológico. A ilustração com polegar levantado e X laranja é uma arte promocional/hero, não deve substituir o logo.

## Ferramentas e responsabilidades

### ChatGPT Image
- Conceitos iniciais, ilustrações editoriais, variações de personagens e peças avulsas.
- Usar a logo oficial como referência quando houver geração baseada em imagem.
- Não redesenhar o logo dentro de cenas; compor o arquivo oficial separadamente quando necessário.
- Antes de criar múltiplas imagens, fechar ficha visual e prompt-base.

### Higgsfield
- Cenários, ambientes de missão, concept art, consistência visual de personagens, animações e vídeos.
- Soul Location para ambientes; Soul Cinema para concept art; GPT Image 2 / Nano Banana Pro para composição e edição com referência; modelos de vídeo para animação.
- Consultar custo em créditos antes de iniciar cada geração paga. Créditos variam por modelo, duração, resolução e parâmetros.

### Hugging Face
- Catálogo e testes de modelos abertos para imagem, vídeo, áudio e visão.
- Inference Providers permite usar provedores externos com cobrança por uso; o Hugging Face informa que repassa o preço do provedor sem markup.
- Para desenvolvimento: experimentar no Playground e protótipos; para produção, integrar por backend/API com token guardado em secret.
- Não colocar HF_TOKEN no React, Vite, GitHub Pages ou qualquer bundle público.
- Não presumir que todo modelo do Hub tem inferência gratuita ou licença comercial adequada. Verificar modelo, provedor, licença, limites e preço antes de adotar.

### ElevenLabs
- Voz do mascote, instruções narradas, falas de missão, efeitos sonoros e trilhas instrumentais.
- Música e efeitos são assets de áudio separados de voz.
- Verificar licença comercial do plano e condições de uso antes de distribuir conteúdo comercial.
- Usar arquivos curtos e reutilizáveis; evitar gerar uma faixa nova para cada tela.

## Arquitetura recomendada
1. Produção: ferramentas de criação geram arquivos mestres.
2. Curadoria: revisão de qualidade, consistência, acessibilidade e licença.
3. Otimização: exportar AVIF/WebP para imagens, SVG para ícones, WebM/MP4 para vídeo e OGG/MP3 para áudio.
4. Publicação: assets versionados em `public/assets/` ou CDN com cache.
5. Runtime: o app carrega arquivos estáticos; não chama APIs pagas diretamente do navegador.
6. Futuro: um serviço backend com fila, autorização, limites de uso e registro de custo poderá automatizar geração sob demanda.

## Convenção de pastas
```
public/assets/
  brand/
  characters/
  environments/
  missions/
  illustrations/
  animations/
  audio/
    music/
    sfx/
    voice/
```

## Controle de custos
- Criar primeiro um lote pequeno de protótipos.
- Priorizar assets reutilizáveis: 1 mascote, expressões, 4 cenários-base, conjunto de botões/ícones e uma biblioteca curta de SFX.
- Para cada geração, registrar ferramenta, modelo, resolução/duração, créditos consumidos, licença e arquivo final.
- Exigir aprovação antes de executar gerações pagas em lote.
- Manter alternativas gratuitas ou open-source quando a qualidade for suficiente.

## Proteção de segredos
Tokens de Higgsfield, Hugging Face e ElevenLabs nunca podem ficar em variáveis `VITE_*`, arquivos versionados ou código frontend. GitHub Pages é hospedagem estática: qualquer segredo incluído no bundle fica público.
