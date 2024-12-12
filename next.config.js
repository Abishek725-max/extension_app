// next.config.js
const path = require("path");

module.exports = {
  output: process.env.EXTENSION_BUILD ? "export" : undefined,
  distDir: "build",
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      // Make sure the extension runs in the browser
      config.target = "web";
    }
    return config;
  },
};
