'use strict';

describe('Service: LastState', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var LastState, http, rootScope, $state, $cookieStore, User;

  var username = {
    BusinessContactUserName: 'user'
  };

  beforeEach(inject(function (_LastState_, _$cookieStore_, _$state_, $rootScope, _User_) {
    LastState = _LastState_;
    rootScope = $rootScope;
    $state = _$state_;
    $cookieStore = _$cookieStore_;
    User = _User_;

    User.infoLoaded = function(){ return true;};
    User.getInfo = function(){
      return username;
    }

    $cookieStore.put('uiState', '');

  }));


  describe('set last state', function () {

    it('should set user state properly', function() {

      $state.current = {
        name: 'thisState'
      };

      LastState.saveUserState();

      expect($cookieStore.get('uiState').lastState.user).toEqual('thisState');
    });

    it('should set two different user states properly', function() {

      $state.current = {
        name: 'thisState'
      };
      username.BusinessContactUserName = 'user1';
      LastState.saveUserState();

      $state.current = {
        name: 'otherState'
      };
      username.BusinessContactUserName = 'user2';
      LastState.saveUserState();

      expect($cookieStore.get('uiState').lastState.user1).toEqual('thisState');
      expect($cookieStore.get('uiState').lastState.user2).toEqual('otherState');
    });

    it('should set default states properly', function() {

      $state.current = {
        name: 'thisState'
      };
      User.infoLoaded = function(){return false;};

      LastState.saveUserState();

      expect($cookieStore.get('uiState').lastState.default).toEqual('thisState');
    });

  });

  describe('get last state', function() {

    it('should get user state properly', function() {

      $state.current = {
        name: 'thisState'
      };

      LastState.saveUserState();

      expect(LastState.getUserState()).toEqual('thisState');

    });

    it('should get two different user states properly', function() {

      $state.current = {
        name: 'thisState'
      };
      username.BusinessContactUserName = 'user1';
      LastState.saveUserState();

      $state.current = {
        name: 'otherState'
      };
      username.BusinessContactUserName = 'user2';
      LastState.saveUserState();

      username.BusinessContactUserName = 'user1';
      expect(LastState.getUserState()).toEqual('thisState');

      username.BusinessContactUserName = 'user2';
      expect(LastState.getUserState()).toEqual('otherState');
    });

    it('should get default states properly before logging in', function() {

      $state.current = {
        name: 'thisState'
      };
      User.infoLoaded = function(){return false;};

      LastState.saveUserState();

      expect(LastState.getUserState()).toEqual('thisState');
    });

    it('should get default states properly after logging in', function() {

      $state.current = {
        name: 'thisState'
      };
      User.infoLoaded = function(){return false;};

      LastState.saveUserState();

      User.infoLoaded = function(){return true;};

      expect(LastState.getUserState()).toEqual('thisState');
    });

    it('should get not set state as undefined', function() {

      expect(LastState.getUserState()).not.toBeDefined();
    });

    it('should get not set state as undefined with other user having one set', function() {
      $state.current = {
        name: 'thisState'
      };

      LastState.saveUserState();

      User.infoLoaded = function(){return false;};

      expect(LastState.getUserState()).not.toBeDefined();
    });

  });

  describe('pop user state', function() {

    beforeEach(function(){
      $cookieStore.put('uiState', {
        lastState: {
          user1: 'state1',
          user2: 'state2'
        }
      });
    });

    it('should unset current user state', function() {

      username.BusinessContactUserName = 'user1';

      expect(LastState.getUserState()).toBeDefined();

      LastState.clearUserState();

      expect(LastState.getUserState()).not.toBeDefined();

    });

    it('should unset default user state', function() {

      $cookieStore.put('uiState', {
        lastState: {
          default: 'statedefault'
        }
      });

      User.infoLoaded = function(){return false;};

      expect(LastState.getUserState()).toBeDefined();

      LastState.clearUserState();

      expect(LastState.getUserState()).not.toBeDefined();

    });

  });

});
