import * as parse from 'csv-parse';
import { readFile } from 'fs';
import { join } from 'path';
import { TabooCard } from './taboo-card';

const csvPath = join(__dirname, '../../../assets/taboo.csv');

export function loadCards(callback: (err: Error, cards?: TabooCard[]) => void) {
  readFile(csvPath, 'utf8', (err, fileContent) => {
    if (err) {
      callback(err);
    }
    const parseOptions = {
      delimiter: ';',
    };
    parse(fileContent, parseOptions, (err, lines) => {
      if (err) {
        callback(err);
      }
      const cards = lines.map(line => ({
        term: line[0],
        taboo: line.slice(1).filter(r => r !== '' && r != null),
      }));
      callback(null, cards);
    });
  });
}
