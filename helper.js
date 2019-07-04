const axios = require('axios');
const { throwError, from, of, Observable } = require('rxjs');
const { catchError, retry, tap, retryWhen, delay, take } = require('rxjs/operators');

function getRequest(url) {
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

function postRequest(url, data) {
  return Observable.create( ( observer ) => {
    console.log(`Requesting...: ${url}`);
    axios.post(url, data)
    .then( ( response ) => {
      observer.next( response.data );
      observer.complete();
    } )
    .catch( ( error ) => {
      observer.error( error );
    } );
  });
}

async function toPromise(observable) {
  return observable.pipe(
    // retryWhen(errors => errors.pipe(delay(randomIntFromInterval(2000, 10000)), take(20)) )
    retry(30)
  ).toPromise();
}

module.exports = {
  getRequest,
  postRequest,
  toPromise
}