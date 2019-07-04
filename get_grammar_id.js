const helper = require('./helper');
const config = require('./config');
const get = require('get-value');
const fs = require('fs');
const promisify = require('util').promisify;
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);
const endOfLine = require('os').EOL;

async function getGrammar(page) {
  let url = 'https://mazii.net/api/search';
  let data = {
    "dict": "javi",
    "type": "grammar",
    "level": "",
    "category": "",
    "query": "",
    "page": page,
    "limit": 12
  };
  try {
    let response = await helper.toPromise(helper.postRequest(url, data));

    return response
  } catch(e) {
    // console.log(e);
    console.log(`Error when processing: ${url}/${page}`)
  }
}

async function main() {
  // clean up
  try {
    await unlink(config.grammar_ids_file);
  } catch (error) {
    
  }
  await appendFile(config.grammar_ids_file, 'id');

  let page = 1;
  while(true) {
    console.log(page);
    let response = await getGrammar(page++);
    let results = get(response, 'results');
    if (Array.isArray(results)) {
      for (let i = 0; i < results.length; i++) {
        let id = results[i]._id;
        if (id) {
          await appendFile(config.grammar_ids_file, endOfLine);
          await appendFile(config.grammar_ids_file, id);
        }
      }

      continue;
    } else {
      break;
    }
  }
}

main();