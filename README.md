# Tlapanōlli
Tlapanōlli derives from the Nahuatl root verb panō, which means "to cross over," "to traverse," or "to pass through." The prefix tla- indicates an object or thing receiving the action, and the suffix -ōlli denotes something that has already undergone the action (a past participle).

Thus, this is [the backend of an] an app to help duplicate (effectively migrate, or "to cross from one side to another") Spotify playlists to Tidal.

We'll see how far we can go.

This is an Oak app (Deno based).


## Requirements
* This is being served via `https`, I used `mkcert` to generate a certificate for `127.0.0.1`. So the cert and key files must be created and should be available to the oak server before starting.

## Running it
```bash
deno task start
```
