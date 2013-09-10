'use strict';

describe('Service: paginate', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var p;
  beforeEach(inject(function (Paginate) {
    p = Paginate;
  }));

  it('should define a range of page sizes', function () {
    expect(typeof p.PAGE_SIZE_SMALL).toBe('number');
    expect(typeof p.PAGE_SIZE_MEDIUM).toBe('number');
    expect(typeof p.PAGE_SIZE_LARGE).toBe('number');
  });

  it('should have a firstPage function that returns a number', function () {
    expect(typeof p.firstPage()).toBe('number');
  });

  it('should have an addPaginator function', function () {
    expect(typeof p.addPaginator).toBe('function');
  });

  describe('addPaginator function', function () {

    it('should add a $paginator property to the provided data object', function () {
      var res = p.addPaginator({foo: 'bar'}, 100, 1, 10);
      expect(res.foo).toBe('bar');
      expect(res.$paginator).toBeDefined();
    });

    it('should have a nextPage method that returns the next page number', function () {
      var res = p.addPaginator({}, 100, 1, 10);
      expect(res.$paginator.nextPage()).toBe(2);
    });

    it('should have a hasMore method that returns true until the next page would be empty', function () {
      var res = p.addPaginator({}, 100, 1, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      res = p.addPaginator({}, 100, 2, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      res = p.addPaginator({}, 100, 9, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      res = p.addPaginator({}, 100, 10, 10);
      expect(res.$paginator.hasMore()).toBe(false);

      res = p.addPaginator({}, 95, 9, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      res = p.addPaginator({}, 95, 10, 10);
      expect(res.$paginator.hasMore()).toBe(false);
    });

  });

});
