function generateCodeVerifier(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('verifier', verifier);

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('response_type', 'code');
  params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
  params.append('scope', 'user-read-private user-read-email');
  params.append('code_challenge_method', 'S256');
  params.append('code_challenge', challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem('verifier');

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URI);
  params.append('code_verifier', verifier);

  await fetch('https://accounts.spotify.com/api/token?', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status  ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem('access_token', data.access_token);
    })
    .catch((error) => {
      throw new Error(`Error: ${error}`);
    });
}

export function verifyCodeAndRedirectToAuthCodeFlowOrGetAccessToken(element, params, clientId) {
  element.addEventListener('click', () => {
    let code = params.get('code');
    if (!code) {
      redirectToAuthCodeFlow(clientId);
    }
    code = params.get('code');
    getAccessToken(clientId, code);
  });
}
