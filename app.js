const csv2json = require('csvtojson');
const fs = require('fs');
const axios = require('axios');
const Json2csvParser = require('json2csv').Parser;
const promisify = require('util').promisify;
const sleep = promisify(setTimeout);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);
const endOfLine = require('os').EOL;
const { throwError, from, of, Observable } = require('rxjs');
const { catchError, retry, tap, retryWhen, delay, take } = require('rxjs/operators');

async function appendCsvFile(asins) {
  let fields = ["ASIN"];
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse(asins);
  await appendFile(config.productsFile, `${endOfLine}`);
  await appendFile(config.productsFile, csv);
}

async function main() {
  let tmp = await getDetail('日')
  console.log(tmp)

  process.exit();
}

async function getDetail(word) {
  try {
    let response = await getDetailObservable(word).pipe(
      // retryWhen(errors => errors.pipe(delay(randomIntFromInterval(2000, 10000)), take(20)) )
      retry(30)
    ).toPromise();

    return response
  } catch(e) {
    // console.log(e);
    console.log(`Error when processing: ${word}`)
  }
}

function getDetailObservable(word) {
  let url = `https://mazii.net/api/mazii/${encodeURI(word)}/10`
  return Observable.create( ( observer ) => {
    console.log(`Requesting...: ${url}`);
    axios.get(url)
    .then( ( response ) => {
      observer.next( response.data );
      observer.complete();
    } )
    .catch( ( error ) => {
      observer.error( error );
    } );
  });
}

main();