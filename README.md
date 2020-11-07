# Leap Solve
(formerly Fixit)

Currently in the MVP stage, with a rough outline of the site.

Next steps: UX research and development, connection to payment, double-checking security.

## Background

[Our shared Drive folder](https://drive.google.com/open?id=1m1cRBFJL6mqw5iE-AGBzxziGWcfd9i-i)
contains all the references for the site. The outline is similar to what the product will look like in Beta. However LeapSolve Specs and LeapSolve todos contain the most up-to-date requirements for the MVP.

## Technologies

All code is JavaScript, using the library [React](https://reactjs.org/) for the frontend of the site. We initially set this up through [Create React App](https://create-react-app.dev/), a quick and dirty way to build a site outline using [Node](https://nodejs.org/en/). We also use [Elastic UI](https://elastic.github.io/eui/#/) library for all our UI design. On the Elastic site you can take snippets of code for different UI features, all built for ReactJS.

The backend of the site is built around [Firebase](https://firebase.google.com/), a google-owned app development platform. It's got some really cool, easy-to-use features and a good free tier for starting out. Right now we use [Authentication](https://firebase.google.com/products/auth) to handle user accounts, [Realtime Database](https://firebase.google.com/products/realtime-database) as a NoSQL database with mostly painless realtime query/sync ability, and [Cloud Functions](https://firebase.google.com/products/functions) as the bulk of the  backend logic. The backend is a little odd because of Firebase: more logic than usual is pushed to the frontend, and the realtime database has json rules to ensure what is coming from the frontend is alright. Cloud functions usually are triggered by changes in the database, but sometimes are triggered for other reasons or attempted to be called by users.


## Directory Structure

Most of our code is in `src/components`.

From there we have `Firebase`, which holds all methods for communicating with
Firebase's Authentication system, Realtime Database, Cloud Functions, and eventually the File Storage system. We plan on splitting up this obnoxiously long file at some point but it would  mess up the context system we've set up for Firebase accesses.

`Session` holds the context for a logged-in user's basic session data.

Inside `Solvers` is all of the material for the solvers' website. Likewise for `Users`. Components shared between them is in `Common`.


## Commands

Running locally (changes you make that connect to Firebase will still edit the overall backend): Can run `yarn start` and view at [http://localhost:3000](http://localhost:3000).

Running tests (we haven't set this up yet): `yarn test` to launch an interactive test runner.

Building the site (haven't gotten to this stage of course): `yarn build` to build the app for production inside the `build` folder.

For a one-way conversion out of the basic CRA setup, `yarn eject`.

## Helpful Topics about CRA

This was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
