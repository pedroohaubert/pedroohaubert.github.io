let y = 0
let listaFaixas;
let listaArtistas;
let access_token;
let faixasRecomendadas;
const client_id = "c3d8138bf17f42ff98b1acedab790802";
const client_secret = "e536212b3c194076848ede08b8c03d5e";
const redirect_uri = "https://pedroohaubert.github.io/logado.html"; 
// const redirect_uri = "http://localhost:5500/logado.html";
const authorization_url = "https://accounts.spotify.com/authorize";
const token_url = "https://accounts.spotify.com/api/token";
const top_artists_url = "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10";
const top_tracks_url = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10";
const recomendations_url = "https://api.spotify.com/v1/recommendations?limit=10&market=BR"  

function requestAuthorization() {
  const scope = "user-top-read";
  const state = generateRandomState();
  const authUrl = `${authorization_url}?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
  window.location.href = authUrl;
  console.log("foi para autorizacao")
}

function getAuthorizationCode() {
  const params = new URLSearchParams(window.location.search);
  console.log("pegou autorizacao")
  return params.get("code");
}

function exchangeCodeForToken(code) {
  const data = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret,
  };

  fetch(token_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  })
    .then((response) => response.json())
    .then((data) => {
      access_token = data.access_token;
      getTopTracks(access_token);
    })
    .catch((error) => {
      console.error("Erro ao trocar código por token:", error);
    });
    console.log("trocou código pelo token")
}

// Passo 4: Obter os 10 artistas mais ouvidos pelo usuário
function getTopArtists(access_token) {
  fetch(top_artists_url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Top 10 artistas:", data.items);
      console.log(data.items[0].name)
      console.log(data.items[0].images[0].url)
      criarArtistas2(data);
    })
    .catch((error) => {
      console.error("Erro ao obter os artistas mais ouvidos:", error);
    });
    console.log("pegou top artistas")
}

function getTopTracks(access_token) {
    fetch(top_tracks_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Top 10 artistas:", data.items);
        console.log(data.items[0].name)
        console.log(data.items[0].album.images[0].url)
        criarFaixas2(data);
      })
      .catch((error) => {
        console.error("Erro ao obter as faixas mais ouvidos:", error);
      });
      console.log("pegou top faixas")
  }

  function getRecomendations(access_token) { 
    fetch( `https://api.spotify.com/v1/recommendations?limit=10&market=BR&seed_artists=${listaArtistas[0]},${listaArtistas[1]},${listaArtistas[3]},${listaArtistas[4]},${listaArtistas[5]}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("50 faixa recomendadas:", data.tracks);
      criarRecomendacoes2(data);
    })
    .catch((error) => {
      console.error("Erro ao obter recomendações", error);
    });
  }
      

