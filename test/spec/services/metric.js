'use strict';

describe('Service: metric', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var metric;
  beforeEach(inject(function (_metric_) {
    metric = _metric_;
  }));

  it('should contain the expected metric names', function () {
    expect(typeof metric.VIEW_AUCTION_SETTINGS).toBe('string');
    expect(typeof metric.CHANGE_AUCTION_SETTINGS).toBe('string');
    expect(typeof metric.VIEW_PROFILE_SETTINGS).toBe('string');
    expect(typeof metric.CHANGE_PROFILE_SETTINGS).toBe('string');
    expect(typeof metric.VIEW_ACCOUNT_MANAGEMENT).toBe('string');
    expect(typeof metric.CHANGE_ACCOUNT_MANAGEMENT).toBe('string');

//    expect(typeof metric.VIEW_ANALYTICS_DASHBOARD).toBe('string');
    expect(typeof metric.VIEW_ALL_TOP_AUCTIONS).toBe('string');
    expect(typeof metric.VIEW_CURRENT_REPORT).toBe('string');
    expect(typeof metric.VIEW_HISTORICAL_REPORT).toBe('string');

    expect(typeof metric.FLOOR_A_VEHICLE).toBe('string');
    expect(typeof metric.BULK_FLOOR_A_VEHICLE).toBe('string');
    expect(typeof metric.SEARCH_FOR_SELLER).toBe('string');
    expect(typeof metric.SEARCH_FOR_BUYER).toBe('string');

//    expect(typeof metric.VIEW_FLOOR_PLAN_DETAILS).toBe('string');
//    expect(typeof metric.VIEW_TITLE).toBe('string');

//    expect(typeof metric.VIEW_MAIN_DASHBOARD).toBe('string');
    expect(typeof metric.VIEW_RESOURCE_DOCUMENT).toBe('string');
    expect(typeof metric.QUERY_BUYER_LINE_OF_CREDIT).toBe('string');
    expect(typeof metric.REQUEST_UNAPPLIED_FUNDS_PAYOUT).toBe('string');

//    expect(typeof metric.VIEW_PAYMENTS_LIST).toBe('string');
    expect(typeof metric.SCHEDULE_PAYMENT).toBe('string');
    expect(typeof metric.MAKE_IMMEDIATE_PAYMENT).toBe('string');
    expect(typeof metric.ADD_TO_BASKET).toBe('string');
//    expect(typeof metric.VIEW_SCHEDULED_PAYMENTS_LIST).toBe('string');

//    expect(typeof metric.VIEW_RECEIPTS_LIST).toBe('string');
//    expect(typeof metric.VIEW_RECEIPT_DETAIL).toBe('string');
  });

});
