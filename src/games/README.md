# Módulos de jogos

Os jogos devem ser implementados como módulos independentes, com Phaser para cenas 2D quando a mecânica justificar.

## Contrato esperado
- Receber objetivo pedagógico e conteúdo como dados.
- Emitir eventos de tentativa, acerto, erro e conclusão.
- Não calcular ou alterar o domínio de aprendizagem por conta própria.
- Encaminhar resultados ao Learning Engine.
- Suportar pausa, retomada e acessibilidade por controles alternativos.

## Primeiro conjunto planejado
- Memory: associação entre operação e resultado.
- Circuit: completar circuitos com resultados corretos.
- Robot Factory: montar grupos e componentes.
- Escape Room: resolver enigmas para avançar.

O primeiro MVP utiliza uma atividade React simples. A integração Phaser será introduzida conforme a validação das mecânicas.
