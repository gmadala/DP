(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('Floorplan', Floorplan);

  Floorplan.$inject = ['api', 'Paginate', 'User', '$q', 'gettextCatalog'];

  function Floorplan(api, Paginate, User, $q, gettextCatalog) {
    var overrideInProgress = false;

    function handleNgenRequest(response) {
      api.resetSessionTimeout();
      return response;
    }

    return {
      create: function (data) {
        // transform data types as needed for API
        data = angular.copy(data);

        angular.extend(data, {
          // boolean
          PaySeller: api.toBoolean(data.PaySeller),
          SaleTradeIn: api.toBoolean(data.SaleTradeIn),
          VinAckLookupFailure: api.toBoolean(data.VinAckLookupFailure),
          // int
          UnitYear: api.toInt(data.UnitYear),
          // date
          UnitPurchaseDate: api.toShortISODate(data.UnitPurchaseDate),
          // option object values that need flattened to ids
          UnitColorId: data.UnitColorId ? data.UnitColorId.ColorId : null,
          TitleLocationId: data.TitleLocationIndex ? data.TitleLocationId.ResultingTitleLocationId : null,
          TitleTypeId: data.TitleLocationId ? data.TitleLocationId.ResultingTitleTypeId : null,
          PhysicalInventoryAddressId: data.PhysicalInventoryAddressId ? data.PhysicalInventoryAddressId.AddressId : null,
          LineOfCreditId: data.LineOfCreditId ? data.LineOfCreditId.LineOfCreditId : null,
          BankAccountId: data.BankAccountId ? data.BankAccountId.BankAccountId : null,
          BusinessId: data.BusinessId ? data.BusinessId.BusinessId : null
        });

        if (data.$selectedVehicle) {
          // selected vehicle from black book is identified by the following two properties
          data.BlackBookGroupNumber = data.$selectedVehicle.GroupNumber;
          data.BlackBookUvc = data.$selectedVehicle.UVc;
          // selected vehicle from black book takes precedence over manually-entered vehicle characteristics
          data.UnitMake = null;
          data.UnitModel = null;
          data.UnitYear = null;
          data.UnitStyle = null;

          // clean up data that's not part of the request object API
          delete data.$blackbookMileage;
          delete data.$selectedVehicle;
        }

        return api.request('POST', '/floorplan/v1_1/create', data);
      },
      filterValues: {
        ALL: 'pending,approved,completed,denied,paidNo,paidYes,titleNo,titleYes',
        // dealer filters (irrespective of paid or not, title or not)
        PENDING: 'pending,paidNo,paidYes,titleNo,titleYes',
        DENIED: 'denied,paidNo,paidYes,titleNo,titleYes',
        APPROVED: 'approved,paidNo,paidYes,titleNo,titleYes',
        COMPLETED: 'completed,paidNo,paidYes,titleNo,titleYes',
        // auction filters (differentiate by paid or not, and sometimes by title or not)
        PENDING_NOT_PAID: 'pending,paidNo,titleNo,titleYes',
        DENIED_NOT_PAID: 'denied,paidNo,titleNo,titleYes',
        APPROVED_PAID: 'approved,paidYes,titleNo,titleYes',
        APPROVED_NOT_PAID: 'approved,paidNo,titleNo,titleYes',
        COMPLETED_PAID: 'completed,paidYes,titleNo,titleYes',
        COMPLETED_NOT_PAID: 'completed,paidNo,titleNo,titleYes',
        NO_TITLE_PAID: 'pending,approved,completed,denied,titleNo,paidYes'
      },
      search: function (criteria, paginator) {
        var self = this,
          params = {
            Keyword: criteria.query || undefined,
            // optimization: only set filter params if they are false, since not setting them is same as true
            // per Heath Matthias: "If true or not set, the search includes items, if set to false items are
            // filtered out (this is how the status filters work)"
            SearchPending: criteria.filter.indexOf('pending') >= 0 ? undefined : false,
            SearchApproved: criteria.filter.indexOf('approved') >= 0 ? undefined : false,
            SearchCompleted: criteria.filter.indexOf('completed') >= 0 ? undefined : false,
            SearchDenied: criteria.filter.indexOf('denied') >= 0 ? undefined : false,
            SearchPaid: criteria.filter.indexOf('paidYes') >= 0 ? undefined : false,
            SearchUnPaid: criteria.filter.indexOf('paidNo') >= 0 ? undefined : false,
            SearchHasTitle: criteria.filter.indexOf('titleYes') >= 0 ? undefined : false,
            SearchHasNoTitle: criteria.filter.indexOf('titleNo') >= 0 ? undefined : false,
            // default values for un-set dates may need adjusted during API integration
            StartDate: api.toShortISODate(criteria.startDate) || undefined,
            EndDate: api.toShortISODate(criteria.endDate) || undefined,
            OrderBy: criteria.sortField || 'FlooringDate',
            OrderByDirection: criteria.sortDescending === undefined || criteria.sortDescending === true ? 'DESC' : 'ASC',
            PageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            PageSize: Paginate.PAGE_SIZE_MEDIUM,
            PhysicalInventoryAddressIds: criteria.inventoryLocation && criteria.inventoryLocation.AddressId
          };

        return api.request('GET', '/floorplan/search', params).then(
          function (results) {
            angular.forEach(results.Floorplans, function (floorplan) {
              floorplan.data = {query: criteria.query};
              if (floorplan.TitleImageAvailable) {
                self.addTitleURL(floorplan);
              }
              floorplan.sellerHasTitle = floorplan.TitleLocation === gettextCatalog.getString('Seller');
              floorplan.Description = self.getVehicleDescription(floorplan);
            });
            return Paginate.addPaginator(results, results.FloorplanRowCount, params.PageNumber, params.PageSize);
          }
        );
      },
      sellerSearch: function (criteria, paginator) {
        var self = this,
          params = {
            businessId: criteria.businessId || undefined,
            searchText: criteria.query || undefined,
            // optimization: only set filter params if they are false, since not setting them is same as true
            // per Heath Matthias: "If true or not set, the search includes items, if set to false items are
            // filtered out (this is how the status filters work)"
            searchPending: criteria.filter.indexOf('pending') >= 0 ? undefined : false,
            searchApproved: criteria.filter.indexOf('approved') >= 0 ? undefined : false,
            searchCompleted: criteria.filter.indexOf('completed') >= 0 ? undefined : false,
            searchDenied: criteria.filter.indexOf('denied') >= 0 ? undefined : false,
            searchPaid: criteria.filter.indexOf('paidYes') >= 0 ? undefined : false,
            searchUnPaid: criteria.filter.indexOf('paidNo') >= 0 ? undefined : false,
            searchHasTitle: criteria.filter.indexOf('titleYes') >= 0 ? undefined : false,
            searchHasNoTitle: criteria.filter.indexOf('titleNo') >= 0 ? undefined : false,
            // default values for un-set dates may need adjusted during API integration
            startDate: api.toShortISODate(criteria.startDate) || undefined,
            endDate: api.toShortISODate(criteria.endDate) || undefined,
            sort: {},
            //orderBy: criteria.sortField || 'FlooringDate',
            //orderByDirection: criteria.sortDescending === undefined || criteria.sortDescending === true ? 'DESC' : 'ASC',
            pageNumber: paginator ? paginator.nextPage() : Paginate.firstPage(),
            pageSize: Paginate.PAGE_SIZE_MEDIUM,
            physicalInventoryAddressIds: criteria.inventoryLocation && criteria.inventoryLocation.AddressId
          };

        if (criteria.sortField !== undefined) {
          var orderDirection = criteria.sortDescending === undefined || criteria.sortDescending === true ? 'DESC' : 'ASC';
          params.sort[criteria.sortField] = orderDirection;
        } else {
          params.sort = {FlooringDate: "ASC"};
        }

        return api.request('POST', api.ngenContentLink('/floorplans/searchMobileSeller'), params, null, true, handleNgenRequest).then(function (response) {
          var results = {
            Floorplans: response.data
          };

          angular.forEach(results.Floorplans, function (floorplan) {
            floorplan.data = {query: criteria.query};
            if (floorplan.TitleImageAvailable) {
              self.addTitleURL(floorplan);
            }
            floorplan.sellerHasTitle = floorplan.TitleLocation === gettextCatalog.getString('Seller');
            floorplan.Description = self.getVehicleDescription(floorplan);
          });
          return Paginate.addPaginator(results, response.headers('X-NGEN-Count'), params.pageNumber, params.pageSize);
        });
      },
      addTitleURL: function (item) {
        if (!item.StockNumber) {
          return item;
        }

        var buyerBusinessNumber, displayId;
        User.getInfo().then(function (info) {
          buyerBusinessNumber = item.BuyerBusinessNumber || info.BusinessNumber;
          displayId = buyerBusinessNumber + '-' + item.StockNumber;
          item.$titleURL = api.contentLink('/floorplan/title/' + displayId + '/0' + '/Title_' + item.StockNumber); // 0 = not first page only
        });

        return item;
      },
      sellerHasTitle: function (floorplanId, hasTitle) {
        return api.request('POST', '/floorplan/SellerHasTitle', {
          FloorplanId: floorplanId,
          HasTitle: hasTitle
        });
      },
      overrideCompletionAddress: function (payments) {
        if (payments && payments.length && payments.length > 0) {
          var data = [];

          _.each(payments, function (p) {
            data.push({
              FloorplanId: p.id,
              TitleAddressId: p.overrideAddress.AddressId
            });
          });

          overrideInProgress = true;
          return api.request('POST', '/floorplan/overrideCompletionAddress', {OverrideCompletionAddressInformation: data}).then(function (response) {
            overrideInProgress = false;
            return response;
          }, function (error) {
            overrideInProgress = false;
            // Rethrow error. Doing it this way propagates the rejection
            // Without an exception being throw at the end of the promise chain
            return $q.reject(error);
          });
        } else {
          return $q.when(true);
        }
      },
      overrideInProgress: function () {
        return overrideInProgress;
      },
      getExtensionPreview: function (floorplanId) {
        return api.request('GET', '/floorplan/extensionPreview/' + floorplanId);
      },
      getVehicleDescription: function (floorplan) {
        return [
          floorplan.UnitYear || null,
          floorplan.UnitMake,
          floorplan.UnitModel,
          floorplan.UnitStyle,
          floorplan.Color
        ].join(' ');
      },
      editInventoryAddress: function (address) {
        return api.request('POST', '/floorplan/EditInventoryAddress', address);
      },
      addComment: function (Comment) {
        return api.request('POST', '/floorplan/comment', Comment);
      },
      determineFloorPlanExtendability: function (floorPlanIds) {
        var fpArray = [];
        fpArray.push(floorPlanIds);
        var fpJSON = JSON.stringify(fpArray);
        return api.request('POST', api.ngenContentLink('/floorplans/extension/determine_floorplan_extendability'), fpJSON, null, true, api.ngenSuccessHandler);
      }
    };

  }
})();
