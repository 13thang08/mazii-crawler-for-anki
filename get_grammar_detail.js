const csv2json = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
const helper = require('./helper');
const config = require('./config');
const get = require('get-value');
const fs = require('fs');
const promisify = require('util').promisify;
const appendFile = promisify(fs.appendFile);
const unlink = promisify(fs.unlink);
const endOfLine = require('os').EOL;
const fields = [
  'level',
  'title_ja',
  'title_vi',
  'synopsis',
  'explain',
  'example1_content',
  'example1_mean',
  'example2_content',
  'example2_mean',
  'example3_content',
  'example3_mean',
  'example4_content',
  'example4_mean',
  'example5_content',
  'example5_mean',
  'example6_content',
  'example6_mean',
  'example7_content',
  'example7_mean',
  'example8_content',
  'example8_mean',
  'example9_content',
  'example9_mean',
  'example10_content',
  'example10_mean',

];

async function getGrammerDetail(id) {
  let url = `https://mazii.net/api/grammar/${id}`;
  try {
    let response = await helper.toPromise(helper.getRequest(url));

    return response
  } catch(e) {
    // console.log(e);
    console.log(`Error when processing: ${url}`);
  }
}

async function getCsvRow(id) {
  let detail = await getGrammerDetail(id);
  let grammar = get(detail, 'grammar');
  if (!grammar) {
    return;
  }

  let data = [];
  data['level'] = grammar.level;

  let title = grammar.title;

  if (title) {
    let titleArr = title.split("=>");
    data['title_ja'] = trim( get(titleArr, '0') );
    data['title_vi'] = trim( get(titleArr, '1') );
  }

  let usage = get(grammar, 'usages.0');
  data['synopsis'] = trim( get(usage, 'synopsis'));
  data['explain'] = trim( get(usage, 'explain'));

  data['example1_content'] = trim( get(usage, 'examples.0.content'));
  data['example1_mean'] = trim( get(usage, 'examples.0.mean'));
  data['example2_content'] = trim( get(usage, 'examples.1.content'));
  data['example2_mean'] = trim( get(usage, 'examples.1.mean'));
  data['example3_content'] = trim( get(usage, 'examples.2.content'));
  data['example3_mean'] = trim( get(usage, 'examples.2.mean'));
  data['example4_content'] = trim( get(usage, 'examples.3.content'));
  data['example4_mean'] = trim( get(usage, 'examples.3.mean'));
  data['example5_content'] = trim( get(usage, 'examples.4.content'));
  data['example5_mean'] = trim( get(usage, 'examples.4.mean'));
  data['example6_content'] = trim( get(usage, 'examples.5.content'));
  data['example6_mean'] = trim( get(usage, 'examples.5.mean'));
  data['example7_content'] = trim( get(usage, 'examples.6.content'));
  data['example7_mean'] = trim( get(usage, 'examples.6.mean'));
  data['example8_content'] = trim( get(usage, 'examples.7.content'));
  data['example8_mean'] = trim( get(usage, 'examples.7.mean'));
  data['example9_content'] = trim( get(usage, 'examples.8.content'));
  data['example9_mean'] = trim( get(usage, 'examples.8.mean'));
  data['example10_content'] = trim( get(usage, 'examples.9.content'));
  data['example10_mean'] = trim( get(usage, 'examples.9.mean'));

  return data;
}

async function appendCsvFile(data) {
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse([data]);
  await appendFile(config.grammar_detail_file, `${endOfLine}`);
  await appendFile(config.grammar_detail_file, csv);
}

async function appendCsvArr(arr) {
  const json2csvParser = new Json2csvParser({ fields, header: false });
  const csv = json2csvParser.parse(arr);
  await appendFile(config.grammar_detail_file, csv);
}

function trim(str) {
  if (str) { return str.trim().replace(/(?:\r\n|\r|\n)/g, '<br>') }
}

function compare(lhs, rhs) {
  if (lhs.level && rhs.level) {
    if (lhs.level == rhs.level) {
      return 0;
    } else {
      return lhs.level < rhs.level ? -1 : 1;
    }
  } else {
    return 0;
  }
}

async function main() {
  try {
    await unlink(config.grammar_detail_file);
  } catch(error) {

  }

  // await appendFile(config.grammar_detail_file, fields.join(","));

  let inputs = await csv2json().fromFile(config.grammar_ids_file);

  let arr = [];

  for(let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let id = input.id;
    let row = await getCsvRow(id);
    arr.push(row);
    console.log(`progress ${i+1}/${inputs.length}`);
  }

  arr.sort(compare);
  await appendCsvArr(arr);
}

main();