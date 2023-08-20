import { getAccessToken } from './authentication.js';
import { updateFavoriteTracksSelection, clearSelection } from './buttons/favorite-tracks-selection.js';
import verifyPageHeight from './page-height.js';

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
          <button id="shortTerm" class="selection-btn">últimos 30 dias</button>
          <button id="mediumTerm" class="selection-btn">últimos 6 meses</button>
          <button id="longTerm" class="selection-btn">desde o início</button>
        </div>
      </div>
      
      <div class="selection">
        <div class="selection-text">
          <p>e a quantidade de músicas</p>
        </div>
        <div class="btn-container quantity-select">
          <button class="selection-btn">9</button>
          <button class="selection-btn">12</button>
          <button class="selection-btn">15</button>
          <button class="selection-btn">18</button>
        </div>
        
        <div class="get-tracks-container">
          <button class="btn-start get-tracks">vamos lá!</button>
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
        <button class="go-back-btn">voltar</button>
        <button class="clear-selection-btn">limpar</button> 
        <button class="btn-start">recomenda<span>í</span></button>
        </div
      </div>
      `;
    }

    const tracksContainer = document.querySelector('.tracks-information-container');

    if (tracksContainer) {
      data.items.forEach((track) => {
        const trackInfo = document.createElement('div');
        trackInfo.classList.add('track-information');

        const trackInfoLeft = document.createElement('div');
        trackInfoLeft.classList.add('track-info-left');

        const cover = document.createElement('img');
        cover.src = `${track.album.images[0].url}`;
        cover.alt = `album cover: ${track.album.name}`;

        trackInfoLeft.appendChild(cover);

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
    verifyPageHeight();
    updateFavoriteTracksSelection();

    const clearSelectionBtn = document.querySelector('.clear-selection-btn');

    if (clearSelectionBtn) {
      clearSelectionBtn.addEventListener('click', clearSelection);
    }
  }
}
