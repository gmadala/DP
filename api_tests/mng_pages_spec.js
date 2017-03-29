/**
 * Created by bala.nithiya on 1/27/17.
 */

'use strict';

var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;
var make_a_payment_data = require('../api_tests/api_test_data/make_a_payment_data.json');
var receipts_data = require('../api_tests/api_test_data/receipts_data.json');
var view_floor_plan_data = require('../api_tests/api_test_data/view_floor_plan_data.json');

var frisby = require('frisby');

frisby.create('Test_Test')
    .get('https://test.nextgearcapital.com/test/#/login')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'text/html')
    .toss();

frisby.create('Make a Payment Page')
    .get(base + '/payment/getaccountfees')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    //.expectJSON(make_a_payment_data)
    .toss();

frisby.create('Receipts')
    .get(base + '/receipt/search?OrderBy=CreateDate&OrderByDirection=DESC&PageNumber=1&PageSize=15')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    //.expectJSON(receipts_data)
    .toss();

frisby.create('View Floor Plan')
    .get(base + '/floorplan/search?OrderBy=FlooringDate&OrderByDirection=DESC&PageNumber=1&PageSize=15')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    //.expectJSON(view_floor_plan_data)
    .toss();

frisby.create('Value Lookup')
    .get(base + '/kbb/vehicle/getyears/UsedCar/Dealer')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Open Audits')
    .get('https://uat.api.nextgearcapital.com/test/ngen/cam/6e56cd8c-36dd-4397-aa61-9facd666aaf4/open_audits?api_key=fbymcqgckrvh7a2h8eavek7e&apiToken=C66E86A2-621B-42E3-9814-E5903BF161AB')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss();

frisby.create('Title Release')
    .get(base + '/titleRelease/getTitleReleaseEligibility')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Analytics')
    .get(base + '/dealer/summary')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Analytics - Average Turn Time')
    .get(base + '/analytics/averageturntime')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Analytics - Aging')
    .get(base + '/analytics/aging')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Promos')
    .get('https://uat.api.nextgearcapital.com/test/ngen/eventsales?api_key=fbymcqgckrvh7a2h8eavek7e&apiToken=C66E86A2-621B-42E3-9814-E5903BF161AB')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .toss();

frisby.create('Profile Settings')
    .get(base + '/userAccount/availableNotifications')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Account Management - Recent Transaction')
    .get(base + '/dealer/recenttransaction')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Account Management - Settings')
    .get(base + '/userAccount/v1_1/settings')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Account Management - Summary')
    .get(base + '/dealer/v1_1/summary')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();

frisby.create('Account Management - Info')
    .get(base + '/dealer/v1_1/Info')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json; charset=utf-8')
    .toss();
