JCatalog JS i18n package

project structure
-----------------

 build - destination folder for compiled/packaged files

 ```
 build             -- current working directory
 dist              -- contains minified files
 lib               -- source code in ES5 (npm module standard)
 src               -- contains source code
 test              -- test sources folder
 gulpfile.babel.js -- gulp configuration file (supports ES6)
 package.json      -- project dependencies file
 .babelrc          -- babel options
 .eslintrc         -- lint options
 .eslintignore     -- ignore files for lint tool
 .esdoc.json       -- esdoc options
 ```


test
-----------------

 Test available in sources folder with suffix <test>.spec.js

 available next goals:

 *npm test*  -- running tests based on *mocha*


build
-----------------

 The project package to grails plugins and install or deploy to maven repository

 available next goals:

 *npm run esdoc*           -- create documentation from sources

 *npm run plugin-package*  -- package plugin

 *npm run plugin-install*  -- install plugin to local repository (depends on package-plugin)

 *npm run plugin-deploy*   -- deploy plugin to remote repository (depends on package-plugin)


development
-----------------

 available next goals:

 *npm lint*      -- check errors/warnings in JavaScript and LESS/CSS

 *npm start*     -- build application and running *index.html* in browser

 *npm run proxy* -- running proxy


proxy
-----------------

You can override proxy options from config.js in project root with file *.proxyrc*

for example:

 ```
{
    "url": "http://divin:8080/jcdemo",
    "language": "en",
    "username": "jcadmin",
    "password": "jcadmin"
}
 ```

 Other resources
-----------------

[Documentation JavaScript](https://esdoc.org)

[Validate JavaScript](http://eslint.org)
