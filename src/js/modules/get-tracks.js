import verifyPageHeight from './page-height.js';
// eslint-disable-next-line import/no-cycle, no-unused-vars
import { createViewWithRecommendedTracksFromData, createViewWithTracksFromData } from './create-view-utils.js';
import { getUserId } from './authentication.js';

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
        if (response.status === 401) {
          sessionStorage.clear();
          window.location.reload();
        }
        throw new Error(`HTTP status  ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      createViewWithTracksFromData(data);
      verifyPageHeight();
    })
    .finally();
}

export async function getRelatedArtists(token, artistsIds) {
  const relatedArtists = [];
  const fetchPromises = artistsIds.map(async (id) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.clear();
        window.location.reload();
      }
      throw new Error(`HTTP status  ${response.status}`);
    }

    const data = await response.json();

    if (data != null) {
      data.artists.forEach((artist) => {
        if (!relatedArtists.includes(artist.id)) {
          relatedArtists.push(artist.id);
        }
      });
    }
  });

  await Promise.all(fetchPromises);
  return relatedArtists;
}

export async function getRecommendedTracks(token, finalArtistsIds) {
  const recommendations = [];
  const fetchPromises = finalArtistsIds.map(async (id) => {
    const response = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=BR`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        sessionStorage.clear();
        window.location.reload();
      }
      throw new Error(`HTTP status  ${response.status}`);
    }

    const data = await response.json();

    if (data != null) {
      const index = Math.floor(Math.random() * data.tracks.length);
      recommendations.push(data.tracks[index]);
    }
  });

  await Promise.all(fetchPromises);
  createViewWithRecommendedTracksFromData(recommendations);
  verifyPageHeight();
}

export async function savePlaylist() {
  if (sessionStorage.getItem('access_token')) {
    const token = sessionStorage.getItem('access_token');
    const userId = await getUserId(token);

    if (userId) {
      const date = new Date();
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');

      const body = {
        name: `recomendaí #${year}-${month}-${day}`,
        description: '',
        public: true,
      };

      const responseCreatePlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!responseCreatePlaylist.ok) {
        if (responseCreatePlaylist.status === 401) {
          sessionStorage.clear();
          window.location.reload();
        }
        throw new Error(`HTTP status  ${responseCreatePlaylist.status}`);
      }

      const data = await responseCreatePlaylist.json();

      if (data != null) {
        const playlistId = data.id;
        const tracks = document.querySelectorAll('.recommendation-track-information');
        const uris = [];

        if (tracks) {
          tracks.forEach((track) => {
            uris.push(track.dataset.uri);
          });
        }

        if (uris !== '') {
          const uriBody = {
            uris,
          };

          const responseAddTracksToPlaylist = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(uriBody),
          });

          if (responseAddTracksToPlaylist.status !== 201) {
            if (responseAddTracksToPlaylist.status === 401) {
              sessionStorage.clear();
              window.location.reload();
            }
            throw new Error(`HTTP status  ${responseAddTracksToPlaylist.status}`);
          }

          await responseAddTracksToPlaylist.json();
        }

        const playlistSavedModal = document.querySelector('#playlist-container');
        const accessPlaylistBtn = document.querySelector('.btn-playlist');
        const closePlaylistModal = document.querySelector('#close-playlist');

        if (playlistSavedModal && accessPlaylistBtn && closePlaylistModal) {
          accessPlaylistBtn.href = `${data.external_urls.spotify}`;
          playlistSavedModal.style.display = 'block';

          closePlaylistModal.addEventListener('click', () => {
            playlistSavedModal.style.display = 'none';
          });
        }
      }
    }
  }
}
