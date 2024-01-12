import { getAccessToken } from './authentication.js';
import { updateFavoriteTracksSelection, clearSelection } from './buttons/favorite-tracks-selection.js';
import verifyPageHeight from './page-height.js';
// eslint-disable-next-line import/no-cycle
import { callGetRelatedArtists } from './button-functions-utils.js';
import { savePlaylist } from './get-tracks.js';

export function createSelectionView(code, clientId, mainContainer, startContainer) {
  if (code || sessionStorage.getItem('code')) {
    mainContainer.removeChild(startContainer);
    mainContainer.innerHTML = `
    <div class="selection-container">
      <div class="selection">
        <div class="selection-text">
          <p>escolha o período</p>
        </div>
        <div class="btn-container period-select">
          <button id="shortTerm" class="btn btn-small selection-btn">últimos 30 dias</button>
          <button id="mediumTerm" class="btn btn-small selection-btn">últimos 6 meses</button>
          <button id="longTerm" class="btn btn-small selection-btn">desde o início</button>
        </div>
      </div>
      
      <div class="selection">
        <div class="selection-text">
          <p>e a quantidade de músicas</p>
        </div>
        <div class="btn-container quantity-select">
          <button class="btn btn-small selection-btn" id="9">9 músicas</button>
          <button class="btn btn-small selection-btn" id="12">12 músicas</button>
          <button class="btn btn-small selection-btn" id="15">15 músicas</button>
          <button class="btn btn-small selection-btn" id="18">18 músicas</button>
        </div>
        
        <div class="get-tracks-container">
          <button class="btn btn-large btn-start get-tracks">vamos lá!</button>
        </div>
        
      </div>
    </div>
    `;
    mainContainer.classList.add('decrease-padding');

    if (!sessionStorage.getItem('access_token')) {
      sessionStorage.setItem('code', code);
      getAccessToken(clientId, code);
    }
    verifyPageHeight();
  }
}

