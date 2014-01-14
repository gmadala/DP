'use strict';

describe('Controller: AuctionDealerSearchCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionDealerSearchCtrl,
    scope,
    dealerNumberSearch,
    q,
    dialog,
    dialogOpen;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, User, DealerNumberSearch, $q) {
    scope = $rootScope.$new();

    dialog = {
      open: function() {
      },
      dialog: function(options) {
        return {
         open: this.open
        };
      }
    };

    q = $q;

    dealerNumberSearch = DealerNumberSearch;

    spyOn(User, 'getStatics').andReturn({});

    AuctionDealerSearchCtrl = $controller('AuctionDealerSearchCtrl', {
      $scope: scope,
      $dialog: dialog
    });

    spyOn(dealerNumberSearch, 'searchByDealerNumber').andReturn(q.when(''));
    spyOn(dealerNumberSearch, 'searchByAuctionAccessNumber').andReturn(q.when(''));

    scope.nameSearch.query.dealerNumber = 'dealerNumber';
    scope.nameSearch.query.auctionAccessNumber = 22;

  }));

  describe('Dealer Number Search', function() {
    it('should search by dealer number', function() {

      spyOn(scope.numberSearch, 'validate').andReturn(true);

      scope.numberSearch.setDealerNumActive();

      scope.numberSearch.search();

      expect(dealerNumberSearch.searchByDealerNumber).toHaveBeenCalled();
      expect(dealerNumberSearch.searchByAuctionAccessNumber).not.toHaveBeenCalled();
    });

    it('should search by auction access number', function() {

      spyOn(scope.numberSearch, 'validate').andReturn(true);

      scope.numberSearch.setAuctionNumActive();

      scope.numberSearch.search();

      expect(dealerNumberSearch.searchByDealerNumber).not.toHaveBeenCalled();
      expect(dealerNumberSearch.searchByAuctionAccessNumber).toHaveBeenCalled();
    });

    it('should not search if form not valid', function() {

      spyOn(scope.numberSearch, 'validate').andReturn(false);

      scope.numberSearch.setAuctionNumActive();

      scope.numberSearch.search();

      expect(dealerNumberSearch.searchByDealerNumber).not.toHaveBeenCalled();
      expect(dealerNumberSearch.searchByAuctionAccessNumber).not.toHaveBeenCalled();
    });

    describe('Validation', function() {

      it('should have missing dealer and auction access number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: false
          },
          auctionAccessNum: {
            $viewValue: false
          }
        };

        var validity = scope.numberSearch.validate();
        expect(validity).toBeFalsy();
        expect(scope.numberSearch.invalid.required.dealerOrAccessNumber).toBeTruthy();

      });

      it('should have missing dealer number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: false
          },
          auctionAccessNum: {
            $viewValue: false
          }
        };

        scope.numberSearch.setDealerNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeFalsy();
        expect(scope.numberSearch.invalid.required.dealerNumber).toBeTruthy();

      });

      it('should have missing auction access number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: false
          },
          auctionAccessNum: {
            $viewValue: false
          }
        };

        scope.numberSearch.setAuctionNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeFalsy();
        expect(scope.numberSearch.invalid.required.auctionAccessNumber).toBeTruthy();

      });

      it('should have non numeric dealer number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: '1 am not a numbe4',
            $error: {
              pattern: !('1 am not a numbe4'.match(scope.onlyNumbersPattern))
            }
          },
          auctionAccessNum: {
            $viewValue: false
          }
        };

        scope.numberSearch.setDealerNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeFalsy();
        expect(scope.numberSearch.invalid.pattern.dealerNumber).toBeTruthy();

      });

      it('should have non numeric auction access number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: ''
          },
          auctionAccessNum: {
            $viewValue: '1 am not a numbe4',
            $error: {
              pattern: !('1 am not a numbe4'.match(scope.onlyNumbersPattern))
            }
          }
        };

        scope.numberSearch.setAuctionNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeFalsy();
        expect(scope.numberSearch.invalid.pattern.auctionAccessNumber).toBeTruthy();

      });

      it('should be valid with a dealer number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $viewValue: '45',
            $error: false
          },
          auctionAccessNum: {
            $error: false
          }
        };

        scope.numberSearch.setDealerNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeTruthy();

      });

      it('should be valid with an auction access number', function() {

        scope.numberSearchForm = {
          dealerNum: {
            $error: false
          },
          auctionAccessNum: {
            $viewValue: '45',
            $error: false
          }
        };

        scope.numberSearch.setAuctionNumActive();
        var validity = scope.numberSearch.validate();
        expect(validity).toBeTruthy();

      });

    });

  });

  describe('Dealer Name Search', function() {

    it('should open a dialog if validation passes', function() {
      spyOn(scope.nameSearch, 'validate').andReturn(true);
      spyOn(dialog, 'dialog').andCallThrough();
      spyOn(dialog, 'open');

      scope.nameSearch.search();

      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalled();

    });

    it('should not open a dialog if validation does not pass', function() {
      spyOn(scope.nameSearch, 'validate').andReturn(false);
      spyOn(dialog, 'dialog');

      scope.nameSearch.search();

      expect(dialog.dialog).not.toHaveBeenCalled();
    });

    describe('Validation', function() {

      it('should have an empty dealer name, city, and state', function() {
        scope.nameSearch.query.dealerName = '';
        scope.nameSearch.query.city = '';
        scope.nameSearch.query.state = '';

        var validity = scope.nameSearch.validate();

        expect(validity).toBeFalsy();
        expect(scope.nameSearch.invalid.dealerName).toBeTruthy();
        expect(scope.nameSearch.invalid.CityOrState).toBeTruthy();

      });

      it('should have a dealer name fewer than 3 characters', function() {
        scope.nameSearch.query.dealerName = 'ab';

        var validity = scope.nameSearch.validate();

        expect(validity).toBeFalsy();
        expect(scope.nameSearch.invalid.minlength).toBeTruthy();

      });

      it('should have a city with non-alpha characters', function() {
        scope.nameSearch.query.city = 'invalid city with a *';

        var validity = scope.nameSearch.validate();

        expect(validity).toBeFalsy();
        expect(scope.nameSearch.invalid.cityFormat).toBeTruthy();

      });

      it('should be valid with a city', function() {
        scope.nameSearch.query.dealerName = 'more than 3 characters';
        scope.nameSearch.query.city = 'Rochester';

        var validity = scope.nameSearch.validate();

        expect(validity).toBeTruthy();

      });

      it('should be valid with a state', function() {
        scope.nameSearch.query.dealerName = 'more than 3 characters';
        scope.nameSearch.query.city = 'New York';

        var validity = scope.nameSearch.validate();

        expect(validity).toBeTruthy();
      });

    });

  });

});
