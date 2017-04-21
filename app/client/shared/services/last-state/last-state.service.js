(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('LastState', LastState);

  LastState.$inject = ['localStorageService', '$state', 'User'];

  function LastState(localStorageService, $state, User) {

    var cookieGet = function(){
      return localStorageService.get('uiState');
    };
    var cookieSet = function(value){
      return localStorageService.set('uiState', value);
    };

    return {
      saveUserState: function() {
        var cookieVal = cookieGet();
        if(!cookieVal) {
          cookieVal = { lastState: {} };
        } else if(!cookieVal.lastState) {
          cookieVal.lastState = {};
        }

        if(User.infoLoaded() && User.getInfoSync().BusinessContactUserName) {
          cookieVal.lastState[User.getInfoSync().BusinessContactUserName] = $state.current.name;
        } else {
          cookieVal.lastState['default'] = $state.current.name;
        }

        cookieVal.lastState['url'] = $state.current.url;
        
        cookieSet(cookieVal);
      },
      clearUserState: function() {
        var cookieVal = cookieGet();

        if(cookieVal && cookieVal.lastState) {
          if(cookieVal.lastState['default']){
            cookieVal.lastState['default'] = undefined;
          } else if(User.infoLoaded()) {
            cookieVal.lastState[User.getInfoSync().BusinessContactUserName] = undefined;
          }
        }

        cookieSet(cookieVal);

      },
      getUserUrl: function() {
          var cookieVal = cookieGet();
          return cookieVal.lastState['url'];
      },
      getUserState: function() {
        var cookieVal = cookieGet();
        var valueToPop;

        if(cookieVal && cookieVal.lastState) {
          if(cookieVal.lastState['default']){
            valueToPop = cookieVal.lastState['default'];
          } else if(User.infoLoaded()) {
            valueToPop = cookieVal.lastState[User.getInfoSync().BusinessContactUserName];
          }
        }

        return valueToPop;

      }
    };

  }
})();
