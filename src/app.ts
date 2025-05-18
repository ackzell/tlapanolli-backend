import type { PinoLogger } from 'hono-pino';

import { generateCodeVerifier, OAuth2Client } from '@badgateway/oauth2-client';
import { OpenAPIHono } from '@hono/zod-openapi';
import { requestId } from 'hono/request-id';
import { serveEmojiFavicon } from 'stoker/middlewares';

import { appEnv } from './env.js';
import { appLogger } from './middlewares/app-logger.js';

interface AppBindings {
  Variables: {
    logger: PinoLogger;
    session: { [key: string]: any };
  };
}

export const app = new OpenAPIHono<AppBindings>();
app
  .use(serveEmojiFavicon('🎧'))
  .use(requestId())
  .use(appLogger());

const client = new OAuth2Client({

  // The base URI of your OAuth2 server
  server: 'https://accounts.spotify.com',

  // OAuth2 client id
  clientId: appEnv.SPOTIFY_CLIENT_ID,

  // OAuth2 client secret. Only required for 'client_credentials', 'password'
  // flows. Don't specify this in insecure contexts, such as a browser using
  // the authorization_code flow.
  clientSecret: appEnv.SPOTIFY_CLIENT_SECRET,

  // The following URIs are all optional. If they are not specified, we will
  // attempt to discover them using the oauth2 discovery document.
  // If your server doesn't have support this, you may need to specify these.
  // you may use relative URIs for any of these.

  // Token endpoint. Most flows need this.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /token
  tokenEndpoint: 'https://accounts.spotify.com/api/token',

  // Authorization endpoint.
  //
  // You only need this to generate URLs for authorization_code flows.
  // If not specified we'll use the information for the discovery document
  // first, and otherwise default to /authorize
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',

  // OAuth2 Metadata discovery endpoint.
  //
  // This document is used to determine various server features.
  // If not specified, we assume it's on /.well-known/oauth2-authorization-server
  // discoveryEndpoint: '/.well-known/oauth2-authorization-server',

});

const codeVerifier = await generateCodeVerifier();
let redirectUri: string;

let user: unknown;

app.get('/login', async (c) => {
  redirectUri = await client.authorizationCode.getAuthorizeUri({

    // URL in the app that the user should get redirected to after authenticating
    redirectUri: 'https://127.0.0.1:8888/callback',

    // Optional string that can be sent along to the auth server. This value will
    // be sent along with the redirect back to the app verbatim.
    state: 'some-string',

    codeVerifier,

    scope: [
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-private',
      'playlist-modify-public',
    ],

  });

  // const userProfile = await sdk.currentUser.profile();
  // console.log(userProfile);

  return c.redirect(redirectUri);
});

app.get('/callback', async (c) => {
  const oauth2Token = await client.authorizationCode.getTokenFromCodeRedirect(
    c.req.url,
    {
      /**
       * The redirect URI is not actually used for any redirects, but MUST be the
       * same as what you passed earlier to "authorizationCode"
       */
      redirectUri: 'https://127.0.0.1:8888/callback',

      /**
       * This is optional, but if it's passed then it also MUST be the same as
       * what you passed in the first step.
       *
       * If set, it will verify that the server sent the exact same state back.
       */
      state: 'some-string',

      codeVerifier,

    },
  );

  const userResponse = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${oauth2Token.accessToken}`,
    },
  });
  user = await userResponse.json();

  c.var.logger.info(JSON.stringify(user, null, 2));

  return c.redirect('/welcome');
});

app.get('/welcome', (c) => {
  return c.text(`Welcome ${user.display_name}! ${JSON.stringify(user)}, null, 2)}`);
});

app.get('/error', (c) => {
  c.var.logger.info('lol');
  throw new Error('This is an error');
});

// app.notFound(notFound);
// app.onError(onError);
