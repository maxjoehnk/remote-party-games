const glob = require('glob');
const { exportTranslationKeys } = require('i18n-tag-schema');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const { run } = require('runjs');

const preprocessor = join(__dirname, 'preprocessors/i18n-typescript');

/**
 * Updates the translation.schema.json file with all available translation keys.
 */
function updateSchema() {
  run(`i18n-tag-schema ./src -p ${preprocessor} -f .tsx --schema ./translation.schema.json`);
  run('prettier --write translation.schema.json');
}

/**
 * Updates the translation file for the given language or generates a new one
 * if it doesn't exist
 */
async function updateTranslation(language) {
  const files = await getTranslatableFiles();
  let keys = await generateTranslationKeys(files);
  const translationFile = buildTranslationFile(keys);
  const exportName = getTranslationFileName(language);
  applyExistingTranslations(exportName, keys, translationFile);
  writeFileSync(exportName, JSON.stringify(translationFile, null, 4));
}

/**
 * Validates all translation files against the given translation schema
 */
function validate() {
  run('i18n-tag-schema ./translations --validate --schema ./translation.schema.json');
}

function getTranslatableFiles() {
  return new Promise((resolve, reject) => {
    glob('./src/**/*.tsx', (err, files) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(files);
    });
  });
}

async function generateTranslationKeys(files) {
  let keys = [];
  for (const file of files) {
    const fileKeys = await exportTranslationKeys({
      filePath: file,
      preprocessor,
      rootPath: process.cwd(),
    });
    keys = [...keys, ...fileKeys];
  }
  return keys;
}

function buildTranslationFile(keys) {
  const translationFile = {};
  for (const key of keys) {
    if (isGroup(key)) {
      const groupName = key.group;
      if (!(groupName in translationFile)) {
        translationFile[groupName] = {};
      }
      for (let item of key.items) {
        translationFile[groupName][item] = item;
      }
    } else {
      translationFile[key] = key;
    }
  }
  return translationFile;
}

function getTranslationFileName(language) {
  return `translations/${language}.json`;
}

function applyExistingTranslations(exportName, keys, translationFile) {
  if (existsSync(exportName)) {
    const existingKeys = readExistingTranslationFile(exportName);
    for (const key of keys) {
      if (isGroup(key)) {
        const groupName = key.group;
        if (existingKeys[groupName] == null) {
          existingKeys[groupName] = {};
        }
        for (const item of Object.getOwnPropertyNames(translationFile[groupName])) {
          if (item in existingKeys[groupName]) {
            translationFile[groupName][item] = existingKeys[groupName][item];
          }
        }
      } else if (key in existingKeys) {
        translationFile[key] = existingKeys[key];
      }
    }
  }
}

function readExistingTranslationFile(exportName) {
  const existingFile = readFileSync(exportName, 'utf8');
  const existingKeys = JSON.parse(existingFile);
  return existingKeys;
}

function isGroup(key) {
  return typeof key !== 'string';
}

module.exports = {
  updateSchema,
  updateTranslation,
  validate,
};
