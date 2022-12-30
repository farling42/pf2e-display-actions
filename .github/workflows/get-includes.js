import * as fsPromises from 'fs/promises';
console.log(JSON.parse(await fsPromises.readFile('dist/module.json', 'utf8')).includes.join(" "));
