// eslint-disable-next-line import/no-cycle, import/named
import getTracks, { getRecommendedTracks, getRelatedArtists } from './get-tracks.js';

const className = 'selected';

export function updatePeriodButtons() {
  const periodSelectButtons = document.querySelectorAll('.period-select button');

  function updateClass(index) {
    periodSelectButtons.forEach((element) => {
      element.classList.remove(className);
    });
    periodSelectButtons[index].classList.add(className);
  }

  if (periodSelectButtons.length) {
    periodSelectButtons.forEach((element, index) => {
      element.addEventListener('click', () => {
        updateClass(index);
      });
    });
  }
}

export function updateQuantityButtons() {
  const quantitySelectButtons = document.querySelectorAll('.quantity-select button');

  function updateClass(index) {
    quantitySelectButtons.forEach((element) => {
      element.classList.remove(className);
    });
    quantitySelectButtons[index].classList.add(className);
  }

  if (quantitySelectButtons.length) {
    quantitySelectButtons.forEach((element, index) => {
      element.addEventListener('click', () => {
        updateClass(index);
      });
    });
  }
}

export async function callGetTracksFunction() {
  const btnGetTracks = document.querySelector('.get-tracks');

  if (btnGetTracks) {
    btnGetTracks.addEventListener('click', async () => {
      const periodContainer = document.querySelector('.period-select').children;
      const quantityContainer = document.querySelector('.quantity-select').children;

      if (periodContainer && quantityContainer) {
        const periodArray = Array.from(periodContainer);
        let periodSelected;
        periodArray.forEach((x) => {
          if (x.classList.contains('selected')) {
            periodSelected = x;
          }
        });

        const quantityArray = Array.from(quantityContainer);
        let quantitySelected;
        quantityArray.forEach((x) => {
          if (x.classList.contains('selected')) {
            quantitySelected = x;
          }
        });

        if (!periodSelected || !quantitySelected) {
          const getTracksContainer = document.querySelector('.get-tracks-container');
          if (getTracksContainer && btnGetTracks) {
            if (getTracksContainer.childElementCount <= 1) {
              const errorContainer = document.createElement('div');
              errorContainer.classList.add('error');
              errorContainer.innerHTML = 'o período e quantidade de músicas são itens obrigatórios';
              getTracksContainer.insertBefore(errorContainer, btnGetTracks);
            }
          }
        } else {
          const getTracksContainer = document.querySelector('.get-tracks-container');
          if (getTracksContainer.firstElementChild.classList.contains('error')) {
            getTracksContainer.removeChild(getTracksContainer.firstElementChild);
          }

          if (sessionStorage.getItem('access_token')) {
            const token = sessionStorage.getItem('access_token');
            const timeRange = periodSelected.id;
            const limit = quantitySelected.innerHTML;

            await getTracks(token, timeRange, limit);
          }
        }
      }
    });
  }
}

export async function callGetRelatedArtists() {
  const userTracksContainer = document.querySelector('.tracks-information-container');

  if (userTracksContainer) {
    const selecteds = userTracksContainer.querySelectorAll('.selected');

    const artistsIds = [];
    if (selecteds && selecteds.length > 0) {
      selecteds.forEach((element) => {
        if (!artistsIds.includes(element.dataset.artistid)) {
          artistsIds.push(element.dataset.artistid);
        }
      });
    }

    if (artistsIds.length > 0) {
      if (sessionStorage.getItem('access_token')) {
        const token = sessionStorage.getItem('access_token');
        const relatedArtists = await getRelatedArtists(token, artistsIds);

        const finalArtistsIds = [];
        if (relatedArtists.length > 18) {
          while (finalArtistsIds.length < 18) {
            const index = Math.floor(Math.random() * relatedArtists.length);
            if (!finalArtistsIds.includes(relatedArtists[index])) {
              finalArtistsIds.push(relatedArtists[index]);
            }
          }
        }
        await getRecommendedTracks(token, finalArtistsIds);
      }
    }
  }
}
