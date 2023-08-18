import '../css/style.css';
import { getAccessToken, verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken } from './modules/authentication.js';
import { updatePeriodButtons, updateQuantityButtons, callGetTracksFunction } from './modules/button-select.js';
import verifyPageHeight from './modules/page-height.js';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const mainContainer = document.querySelector('.main-container');
const startContainer = document.querySelector('.start-container');
const startButton = document.querySelector('.btn-start');

verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(startButton, params, clientId);

if (code || localStorage.getItem('code')) {
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

  if (!localStorage.getItem('access_token')) {
    localStorage.setItem('code', code);
    getAccessToken(clientId, code);
  }
  verifyPageHeight();
}

verifyPageHeight();
updatePeriodButtons();
updateQuantityButtons();
await callGetTracksFunction();
verifyPageHeight();

window.addEventListener('resize', verifyPageHeight);
