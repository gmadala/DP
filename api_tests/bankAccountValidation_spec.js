// To test the bank account information retrieved is associated with the logged in dealer
'use strict';


var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;


frisby.login()
    .after(function () {

        frisby.create('Financial Account: Check unassociated financial account')
            .get(base + 'dealer/bankAccount/ba057bf9-2333-4a25-904d-5e872fddda78')
            .expectJSON({
                // Message: 'Invalid access'
                "Success": false,
                "Message": "The bank account cannot be found",
                "Data": null
            })
            .expectStatus(200)
            .toss();
    })
    .toss();




