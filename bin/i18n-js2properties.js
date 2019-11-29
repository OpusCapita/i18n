#!/usr/bin/env node
//for the source definitions in style ES6
require("babel-register")({
  presets: ["es2015", "stage-0"],
  plugins: ["istanbul"]
});
const properties = require("properties");
const fs = require("fs");
const path = require("path");
const argv = require('yargs')
  .usage("Usage: i18n-js2properties --source src/client/components/i18n --target ../plugin/grails-app/i18n/boilerplateEditor")
  .demandOption(["source", "target"])
  .argv;

const {source, target} = argv;
const sourceFilePath = path.resolve(process.cwd(), source);
console.log(`Reading source import [${sourceFilePath}]`);
let sourceObject = require(sourceFilePath);
//in case if export module with es6
if (sourceObject.default) {
  sourceObject = sourceObject.default;
}

const defaultLanguage = "en";

function padWithLeadingZeros(string) {
  return new Array(5 - string.length).join("0") + string;
}

function unicodeCharEscape(charCode) {
  return "\\u" + padWithLeadingZeros(charCode.toString(16));
}

function unicodeEscape(string) {
  return string.split("")
    .map(function (char) {
      var charCode = char.charCodeAt(0);
      return charCode > 127 ? unicodeCharEscape(charCode) : char;
    })
    .join("");
}

if (!sourceObject[defaultLanguage]) {
  console.error(`Default language [${defaultLanguage}] should be defined in translations [${source}]`);
} else {
  const targetPath = path.resolve(process.cwd(), path.dirname(target));

  if (!fs.existsSync(targetPath)) {
    console.error(`Target path [${targetPath}] doesn't exists`);
  } else {
    const bundleName = path.basename(target);

    const languages = Object.keys(sourceObject);

    function flattenTranslationTexts(object, parentKey) {
      let result = {};
      const keys = Object.keys(object);

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        const propertiesKey = parentKey ? `${parentKey}.${key}` : key;
        const value = object[key];

        if (typeof value === "object") {
          result = {
            ...result,
            ...flattenTranslationTexts(value, propertiesKey)
          };
        } else {
          result[propertiesKey] = value.toString();
        }
      }

      return result;
    }

    for (let i = 0; i < languages.length; i++) {
      const language = languages[i];
      const objectTranslationTexts = sourceObject[language];
      const translationTexts = flattenTranslationTexts(objectTranslationTexts);
      const propertiesText = properties.stringify(translationTexts, {
        // unicode: true,
        replacer(key, value) {
          return value ? unicodeEscape(value) : value;
        }
      });
      const filePath = path.join(targetPath, `${bundleName}_${language}.properties`);

      console.log(`Writing target file [${filePath}]`);
      fs.writeFileSync(filePath, propertiesText);
    }

    const fromFilePath = path.join(targetPath, `${bundleName}_en.properties`);
    const toFilePath = path.join(targetPath, `${bundleName}.properties`);
    console.log(`Copy file [${fromFilePath}] to [${toFilePath}]`);
    //save english properties as default
    fs.createReadStream(fromFilePath).pipe(
      fs.createWriteStream(toFilePath)
    );
  }
}




