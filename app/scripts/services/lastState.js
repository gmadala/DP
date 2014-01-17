'use strict';

angular.module('nextgearWebApp')
  .factory('LastState', function($cookieStore, $state, User) {

    var cookieGet = function(){
      return $cookieStore.get('uiState');
    };
    var cookieSet = function(value){
      return $cookieStore.put('uiState', value);
    };

    return {
      saveUserState: function() {
        var cookieVal = cookieGet();
        if(!cookieVal) {
          cookieVal = { lastState: {} };
        } else if(!cookieVal.lastState) {
          cookieVal.lastState = {};
        }

        if(User.infoLoaded() && User.getInfo().BusinessContactUserName) {
          cookieVal.lastState[User.getInfo().BusinessContactUserName] = $state.current.name;
        } else {
          cookieVal.lastState['default'] = $state.current.name;
        }

        cookieSet(cookieVal);
      },
      clearUserState: function() {
        var cookieVal = cookieGet();

        if(cookieVal && cookieVal.lastState) {
          if(cookieVal.lastState['default']){
            cookieVal.lastState['default'] = undefined;
          } else if(User.infoLoaded()) {
            cookieVal.lastState[User.getInfo().BusinessContactUserName] = undefined;
          }
        }

        cookieSet(cookieVal);

      },
      getUserState: function() {
        var cookieVal = cookieGet();
        var valueToPop;

        if(cookieVal && cookieVal.lastState) {
          if(cookieVal.lastState['default']){
            valueToPop = cookieVal.lastState['default'];
          } else if(User.infoLoaded()) {
            valueToPop = cookieVal.lastState[User.getInfo().BusinessContactUserName];
          }
        }

        return valueToPop;

      }
    };

  });
