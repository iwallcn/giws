const SentryPlugin = require('webpack-sentry-plugin');
const packageJson = require('./package.json');
const path = require('path');

module.exports = {
  // webpackLoaders: {
  //   js: {
  //     test: '.tsx$',
  //     loaders: {
  //       'i118-loader': {
  //         options: {
  //           loaderoption: true,
  //           pattern: //
  //         },
  //       },
  //     },
  //   },
  // },
  plugins: [
    [
      'build-plugin-fusion',
      {
        themePackage: '@alifd/theme-for4px',
      },
    ],
  ],
  babelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@fpxfd/next',
        style: true,
      },
    ],
  ],
  proxy: {
    '/api': {
      enable: true,
      target: 'https://parttimer.test.i4px.com',
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  dll: true,
  router: {
    lazy: true,
  },
  modeConfig: {
    test: {
      define: {},
      vendor: true,
      plugins: [
        [
          'build-plugin-moment-locales',
          {
            locales: ['zh-cn', 'en-au'],
          },
        ],
      ],
    },
    prod: {
      define: {},
      vendor: true,
      plugins: [
        [
          'build-plugin-moment-locales',
          {
            locales: ['zh-cn', 'en-au'],
          },
        ],
        new SentryPlugin({
          organization: 'fpx-fe',
          project: 'giws',
          apiKey: 'c345a9192e444c249a421547d0af9db57aafb834ba5f454595e18f465c08a959',
          release: packageJson.version,
          include: /\.map$/,
          baseSentryURL: 'https://123.58.43.40:9000/api/0',
        }),
      ],
    },
  },
};
