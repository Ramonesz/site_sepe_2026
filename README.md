# A influência da música na Ditadura Militar

## Sobre o projeto

**Vozes em resistência** é um site educacional sobre a influência da música durante a Ditadura Militar brasileira.

O projeto apresenta artistas, canções e manifestações culturais que ajudaram a expressar críticas, preservar memórias e representar formas de resistência durante o período. Além do acervo musical, o site possui um quiz interativo e uma playlist do Spotify.

## Objetivo do projeto

O objetivo do site é mostrar como a música foi utilizada como forma de expressão, denúncia e resistência durante a Ditadura Militar brasileira. A proposta é aproximar o público desse período histórico por meio de canções, artistas e informações apresentadas de forma visual e interativa.

O projeto também busca valorizar a memória cultural brasileira e incentivar a reflexão sobre a importância da liberdade de expressão. Por meio do acervo musical e do quiz, o visitante pode conhecer diferentes formas de resistência artística e compreender como a música ajudou a preservar vozes que tentavam ser silenciadas.

Este site foi desenvolvido por **Ramon Affonso Noara Petry** para ser apresentado de forma interativa durante a **SEPE (Semana de Ensino, Pesquisa e Extensão)** do **Instituto Federal Catarinense – Campus Concórdia**, no ano de 2026.

## Funcionalidades

- Página inicial com apresentação do tema e imagens históricas.
- Tela de seleção entre o acervo musical e o quiz.
- Acervo com músicas relacionadas ao período histórico.
- Player de áudio fixo com:
  - reprodução e pausa;
  - barra de progresso;
  - controle de volume;
  - identificação da música e do artista;
  - capa da música em reprodução.
- Cards musicais com imagens em tons de cinza e imagens coloridas.
- Cards expansíveis com informações sobre os artistas e as músicas.
- Quiz com 10 perguntas sobre música, censura e resistência cultural.
- Embaralhamento das alternativas do quiz.
- Feedback visual para respostas corretas e incorretas.
- Contagem de acertos e resultado final no formato `X/10 acertos`.
- Confetes animados ao concluir o quiz.
- Playlist recomendada do Spotify com capa e QR Code.
- Layout responsivo para computador, tablet e celular.
- Transições entre páginas e restauração correta ao voltar pelo navegador.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- HTMLAudioElement para reprodução dos áudios
- CSS Grid e Flexbox para os layouts
- CSS Media Queries para responsividade
- Google Fonts:
  - DM Serif Display
  - Manrope
  - DM Mono

O projeto não utiliza frameworks, bibliotecas externas de JavaScript, banco de dados ou sistema de build.

## Estrutura do projeto

```text
.
├── index.html                 # Entrada principal e redirecionamento
├── html/
│   ├── index.html             # Capa do projeto
│   ├── selecao.html           # Seleção entre músicas e quiz
│   ├── musicas.html           # Acervo musical, player e playlist
│   └── quiz.html              # Interface do quiz
├── css/
│   └── style.css              # Estilos, responsividade e animações
├── js/
│   ├── main.js                # Interações, player, navegação e quiz
│   └── quiz-data.js            # Banco de perguntas do quiz
├── documentos/
│   ├── apresentacao-sepe.pdf  # Apresentação da pesquisa
│   └── banner-sepe-2026.pdf   # Banner da pesquisa para a SEPE
├── audio/
│   ├── efeitos sonoros/        # Sons de navegação, respostas e vitória
│   └── musicas/                # Músicas do acervo
└── imagens/
    ├── ativo/                 # Imagens coloridas dos artistas
    ├── capa/                  # Capas usadas no player
    ├── desativado/            # Imagens em tons de cinza
    ├── ditcapa/               # Imagens históricas da capa
    ├── roda pe/               # Identidade visual do rodapé
    └── spotify/               # Capa e QR Code da playlist
```

## Como executar localmente

Como o projeto é estático, não é necessário instalar dependências.

