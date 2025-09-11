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
