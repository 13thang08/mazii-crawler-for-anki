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

const input_file = "kanji_list.csv";
const output_file = "output.csv";

const fields = [
  'kanji',
  'mean',
  'kun',
  'on',
  'stroke_count',
  'level',
  'freq',
  'compDetail1_w',
  'compDetail1_h',
  'compDetail2_w',
  'compDetail2_h',
  'compDetail3_w',
  'compDetail3_h',
  'compDetail4_w',
  'compDetail4_h',
  'detail1',
  'detail2',
  'detail3',
  'detail4',
  'detail5',
  'suggestions1',
  'suggestions2',
  'suggestions3',
  'suggestions4',
  'examples1_w',
  'examples1_p',
  'examples1_m',
  'examples1_h',
  'examples2_w',
  'examples2_p',
  'examples2_m',
  'examples2_h',
  'examples3_w',
  'examples3_p',
  'examples3_m',
  'examples3_h',
  'examples4_w',
  'examples4_p',
  'examples4_m',
  'examples4_h',
  'examples5_w',
  'examples5_p',
  'examples5_m',
  'examples5_h',
  'examples6_w',
  'examples6_p',
  'examples6_m',
  'examples6_h',
  'examples7_w',
  'examples7_p',
  'examples7_m',
  'examples7_h',
  'examples8_w',
  'examples8_p',
  'examples8_m',
  'examples8_h',
  'examples9_w',
  'examples9_p',
  'examples9_m',
  'examples9_h',
  'examples10_w',
  'examples10_p',
  'examples10_m',
  'examples10_h',
];

async function appendCsvFile(data) {
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse([data]);
  await appendFile(output_file, `${endOfLine}`);
  await appendFile(output_file, csv);
}

async function main() {
  // clean up
  try {
    await unlink(output_file);
  } catch (error) {
    
  }

  let inputs = await csv2json().fromFile(input_file);
  let kanji_list = inputs.map(x => x.kanji);
  for (let i = 0; i < kanji_list.length; i++) {
    let kanji = kanji_list[i];
    let row = await getCsvRow(kanji);
    await appendCsvFile(row);
    console.log(`progress ${i+1}/${kanji_list.length}`);
  }

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
  data['kun'] = result.kun;
  data['on'] = result.on;
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

  let detailArr;
  if (result.detail) {
    detailArr = result.detail.split("##");
  }
  data['detail1'] = get(detailArr, '0');
  data['detail2'] = get(detailArr, '1');
  data['detail3'] = get(detailArr, '2');
  data['detail4'] = get(detailArr, '3');
  data['detail5'] = get(detailArr, '4');

  data['suggestions1'] = get(mean, 'result.0.mean');
  data['suggestions2'] = get(mean, 'result.1.mean');
  data['suggestions3'] = get(mean, 'result.2.mean');
  data['suggestions4'] = get(mean, 'result.3.mean');

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

  return data;
}

main();