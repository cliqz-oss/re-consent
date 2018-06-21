# Cliqz Privacy Chrome Extension

This project was implemented with [Create React App](https://github.com/facebookincubator/create-react-app) and
[Storybook](https://github.com/storybooks/storybook).


## S3 deployment

[Website](http://cliqz.s3-website.eu-central-1.amazonaws.com/website/)
[Storybook](http://cliqz.s3-website.eu-central-1.amazonaws.com/storybook/)

## How to deploy

- Deploy Website command
`npm run deploy`

- Deploy Storybook command
`npm run deploy-storybook`

## Storybook

We use `@storybook/react@v4.0.0-alpha.9` to be able to use webpack 4.
These dependencies are required just for the storybook:
- babel-plugin-transform-decorators-legacy
- babel-preset-es2015


## Docker
Use the following commands to run everything in an isolated docker container.

- Run the development server: `docker-compose up`
- Run the tests: `docker-compose exec app npm run test`

*Note*: On MacOS High Sierra the file watchers don't always work reliable, that's why it is recommended to use docker instead.
