var WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = { 
  // where to start the bundling process
  entry: "./public/index.js",
  output: {
    path: __dirname + "./public/dist",
    filename: "bundle.js"
  }, 
  // bundle files on production
  mode: "production",
 
  plugins: [
  new WebpackPwaManifest({ 
    fingerpring: false,
    name: 'budget-pwa',
    short_name: 'budget-pwa',
    description: 'A budget tracking progressive web app.',
    background_color: '#fff',
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: path.resolve('public/icons/icon-192x192.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      }
      
    ]
  })
]}; 


module.exports = config;
