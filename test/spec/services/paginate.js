'use strict';

describe('Service: paginate', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var p,
    config;

  beforeEach(inject(function (Paginate, nxgConfig) {
    p = Paginate;
    config = nxgConfig;
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
      //(data, totalItems, currentPageNumber, pageSize
      var res = p.addPaginator({}, 100, 1, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 100, 2, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 100, 9, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 100, 10, 10);
      expect(res.$paginator.hasMore()).toBe(false);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 95, 9, 10);
      expect(res.$paginator.hasMore()).toBe(true);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 95, 10, 10);
      expect(res.$paginator.hasMore()).toBe(false);
    });

    it('should respect the infinite scroll max', function() {
      config.infiniteScrollingMax = 5;

      //(data, totalItems, currentPageNumber, pageSize
      var res = p.addPaginator({}, 5, 1, 4);
      expect(res.$paginator.hasMore()).toBe(true);

      //(data, totalItems, currentPageNumber, pageSize
      res = p.addPaginator({}, 6, 2, 5);
      expect(res.$paginator.hasMore()).toBe(false);
    });

  });

});
