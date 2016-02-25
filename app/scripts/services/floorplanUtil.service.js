'use strict';

angular.module('nextgearWebApp')
  .factory('FloorplanUtil', function (Floorplan) {

    var FloorplanUtil = function(defaultSort, initialFilter) {
      this.results = [];
      this.loading = false;
      this.paginator = null;
      this.hitInfiniteScrollMax = false;
      this.defaultSort = defaultSort;
      this.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Floorplan.filterValues.ALL,
        inventoryLocation: undefined,
        sortField: defaultSort,
        sortDescending: true
      };
    };

    FloorplanUtil.prototype = {
      search: function(criteria) { // start from the beginning
        this.paginator = null;
        this.hitInfiniteScrollMax = false;
        this.results.length = 0;
        this.searchCriteria = criteria;

        this.fetchNextResults();
      },
      fetchNextResults: function() {
        var paginator = this.paginator,
          promise, lastPromise;

        if (paginator && !paginator.hasMore()) {
          if (paginator.hitMaximumLimit()) {
            this.hitInfiniteScrollMax = true;
          }
          return;
        }

        // get the next applicable batch of results
        this.loading = true;
        promise = lastPromise = Floorplan.search(this.searchCriteria, paginator);
        promise.then(_.bind(
          function (result) {
            if (promise !== lastPromise) {
              return;
            }

            this.loading = false;
            this.paginator = result.$paginator;
            // fast concatenation of results into existing array
            Array.prototype.push.apply(this.results, result.Floorplans);
          }, this), _.bind(function (/*error*/) {
            if (promise !== lastPromise) { return; }
            this.loading = false;
          }, this)
        );
      },
      sortBy: function(fieldName) {
        if (this.searchCriteria.sortField === fieldName) {
          // already sorting by this field, just flip the direction
          this.searchCriteria.sortDescending = !this.searchCriteria.sortDescending;
        } else {
          this.searchCriteria.sortField = fieldName;
          this.searchCriteria.sortDescending = false;
        }

        this.search(this.searchCriteria);
      },
      resetSearch: function(initialFilter) {
        this.searchCriteria = {
          query: null,
          startDate: null,
          endDate: null,
          filter: initialFilter || Floorplan.filterValues.ALL,
          inventoryLocation: undefined,
          sortField: this.defaultSort,
          sortDescending: true
        };

        this.search(this.searchCriteria);
      }
    };
    return FloorplanUtil;
  });
