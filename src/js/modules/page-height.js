export default function verifyPageHeight(event) {
  if (event) {
    event.preventDefault();
  }

  const windowHeight = window.innerHeight;
  const headerHeight = document.querySelector('.header-container').offsetHeight;
  const mainHeight = document.querySelector('.main-container').offsetHeight;
  const footerHeight = document.querySelector('.footer-container').offsetHeight;
  const footer = document.querySelector('footer');

  if (mainHeight <= windowHeight - (headerHeight + footerHeight)) {
    footer.classList.add('bottom-0');
  } else if (footer.classList.contains('bottom-0')) {
    footer.classList.remove('bottom-0');
  }
}
