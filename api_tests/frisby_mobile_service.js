/**
 * Frisby extensions for testing the MobileService API with an authenticate method and helper methods
 *
 * Usage:
 *  frisby.login()
 *    .after(function () {
 *
 *      frisby.create('Foo: Gets all the foos')
 *        .get(frisby.apiBase + 'foo')
 *        .expectSuccess()
 *        .toss();
 *
 *      frisby.create('Bar: Gets all the bars')
 *        .get(frisby.apiBase + 'bar')
 *        .expectSuccess()
 *        .toss();
 *
 *    })
 *    .toss();
 */

'use strict';

var frisby = require('frisby');

var apiBase = process.env.API_BASE || 'https://test.nextgearcapital.com/MobileService/api/';
var username = process.env.USERNAME || '53190md';
var password = process.env.PASSWORD || 'ngcpass!0';
console.log(password);
console.log(process.env);

console.log('You can run with the following options:');
console.log('jasmine-node api_tests/ --config API_BASE http://localhost:9000/ '
+ '--config USERNAME myUser --config PASSWORD myPassword)');

// extend the frisby prototype so each Frisby test can use extension methods
var frisbyPrototype = frisby.create('mobileservice-exensions').constructor.prototype;

// export object (use frisby)
var frisbyMobileService = module.exports = frisby;
frisbyMobileService.apiBase = apiBase;

// Frisby extension method
frisbyPrototype.expectSuccess = function () {

  return this.expectStatus(200)
    .inspectJSON() // comment this out to suppress logging response data
    .expectStatus(200)
    .expectJSON({
      Success: true,
      Message: null
    })
    .expectJSONTypes({
      Success: Boolean
    })
    .afterJSON(function (res) {
      if (!res.Success) {
        throw new Error(res.Message);
      }
    });
};

frisby.login = function (langId) {

  var lang = langId || 1;
  var authorization = new Buffer(username + ':' + password + ':' + lang).toString('base64');

  var newFrisby = frisby.create('Mobile Service Authenticate');

  return newFrisby
    //.addHeader('Content-Type', 'application/json')
    //.addHeader('Accept', 'application/json')
    .addHeader('Authorization', 'CT ' + (authorization || defaultAuthorization))
    .post(apiBase + 'UserAccount/v1_1/Authenticate')
    .expectSuccess()
    .afterJSON(function (res) {
      var token = res.Data.Token;
      frisby.globalSetup({
        request: {
          headers: {
            'Authorization': 'CT ' + token
          }
        }
      });
    });
};
