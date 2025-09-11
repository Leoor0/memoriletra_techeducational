# memoriletra_techeducational
1) Visão geral
O MemoriLetra é um jogo de memória educativo focado em alfabetização inicial (5 a 8 anos). A criança
vira cartas para encontrar pares e, a cada par correto, deve escrever o nome da figura — reforçando
vocabulário, consciência fonológica e ortografia. O jogo roda no navegador (HTML, CSS e JavaScript) e
pode ter um servidor Python (Flask) opcional para servir dados.
Principais diferenciais - Combina memória visual + escrita guiada com dicas graduais por fase. -
Acessível (alto contraste, fonte grande) e com áudio da palavra (TTS do navegador). - Relatório local
em CSV para acompanhamento de acertos/erros por tema e fase.
2) Objetivos educacionais
Ampliar vocabulário (animais, frutas, objetos escolares, cores/formas, números por extenso).
Relacionar som–letra (sílabas simples, e depois encontros consonantais como nh/ch/lh).
Treinar ortografia básica, aceitando maiúsculas/minúsculas e normalizando acentos.
Exercitar atenção e memória.
3) Escopo
Inclui (MVP): - 4 fases com tabuleiros crescentes (2x2, 3x2, 3x4, 4x4) e dicas por fase.
- Temas: Animais, Frutas, Objetos escolares, Cores/Formas, Números.
- Validação da escrita ignorando caixa e acento (com reforço positivo e/ou dica).
- Recompensas: estrelas por acerto na primeira tentativa; adesivos/insígnias simples (UI).
- Relatório local: exportar CSV dos acertos/erros por fase/tema.
Exclui (neste momento): - Login/usuários, nuvem, ranking on‑line, editor de fases, anúncios.
4) Público‑alvo e personas
Crianças 5–8 anos (EI e 1º–2º ano) com supervisão de responsáveis.
Professora Ana (28): usa o jogo em laboratório de informática.
Responsável Carlos (35): usa em casa no tablet para reforço diário.
•
•
•
•
•
•
•
1
5) Requisitos funcionais (RF)
RF1. Virar cartas e detectar pares.
RF2. Ao acertar o par, exibir modal para digitar o nome da figura.
RF3. Validação: ignorar maiúsc./minúsc. e acentos; dar dica se errar.
RF4. Dicas por fase: (F1) palavra curta; (F2) primeira letra; (F3) nº de letras; (F4) presença de nh/ch/lh se
existir.
RF5. Recompensa: adicionar estrela se acerto na tentativa.
RF6. TTS: opção “Ouvir palavra” após o par encontrado.
RF7. Progresso local em localStorage (estrelas por fase/tema).
RF8. Relatório CSV com timestamp, fase, tema, palavra, resposta e acerto.
6) Requisitos não funcionais (RNF)
RNF1. Front-end em HTML, CSS e JS (ES6+), sem dependências obrigatórias.
RNF2. Compatível com desktop e tablets (responsivo).
RNF3. Acessibilidade: alto contraste, tamanho de fonte ≥ 16px, labels ARIA.
RNF4. Privacidade: sem coleta externa; dados ficam no navegador.
RNF5. Desempenho: carregar tabuleiro ≤ 1s no grid 4x4 em hardware comum.
7) Regras de negócio
Estrela apenas em acerto (primeira confirmação após o par).
Acento não reprova: a validação remove diacríticos.
Maiúsc./minúsc. não alteram o resultado.
Fim da rodada: todas as cartas pareadas ⇒ mostrar estrelas e voltar ao menu.
8) Arquitetura
Opção A — 100% estático (recomendado para apresentação): - index.html (menu) →
game.html (tabuleiro) + styles.css + game.js .
- Assets mínimos: emojis como figuras (evita download de imagens).
Opção B — Servidor leve (Python/Flask, opcional): - Endpoints para servir listas de palavras por
tema/fase e, se desejado, gerar CSV no servidor.
- Sem banco de dados: dados em memória/JSON.
Diagrama de componentes (simplificado):
[Browser] --HTML/CSS/JS--> [MemoriLetra UI]
 | |
 | TTS/Web APIs (speech) | localStorage/CSV
 v v
