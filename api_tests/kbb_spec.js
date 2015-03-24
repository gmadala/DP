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
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .expectSuccess()
      .toss();

    frisby.create('KBB: Gets vehicle models by year and make')
      .get(base + 'kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/' + makeId + '/' + yearId)
      .expectSuccess()
      .expectJSONTypes('Data.*', {
        Key: Number,
        Value: String
      })
      .toss();

    frisby.create('KBB: Gets trims and vehicle IDs by year and model')
      .get(base + 'kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/' + modelId + '/' + yearId)
      .expectSuccess()
      .expectJSONTypes('Data.*', {
        Id: Number,
        VehicleId: Number,
        DisplayName: String
      })
      .timeout(20000)
      .toss();

    frisby.create('KBB: Gets vehicle values by vehicle ID, mileage, and ZIP code')
      .get(base + 'kbb/value/getvehiclevaluesallconditions/UsedCar/Dealer/' + vehicleId + '/' + mileage + '/' + zipCode)
      .expectSuccess()
      .expectJSONTypes('Data', {
        IsInsufficientMarketData: Boolean,
        IsLimitedProduction: Boolean,
        MileageAdjustment: Number,
        MileageZeroPoint: Number,
        ValuationZipCode: String
      })
      .expectJSONTypes('Data.ValuationPrices.*', {
        Id: Number,
        IsMaxDeductApplied: Boolean,
        PriceType: Number,
        Value: Number
      })
      .expectJSONLength('Data.ValuationPrices', 5)
      .timeout(20000)
      .toss();

    frisby.create('KBB: Gets vehicle configurations by VIN and ZIP code')
      .get(base + 'kbb/vin/getvehicleconfigurationbyvinandclass/UsedCar/' + vin + '/' + zipCode)
      .expectSuccess()
      .expectJSONTypes('Data.*', {
        Id: Number,
        VIN: String,
        Year: {
          Id: Number,
          Value: String
        },
        Make: {
          Id: Number,
          Value: String
        },
        Model: {
          Id: Number,
          Value: String
        },
        Trim: {
          Id: Number,
          Value: String
        },
        Mileage: Number
      })
      .toss();

    frisby.create('KBB: Gets vehicle configuration by vehicle ID and ZIP code')
      .get(base + '/kbb/vehicle/getvehicleconfigurationbyvehicleid/UsedCar/Dealer/' + vehicleId + '/' + zipCode)
      .expectSuccess()
      .expectJSONTypes('Data', {
        Id: Number,
        Year: {
          Key: Number,
          Value: String
        },
        Make: {
          Key: Number,
          Value: String
        },
        Model: {
          Key: Number,
          Value: String
        },
        Trim: {
          Key: Number,
          Value: String
        },
        Mileage: Number
      })
      .toss();
  })
  .toss();
