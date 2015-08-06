
// To test the bank account information retrieved is associated with the logged in dealer
'use strict';


var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;


frisby.login()
  .after(function () {

    frisby.create('Financial Account: Check unassociated financial account')
      .get(base + 'dealer/bankAccount/f9bb018d-e33f-437e-bcb9-38ffdb66af76')
      .expectJSON({
        Message: 'Invalid access'
      })
      .expectStatus(403)
      .toss();

  })
  .toss();




