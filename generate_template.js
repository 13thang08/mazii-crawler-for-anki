function getTemplate() {
  return `
  <div _ngcontent-c18="" class="box-main-word">
  <div _ngcontent-c18="" class="main-word cl-red-main"> {{word}} </div>
  <!---->
  <div _ngcontent-c18="" class="phonetic-word japanese-char cl-content"> {{phonetic}} </div>
  <!----><!---->
  <!---->
  ${getAllMean()}
<br/>
</div>  
  `
}

function getAllMean() {
  return Array.from(Array(6).keys())
    .map(i => getMean(i))
    .join("");
}

function getMean(meanIndex) {
  return `
  {{#mean_${meanIndex}}}
  <div _ngcontent-c18="" class="mean-detail-range">
    {{#kind_${meanIndex}}}<div _ngcontent-c18="" class="type-word cl-red">☆ {{kind_${meanIndex}}} </div>{{/kind_${meanIndex}}}
    <!---->
    <div _ngcontent-c18="">
      <div _ngcontent-c18="" class="mean-fr-word cl-blue">◆ {{mean_${meanIndex}}}</div>
      <div _ngcontent-c18="" class="example-range">
        <app-example _ngcontent-c18="" _nghost-c19="">
          <!---->
          ${getAllExample(meanIndex)}
          <!---->
        </app-example>
      </div>
    </div>
  </div>
  {{/mean_${meanIndex}}}
  `
}

function getAllExample(meanIndex) {
  return Array.from(Array(6).keys())
    .map(exampleIndex => getExample(meanIndex, exampleIndex))
    .join("");

}

function getExample(meanIndex, exampleIndex) {
  return `
          <!---->
          {{#examples_${meanIndex}_0_content}}
          <div _ngcontent-c19="" class="example-container">
            {{#examples_${meanIndex}_${exampleIndex}_content}}
            <div _ngcontent-c19="" class="content-example">
              <div _ngcontent-c19="" class="example-word sentence-exam cl-red">
                <!---->
                <div _ngcontent-c19="" class="content-word-example">
                  <div _ngcontent-c19="" class="japanese-char inline">
                    <!---->
                    <ruby _ngcontent-c19="">
                      {{examples_${meanIndex}_${exampleIndex}_content}}
                      <p _ngcontent-c19="" class="txt-romaji" ng-if="me.r"></p>
                      <rt style="text-align: left;" _ngcontent-c19="">{{examples_${meanIndex}_${exampleIndex}_transcription}}</rt>
                    </ruby>
                  </div>
                </div>
                <!---->
              </div>
              <div _ngcontent-c19="" class="example-mean-word sentence-exam cl-content">
                <!----><!----><span _ngcontent-c19="">{{examples_${meanIndex}_${exampleIndex}_mean}}</span>
              </div>
            </div>
            {{/examples_${meanIndex}_${exampleIndex}_content}}
          </div>
          {{/examples_${meanIndex}_0_content}}
          <!---->
  `
}

function main() {
  console.log(getTemplate());
}

main();