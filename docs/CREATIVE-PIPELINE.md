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

## Referência de custos consultada — 19/11/2026

Valores em USD, sujeitos a alteração, impostos, câmbio e disponibilidade regional.

| Serviço | Referência pública | Observação |
|---|---:|---|
| ChatGPT Image | Conforme plano ChatGPT | Geração no ChatGPT; limites dependem do plano e do produto. |
| Higgsfield Starter | A partir de US$ 9/mês na página de preços | Créditos mensais; conferir o checkout e a quantidade atual. |
| Higgsfield Plus | A página exibe US$ 47/mês na cobrança anual em uma oferta | Créditos e promoções mudam. |
| Hugging Face Free | Sem crédito mensal incluído atualmente na página de preços | Inferência por provedor é pay-as-you-go. |
| Hugging Face PRO | US$ 9/mês | Inclui US$ 2/mês em créditos de compute/inference. |
| ElevenLabs Free | US$ 0/mês; 10 mil créditos/mês | Uso gratuito limitado; sem licença comercial. |
| ElevenLabs Starter | US$ 6/mês; 30 mil créditos/mês | Inclui licença comercial e uso comercial de música. |
| ElevenLabs Creator | US$ 22/mês; 121 mil créditos/mês | Inclui recursos adicionais de voz. |

### Estimativas reais de preflight na conta conectada Higgsfield
As estimativas abaixo foram consultadas sem submeter gerações:
- Uma imagem de cenário 16:9 com GPT Image 2.6: **0,25 crédito**.
- Uma trilha instrumental de 30 segundos com ElevenLabs Music v2.5: **4,36 créditos**.

Esses números são estimativas do motor de créditos da conta conectada e não equivalem a preço em dólares. O custo final depende do pacote de créditos vigente. Antes de cada geração paga, executar o preflight e apresentar o total para aprovação.

### ElevenLabs — consumo aproximado de créditos publicado
- Text to Speech: cerca de 1 crédito por caractere nos modelos padrão indicados.
- Música: cerca de 900 créditos por minuto.
- Efeitos sonoros: cerca de 200 créditos por geração.
Os consumos variam conforme produto e modelo. Consultar o painel antes de produzir lotes.

### Recomendação de compra
Não contratar planos adicionais antes de validar um pequeno lote de assets. Começar pelo plano gratuito e créditos já disponíveis, produzir protótipos, medir custo por asset aprovado e só então decidir se vale assinar Higgsfield Starter/Plus ou ElevenLabs Starter/Creator.

### Fontes de preço
- Higgsfield: https://higgsfield.ai/pricing
- Hugging Face: https://huggingface.co/pricing
- Hugging Face Inference Providers: https://huggingface.co/docs/inference-providers/pricing
- ElevenLabs: https://elevenlabs.io/pt/pricing