// Função auxiliar para gerar um estado aleatório
function generateRandomState() {
  console.log("gerou estado aleatorio")
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function paginaCarregada(){
  let authorizationCode = getAuthorizationCode();
  if (authorizationCode) {
    exchangeCodeForToken(authorizationCode);
    console.log("verificou se a código de autorizacao")
}
  else{requestAuthorization();}

}

let criarArtistas2 =(data)=>{

    let botaoFaixas = document.getElementById("botaoFaixas")
    let botaoArtistas = document.getElementById("botaoArtistas")
    let botaoRecomendacoes = document.getElementById("botaoRecomendacoes")
    let menus = document.getElementById("menus")

    // Remove a classe 'ativo' de todos e adiciona ao botão clicado
    botaoFaixas.classList.remove('ativo');
    botaoArtistas.classList.add('ativo');
    botaoRecomendacoes.classList.remove('ativo');

    listaArtistas = []
    y = 0
    let box = document.getElementById("box")
    box.innerHTML = ""
    
    // Adiciona título à seção
    box.innerHTML = `<div class="titulo-secao">Seus Artistas Mais Ouvidos</div>`;
    
    console.log("items criados");
    console.log(data);
    
    // Adiciona os itens abaixo do título
    box.innerHTML += data.items.map((x)=>{
        listaArtistas[y] = x.id;
        y++;
        
        // Obtém gêneros (se disponíveis)
        const genres = x.genres && x.genres.length > 0 
            ? x.genres.slice(0, 2).join(', ') 
            : ""; // Limita a 2 gêneros
        
        // Estrutura HTML atualizada para alinhar texto
        return`
        <div class="items mx-auto">
          <img src="${x.images[0]?.url || 'https://via.placeholder.com/150?text=Artista'}" alt="${x.name}">
          <span class="numero">${y}</span>
          <div class="item-text">
            <p class="track-name">${x.name}</p>
            <p class="artist-name">${genres}</p>
          </div>
        </div>`
    }).join("");
    
    return;
}

let criarFaixas2 =(data)=>{
    let botaoFaixas = document.getElementById("botaoFaixas")
    let botaoArtistas = document.getElementById("botaoArtistas")
    let botaoRecomendacoes = document.getElementById("botaoRecomendacoes")
    let menus = document.getElementById("menus")

    // Remove a classe 'ativo' de todos e adiciona ao botão clicado
    botaoFaixas.classList.add('ativo');
    botaoArtistas.classList.remove('ativo');
    botaoRecomendacoes.classList.remove('ativo');
    
    listaFaixas = []
    y = 0
    let box = document.getElementById("box")
    box.innerHTML = ""
    
    // Adiciona título à seção
    box.innerHTML = `<div class="titulo-secao">Suas Faixas Mais Ouvidas</div>`;
    
    console.log("items criados");
    console.log(data);
    
    // Adiciona os itens abaixo do título
    box.innerHTML += data.items.map((x)=>{
        listaFaixas[y] = x.id;
        y++;
        // Extrai o nome do artista
        const artistName = x.artists && x.artists.length > 0 ? x.artists[0].name : "";
        
        // Estrutura HTML atualizada
        return`
        <div class="items mx-auto">
          <img src="${x.album.images[0]?.url || 'https://via.placeholder.com/150?text=Faixa'}" alt="${x.name}">
          <span class="numero">${y}</span>
          <div class="item-text">
            <p class="track-name">${x.name}</p>
            <p class="artist-name">${artistName}</p>
          </div>
        </div>`
    }).join("");
    
    return;
}
let selecionarArtistas = () =>{
    getTopArtists(access_token);
}
let selecionarFaixas = () =>{
    getTopTracks(access_token);
}
let selecionarRecomendacoes = () =>{
  getRecomendations(access_token);
}

let criarRecomendacoes2 =(data)=>{
  let botaoFaixas = document.getElementById("botaoFaixas")
  let botaoArtistas = document.getElementById("botaoArtistas")
  let botaoRecomendacoes = document.getElementById("botaoRecomendacoes")
  let menus = document.getElementById("menus")

  // Remove a classe 'ativo' de todos e adiciona ao botão clicado
  botaoFaixas.classList.remove('ativo');
  botaoArtistas.classList.remove('ativo');
  botaoRecomendacoes.classList.add('ativo');
  
  faixasRecomendadas = []
  y = 0
  let box = document.getElementById("box")
  box.innerHTML = ""
  
  // Adiciona título à seção
  box.innerHTML = `<div class="titulo-secao">Recomendações Para Você</div>`;
  
  console.log("items criados");
  console.log(data);
  
  // Adiciona os itens abaixo do título
  box.innerHTML += data.tracks.map((x)=>{
      faixasRecomendadas[y] = x.id;
      y++;
      // Extrai o nome do artista
      const artistName = x.artists && x.artists.length > 0 ? x.artists[0].name : "";
      
      // Estrutura HTML atualizada
      return`
      <div class="items mx-auto">
        <img src="${x.album.images[0]?.url || 'https://via.placeholder.com/150?text=Recom'}" alt="${x.name}">
        <span class="numero">${y}</span>
        <div class="item-text">
          <p class="track-name">${x.name}</p>
          <p class="artist-name">${artistName}</p>
        </div>
      </div>`
  }).join("");
  
  return;
}