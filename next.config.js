// next.config.js
const path = require("path");

module.exports = {
  output: process.env.EXTENSION_BUILD ? "export" : undefined,
  distDir: "build",
  // reactStrictMode: true,
  // exportPathMap: async function () {
  //   return {
  //     "/": { page: "/" },
  //   };
  // },
};
