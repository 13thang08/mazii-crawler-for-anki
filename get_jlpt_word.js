const helper = require('./helper');
const config = require('./config');
const get = require('get-value');
const fs = require('fs');
const { async } = require('rxjs/internal/scheduler/async');
const promisify = require('util').promisify;
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);
const endOfLine = require('os').EOL;
const csv2json = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;

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

async function getWord(word) {
  let url = 'https://mazii.net/api/search';
  let data = {
    "dict": "javi",
    "type": "word",
    "query": word,
    "limit": 1,
    "page": 1
  }
  try {
    let response = await helper.toPromise(helper.postRequest(url, data));

    return response
  } catch(e) {
    // console.log(e);
    console.log(`Error when processing: ${url}:${word}`)
  }
}

function getCsvRow(result) {
  // TODO: fix here!
  let detail = get(result, 'data.0');
  if (!detail) {
    return;
  }

  let means = get(detail, 'means');

  let data = [];

  data['word'] = trim( get(detail, 'word'));
  data['phonetic'] = trim( get(detail, 'phonetic'));

  data['kind_0'] = getKindDetail(trim(get(means, '0.kind')));
  data['mean_0'] = trim( get(means, '0.mean') );
  data['examples_0_0_content'] = trim( get(means, '0.examples.0.content') );
  data['examples_0_0_mean'] = trim( get(means, '0.examples.0.mean') );
  data['examples_0_0_transcription'] = trim( get(means, '0.examples.0.transcription') );
  data['examples_0_1_content'] = trim( get(means, '0.examples.1.content') );
  data['examples_0_1_mean'] = trim( get(means, '0.examples.1.mean') );
  data['examples_0_1_transcription'] = trim( get(means, '0.examples.1.transcription') );
  data['examples_0_2_content'] = trim( get(means, '0.examples.2.content') );
  data['examples_0_2_mean'] = trim( get(means, '0.examples.2.mean') );
  data['examples_0_2_transcription'] = trim( get(means, '0.examples.2.transcription') );
  data['examples_0_3_content'] = trim( get(means, '0.examples.3.content') );
  data['examples_0_3_mean'] = trim( get(means, '0.examples.3.mean') );
  data['examples_0_3_transcription'] = trim( get(means, '0.examples.3.transcription') );
  data['examples_0_4_content'] = trim( get(means, '0.examples.4.content') );
  data['examples_0_4_mean'] = trim( get(means, '0.examples.4.mean') );
  data['examples_0_4_transcription'] = trim( get(means, '0.examples.4.transcription') );
  data['examples_0_5_content'] = trim( get(means, '0.examples.5.content') );
  data['examples_0_5_mean'] = trim( get(means, '0.examples.5.mean') );
  data['examples_0_5_transcription'] = trim( get(means, '0.examples.5.transcription') );

  data['kind_1'] = getKindDetail(trim(get(means, '1.kind')));
  data['mean_1'] = trim( get(means, '1.mean') );
  data['examples_1_0_content'] = trim( get(means, '1.examples.0.content') );
  data['examples_1_0_mean'] = trim( get(means, '1.examples.0.mean') );
  data['examples_1_0_transcription'] = trim( get(means, '1.examples.0.transcription') );
  data['examples_1_1_content'] = trim( get(means, '1.examples.1.content') );
  data['examples_1_1_mean'] = trim( get(means, '1.examples.1.mean') );
  data['examples_1_1_transcription'] = trim( get(means, '1.examples.1.transcription') );
  data['examples_1_2_content'] = trim( get(means, '1.examples.2.content') );
  data['examples_1_2_mean'] = trim( get(means, '1.examples.2.mean') );
  data['examples_1_2_transcription'] = trim( get(means, '1.examples.2.transcription') );
  data['examples_1_3_content'] = trim( get(means, '1.examples.3.content') );
  data['examples_1_3_mean'] = trim( get(means, '1.examples.3.mean') );
  data['examples_1_3_transcription'] = trim( get(means, '1.examples.3.transcription') );
  data['examples_1_4_content'] = trim( get(means, '1.examples.4.content') );
  data['examples_1_4_mean'] = trim( get(means, '1.examples.4.mean') );
  data['examples_1_4_transcription'] = trim( get(means, '1.examples.4.transcription') );
  data['examples_1_5_content'] = trim( get(means, '1.examples.5.content') );
  data['examples_1_5_mean'] = trim( get(means, '1.examples.5.mean') );
  data['examples_1_5_transcription'] = trim( get(means, '1.examples.5.transcription') );

  data['kind_2'] = getKindDetail(trim(get(means, '2.kind')));
  data['mean_2'] = trim( get(means, '2.mean') );
  data['examples_2_0_content'] = trim( get(means, '2.examples.0.content') );
  data['examples_2_0_mean'] = trim( get(means, '2.examples.0.mean') );
  data['examples_2_0_transcription'] = trim( get(means, '2.examples.0.transcription') );
  data['examples_2_1_content'] = trim( get(means, '2.examples.1.content') );
  data['examples_2_1_mean'] = trim( get(means, '2.examples.1.mean') );
  data['examples_2_1_transcription'] = trim( get(means, '2.examples.1.transcription') );
  data['examples_2_2_content'] = trim( get(means, '2.examples.2.content') );
  data['examples_2_2_mean'] = trim( get(means, '2.examples.2.mean') );
  data['examples_2_2_transcription'] = trim( get(means, '2.examples.2.transcription') );
  data['examples_2_3_content'] = trim( get(means, '2.examples.3.content') );
  data['examples_2_3_mean'] = trim( get(means, '2.examples.3.mean') );
  data['examples_2_3_transcription'] = trim( get(means, '2.examples.3.transcription') );
  data['examples_2_4_content'] = trim( get(means, '2.examples.4.content') );
  data['examples_2_4_mean'] = trim( get(means, '2.examples.4.mean') );
  data['examples_2_4_transcription'] = trim( get(means, '2.examples.4.transcription') );
  data['examples_2_5_content'] = trim( get(means, '2.examples.5.content') );
  data['examples_2_5_mean'] = trim( get(means, '2.examples.5.mean') );
  data['examples_2_5_transcription'] = trim( get(means, '2.examples.5.transcription') );

  data['kind_3'] = getKindDetail(trim(get(means, '3.kind')));
  data['mean_3'] = trim( get(means, '3.mean') );
  data['examples_3_0_content'] = trim( get(means, '3.examples.0.content') );
  data['examples_3_0_mean'] = trim( get(means, '3.examples.0.mean') );
  data['examples_3_0_transcription'] = trim( get(means, '3.examples.0.transcription') );
  data['examples_3_1_content'] = trim( get(means, '3.examples.1.content') );
  data['examples_3_1_mean'] = trim( get(means, '3.examples.1.mean') );
  data['examples_3_1_transcription'] = trim( get(means, '3.examples.1.transcription') );
  data['examples_3_2_content'] = trim( get(means, '3.examples.2.content') );
  data['examples_3_2_mean'] = trim( get(means, '3.examples.2.mean') );
  data['examples_3_2_transcription'] = trim( get(means, '3.examples.2.transcription') );
  data['examples_3_3_content'] = trim( get(means, '3.examples.3.content') );
  data['examples_3_3_mean'] = trim( get(means, '3.examples.3.mean') );
  data['examples_3_3_transcription'] = trim( get(means, '3.examples.3.transcription') );
  data['examples_3_4_content'] = trim( get(means, '3.examples.4.content') );
  data['examples_3_4_mean'] = trim( get(means, '3.examples.4.mean') );
  data['examples_3_4_transcription'] = trim( get(means, '3.examples.4.transcription') );
  data['examples_3_5_content'] = trim( get(means, '3.examples.5.content') );
  data['examples_3_5_mean'] = trim( get(means, '3.examples.5.mean') );
  data['examples_3_5_transcription'] = trim( get(means, '3.examples.5.transcription') );

  data['kind_4'] = getKindDetail(trim(get(means, '4.kind')));
  data['mean_4'] = trim( get(means, '4.mean') );
  data['examples_4_0_content'] = trim( get(means, '4.examples.0.content') );
  data['examples_4_0_mean'] = trim( get(means, '4.examples.0.mean') );
  data['examples_4_0_transcription'] = trim( get(means, '4.examples.0.transcription') );
  data['examples_4_1_content'] = trim( get(means, '4.examples.1.content') );
  data['examples_4_1_mean'] = trim( get(means, '4.examples.1.mean') );
  data['examples_4_1_transcription'] = trim( get(means, '4.examples.1.transcription') );
  data['examples_4_2_content'] = trim( get(means, '4.examples.2.content') );
  data['examples_4_2_mean'] = trim( get(means, '4.examples.2.mean') );
  data['examples_4_2_transcription'] = trim( get(means, '4.examples.2.transcription') );
  data['examples_4_3_content'] = trim( get(means, '4.examples.3.content') );
  data['examples_4_3_mean'] = trim( get(means, '4.examples.3.mean') );
  data['examples_4_3_transcription'] = trim( get(means, '4.examples.3.transcription') );
  data['examples_4_4_content'] = trim( get(means, '4.examples.4.content') );
  data['examples_4_4_mean'] = trim( get(means, '4.examples.4.mean') );
  data['examples_4_4_transcription'] = trim( get(means, '4.examples.4.transcription') );
  data['examples_4_5_content'] = trim( get(means, '4.examples.5.content') );
  data['examples_4_5_mean'] = trim( get(means, '4.examples.5.mean') );
  data['examples_4_5_transcription'] = trim( get(means, '4.examples.5.transcription') );

  data['kind_5'] = getKindDetail(trim(get(means, '5.kind')));
  data['mean_5'] = trim( get(means, '5.mean') );
  data['examples_5_0_content'] = trim( get(means, '5.examples.0.content') );
  data['examples_5_0_mean'] = trim( get(means, '5.examples.0.mean') );
  data['examples_5_0_transcription'] = trim( get(means, '5.examples.0.transcription') );
  data['examples_5_1_content'] = trim( get(means, '5.examples.1.content') );
  data['examples_5_1_mean'] = trim( get(means, '5.examples.1.mean') );
  data['examples_5_1_transcription'] = trim( get(means, '5.examples.1.transcription') );
  data['examples_5_2_content'] = trim( get(means, '5.examples.2.content') );
  data['examples_5_2_mean'] = trim( get(means, '5.examples.2.mean') );
  data['examples_5_2_transcription'] = trim( get(means, '5.examples.2.transcription') );
  data['examples_5_3_content'] = trim( get(means, '5.examples.3.content') );
  data['examples_5_3_mean'] = trim( get(means, '5.examples.3.mean') );
  data['examples_5_3_transcription'] = trim( get(means, '5.examples.3.transcription') );
  data['examples_5_4_content'] = trim( get(means, '5.examples.4.content') );
  data['examples_5_4_mean'] = trim( get(means, '5.examples.4.mean') );
  data['examples_5_4_transcription'] = trim( get(means, '5.examples.4.transcription') );
  data['examples_5_5_content'] = trim( get(means, '5.examples.5.content') );
  data['examples_5_5_mean'] = trim( get(means, '5.examples.5.mean') );
  data['examples_5_5_transcription'] = trim( get(means, '5.examples.5.transcription') );

  return data;
}

