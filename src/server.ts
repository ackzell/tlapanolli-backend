import { OAuth2Client } from '@cmd-johnson/oauth2-client';
import { Application, Router } from '@oak/oak';
import { Session } from '@oak_sessions';
import 'jsr:@std/dotenv/load';

type AppState = {
  session: Session;
};

const app = new Application<AppState>();
const router = new Router<AppState>();

// Spotify OAuth2 configuration
const clientId = Deno.env.get('SPOTIFY_CLIENT_ID')!;
const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
const redirectUri = Deno.env.get('SPOTIFY_REDIRECT_URI');

const oauth2Client = new OAuth2Client({
  clientId,
  clientSecret,
  redirectUri,
  authorizationEndpointUri: 'https://accounts.spotify.com/authorize',
  tokenUri: 'https://accounts.spotify.com/api/token',
});

router.get('/', (ctx) => {
  ctx.response.body = 'Hello World!';
});

router.get('/login', async (ctx) => {
  const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri({
    state: 'some_random_state_string',
  });

  console.log('code verifier', codeVerifier);

  // console.log('Authorization URL:', uri);
  // console.log('Redirect URI:', redirectUri);
  // console.log('Client ID:', clientId);

  ctx.state.session.flash('codeVerifier', codeVerifier);
  ctx.response.redirect(uri);
});

router.get('/callback', async (ctx) => {
  // In both cases, your app should compare the state parameter that it received in the redirection URI with the state parameter it originally provided to Spotify in the authorization URI. If there is a mismatch then your app should reject the request and stop the authentication flow.

  const codeVerifier = ctx.state.session.get('codeVerifier') as string;

  if (!codeVerifier) {
    ctx.response.status = 400;
    ctx.response.body = 'Code verifier not found in session';
    return;
  }

  // get the token now
  const { accessToken } = await oauth2Client.code.getToken(ctx.request.url, {
    codeVerifier,
  });

  // Use the access token to make an authenticated API request
  const userResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const user = await userResponse.json();

  ctx.response.body = `Hello, ${JSON.stringify(user, null, 2)}!`;
});

console.log('Cert Path:', Deno.realPathSync('./127.0.0.1.pem'));
console.log('Key Path:', Deno.realPathSync('./127.0.0.1-key.pem'));

app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server running on https://127.0.0.1:8888');
await app.listen({
  port: 8888,
  secure: true,
  cert: Deno.readTextFileSync('./127.0.0.1.pem'),
  key: Deno.readTextFileSync('./127.0.0.1-key.pem'),
});
