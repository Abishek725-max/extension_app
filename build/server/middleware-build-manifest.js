self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/choose-wallet": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/choose-wallet.js"
    ],
    "/home": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/home.js"
    ],
    "/import-wallet": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/import-wallet.js"
    ],
    "/welcome": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/welcome.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];