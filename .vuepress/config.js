const themeConfig = require("./config/theme/index.js");
const plugins = require("./config/plugins/index.js");

module.exports = {
  title: "kory's blog",
  description: "",
  dest: "public",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig,
  plugins,
  markdown: {
    lineNumbers: true,
  },
};
