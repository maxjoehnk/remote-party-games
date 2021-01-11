import * as parse from 'csv-parse';
import { readFile } from 'fs';
import { join } from 'path';

const getPath = (wordList: string) => join(__dirname, `../../../assets/${wordList}.csv`);

export function loadWords(wordlist: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readFile(getPath(wordlist), 'utf8', (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      const parseOptions = {
        delimiter: ';',
      };
      parse(fileContent, parseOptions, (err, lines) => {
        if (err) {
          return reject(err);
        }
        const words = lines.map(line => line[0].trim()).filter(l => !!l);
        return resolve(words);
      });
    });
  });
}
