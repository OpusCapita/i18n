// set node evn
process.env.NODE_ENV = 'test';

//polyfill async/await calls
require("babel-polyfill");
// register babel presets
require('babel-register')({
  presets: ['es2015', 'stage-0'],
  plugins: ['istanbul']
});
