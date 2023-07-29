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

const mainContainer = document.querySelector('.main-container');
const startContainer = document.querySelector('.start-container');

verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(startContainer, params, clientId);

if (code || localStorage.getItem('code')) {
  mainContainer.removeChild(startContainer);
  // const authorizeButton = document.createElement('button');
  mainContainer.innerHTML = `
  <div class="selection-container">
    <div class="selection">
      <div class="selection-text">
        <p>escolha o período</p>
      </div>
      <div class="btn-container">
        <button class="selection-btn">últimos 30 dias</button>
        <button class="selection-btn">últimos 6 meses</button>
        <button class="selection-btn">desde o início</button>
      </div>
    </div>
    
    <div class="selection">
      <div class="selection-text">
        <p>e a quantidade de músicas</p>
      </div>
      <div class="btn-container">
        <button class="selection-btn">10</button>
        <button class="selection-btn">15</button>
        <button class="selection-btn">20</button>
        <button class="selection-btn">25</button>
      </div>
      
      <div class="get-tracks-container">
        <button class="btn-start get-tracks">vamos lá!</button>
      </div>
      
    </div>
  </div>
  `;
  mainContainer.classList.add('decrease-padding');

  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('code', code);
    getAccessToken(clientId, code);
  }
}

window.addEventListener('resize', verifyPageHeight);