[Opcional] ---- HTTP ----> [Flask API]
•
•
•
•
2
9) Modelo de dados (lógico, mínimo)
Entidades locais (JS): - Item { emoji: string, palavra: string, tema: enum }.
- Evento { timestamp, fase, tema, palavra, resposta, correto }.
- Progresso { chaveFaseTema → estrelas } em localStorage .
10) Fluxo principal (UML textual)
Jogador escolhe fase e tema no menu.
Sistema gera grade (2x2…4x4), embaralha cartas.
Jogador vira duas cartas.
Se par: abrir modal de escrita.
Validar escrita; se correto, estrela e feedback sonoro (TTS).
Registrar evento para relatório.
Ao final, exibir total de estrelas e retornar ao menu.
11) Casos de uso (resumo)
UC01 — Iniciar partida: selecionar fase/tema e abrir tabuleiro.
UC02 — Jogar rodada: virar cartas e encontrar pares.
UC03 — Escrever palavra: digitar, validar e receber feedback/dica.
UC04 — Exportar relatório: gerar CSV de eventos capturados.
UC05 — Ouvir palavra: emitir áudio (pós-par encontrada).
12) User stories (INVEST) + critérios de aceite
US01: “Como criança, quero escolher fase/tema para jogar do meu nível.”
CA: menu mostra fases 1–4 e temas; ao confirmar, abre o tabuleiro correto.
US02: “Como criança, ao acertar um par, quero escrever a palavra.”
CA: modal aparece com campo de texto + dica conforme fase.
US03: “Como criança, quero ganhar estrela quando acerto a escrita.”
CA: se normalize(resposta) == normalize(palavra) , incrementar estrela.
US04: “Como professor, quero baixar um CSV com tentativas.”
CA: botão exporta CSV com colunas {timestamp,fase,tema,palavra,resposta,correto}.
13) Protótipo de UI (MVP)
Menu: grade simples, cores azul/amarelo, botões grandes, fonte arredondada.
Tabuleiro: cartas com interações acessíveis (teclado/ARIA), feedback visual claro.
Modal: título, dica dinâmica, campo de resposta, botões “Confirmar” e “Pular”.
1.
2.
3.
4.
5.
6.
7.
•
•
•
•
•
•
•
•
•
•
•
•
3
14) Plano de releases e sprints (exemplo 2–3 semanas)
Sprint 1 (Fundação): grid 2x2, virada e pareamento, modal, validação sem acento.
Sprint 2 (Aprendizado): dicas por fase, TTS, progresso local, CSV.
Sprint 3 (Expansão): grades 3x2/3x4/4x4, temas adicionais, polimento de UI.
15) Testes
Funcionais: pareamento, modais, validação com/sem acento/maiúsculas.
Acessibilidade: contraste, navegação por teclado, leitura de rótulos.
Usabilidade: clareza das dicas e tempo de resposta.
Compatibilidade: Chrome/Edge/Firefox; tablets (Android/iPadOS).
16) Riscos e mitigação
Atenção dispersa: grades progressivas e sessões curtas.
Acentos/ortografia: normalização sem penalizar acento, com reforço de áudio.
Dispositivo fraco: uso de emojis (sem imagens pesadas) e DOM leve.
17) Como executar (para apresentação)
Sem servidor (recomendado): 1. Baixar o pacote .zip do protótipo.
2. Extrair e abrir index.html em um navegador moderno.
Com servidor (opcional): 1. python -m venv .venv && .venv/Scripts/activate (Windows) ou
source .venv/bin/activate (Linux/macOS).
2. pip install flask
3. python server.py → abrir http://127.0.0.1:5000 .
18) Referências técnicas
Web Speech API (speechSynthesis) — documentação MDN.
Acessibilidade Web (WAI-ARIA) — padrões básicos.
Observação: Este documento resume o projeto para apresentação, alinhado ao escopo
definido e ao MVP implementado (protótipo funcional em HTML/CSS/JS com opção de
Flask).
