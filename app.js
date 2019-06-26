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
const get = require('get-value');

async function appendCsvFile(asins) {
  let fields = ["ASIN"];
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse(asins);
  await appendFile(config.productsFile, `${endOfLine}`);
  await appendFile(config.productsFile, csv);
}

async function main() {
  let row = await getCsvRow('勝');
  console.log(row);

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

async function getMean(wordId) {
  try {
    let response = await getMeanObservable(wordId).pipe(
      // retryWhen(errors => errors.pipe(delay(randomIntFromInterval(2000, 10000)), take(20)) )
      retry(30)
    ).toPromise();

    return response
  } catch(e) {
    // console.log(e);
    console.log(`Error when processing: ${wordId}`)
  }
}

function getMeanObservable(wordId) {
  return Observable.create( ( observer ) => {
    console.log(`Requesting...: ${wordId}`);
    axios.post('https://api.mazii.net/api/get-mean', {
      wordId,
      type: "kanji",
      dict: "javi"
    })
    .then( ( response ) => {
      observer.next( response.data );
      observer.complete();
    } )
    .catch( ( error ) => {
      observer.error( error );
    } );
  });
}

async function getCsvRow(word) {
  let detail = await getDetail(word)
  let result = get(detail, 'results.0');
  let mean;

  if (!result) {
    return
  }

  let mobileId = result.mobileId;
  if (mobileId) {
    mean = await getMean(mobileId);
  }

  let data = {};
  data['kanji'] = result.kanji;
  data['mean'] = result.mean;
  data['on'] = result.on;
  data['kun'] = result.kun;
  data['stroke_count'] = result.stroke_count;
  data['level'] = result.level;
  data['freq'] = result.freq;
  let compDetail = result.compDetail;
  data['compDetail1_w'] = get(compDetail, '0.w');
  data['compDetail1_h'] = get(compDetail, '0.h');
  data['compDetail2_w'] = get(compDetail, '1.w');
  data['compDetail2_h'] = get(compDetail, '1.h');
  data['compDetail3_w'] = get(compDetail, '2.w');
  data['compDetail3_h'] = get(compDetail, '2.h');
  data['compDetail4_w'] = get(compDetail, '3.w');
  data['compDetail4_h'] = get(compDetail, '3.h');
  let examples = result.examples;
  data['examples1_w'] = get(examples, '0.w');
  data['examples1_p'] = get(examples, '0.p');
  data['examples1_m'] = get(examples, '0.m');
  data['examples1_h'] = get(examples, '0.h');
  data['examples2_w'] = get(examples, '1.w');
  data['examples2_p'] = get(examples, '1.p');
  data['examples2_m'] = get(examples, '1.m');
  data['examples2_h'] = get(examples, '1.h');
  data['examples3_w'] = get(examples, '2.w');
  data['examples3_p'] = get(examples, '2.p');
  data['examples3_m'] = get(examples, '2.m');
  data['examples3_h'] = get(examples, '2.h');
  data['examples4_w'] = get(examples, '3.w');
  data['examples4_p'] = get(examples, '3.p');
  data['examples4_m'] = get(examples, '3.m');
  data['examples4_h'] = get(examples, '3.h');
  data['examples5_w'] = get(examples, '4.w');
  data['examples5_p'] = get(examples, '4.p');
  data['examples5_m'] = get(examples, '4.m');
  data['examples5_h'] = get(examples, '4.h');
  data['examples6_w'] = get(examples, '5.w');
  data['examples6_p'] = get(examples, '5.p');
  data['examples6_m'] = get(examples, '5.m');
  data['examples6_h'] = get(examples, '5.h');
  data['examples7_w'] = get(examples, '6.w');
  data['examples7_p'] = get(examples, '6.p');
  data['examples7_m'] = get(examples, '6.m');
  data['examples7_h'] = get(examples, '6.h');
  data['examples8_w'] = get(examples, '7.w');
  data['examples8_p'] = get(examples, '7.p');
  data['examples8_m'] = get(examples, '7.m');
  data['examples8_h'] = get(examples, '7.h');
  data['examples9_w'] = get(examples, '8.w');
  data['examples9_p'] = get(examples, '8.p');
  data['examples9_m'] = get(examples, '8.m');
  data['examples9_h'] = get(examples, '8.h');
  data['examples10_w'] = get(examples, '9.w');
  data['examples10_p'] = get(examples, '9.p');
  data['examples10_m'] = get(examples, '9.m');
  data['examples10_h'] = get(examples, '9.h');

  data['suggestions1'] = get(mean, 'result.0.mean')
  data['suggestions2'] = get(mean, 'result.1.mean')
  data['suggestions3'] = get(mean, 'result.2.mean')
  data['suggestions4'] = get(mean, 'result.3.mean')

  return data;
}

main();