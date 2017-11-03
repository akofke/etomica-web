# etomica-web
Web-app frontend for the Etomica server.

## Running locally
Follow these steps to serve the app locally in development mode. Requires nodejs to build ([yarn](yarnpkg.com) is recommended in place
of `npm` in order to stay in sync with the lockfile, although both will work).

* Run `npm install` (or `yarn install`)
* If necessary, create a `.env` file specifying the server address (See `.env.example`). This isn't needed if running the
server locally on the default port
* Run `npm start` (or `yarn start`)
* Ensure the etomica server is started
* Browse to `localhost:9000`
