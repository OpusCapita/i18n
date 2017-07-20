## [v1.0.15-rc.1](https://github.com/OpusCapita/i18n/compare/v1.0.14...v1.0.15-rc.1) (Thu, 20 Jul 2017 07:28:57 GMT)
 - Updating README.md (Alexey Sergeev <sab@scand.com>, 5d68fb9)
 - Switch to plain/flat bundle structure (#6)
    
    * Redevelop getMessage method to support plain messages object structure e.g. message key/path 'a.b' would mean that message could be stored either by property named 'a.b' or using corresponding object path e.g. {a: {b: '..'}}
    
    * Depreacting old way of registering locale message bundles using structure:
    ```javascript
    [
      {locales: ['en'], messages: {yes: 'jes'}}
      {locales: ['de'], messages: {yes: 'ja'}}
    ]
    ```
    Use the following notation instead:
    ```javascript
    {
      'en': {yes: 'jes'},
      'de': {yes: 'ja'}
    }
    ```
    Also constructor signature
    ```javascript
    new I18nManager(locale, localeBundles, localeFormattingInfo, fallbackLocale)
    ```
    is deprecated , user the following constructor instead:
    ```javascript
    new I18nManager({locale, localeFormattingInfo, fallbackLocale})
    ```
    message bundles registration should be done using 'register' method.
    * Renaming goal 'testonly' to 'test-only'
    * Fixing code styles. Updating dev dependencies. (Alexey Sergeev <sab@scand.com>, 72851de)

## [v1.0.14](https://github.com/OpusCapita/i18n/compare/v1.0.13...v1.0.14) (Thu, 15 Jun 2017 10:44:19 GMT)
 - Merge pull request #3 from OpusCapita/issue/2
    
     #2 i18nManager.getMessage("A B") can't get messages with spaces (e1978ab 114389a, 0338577)
 - #2 i18nManager.getMessage("A B") can't get messages with spaces (Kirill Volkovich <volkovich@scand.com>, 114389a)

## [v1.0.13](https://github.com/OpusCapita/i18n/compare/v1.0.12...v1.0.13) (Mon, 29 May 2017 20:07:10 GMT)
 - Updating project info after migration from OpusCapitaBES organization to OpusCapita (Alexey Sergeev <sab@scand.com>, 5340b61)

## [v1.0.12](https://github.com/OpusCapita/i18n/compare/v1.0.11...v1.0.12) (Wed, 05 Apr 2017 13:09:00 GMT)
 - Freeze dependency version (Kirill Volkovich <volkovich@scand.com>, ea90d02)
 - Add babel-plugin-lodash
    
    It should reduce size of bundle and transpiled components (Kirill Volkovich <volkovich@scand.com>, 58d53ef)

## [v1.0.11](https://github.com/OpusCapita/i18n/compare/v1.0.10...v1.0.11) (Tue, 04 Apr 2017 07:48:16 GMT)
 - Fixed lodash version: 4.17.2 (Kirill Volkovich <volkovich@scand.com>, bcbc96e)

## [v1.0.10](https://github.com/OpusCapita/i18n/compare/v1.0.8...v1.0.10) (Thu, 23 Mar 2017 11:03:55 GMT)
 - Path version (Kirill Volkovich <volkovich@scand.com>, 2625970)
 - (RFQ-463) Fixed 'getMessage()' bug when only first arg occurence has been replaced (Kirill Volkovich <volkovich@scand.com>, 13a8989)
 - Merge pull request #1 from amourzenkov-sc/patch-1
    
    Minor wording corrections in README.md (cf97cac 8d4ccde, 755a69b)
 - Minor wording corrections in README.md (Andrei Mourzenkov <amourzenkov-sc@users.noreply.github.com>, 8d4ccde)

## [v1.0.8](https://github.com/OpusCapita/i18n/compare/v1.0.7...v1.0.8) (Tue, 03 Jan 2017 10:44:59 GMT)
 - (CMMN-5115) Fixed bug. (Dmitriy Sanko <dmitriy.sanko@jcatalog.com>, f7d1c14)
 - Fixing format number when numberDecimalSeparatorUseAlways=true (Dmitry Divin <dmitry.divin@jcatalog.com>, c816ce9)

## [v1.0.7](https://github.com/OpusCapita/i18n/compare/v1.0.6...v1.0.7) (Thu, 15 Dec 2016 07:47:40 GMT)
 - Fixed readme (kirillvolkovich <kirill.volkovich@jcatalog.com>, 1db6157)

## [v1.0.6](https://github.com/OpusCapita/i18n/compare/v1.0.5...v1.0.6) (Wed, 14 Dec 2016 14:43:19 GMT)
 - 1.0.6 (kirillvolkovich <kirill.volkovich@jcatalog.com>, 1693655)

## [v1.0.5](https://github.com/OpusCapita/i18n/compare/v1.0.4...v1.0.5) (Wed, 14 Dec 2016 14:41:06 GMT)
 - Moved '@opuscapita/npm-scripts' => 'opuscapita-npm-scripts (kirillvolkovich <kirill.volkovich@jcatalog.com>, 86cdd13)

## [v1.0.4](https://github.com/OpusCapita/i18n/compare/v1.0.3...v1.0.4) (Wed, 14 Dec 2016 14:11:13 GMT)
 - Prepared to publish public to npm registry (kirillvolkovich <kirill.volkovich@jcatalog.com>, 9da7dc5)
 - Added 'LICENSE' file (kirillvolkovich <kirill.volkovich@jcatalog.com>, c3e7cbf)
 - Moved to Jenkinsfile buildprocess (kirillvolkovich <kirill.volkovich@jcatalog.com>, 0e807cd)
 - Update README.md (Kirill Volkovich <kirill.volkovich@jcatalog.com>, a2c1cd4)
 - Update README.md (Kirill Volkovich <kirill.volkovich@jcatalog.com>, b662ae6)
 - Update README.md (Daniel <daniilzhitomirsky@gmail.com>, fdc0973)
 - Update README.md (Daniel <daniilzhitomirsky@gmail.com>, 646da44)
 - Fixed lint. (kirillvolkovich <kirill.volkovich@jcatalog.com>, 88d5e70)

## [v1.0.3](https://github.com/OpusCapita/i18n/compare/v1.0.2...v1.0.3) (Wed, 07 Dec 2016 09:46:40 GMT)
 - Fixed build. (kirillvolkovich <kirill.volkovich@jcatalog.com>, b94db40)

## [v1.0.2](https://github.com/OpusCapita/i18n/compare/v1.0.1...v1.0.2) (Wed, 07 Dec 2016 08:49:45 GMT)
 - 'moment-jdateformatparser' dependency moved to local. Purpose: 'yarn' 0.19.x package manager can't resolve dependencies with specified commit hash. (kirillvolkovich <kirill.volkovich@jcatalog.com>, a62d4de)
 - Removed odd code. (volkovich <Kirill.Volkovich@jCatalog.com>, e27becf)

## [v1.0.1](https://github.com/OpusCapita/i18n/compare/v1.0.0...v1.0.1) (Sun, 27 Nov 2016 15:39:21 GMT)
 - Fixed lint errors. (volkovich <Kirill.Volkovich@jCatalog.com>, 7ee0280)
 - Fixed - DateConverter constructor call throws error if no `format` argument specified. (volkovich <Kirill.Volkovich@jCatalog.com>, 359b02e)
 - Fixed typos. (volkovich <Kirill.Volkovich@jCatalog.com>, 6bb6c1f)
 - Improved test of DateConverter. (volkovich <Kirill.Volkovich@jCatalog.com>, 1073634)
 - Fixed tests running. (volkovich <Kirill.Volkovich@jCatalog.com>, 09f68f6)
 - Sorted dependny list by alphabet order. (volkovich <Kirill.Volkovich@jCatalog.com>, 52a4200)
 - Update README.md (Kirill Volkovich <kirill.volkovich@jcatalog.com>, f3d87d9)
 - Update README.md (Kirill Volkovich <kirill.volkovich@jcatalog.com>, 72a3555)

## [v1.0.0](https://github.com/OpusCapita/i18n/compare/undefined...v1.0.0) (Fri, 25 Nov 2016 06:29:47 GMT)
 - Updgrading/adjusting dependencies. Set up new package name to @opuscapita/i18n and version to 1.0.0. Cleaup README and CHANGES. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 799a6f9)
 - Fixed NumberConverter bug when 'stringToValue' method returns string. (volkovich <Kirill.Volkovich@jCatalog.com>, d803295)
 - Improved tests of NumberConverter. (volkovich <Kirill.Volkovich@jCatalog.com>, 3a8972a)
 - Revert "Updated CHANGES.txt"
    
    This reverts commit 175bd4d3aa5b23938d387fcdd32e66d8c8c8b6bc. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, f21b4a7)
 - Updating to compatible dependency versions (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 348dc3c)
 - Adding more tests. Adding test coverage monitoring (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 72eab76)
 - Revert "Moved to the latest dependencies."
    
    This reverts commit 96b5dc8069cff351bd94f219f09373ca4608c486. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 092562b)
 - Revert "Updated CHANGES.txt"
    
    This reverts commit d481f93c3fd8d3d53967d806a6716cff9b159063. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, d8e3fc0)
 - Moved to the latest dependencies. (Daniel Zhitomirsky <danielzhitomirsky@MacBook-Pro-Daniel.local>, 96b5dc8)
 - (CMMN-5044) Cleaup code. Throwing TypeError in case when not a number is passed to NumberConverter.valueToString and when not a string is passed to NumberConverter.stringToValue, if null is passed null will be returted from both methods. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, e252a41)
 - (CMMN-5044) Added throwing exception if integer number is too big. (volkovich <Kirill.Volkovich@jCatalog.com>, 837890d)
 - (CMMN-5044) Fixed problem when the integer part of number has 7 and more symbols. (volkovich <Kirill.Volkovich@jCatalog.com>, d0bf57c)
 - (CMMN-5044) Added tests for formatDecimalNumber method. (volkovich <Kirill.Volkovich@jCatalog.com>, c5b2936)
 - Fix version lodash (Dmitry Divin <dmitry.divin@jcatalog.com>, 1db2d43)
 - Fixing lint (Dmitry Divin <dmitry.divin@jcatalog.com>, f116672)
 - (CMMN-4989) Removing underscore with deps & moment-timezone (Dmitry Divin <dmitry.divin@jcatalog.com>, 4c5e8b1)
 - Added dateTime pattern support (Sergey Korsik <ksy@scand.local>, d358a60)
 - Updated dev-tools version. (dzhitomirsky <dzhitomirsky@jcatalog.com>, c61043a)
 - Updating dev tools dependency (Dmitry Divin <dmitry.divin@jcatalog.com>, af3d332)
 - Fixed version. (dzhitomirsky <dzhitomirsky@jcatalog.com>, 8858cee)
 - Removed odd dependency. (dzhitomirsky <dzhitomirsky@jcatalog.com>, de031de)
 - Refactored buil process. (dzhitomirsky <dzhitomirsky@jcatalog.com>, d6ea90f)
 - Updating dependencies (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 9305859)
 - Updating version (Dmitry Divin <dmitry.divin@jcatalog.com>, 98f53ca)
 - Using release version of eslint-config-jcatalog module (Alexey Sergeev <alexey.sergeev@jcatalog.com>, b634635)
 - Apply jcatalog ESLint styles. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 675380d)
 - Set up new '1.2.0' version after release (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 985eca1)
 - (PIM-10996) Added name field for ParseError (Michael Pritchin <michael.pritchin@jcatalog.com>, 4c2e679)
 - Rollback changes (Dmitry Divin <dmitry.divin@jcatalog.com>, 96a9164)
 - Fixing publish dev (Dmitry Divin <dmitry.divin@jcatalog.com>, 9149414)
 - Updating package.json (Dmitry Divin <dmitry.divin@jcatalog.com>, a4665ed)
 - Cleaning code (Dmitry Divin <dmitry.divin@jcatalog.com>, ff7180e)
 - Updating version (Dmitry Divin <dmitry.divin@jcatalog.com>, 103907e)
 - Fixing index.js (Dmitry Divin <dmitry.divin@jcatalog.com>, 6885f57)
 - Updating version (Dmitry Divin <dmitry.divin@jcatalog.com>, edef343)
 - Updating package.json (Dmitry Divin <dmitry.divin@jcatalog.com>, 404611d)
 - (CMMN-4795) Implementing build process for npm module (Dmitry Divin <dmitry.divin@jcatalog.com>, efe9ab7)
 - Set up 0.1.0-SNAPSHOT version (Alexey Sergeev <alexey.sergeev@jcatalog.com>, bacf173)
 - Set up 0.1.0 version (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 3df5ac8)
 - 8.0.1-0 (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 132635e)
 - Setup engines versions (Alexey Sergeev <alexey.sergeev@jcatalog.com>, a1f5038)
 - Fixing build (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 4a8d884)
 - Using fixed dependency version. Use LTS node/npm engines. (Alexey Sergeev <alexey.sergeev@jcatalog.com>, 201da19)
 - Fixed browserify build. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, 2e6ac73)
 - Reimplemented webpack workflow. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, 92d9779)
 - (PIM-10743) Fixed package.json (Michael Pritchin <michael.pritchin@jcatalog.com>, 7eefc06)
 - (PIM-10743) Fixed package.json (Michael Pritchin <michael.pritchin@jcatalog.com>, 464d9c4)
 - Revert changes. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, 4af5182)
 - Disabled dependent branch build. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, ab5bd4b)
 - Reimplemented build process using webpack. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, 8295e3a)
 - Revert "Reimplemented build process using webpack."
    
    This reverts commit bd3c7b0ec4d4464663fff76307a57c196dc9fd96. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, ca26a86)
 - Reimplemented build process using webpack. (Eugene Viktarovich <eugene.viktorovich@jcatalog.com>, bd3c7b0)
 - Merge branch 'master' of http://buildserver.jcatalog.com/git/js-i18n (3e2eab5 a238f92, fdfd4ad)
 - Remove react dependency (Dmitry Divin <dmitry.divin@jcatalog.com>, 3e2eab5)
 - Updating test (Dmitry Divin <dmitry.divin@jcatalog.com>, 3bcc461)
 - (CMMN-4674) Fixed I18nManager problem. (dzhitomirsky <dzhitomirsky@jcatalog.com>, a238f92)
 - (PIM-10743) Fixed package.json (Michael Pritchin <michael.pritchin@jcatalog.com>, 361bcb6)
 - (CMMN-4660) Refacotring code rename fields in format info (Dmitry Divin <dmitry.divin@jcatalog.com>, 6a216f4)
 - (CMMN-4660) Fixing formating decimal value (Dmitry Divin <dmitry.divin@jcatalog.com>, e7e1115)
 - (CMMN-4660) Implementing decimalSeparatorUseAlways format patterns parementer (Dmitry Divin <dmitry.divin@jcatalog.com>, 3cf5a06)
 - (PIM-10630) Fix for NumberConverter: valueToString returns as-is value, if it is string (Alexander Benderski <alexander.benderski@jcatalog.com>, e5928a5)
 - (CMMN-4622) Advancing project version to the next development - 7.18-SNAPSHOT (ifursik <ifursik@jcatalog.com>, 09c3547)
 - (CMMN-4622) Releasing 7.18.m2 version (ifursik <ifursik@jcatalog.com>, b16b21c)
 - (CMMN-4609) Implemented i18nManager fallback logic. (dzhitomirsky <dzhitomirsky@jcatalog.com>, 5cccd7d)
 - (PRJ-17902) Advancing project version to the next development - 7.18-SNAPSHOT (evgeny <evgeny.kachanovsky@jcatalog.com>, f0be685)
 - (PRJ-17902) Releasing 7.18.m1 version (evgeny <evgeny.kachanovsky@jcatalog.com>, b79f23b)
 - Fixed formatting numbers (case of not using decimal separator) (Alexander Benderski <alexander.benderski@jcatalog.com>, 1bb4438)
 - Changed returning from NumberConverter value form Object (Number) to primitive (Alexander Benderski <alexander.benderski@jcatalog.com>, 9187c49)
 - (PIM-10624) Adjusted setting for building grails plugin (Michael Pritchin <michael.pritchin@jcatalog.com>, dfb2298)
 - Fixing problems with IE compatibility. (dzhitomirsky <dzhitomirsky@jcatalog.com>, 5bd7978)
 - Fixed I18nManager to be compatible with IE. (dzhitomirsky <dzhitomirsky@jcatalog.com>, 9ce713a)
 - Fixing parsing exception (Dmitry Divin <dmitry.divin@jcatalog.com>, 0138e88)
 - Fixing convert empty value to date (Dmitry Divin <dmitry.divin@jcatalog.com>, c3a0e39)
 - Fixing undefined param value when get message with null params (Dmitry Divin <dmitry.divin@jcatalog.com>, 71b1d28)
 - Supporting formatted messages (Dmitry Divin <dmitry.divin@jcatalog.com>, 2ea3e9f)
 - Fixing convert string to number in case if value is null (Dmitry Divin <dmitry.divin@jcatalog.com>, cf9b39e)
 - Adding .babelrc (Dmitry Divin <dmitry.divin@jcatalog.com>, 106d46f)
 - Adding getter dateFomrat to I18nManager (Dmitry Divin <dmitry.divin@jcatalog.com>, bbdd0d6)
 - Fixing module name (Dmitry Divin <dmitry.divin@jcatalog.com>, 3a352b0)
 - Fixing module name (Dmitry Divin <dmitry.divin@jcatalog.com>, 2593c68)
 - Moving depends on i18n classes to new repo (Dmitry Divin <dmitry.divin@jcatalog.com>, 671ad11)

