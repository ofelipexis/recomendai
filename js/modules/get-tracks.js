import verifyPageHeight from './page-height.js';

function updateViewWithTracks(data) {
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
  }
  verifyPageHeight();
}

export default async function getTracks(token, timeRange, limit) {
  const timeRangeFormatted = timeRange.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  const params = new URLSearchParams();

  params.append('time_range', timeRangeFormatted);
  params.append('limit', limit);

  await fetch(`https://api.spotify.com/v1/me/top/tracks?${params.toString()}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status  ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      updateViewWithTracks(data);
      verifyPageHeight();
    })
    .finally();
}
