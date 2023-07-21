import './style.css';
import { getAccessToken, verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken } from './authentication.js';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

const buttonContainer = document.querySelector('#button-container');
const startButton = document.querySelector('#vai');

verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(startButton, params, clientId);

if (code || localStorage.getItem('code')) {
  buttonContainer.removeChild(startButton);
  const authorizeButton = document.createElement('button');
  authorizeButton.innerHTML = 'Code Deu certo';
  buttonContainer.appendChild(authorizeButton);
  localStorage.setItem('code', code);

  if (!localStorage.getItem('access_token')) {
    getAccessToken(clientId, code);
  }
}
