'use strict';

var frisby = require('frisby');
var base = 'https://test.nextgearcapital.com/MobileService/api/';
var credentials = 'Njg5NDZURjpuZ2NwYXNzITA6MQ==';
var vehicleClass = 'UsedCar'; // or NewCar
var applicationCategory = 'Dealer'; // or Consumer
var yearId = 1995;
var makeId = 16; // 'GMC'
var modelId = 27751; // '3500 Regular Cab & Chassis'
var vehicleId = 1000; // TODO
var zipCode = '46123'; // TODO



frisby.create('Kelley Blue Book (KBB): Authenticate')
  //.addHeader('Content-Type', 'application/json')
  //.addHeader('Accept', 'application/json')
  .addHeader('Authorization', 'CT ' + credentials)
  .post(base + 'UserAccount/v1_1/Authenticate')
  //.inspectJSON()
  .expectStatus(200)
  .expectJSON({
    Success: true,
    Message: null,
    Data: {}
  })
  .expectJSONTypes({
    Success: Boolean
  })
  .afterJSON(function (res) {
    var token = res.Data.Token;
    frisby.globalSetup({
      request: {
        headers: {
          'Authorization': 'CT ' + token
        }
      }
    });

    frisby.create('KBB: Gets the vehicle years for the specified vehicle class and application category')
      .get(base + 'kbb/vehicle/getyears/' + vehicleClass + '/' + applicationCategory)
      //.inspectJSON()
      .expectStatus(200)
      .expectJSON({
        Success: true,
        Message: null,
        Data: []
      })
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectJSONLength('Data', 11)
      .toss();


    frisby.create('KBB: Gets vehicle makes by year')
      .get(base + 'kbb/vehicle/getmakesbyyear/' + vehicleClass + '/' + applicationCategory + '/' + yearId)
      //.inspectJSON()
      .expectStatus(200)
      .expectJSON({
        Success: true,
        Message: null,
        Data: []
      })
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectJSONLength('Data', 1)
      .toss();


    frisby.create('KBB: Gets vehicle models by year and make')
      .get(base + 'kbb/vehicle/getmodelsbyyearandmake/' + vehicleClass + '/' + applicationCategory + '/' + makeId + '/' + yearId)
      .inspectJSON()
      .expectStatus(200)
      .expectJSON({
        Success: true,
        Message: null,
        Data: []
      })
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectJSONLength('Data', 1)
      .toss();

    frisby.create('KBB: Gets the trims and vehicle ids by year and model')
      .get(base + 'kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/' + vehicleClass + '/' + applicationCategory + '/' + modelId + '/' + yearId)
      .inspectJSON()
      .expectStatus(200)
      .expectJSON({
        Success: true,
        Message: null,
        Data: []
      })
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectJSONLength('Data', 1);
    // TODO API needs to be changed by modifying the route for this function
    // .toss();

    frisby.create('KBB: Gets the vehicle configuration by vehicle identifier')
      // API needs to be updated here!
      .get(base + 'kbb/vehicle/getvehicleconfigurationbyvehicleid/' + vehicleClass + '/' + applicationCategory + '/' + vehicleId + '/' + zipCode)
      .inspectJSON()
      .expectStatus(200)
      .expectJSON({
        Success: true,
        Message: null,
        Data: []
      })
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectJSONLength('Data', 1);
    // TODO need vehicleId.toss();

    // TODO add tests for the other endpoints
  })
  .toss();
