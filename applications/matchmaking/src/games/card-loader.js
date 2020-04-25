import parse from 'csv-parse';
import { readFile } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from "url";

const csvPath = join(dirname(fileURLToPath(import.meta.url)), './taboo.csv')

export function loadCards(callback) {
    readFile(csvPath, 'utf8', (err, fileContent) => {
        if (err) {
            callback(err);
        }
        parse(fileContent, {
            delimiter: ';'
        }, (err, lines) => {
            if (err) {
                callback(err);
            }
            const cards = lines.map(line => ({
                term: line[0],
                taboo: line.slice(1)
            }));
            callback(null, cards);
        })
    })
}
