export function updateFavoriteTracksSelection() {
  const tracks = document.querySelectorAll('.track-information');
  const selected = 'selected';

  if (tracks.length) {
    tracks.forEach((element) => {
      element.addEventListener('click', () => {
        if (element.classList.contains(selected)) {
          element.classList.remove(selected);
        } else {
          element.classList.add(selected);
        }
      });
    });
  }
}

export function clearSelection() {
  const tracks = document.querySelectorAll('.track-information');
  const selected = 'selected';

  if (tracks.length) {
    tracks.forEach((element) => {
      element.classList.remove(selected);
    });
  }
}