async function appendCsvFile(data) {
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse([data]);
  await appendFile('JLPT_N1.csv', `${endOfLine}`);
  await appendFile('JLPT_N1.csv', csv);
}

function trim(str) {
  if (str) { return str.trim().replace(/(?:\r\n|\r|\n)/g, '<br>') }
}

async function main() {
  console.log(getKindDetail("adj-no, n, vs"));
  return;

  // clean up
  try {
    await unlink('JLPT_N1.csv');
  } catch (error) {
    
  }
  await appendCsvFile(fields);
  let inputs = await csv2json({
    noheader: true,
    output: "csv"
  }).fromFile('./jlpt-words/Core Japanese Vocabulary__JLPT-N1.csv');

  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let word = input[0];
    let result = await getWord(word);
    let csvRow = getCsvRow(result);
    await appendCsvFile(csvRow);
  }

  console.log(csvRow);
}

async function main2() {
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

const fields = [
  'word',
  'phonetic',

  'kind_0',
  'mean_0',
  'examples_0_0_content',
  'examples_0_0_mean',
  'examples_0_0_transcription',
  'examples_0_1_content',
  'examples_0_1_mean',
  'examples_0_1_transcription',
  'examples_0_2_content',
  'examples_0_2_mean',
  'examples_0_2_transcription',
  'examples_0_3_content',
  'examples_0_3_mean',
  'examples_0_3_transcription',
  'examples_0_4_content',
  'examples_0_4_mean',
  'examples_0_4_transcription',
  'examples_0_5_content',
  'examples_0_5_mean',
  'examples_0_5_transcription',

  'kind_1',
  'mean_1',
  'examples_1_0_content',
  'examples_1_0_mean',
  'examples_1_0_transcription',
  'examples_1_1_content',
  'examples_1_1_mean',
  'examples_1_1_transcription',
  'examples_1_2_content',
  'examples_1_2_mean',
  'examples_1_2_transcription',
  'examples_1_3_content',
  'examples_1_3_mean',
  'examples_1_3_transcription',
  'examples_1_4_content',
  'examples_1_4_mean',
  'examples_1_4_transcription',
  'examples_1_5_content',
  'examples_1_5_mean',
  'examples_1_5_transcription',

  'kind_2',
  'mean_2',
  'examples_2_0_content',
  'examples_2_0_mean',
  'examples_2_0_transcription',
  'examples_2_1_content',
  'examples_2_1_mean',
  'examples_2_1_transcription',
  'examples_2_2_content',
  'examples_2_2_mean',
  'examples_2_2_transcription',
  'examples_2_3_content',
  'examples_2_3_mean',
  'examples_2_3_transcription',
  'examples_2_4_content',
  'examples_2_4_mean',
  'examples_2_4_transcription',
  'examples_2_5_content',
  'examples_2_5_mean',
  'examples_2_5_transcription',

  'kind_3',
  'mean_3',
  'examples_3_0_content',
  'examples_3_0_mean',
  'examples_3_0_transcription',
  'examples_3_1_content',
  'examples_3_1_mean',
  'examples_3_1_transcription',
  'examples_3_2_content',
  'examples_3_2_mean',
  'examples_3_2_transcription',
  'examples_3_3_content',
  'examples_3_3_mean',
  'examples_3_3_transcription',
  'examples_3_4_content',
  'examples_3_4_mean',
  'examples_3_4_transcription',
  'examples_3_5_content',
  'examples_3_5_mean',
  'examples_3_5_transcription',

  'kind_4',
  'mean_4',
  'examples_4_0_content',
  'examples_4_0_mean',
  'examples_4_0_transcription',
  'examples_4_1_content',
  'examples_4_1_mean',
  'examples_4_1_transcription',
  'examples_4_2_content',
  'examples_4_2_mean',
  'examples_4_2_transcription',
  'examples_4_3_content',
  'examples_4_3_mean',
  'examples_4_3_transcription',
  'examples_4_4_content',
  'examples_4_4_mean',
  'examples_4_4_transcription',
  'examples_4_5_content',
  'examples_4_5_mean',
  'examples_4_5_transcription',

  'kind_5',
  'mean_5',
  'examples_5_0_content',
  'examples_5_0_mean',
  'examples_5_0_transcription',
  'examples_5_1_content',
  'examples_5_1_mean',
  'examples_5_1_transcription',
  'examples_5_2_content',
  'examples_5_2_mean',
  'examples_5_2_transcription',
  'examples_5_3_content',
  'examples_5_3_mean',
  'examples_5_3_transcription',
  'examples_5_4_content',
  'examples_5_4_mean',
  'examples_5_4_transcription',
  'examples_5_5_content',
  'examples_5_5_mean',
  'examples_5_5_transcription'
]

function getKindDetail(kind) {
  const kindTablesVi = {
    abbr: "t\u1eeb vi\u1ebft t\u1eaft",
    adj: "t\xednh t\u1eeb",
    "adj-na": "t\xednh t\u1eeb \u0111u\xf4i \u306a",
    "adj-no": "danh t\u1eeb s\u1edf h\u1eefu c\xe1ch th\xeam \u306e",
    "adj-pn": "t\xednh t\u1eeb \u0111\u1ee9ng tr\u01b0\u1edbc danh t\u1eeb",
    "adj-s": "t\xednh t\u1eeb \u0111\u1eb7c bi\u1ec7t",
    "adj-t": "t\xednh t\u1eeb \u0111u\u1ed5i tara",
    adv: "tr\u1ea1ng t\u1eeb",
    "adv-n": "danh t\u1eeb l\xe0m ph\xf3 t\u1eeb",
    "adv-to": "tr\u1ea1ng t\u1eeb th\xeam \u3068",
    arch: "t\u1eeb c\u1ed5",
    ateji: "k\xfd t\u1ef1 thay th\u1ebf",
    aux: "tr\u1ee3 t\u1eeb",
    "aux-v": "tr\u1ee3 \u0111\u1ed9ng t\u1eeb",
    "aux-adj": "t\xednh t\u1eeb ph\u1ee5 tr\u1ee3",
    Buddh: "thu\u1eadt ng\u1eef ph\u1eadt gi\xe1o",
    chn: "ng\xf4n ng\u1eef tr\u1ebb em",
    col: "th\xe2n m\u1eadt ng\u1eef",
    comp: "thu\u1eadt ng\u1eef tin h\u1ecdc",
    conj: "li\xean t\u1eeb",
    derog: "x\xfac ph\u1ea1m ng\u1eef",
    ek: "h\xe1n t\u1ef1 \u0111\u1eb7c tr\u01b0ng",
    exp: "c\u1ee5m t\u1eeb",
    fam: "t\u1eeb ng\u1eef th\xe2n thu\u1ed9c",
    fem: "ph\u1ee5 n\u1eef hay d\xf9ng",
    food: "thu\u1eadt ng\u1eef th\u1ef1c ph\u1ea9m",
    geom: "thu\u1eadt ng\u1eef h\xecnh h\u1ecdc",
    gikun: "gikun",
    gram: "thu\u1ed9c v\u1ec1 ng\u1eef ph\xe1p",
    hon: "t\xf4n k\xednh ng\u1eef",
    hum: "khi\xeam nh\u01b0\u1eddng ng\u1eef",
    id: "th\xe0nh ng\u1eef",
    int: "th\xe1n t\u1eeb",
    iK: "t\u1eeb ch\u1ee9a kanji b\u1ea5t quy t\u1eafc",
    ik: "t\u1eeb ch\u1ee9a kana b\u1ea5t quy t\u1eafc",
    io: "okurigana b\u1ea5t quy t\u1eafc",
    iv: "\u0111\u1ed9ng t\u1eeb b\u1ea5t quy t\u1eafc",
    kyb: "gi\u1ecdng Kyoto",
    ksb: "gi\u1ecdng Kansai",
    ktb: "gi\u1ecdng Kantou",
    ling: "thu\u1eadt ng\u1eef ng\xf4n ng\u1eef h\u1ecdc",
    MA: "thu\u1eadt ng\u1eef ngh\u1ec7 thu\u1eadt",
    male: "ti\u1ebfng l\xf3ng c\u1ee7a nam gi\u1edbi",
    math: "thu\u1eadt ng\u1eef to\xe1n h\u1ecdc",
    mil: "thu\u1eadt ng\u1eef qu\xe2n s\u1ef1",
    "m-sl": "thu\u1eadt ng\u1eef truy\u1ec7n tranh",
    n: "danh t\u1eeb",
    "n-adv": "danh t\u1eeb l\xe0m ph\xf3 t\u1eeb",
    "n-pref": "danh t\u1eeb l\xe0m ti\u1ec1n t\u1ed1",
    "n-suf": "danh t\u1eeb l\xe0m h\u1eadu t\u1ed1",
    "n-t": "danh t\u1eeb ch\u1ec9 th\u1eddi gian",
    neg: "th\u1ec3 ph\u1ee7 \u0111\u1ecbnh",
    "neg-v": "\u0111\u1ed9ng t\u1eeb mang ngh\u0129a ph\u1ee7 \u0111\u1ecbnh",
    ng: "t\u1eeb trung t\xednh",
    obs: "t\u1eeb c\u1ed5",
    obsc: "t\u1eeb t\u1ed1i ngh\u0129a",
    oK: "t\u1eeb ch\u1ee9a kanji c\u1ed5",
    ok: "t\u1eeb ch\u1ee9a kana c\u1ed5",
    osk: "Gi\u1ecdng Osaka",
    physics: "thu\u1eadt ng\u1eef v\u1eadt l\xfd",
    pol: "th\u1ec3 l\u1ecbch s\u1ef1",
    pref: "ti\u1ebfp \u0111\u1ea7u ng\u1eef",
    prt: "gi\u1edbi t\u1eeb",
    qv: "tham kh\u1ea3o m\u1ee5c kh\xe1c",
    rare: "t\u1eeb hi\u1ebfm g\u1eb7p",
    sl: "ti\u1ebfng l\xf3ng",
    suf: "h\u1eadu t\u1ed1",
    tsb: "gi\u1ecdng Tosa",
    uK: "t\u1eeb s\u1eed d\u1ee5ng kanji \u0111\u1ee9ng m\u1ed9t m\xecnh",
    uk: "t\u1eeb s\u1eed d\u1ee5ng kana \u0111\u1ee9ng m\u1ed9t m\xecnh",
    v: "\u0111\u1ed9ng t\u1eeb",
    v1: "\u0111\u1ed9ng t\u1eeb nh\xf3m 2",
    v5: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1",
    v5aru: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -aru",
    v5b: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -bu",
    v5g: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -ku",
    v5k: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -ku",
    "v5k-s": "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -iku/yuku",
    v5m: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -mu",
    v5n: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -nu",
    v5r: "\u0110\u1ed9ng t\u1eeb nh\xf3m 1 -ru",
    "v5r-i": "\u0110\u1ed9ng t\u1eeb nh\xf3m 1 b\u1ea5t quy t\u1eafc -ru",
    v5s: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -su",
    v5t: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -tsu",
    v5u: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -u",
    "v5u-s": "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -u (\u0111\u1eb7c bi\u1ec7t)",
    v5uru: "\u0111\u1ed9ng t\u1eeb nh\xf3m 1 -uru",
    vi: "t\u1ef1 \u0111\u1ed9ng t\u1eeb",
    vk: "\u0111\u1ed9ng t\u1eeb kuru (\u0111\u1eb7c bi\u1ec7t)",
    vs: "danh t\u1eeb ho\u1eb7c gi\u1edbi t\u1eeb l\xe0m tr\u1ee3 t\u1eeb cho \u0111\u1ed9ng t\u1eeb suru",
    "vs-i": "\u0111\u1ed9ng t\u1eeb b\u1ea5t quy t\u1eafc -suru",
    vt: "tha \u0111\u1ed9ng t\u1eeb",
    vulg: "thu\u1eadt ng\u1eef th\xf4 t\u1ee5c",
    vz: "tha \u0111\u1ed9ng t\u1eeb",
    X: "thu\u1eadt ng\u1eef th\xf4 t\u1ee5c"
  }

  if (!kind) { return ""}
  let arr = kind.split(",");
  console.log(arr);
  return arr
  .map (x => trim(x))
  .map (x => kindTablesVi[x])
  .join(", ");
}