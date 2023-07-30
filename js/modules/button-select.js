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
