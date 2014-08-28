'use strict';

angular.module('nextgearWebApp')
  .factory('TitleReleases', function(api, Addresses, $q, Paginate, moment) {

    var eligibilityLoading = false;

    var queue = [];

    return {

      filterValues: {
        ALL: 'all',
        OUTSTANDING: 'outstanding',
        ELIGIBLE: 'eligible',
        NOT_ELIGIBLE: 'not_eligible'
      },
      getTitleReleaseEligibility: function() {
        eligibilityLoading = true;
        return api.request('GET', '/titleRelease/getTitleReleaseEligibility').then(function(res) {
          eligibilityLoading = false;
          return res;
        });
      },

      getEligibilityLoading: function() {
        return eligibilityLoading;
      },

      getQueue: function() {
        return queue;
      },

      clearQueue: function() {
        queue.length = 0;
      },

      addToQueue: function(floorplan) {
        queue.push(floorplan);
      },

      getQueueFinanced: function() {
        return _.reduce(queue, function(sum, item) {
          return sum + item.AmountFinanced;
        }, 0);
      },

      removeFromQueue: function(floorplan) {
        var indexOf = _.findIndex(queue, function(item) {
          return item.FloorplanId === floorplan.FloorplanId;
        });

        if(indexOf !== -1) {
          queue.splice(indexOf, 1);
        }
      },

      isFloorplanOnQueue: function(floorplan) {
        return _.some(queue, function(item) {
          return floorplan.FloorplanId === item.FloorplanId;
        });
      },

      makeRequest: function() {
        // Get the default address to send with non-overridden floorplans
        var needDefaultAddress = !_.every(queue, function(floorplan) {
          return floorplan.overrideAddress;
        });

        // Get the default address (if needed) and make the API request
        var defaultAddress;
        if(needDefaultAddress){
          defaultAddress = Addresses.getDefaultTitleAddress();
        }

        var floorplans = _.map(queue, function(floorplan) {
          return {
            FloorplanId: floorplan.FloorplanId,
            ReleaseAddressId: floorplan.overrideAddress ? floorplan.overrideAddress.AddressId : defaultAddress.AddressId
          };
        });

        var data = {
          TitleReleases: floorplans
        };

        return api.request('POST', '/titleRelease/RequestTitleRelease', data);
      },
      search: function (criteria, paginator) {
        var params = {
            Keyword: criteria.query || undefined,
            OrderBy: criteria.sortField || 'FlooringDate',
            OrderByDirection: criteria.sortDesc === undefined || criteria.sortDesc === true ? 'DESC' : 'ASC',
            PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            PageSize: Paginate.PAGE_SIZE_MEDIUM,
            StartDate: api.toShortISODate(criteria.startDate) || undefined,
            EndDate: api.toShortISODate(criteria.endDate) || undefined,
            SearchOutstandingTitleReleaseProgramRelease: criteria.filter === this.filterValues.OUTSTANDING || criteria.filter === this.filterValues.ALL,
            SearchEligibleForRelease: criteria.filter === this.filterValues.ELIGIBLE || criteria.filter === this.filterValues.ALL,
            SearchNotEligibleForRelease: criteria.filter === this.filterValues.NOT_ELIGIBLE || criteria.filter === this.filterValues.ALL
          };
        return api.request('GET', '/titleRelease/search', params).then(
          function (results) {
            angular.forEach(results.Floorplans, function (floorplan) {
              floorplan.data = {query: criteria.query};
              if (floorplan.FlooringDate && floorplan.FlooringDate !== null) {
                var today = moment();
                var floored = moment(floorplan.FlooringDate);
                floorplan.DaysFloored = today.diff(floored, 'days');
              }
            });
            return Paginate.addPaginator(results, results.FloorplanRowCount, params.PageNumber, params.PageSize);
          }
        );
      }

    };
  });
