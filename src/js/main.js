import '../css/style.css';
import { verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken } from './modules/authentication.js';
import {
  updatePeriodButtons, updateQuantityButtons,
  callGetTracksFunction,
  acceptTerms,
  openTerms,
} from './modules/button-functions-utils.js';
import { createSelectionView } from './modules/create-view-utils';
import verifyPageHeight from './modules/page-height.js';

const clientId = import.meta.env.VITE_CLIENT_ID;
const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const mainContainer = document.querySelector('.main-container');
const startContainer = document.querySelector('.start-container');
const startButton = document.querySelector('.btn-start');

verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(startButton, params, clientId);
createSelectionView(code, clientId, mainContainer, startContainer);
verifyPageHeight();
updatePeriodButtons();
updateQuantityButtons();
callGetTracksFunction();
verifyPageHeight();
acceptTerms();
openTerms();
window.addEventListener('resize', verifyPageHeight);
