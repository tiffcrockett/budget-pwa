var WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = { 
  // where to start the bundling process
  entry: "./public/index.js",
  output: {
    path: __dirname + "./public/dist",
    filename: "bundle.js"
  }, 
  // bundle files on production, not while in dev
  mode: "productions"
}; 
 
plugins: [
  new WebpackPwaManifest({
    name: 'budget-pwa',
    short_name: 'budget-pwa',
    description: 'A budget tracking progressive web app.',
    background_color: '#fff',
    crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    icons: [
      {
        src: path.resolve('src/assets/icon.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      },
      {
        src: path.resolve('src/assets/large-icon.png'),
        size: '1024x1024' // you can also use the specifications pattern
      },
      {
        src: path.resolve('src/assets/maskable-icon.png'),
        size: '1024x1024',
        purpose: 'maskable'
      }
    ]
  })
]

module.exports = config;