export function createViewWithTracksFromData(data) {
  if (data != null) {
    const mainContainer = document.querySelector('.main-container');
    const selectionContainer = document.querySelector('.selection-container');

    if (mainContainer && selectionContainer) {
      mainContainer.removeChild(selectionContainer);
      mainContainer.innerHTML = `
      <div class="user-tracks-container">
        <p>agora escolha suas favoritas</p>
        <p>(no mínimo uma e no máximo todas)</p>
        <div class="tracks-information-container">
        </div>
        <div class="btn-container">
        <button class="btn btn-large go-back-btn">voltar</button>
        <button class="btn btn-large clear-selection-btn">limpar</button> 
        <button class="btn btn-large btn-start get-recommendations">recomenda<span>í</span></button>
        </div>
      </div>
      `;
    }

    const tracksContainer = document.querySelector('.tracks-information-container');

    if (tracksContainer) {
      data.items.forEach((track) => {
        const trackInfo = document.createElement('div');
        trackInfo.classList.add('track-information');
        trackInfo.dataset.artistid = `${track.artists[0].id}`;
        trackInfo.id = track.id;

        const trackInfoLeft = document.createElement('div');
        trackInfoLeft.classList.add('track-info-left');

        const trackLink = document.createElement('a');
        trackLink.title = 'tocar no spotify';
        trackLink.target = '_blank';
        trackLink.href = `${track.external_urls.spotify}`;

        const cover = document.createElement('img');
        cover.src = `${track.album.images[0].url}`;
        cover.alt = `album cover: ${track.album.name}`;

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const play = document.createElement('div');
        play.innerText = '▶︎';

        overlay.appendChild(play);
        trackLink.appendChild(cover);
        trackLink.appendChild(overlay);

        trackInfoLeft.appendChild(trackLink);

        const trackInfoRight = document.createElement('div');
        trackInfoRight.classList.add('track-info-right');

        const title = document.createElement('div');
        title.classList.add('track-title');
        title.innerHTML = `${track.name}`;

        const artist = document.createElement('div');
        artist.classList.add('track-artist');
        const namesArr = track.artists.map((art) => art.name);
        const names = namesArr.join(', ');
        artist.innerHTML = `${names}`;

        trackInfoRight.appendChild(title);
        trackInfoRight.appendChild(artist);

        trackInfo.appendChild(trackInfoLeft);
        trackInfo.appendChild(trackInfoRight);

        tracksContainer.appendChild(trackInfo);
      });
    }
    window.addEventListener('resize', verifyPageHeight);
    verifyPageHeight();
    updateFavoriteTracksSelection();

    const goBackBtn = document.querySelector('.go-back-btn');
    if (goBackBtn) {
      goBackBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    const clearSelectionBtn = document.querySelector('.clear-selection-btn');
    if (clearSelectionBtn) {
      clearSelectionBtn.addEventListener('click', clearSelection);
    }

    const getRecommendationsBtn = document.querySelector('.get-recommendations');
    if (getRecommendationsBtn) {
      getRecommendationsBtn.addEventListener('click', callGetRelatedArtists);
    }
  }
}

export function createViewWithRecommendedTracksFromData(data) {
  if (data != null) {
    const mainContainer = document.querySelector('.main-container');
    const userTracksContainer = document.querySelector('.user-tracks-container');

    if (mainContainer && userTracksContainer) {
      mainContainer.removeChild(userTracksContainer);
      mainContainer.innerHTML = `
      <div class="recommendation-tracks-container">
        <p>aqui estão nossas recomendações para você!</p>
        <div class="tracks-information-container">
        </div>
        <div class="btn-container">
        <button class="btn btn-large go-back-btn">refazer</button>
        <button class="btn btn-large btn-start save-playlist">salvar playlist</button>
        </div
      </div>
      `;
    }

    const tracksContainer = document.querySelector('.tracks-information-container');

    if (tracksContainer) {
      data.forEach((track) => {
        const trackInfo = document.createElement('div');
        trackInfo.classList.add('recommendation-track-information');
        trackInfo.dataset.artistid = `${track.artists[0].id}`;
        trackInfo.dataset.uri = `${track.uri}`;
        trackInfo.id = `${track.artists[0].id}`;

        const trackInfoLeft = document.createElement('div');
        trackInfoLeft.classList.add('track-info-left');

        const trackLink = document.createElement('a');
        trackLink.title = 'tocar no spotify';
        trackLink.target = '_blank';
        trackLink.href = `${track.external_urls.spotify}`;

        const cover = document.createElement('img');
        cover.src = `${track.album.images[0].url}`;
        cover.alt = `album cover: ${track.album.name}`;

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        const play = document.createElement('img');
        play.innerText = '▶︎';

        overlay.appendChild(play);
        trackLink.appendChild(cover);
        trackLink.appendChild(overlay);

        trackInfoLeft.appendChild(trackLink);

        const trackInfoRight = document.createElement('div');
        trackInfoRight.classList.add('track-info-right');

        const title = document.createElement('div');
        title.classList.add('track-title');
        title.innerHTML = `${track.name}`;

        const artist = document.createElement('div');
        artist.classList.add('track-artist');
        const namesArr = track.artists.map((art) => art.name);
        const names = namesArr.join(', ');
        artist.innerHTML = `${names}`;

        trackInfoRight.appendChild(title);
        trackInfoRight.appendChild(artist);

        trackInfo.appendChild(trackInfoLeft);
        trackInfo.appendChild(trackInfoRight);

        tracksContainer.appendChild(trackInfo);
      });
    }
    window.addEventListener('resize', verifyPageHeight);
    verifyPageHeight();

    const goBackBtn = document.querySelector('.go-back-btn');
    if (goBackBtn) {
      goBackBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    const savePlaylistBtn = document.querySelector('.save-playlist');
    if (savePlaylistBtn) {
      savePlaylistBtn.addEventListener('click', savePlaylist);
    }
  }
}
