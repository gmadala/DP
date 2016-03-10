'use strict';

describe('app.js', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var dealer, user, state, lastState;

  // instantiate service
  var rootScope, location, cookieStore, userInitRequired, passwordChangeRequired;
  beforeEach(inject(function ($http, $rootScope, User, $state, LastState, $cookieStore, $location) {
    rootScope = $rootScope;
    user = User;
    state = $state;
    lastState = LastState;
    location = $location;
    cookieStore = $cookieStore;
    passwordChangeRequired = false;
    userInitRequired = false;

    User.isDealer = function(){
      return dealer;
    };

    User.reloadSession = function(){
      return {
        then: function(callback){
          callback();
        }
      };
    };

    User.initSession = function(){
      return {
        then: function(callback){
          callback();
        }
      };
    };

    User.isUserInitRequired = function(){
      return userInitRequired;
    };

    User.isPasswordChangeRequired = function(){
      return passwordChangeRequired;
    };

  }));


  describe('event:userAuthenticated', function () {
    it('should restore a previous state', function() {
      spyOn(lastState, 'getUserState').and.returnValue('userstate');
      spyOn(lastState, 'clearUserState');
      spyOn(state, 'transitionTo');

      rootScope.$broadcast('event:userAuthenticated', {ShowUserInitialization: false});
      expect(lastState.getUserState.calls.count()).toEqual(3);
      expect(lastState.clearUserState.calls.count()).toEqual(1);
      expect(state.transitionTo).toHaveBeenCalledWith('userstate');

    });

    it('should go to dealer home if no saved state', function() {

      spyOn(lastState, 'getUserState').and.returnValue('');
      spyOn(lastState, 'clearUserState');
      spyOn(state, 'go');
      dealer = true;

      rootScope.$broadcast('event:userAuthenticated', {ShowUserInitialization: false});
      expect(lastState.getUserState).toHaveBeenCalled();
      expect(lastState.clearUserState).not.toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('dashboard');

    });

    it('should go to auction home if no saved state', function() {

      spyOn(lastState, 'getUserState').and.returnValue('');
      spyOn(lastState, 'clearUserState');
      spyOn(state, 'go');
      dealer = false;

      rootScope.$broadcast('event:userAuthenticated', {ShowUserInitialization: false});
      expect(lastState.getUserState).toHaveBeenCalled();
      expect(lastState.clearUserState).not.toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('auction_dashboard');

    });

    it('should go to pending state if one exists', function() {

      var toStateObject = {
        data: {
          allowAnonymous: false,
          name: 'myfancystring'
        }
      };

      var otheToStateObject = {
        ShowUserInitialization: false
      };

      // Must do this part to set up "pendingState" variable.
      spyOn(user, 'isLoggedIn').and.returnValue(false);
      spyOn(state, 'go');
      spyOn(cookieStore, 'get').and.returnValue(false);
      rootScope.$broadcast('$stateChangeStart', toStateObject);
      expect(state.go).toHaveBeenCalledWith('login');

      rootScope.$broadcast('event:userAuthenticated', otheToStateObject);
      expect(state.go).toHaveBeenCalledWith(toStateObject.name);

    });

    it('should show updateSecurity page when User.isUserInitRequired() is true', function() {

      var toStateObject = {
        ShowUserInitialization: true,
        TemporaryPasswordUsed: false
      };

      spyOn(lastState, 'getUserState').and.returnValue('');
      spyOn(lastState, 'clearUserState');
      spyOn(state, 'go');
      dealer = true;
      passwordChangeRequired = false;
      userInitRequired = true;

      rootScope.$broadcast('event:userAuthenticated', toStateObject);
      expect(lastState.getUserState).not.toHaveBeenCalled();
      expect(lastState.clearUserState).not.toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('loginUpdateSecurity');

    });

    it('should show createPassword page when User.isPasswordChangeRequired() is true', function() {

      spyOn(lastState, 'getUserState').and.returnValue('');
      spyOn(lastState, 'clearUserState');
      spyOn(state, 'go');
      dealer = true;
      passwordChangeRequired = true;
      userInitRequired = false;

      rootScope.$broadcast('event:userAuthenticated');
      expect(lastState.getUserState).not.toHaveBeenCalled();
      expect(lastState.clearUserState).not.toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('loginCreatePassword');

    });

  });

  describe('event:switchState', function() {

    it('should switch the location path', function() {
      var toState = {
        url: 'bar'
      };

      spyOn(state, 'go');
      rootScope.$broadcast('event:switchState', toState);
      expect(state.go).toHaveBeenCalledWith(toState);
    });

  });

  describe('$stateChangeStart', function() {

    var toNonAnonState = {
      data: {
        allowAnonymous: false
      }
    };

    var toAnonState = {
      data: {
        allowAnonymous: true
      }
    };

    var toNonAnonDealerState = {
      data: {
        allowAnonymous: false,
        isAuctionState: false
      }
    };

    var toNonAnonAuctionState = {
      data: {
        allowAnonymous: false,
        isAuctionState: true
      }
    };

    it('should not check type of user if state allows anonymous users', function() {
      spyOn(user, 'isDealer');
      rootScope.$broadcast('$stateChangeStart', toAnonState);
      expect(user.isDealer).not.toHaveBeenCalled();
    });

    it('should restore session from saved auth token', function() {
      spyOn(user, 'isLoggedIn').and.returnValue(false);
      spyOn(cookieStore, 'get').and.returnValue('savedAuthString');
      spyOn(user, 'initSession').and.callThrough();
      spyOn(state, 'go');
      var toState = {
        data: {
          allowAnonymous: false
        }
      };
      rootScope.$broadcast('$stateChangeStart', toState);

      expect(user.initSession).toHaveBeenCalledWith('savedAuthString');
      expect(state.go).toHaveBeenCalledWith(toState, undefined);
    });

    it('should redirect to login if user not logged in', function() {
      spyOn(user, 'isDealer').and.callThrough();
      spyOn(user, 'isLoggedIn').and.returnValue(false);
      spyOn(state, 'go');
      dealer = true;
      spyOn(cookieStore, 'get').and.returnValue(false);

      rootScope.$broadcast('$stateChangeStart', toNonAnonState);

      expect(user.isDealer).toHaveBeenCalled();
      expect(user.isLoggedIn).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('login');
    });

    it('should redirect to update security questions', function() {
      spyOn(user, 'isDealer').and.callThrough();
      spyOn(user, 'isLoggedIn').and.returnValue(true);
      spyOn(user, 'isUserInitRequired').and.returnValue(true);
      spyOn(state, 'go');
      dealer = true;

      rootScope.$broadcast('$stateChangeStart', toNonAnonState);

      expect(state.go).toHaveBeenCalledWith('loginUpdateSecurity');
    });

    it('should redirect auction user if trying to access page for dealer user', function() {
      spyOn(user, 'isLoggedIn').and.returnValue(true);
      spyOn(user, 'isUserInitRequired').and.returnValue(false);
      spyOn(state, 'go');
      dealer = false;

      rootScope.$broadcast('$stateChangeStart', toNonAnonDealerState);

      expect(state.go).toHaveBeenCalledWith('auction_dashboard');
    });

    it('should redirect dealer user if trying to access page for auction user', function() {
      spyOn(user, 'isLoggedIn').and.returnValue(true);
      spyOn(user, 'isUserInitRequired').and.returnValue(false);
      spyOn(state, 'go');
      dealer = true;

      rootScope.$broadcast('$stateChangeStart', toNonAnonAuctionState);

      expect(state.go).toHaveBeenCalledWith('dashboard');
    });

  });
});
