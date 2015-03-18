'use strict';

var frisby = require('frisby');
var base = 'https://test.nextgearcapital.com/MobileService/api/';
var credentials = 'Njg5NDZURjpuZ2NwYXNzITA6MQ==';
var yearId = 2011;
var makeId = 4; // 'Audi'
var modelId = 8; // '3500 Regular Cab & Chassis'
var vehicleId = 352620;
var mileage = 10000;
var zipCode = '46032';
var vin = '19UYA3253WL002778';

frisby.create('Kelley Blue Book (KBB): Authenticate')
  //.addHeader('Content-Type', 'application/json')
  //.addHeader('Accept', 'application/json')
  .addHeader('Authorization', 'CT ' + credentials)
  .post(base + 'UserAccount/v1_1/Authenticate')
  .inspectJSON()
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

    frisby.create('KBB: Gets vehicle years for the specified vehicle class and application category')
      .get(base + 'kbb/vehicle/getyears/UsedCar/Dealer')
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
      .expectJSONLength('Data', 11)
      .toss();

    frisby.create('KBB: Gets vehicle makes by year')
      .get(base + 'kbb/vehicle/getmakesbyyear/UsedCar/Dealer/' + yearId)
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
      .get(base + 'kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/' + makeId + '/' + yearId)
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

    frisby.create('KBB: Gets trims and vehicle IDs by year and model')
      .get(base + 'kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/' + modelId + '/' + yearId)
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

    frisby.create('KBB: Gets vehicle values by vehicle ID, mileage, and ZIP code')
      .get(base + 'kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/' + vehicleId + '/' + mileage + '/' + zipCode)
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

    frisby.create('KBB: Gets vehicle configurations by VIN and ZIP code')
      // TODO UsedCare/Dealer
      .get(base + 'kbb/vin/getvehicleconfigurationbyvin/' + vin + '/' + zipCode)
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

    frisby.create('KBB: Gets vehicle values by configuration, ZIP code and vehicle condition')
      // API needs to be updated here!
      // TODO
      .get(base + 'kbb/vehicle/getvehicleconfigurationbyvehicleid/' + vehicleId + '/' + zipCode)
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
      // TODO .toss();

    frisby.create('KBB: Gets vehicle configuration by vehicle ID and ZIP code')
      .get(base + '/kbb/vehicle/getvehicleconfigurationbyvehicleid/UsedCar/Dealer/' + vehicleId + '/' + zipCode)
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
  })
  .toss();
