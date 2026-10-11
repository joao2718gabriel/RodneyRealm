/**
 * RODNEY REALM — conteúdo do site
 * --------------------------------
 * Este é o único arquivo que você precisa editar para publicar
 * as informações reais do servidor.
 *
 * Logo
 *   Salve como images/logo.png (quadrado). O header troca o símbolo
 *   pela imagem assim que o arquivo existir. Ou preencha `logo` com outro caminho.
 *
 * Banner do topo
 *   Quando tiver a arte, coloque o caminho em `hero`, por exemplo "images/hero.jpg".
 *   Enquanto estiver vazio, o site usa a ilustração de images/hero.svg.
 *
 * Fotos das estruturas
 *   Salve em images/structures/ e aponte `image` para o arquivo.
 *   Exemplo: "images/structures/farm-de-ferro.png"
 *
 * Fotos ou skins dos jogadores
 *   Salve em images/players/ e aponte `image` para o arquivo.
 *
 * Jogadores em cada projeto
 *   `players` dentro do projeto é uma lista de `id`.
 *   A seção de jogadores monta o caminho inverso sozinha.
 *
 * Quando os dados forem os oficiais, mude `demo` para false
 * para esconder o aviso de exemplo.
 *
 * GitHub Pages: Settings → Pages → branch main, pasta raiz (/).
 * Os caminhos são relativos, então funciona em usuario.github.io/repo/.
 */
window.RODNEY = {
  demo: true,
  name: "Rodney Realm",
  address: "IP em breve",
  edition: "",
  logo: "images/logo.png",
  hero: "",
  meta: ["Somente survival", "Farms e bases da comunidade"],

  players: [
    {
      id: "jogador-1",
      name: "Jogador 1",
      role: "Construtor",
      image: "images/players/jogador-1.png",
    },
    {
      id: "jogador-2",
      name: "Jogador 2",
      role: "Redstone",
      image: "images/players/jogador-2.png",
    },
    {
      id: "jogador-3",
      name: "Jogador 3",
      role: "Farms",
      image: "images/players/jogador-3.png",
    },
    {
      id: "jogador-4",
      name: "Jogador 4",
      role: "Exploração",
      image: "images/players/jogador-4.png",
    },
  ],

  projects: [
    {
      id: "farm-de-ferro",
      name: "Farm de Ferro",
      kind: "Farm",
      dimension: "Overworld",
      status: "Ativa",
      summary: "Vila compacta que produz ferro para as construções do reino.",
      about: "Modelo de uma farm de ferro no estilo vila. Os villagers ficam nas células, o ferro cai na coleta central e o excesso segue para o armazenamento.",
      image: "images/structures/farm-de-ferro.png",
      coords: "",
      players: ["jogador-1", "jogador-3"],
    },
    {
      id: "farm-de-ouro",
      name: "Farm de Ouro",
      kind: "Farm",
      dimension: "Nether",
      status: "Ativa",
      summary: "Plataforma no Nether para ouro em quantidade, ligada ao hub.",
      about: "Modelo de farm de ouro no Nether, com plataforma de spawn e túnel de volta ao overworld. A coleta fica marcada para quem mantém a build.",
      image: "images/structures/farm-de-ouro.png",
      coords: "",
      players: ["jogador-2", "jogador-3"],
    },
    {
      id: "base-do-spawn",
      name: "Base do Spawn",
      kind: "Base",
      dimension: "Overworld",
      status: "Em construção",
      summary: "Ponto de encontro do reino: hall, camas e o caminho para as farms.",
      about: "Modelo da base comunitária no spawn. É o lugar de onde saem os portais e as trilhas até as outras estruturas. Ainda em obra no exemplo.",
      image: "images/structures/base-do-spawn.png",
      coords: "",
      players: ["jogador-1", "jogador-2", "jogador-3", "jogador-4"],
    },
    {
      id: "armazenamento",
      name: "Armazenamento",
      kind: "Redstone",
      dimension: "Overworld",
      status: "Ativa",
      summary: "Sistema que separa os itens das farms e devolve o que cada baú pede.",
      about: "Modelo de um ordenador com filtros por item. O que as farms produzem entra por um funil mestre e cada baú guarda um tipo só.",
      image: "images/structures/armazenamento.png",
      coords: "",
      players: ["jogador-1", "jogador-2"],
    },
    {
      id: "farm-de-xp",
      name: "Farm de XP",
      kind: "Farm",
      dimension: "Overworld",
      status: "Ativa",
      summary: "Câmara escura para experiência, usada nos encantamentos da base.",
      about: "Modelo de farm de experiência da comunidade. A câmara fica fechada, com um ponto de ataque seguro e um baú para os drops.",
      image: "images/structures/farm-de-xp.png",
      coords: "",
      players: ["jogador-3"],
    },
    {
      id: "hub-do-end",
      name: "Hub do End",
      kind: "Estrutura",
      dimension: "End",
      status: "Em construção",
      summary: "Ponte e marco de retorno depois da luta com o dragão.",
      about: "Modelo do hub no End: plataforma de pouso, baú de reposição e o caminho de volta ao portal. A ponte principal ainda está em construção neste exemplo.",
      image: "images/structures/hub-do-end.png",
      coords: "",
      players: ["jogador-1", "jogador-4"],
    },
  ],

  faq: [
    {
      q: "O Rodney Realm tem outros modos?",
      a: "Não. O servidor é somente survival. Não há minigames nem um modo criativo aberto para a comunidade.",
    },
    {
      q: "O que esta página mostra?",
      a: "As estruturas e farms feitas no mapa, e os jogadores que participam de cada uma. Se alguém entra em mais de um projeto, o nome aparece em todos eles.",
    },
    {
      q: "Como eu entro no servidor?",
      a: "Pelo endereço no topo da página. Enquanto o IP definitivo não estiver publicado, o campo mostra que ele ainda vai ser anunciado.",
    },
    {
      q: "Uma construção nova pode entrar na lista?",
      a: "Sim. Cada projeto compartilhado do reino pode ganhar um card, com a foto, o status e quem colocou a mão na massa.",
    },
  ],
};