### Opção 1: abrir diretamente

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` no navegador.
3. A página inicial redirecionará para `html/index.html`.

### Opção 2: usar o Live Server no VS Code

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não tenha.
3. Clique com o botão direito em `index.html`.
4. Selecione **Open with Live Server**.

Usar um servidor local costuma oferecer uma experiência mais próxima da publicação online, especialmente para arquivos de áudio e navegação entre páginas.

### Opção 3: servidor local pelo terminal

Com Python instalado, execute na pasta raiz do projeto:

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Publicação no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos e pastas deste projeto para a branch principal.
3. No repositório, abra **Settings**.
4. Acesse **Pages**.
5. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: branch principal, normalmente `main`
   - Folder: `/ (root)`
6. Salve a configuração.
7. Aguarde o GitHub Pages gerar o endereço do site.

O arquivo `index.html` na raiz é a porta de entrada recomendada para a publicação.

## Organização dos arquivos de mídia

Os arquivos dentro de `audio` e `imagens` seguem um padrão de nomes em letras minúsculas, sem acentos ou espaços, usando hífens para separar as palavras.

Exemplos:

```text
artista-colorido-chico-buarque.jpg
artista-cinza-chico-buarque.jpg
capa-chico-buarque.jpg
musica-chico-buarque-apesar-de-voce.mp3
efeito-vitoria.mp3
qr-code-playlist.png
```

Ao adicionar uma nova imagem ou música, mantenha esse padrão e atualize as referências no HTML ou JavaScript correspondente.

## Funcionamento do JavaScript

O arquivo `js/main.js` é compartilhado pelas páginas e identifica quais elementos existem em cada uma delas.

### Navegação

As páginas usam transições de saída antes de mudar de endereço. O evento `pageshow` remove estados antigos de animação para evitar que a página fique branca quando o usuário retorna usando o botão do navegador ou do celular.

### Player de áudio

O player utiliza `HTMLAudioElement` e recebe os dados da música diretamente dos atributos `data-*` dos cards:

```html
<article
  data-audio="../audio/musicas/musica-exemplo.mp3"
  data-song="Nome da música"
  data-artist="Nome do artista"
  data-cover="../imagens/capa/capa-exemplo.jpg">
</article>
```

### Quiz

As perguntas ficam em `js/quiz-data.js`. O `main.js` embaralha as alternativas, controla a pergunta atual, registra os acertos e mostra o resultado final.

Para adicionar ou alterar perguntas, edite apenas o arquivo `js/quiz-data.js`, mantendo a estrutura existente:

```javascript
{
  pergunta: 'Texto da pergunta',
  respostas: ['Alternativa 1', 'Alternativa 2', 'Alternativa 3', 'Alternativa 4'],
  correta: 1,
}
```

O valor de `correta` representa o índice da resposta correta, começando em `0`.

## Responsividade

O layout utiliza breakpoints CSS para adaptar:

- quantidade de colunas dos cards musicais;
- tamanho das fontes;
- espaçamento das páginas;
- player de áudio;
- playlist do Spotify;
- capa, QR Code e botões em telas menores.

A playlist passa para uma única coluna em larguras menores para evitar que texto, capa ou QR Code ultrapassem a tela do celular.

## Documentos da pesquisa

Na página **Sobre o projeto**, acessível pelo rodapé do acervo musical e do quiz, estão disponíveis dois documentos em PDF:

- **Apresentação SEPE**: material de apoio com a introdução histórica sobre a Ditadura Militar, a repressão e a censura, as formas de tortura, a música antes e durante o regime, a censura musical, a música como resistência, artistas importantes e o legado dessas produções.
- **Banner SEPE 2026**: apresenta a pesquisa **A influência da música na Ditadura Militar**, seus objetivos, a metodologia baseada em músicas, imagens, site e quiz, além da conclusão sobre a música como forma de expressão, crítica e resistência.

Os documentos também destacam que a pesquisa busca conscientizar sobre a importância do estudo da história nacional, apresentar artistas e músicas brasileiras e mostrar como a arte pode preservar a memória e defender a liberdade de expressão.

Os PDFs estão armazenados na pasta `documentos/` com nomes padronizados e podem ser abertos diretamente pela página Sobre.

## Acessibilidade e boas práticas

- As páginas possuem `lang="pt-BR"`.
- Imagens possuem textos alternativos com `alt`.
- Botões têm rótulos acessíveis com `aria-label` quando necessário.
- O quiz informa o feedback por meio de `aria-live`.
- O progresso da música utiliza o papel ARIA de slider.
- Links externos para o Spotify abrem em uma nova aba.

## Observações

- A reprodução automática de sons pode ser bloqueada pelo navegador até que o usuário interaja com a página.
- Os arquivos de áudio e imagem precisam permanecer nos caminhos esperados para que o site funcione corretamente.
- O projeto foi desenvolvido para funcionar sem backend.
- O conteúdo histórico deve ser utilizado com finalidade educacional e contextualizado por fontes confiáveis.

## Licença e créditos

Este projeto foi desenvolvido por **Ramon Affonso Noara Petry** como uma experiência educacional sobre música, memória e resistência cultural durante a Ditadura Militar brasileira.

O site foi produzido para apresentação na **SEPE (Semana de Ensino, Pesquisa e Extensão)** do **Instituto Federal Catarinense – Campus Concórdia**, em 2026.

Antes de publicar o projeto publicamente, verifique as licenças e autorizações das imagens, músicas, fontes e demais materiais utilizados.
