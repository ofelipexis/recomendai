import '../css/style.css';
import { getAccessToken, verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken } from './modules/authentication.js';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

function verifyPageHeight(event) {
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

verifyPageHeight();
window.addEventListener('resize', verifyPageHeight);

const buttonContainer = document.querySelector('#button-container');
const startButton = document.querySelector('#vai');

verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(startButton, params, clientId);

if (code || localStorage.getItem('code')) {
  buttonContainer.removeChild(startButton);
  const authorizeButton = document.createElement('button');
  authorizeButton.innerHTML = 'Code Deu certo';
  buttonContainer.appendChild(authorizeButton);

  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('code', code);
    getAccessToken(clientId, code);
  }
}
