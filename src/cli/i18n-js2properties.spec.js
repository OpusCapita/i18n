const fs = require("fs");
const rimraf = require("rimraf");
const { expect } = require("chai");
const { spawn } = require("child_process");
const concat = require("concat-stream");
const properties = require("properties");

function createProcess(processPath, args = [], env = {}) {
  return spawn("node", [processPath].concat(args), {
    env: {
      ...env,
      ...{ NODE_ENV: "test" }
    }
  });
}

function execute(processPath, args = [], opts = {}) {
  const { env = null } = opts;
  const childProcess = createProcess(processPath, args, env);
  childProcess.stdin.setEncoding("utf-8");
  return new Promise((resolve, reject) => {
    childProcess.stderr.once("data", err => {
      reject(err.toString());
    });
    childProcess.on('error', reject);
    childProcess.stdout.pipe(
      concat(result => {
        resolve(result.toString());
      })
    );
  });
}


describe("i18n-js to properties CLI", () => {
  beforeEach(() => {
    rimraf.sync("tmp");
    fs.mkdirSync("tmp");
    fs.mkdirSync("tmp/i18n");
    fs.mkdirSync("tmp/grails-app");
    fs.mkdirSync("tmp/grails-app/i18n");
    fs.writeFileSync("tmp/i18n/index.js", `
import en from './en';
import de from './de';

export default {
  en,
  de
};
    `);
    fs.writeFileSync("tmp/i18n/en.js", `
const header = {
  title: "test title"
};

const form = {
  "a.b": "test a b",
  "a.b.c": "test a b c"
};

export default { messages: {header, form} }
    `);
    fs.writeFileSync("tmp/i18n/de.js", `
const header = {
  title: "de test title"
};

const form = {
  "a.b": "de test a b",
  "a.b.c": "de test a b c"
};

export default { messages: {header, form} }
    `);
  });

  afterEach(() => {
    rimraf.sync("tmp");
  });

  it("should generate properties", async () => {
    await execute("bin/i18n-js2properties.js", ["--source", "tmp/i18n", "--target", "tmp/grails-app/i18n/messages"]);

    expect(
      fs.existsSync("tmp/grails-app/i18n/messages.properties")
    ).to.be.equal(true);

    expect(
      fs.existsSync("tmp/grails-app/i18n/messages_en.properties")
    ).to.be.equal(true);

    expect(
      fs.existsSync("tmp/grails-app/i18n/messages_de.properties")
    ).to.be.equal(true);

    const englishProperties = properties.parse(
      fs.readFileSync("tmp/grails-app/i18n/messages_en.properties").toString()
    );

    expect(englishProperties).to.deep.include(
      { "messages.header.title": "test title", "messages.form.a.b": "test a b", "messages.form.a.b.c": "test a b c" }
    );

    const germanProperties = properties.parse(fs.readFileSync("tmp/grails-app/i18n/messages_de.properties").toString());

    expect(germanProperties).to.deep.include(
      {
        "messages.header.title": "de test title",
        "messages.form.a.b": "de test a b",
        "messages.form.a.b.c": "de test a b c"
      }
    );

    const defaultProperties = properties.parse(fs.readFileSync("tmp/grails-app/i18n/messages.properties").toString());
    expect(defaultProperties).to.deep.include(englishProperties);
  });
});
