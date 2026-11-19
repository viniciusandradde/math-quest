# Esteira criativa e multimídia — Math Quest

## Princípio obrigatório

**Usar exclusivamente as ferramentas e contas que já fazem parte do ambiente do projeto. Não contratar, recomendar, integrar ou introduzir novos fornecedores.**

Ferramentas autorizadas para esta esteira:
1. **ChatGPT / GPT Image** — criação de imagens, conceitos, ilustrações, personagens e apoio criativo.
2. **Higgsfield (conta paga já existente)** — cenários, concept art, consistência visual, edição, animações e vídeos. Priorizar os créditos e modelos já disponíveis na conta.
3. **ElevenLabs (integração já conectada)** — voz do mascote, narração, música instrumental e efeitos sonoros.

Não introduzir Hugging Face, fal.ai, novos geradores, bibliotecas comerciais de assets, novas assinaturas ou serviços externos nesta esteira. Só reconsiderar isso mediante pedido explícito do responsável pelo projeto.

## Identidade oficial

- Logo oficial vetorial: `public/brand/math-quest-logo.svg`
- Arquivo-fonte: `assets/brand/math-quest-logo.svg`
- Favicon: `public/favicon.svg`
- Ícones PWA: `public/icons/`

O mascote oficial é o robô frontal com visor azul-marinho, olhos e sorriso ciano, fones laranja, antena e aro tecnológico azul. A ilustração promocional com polegar levantado e X laranja não substitui o logo.

Kit de marca Math Quest criado no workspace conectado do ElevenLabs. A referência visual oficial deve orientar todas as gerações.

## Responsabilidades por ferramenta

### ChatGPT / GPT Image
- Criar conceitos, ilustrações, personagens, expressões, poses, objetos, ícones e imagens editoriais.
- Usar o mascote e a paleta oficial como referência.
- Não tentar redesenhar o logo oficial dentro das imagens; usar o SVG mestre na composição final.
- Criar primeiro uma imagem-mestre aprovada e depois variações coerentes.

### Higgsfield — conta paga existente
- Ferramenta principal para cenários, ambientes de missão, concept art, consistência visual, edição e animação.
- Aproveitar os modelos, créditos e recursos que já estão incluídos na conta.
- Antes de cada geração paga, consultar a estimativa de créditos na própria conta.
- Não iniciar lotes pagos sem aprovação do responsável.
- Não sugerir upgrade ou contratação de outro plano.

### ElevenLabs — conta conectada
- Criar a voz oficial do mascote, falas curtas, instruções narradas, música-tema, trilhas de fundo e efeitos sonoros.
- Reutilizar assets de áudio em várias missões sempre que possível.
- Antes de lotes de áudio, verificar o saldo e o consumo previsto na conta existente.
- Não sugerir contratação de outro plano.

## Fluxo de produção

1. **Briefing pedagógico:** definir o que a criança precisa aprender e o papel visual/sonoro do asset.
2. **Direção de arte:** registrar cenário, personagem, paleta, enquadramento e estilo.
3. **Geração:** escolher entre ChatGPT/GPT Image, Higgsfield e ElevenLabs conforme o tipo de asset.
4. **Revisão:** conferir consistência com a marca, legibilidade em celular, adequação etária, acessibilidade e qualidade.
5. **Aprovação:** somente assets aprovados entram na biblioteca do produto.
6. **Otimização:** SVG para vetores e ícones; WebP/AVIF para imagens; WebM/MP4 para vídeo; OGG/MP3 para áudio.
7. **Publicação:** assets versionados em `public/assets/` e carregados pelo app como arquivos estáticos.

## Biblioteca de assets

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

## Controle de custos — somente contas existentes

- Não há orçamento para novas assinaturas ou serviços.
- Registrar ferramenta, modelo, créditos consumidos, resolução/duração, finalidade pedagógica e arquivo final.
- Higgsfield: usar preflight de créditos disponível na conta antes da geração paga.
- ElevenLabs: conferir saldo e consumo estimado antes de gerar áudio.
- ChatGPT: respeitar os limites e recursos já disponíveis no plano atual.
- Preferir assets reutilizáveis e lotes pequenos aprovados.
- Apresentar ao responsável o consumo estimado nas contas existentes quando houver custo adicional.
- Não converter créditos em dólares sem uma taxa oficial aplicável ao pacote atual da conta.

## Segurança e arquitetura

- Não colocar tokens ou credenciais em `VITE_*`, no repositório ou no bundle frontend.
- GitHub Pages hospeda o aplicativo estático; não deve chamar APIs privadas diretamente do navegador.
- Nesta fase, a produção pode ocorrer nas interfaces e integrações já disponíveis, com publicação manual/versionada dos assets no repositório.
- Uma automação de geração por API só será implementada se as contas existentes oferecerem acesso autorizado e sem contratação de novos serviços.

## Fora do escopo

- Hugging Face e Inference Providers.
- fal.ai ou qualquer novo agregador.
- Novas assinaturas, upgrades ou contratação de créditos adicionais sem aprovação.
- APIs ou provedores não presentes nas contas já utilizadas pelo projeto.
- Geração automática em lote sem estimativa e aprovação de custo.
