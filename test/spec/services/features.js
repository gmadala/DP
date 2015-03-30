'use strict';

describe('Service: features', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var features, $location;

  beforeEach(inject(function (_features_, _$location_) {

    features = _features_;
    $location = _$location_;
  }));

  it('kbb should be defined', function () {

    expect(features.kbb).toBeDefined();
    expect(features.kbb.enabled).toBeDefined();
  });

  it('kbb should be enabled', function () {

    expect(features.kbb.enabled).toBeTruthy();
  });

  it('kbb should be enabled when enabled by query parameter', function () {

    // change query string
    $location.search('features', 'feature1,kbb,anotherfeature');

    // reload from the query string
    features.loadFromQueryString();

    expect(features.kbb.enabled).toBeTruthy();
  });

  it('kbb should still be enabled when the query parameter sets other features', function () {

    // change query string
    $location.search('features', 'feature1,anotherfeature');

    // reload from the query string
    features.loadFromQueryString();

    expect(features.kbb.enabled).toBeTruthy();
  });
});
