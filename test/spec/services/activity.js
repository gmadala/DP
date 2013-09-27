'use strict';

describe('Service: activity', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var activity;
  beforeEach(inject(function (_activity_) {
    activity = _activity_;
  }));

  it('should start with no indicators', function () {
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should report indicators are present when an activity has been added', function () {
    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
  });

  it('should report indicators are no longer present when the activity has been removed', function () {
    activity.add('foo');
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should correctly report indicator presence as multiple activities are added and removed', function () {
    activity.add('foo');
    activity.add('bar');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.add('baz');
    activity.remove('bar');
    expect(activity.indicators.arePresent()).toBe(true);
    activity.remove('baz');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should allow indicators to be suppressed and re-enabled globally', function () {
    activity.add('foo');
    activity.indicators.suppress();
    expect(activity.indicators.arePresent()).toBe(false);

    activity.indicators.allow();
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should allow activity ids to be reused independently after removal', function () {
    activity.add('foo');
    activity.remove('foo');

    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should only count the activity once if the same id is used while still active', function () {
    activity.add('foo');
    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

  it('should gracefully handle removal of a non-existent activity id', function () {
    activity.remove('whee');
    activity.add('foo');
    expect(activity.indicators.arePresent()).toBe(true);

    activity.remove('foo');
    expect(activity.indicators.arePresent()).toBe(false);
  });

});
