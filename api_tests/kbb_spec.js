'use strict';

var frisby = require('./frisby_mobile_service');
var yearId = 2014;
var makeId = 4; // 'Audi'
var modelId = 9; // ''
var vehicleId = 352620;
var mileage = 10000;
var zipCode = '46032';
var vin = '19UYA3253WL002778';
var base = frisby.apiBase;

// for dev
//base = 'http://localhost:8080/';
//frisby.login('68946TF', 'ngcpass!0')
frisby.authenticate()
  .after(function () {

    frisby.create('KBB: Gets vehicle years for the specified vehicle class and application category')
      .get(base + 'kbb/vehicle/getyears/UsedCar/Dealer')
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectSuccess()
      .toss();

    frisby.create('KBB: Gets vehicle makes by year')
      .get(base + 'kbb/vehicle/getmakesbyyear/UsedCar/Dealer/' + yearId)
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      .expectSuccess()
      .toss();

    frisby.create('KBB: Gets vehicle models by year and make')
      .get(base + 'kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/' + makeId + '/' + yearId)
      .expectSuccess()
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      .toss();

    frisby.create('KBB: Gets trims and vehicle IDs by year and model')
      .get(base + 'kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/' + modelId + '/' + yearId)
      .expectSuccess()
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      .toss();

    frisby.create('KBB: Gets vehicle values by vehicle ID, mileage, and ZIP code')
      .get(base + 'kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/' + vehicleId + '/' + mileage + '/' + zipCode)
      .expectSuccess()
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      .toss();

    frisby.create('KBB: Gets vehicle configurations by VIN and ZIP code')
      .get(base + 'kbb/vin/getvehicleconfigurationbyvin/' + vin + '/' + zipCode)
      .expectSuccess();
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      //.toss();

    frisby.create('KBB: Gets vehicle configuration by vehicle ID and ZIP code')
      .get(base + '/kbb/vehicle/getvehicleconfigurationbyvehicleid/UsedCar/Dealer/' + vehicleId + '/' + zipCode)
      .expectSuccess()
      //.expectJSONTypes('Data.*', {
      //  Key: Number,
      //  Value: String
      //})
      //.expectJSONLength('Data', 1)
      .toss();
  })
  .toss();
