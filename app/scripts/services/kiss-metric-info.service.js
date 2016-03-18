(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('kissMetricInfo', kissMetricInfo);

  kissMetricInfo.$inject = [ '$window', 'BusinessHours', '$q'];

  function kissMetricInfo($window, BusinessHours, $q) {

    return {
      getKissMetricInfoAuthenticated: getKissMetricInfoAuthenticated,
      getKissMetricInfo: getKissMetricInfo
    };

    function getKissMetricInfoAuthenticated(authenticated) {

      var retObj = {};

      retObj.vendor = $window.navigator.vendor;
      retObj.version = getBrowserStats();
      retObj.height = $window.screen.height;
      retObj.width = $window.screen.width;

      if(authenticated === true) {
        return BusinessHours.insideBusinessHours().then(function (result) {
          retObj.isBusinessHours = result;
          return retObj;
        }, function () {
          retObj.isBusinessHours = null;
          return retObj;
        });
      } else {
        retObj.isBusinessHours = null;
        return $q.when(retObj);
      }
    }

    function getKissMetricInfo(){
      return getKissMetricInfoAuthenticated(true);
    }

  }

  function getBrowserStats() {
    var ua= navigator.userAgent, tem,
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
      tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
      tem= ua.match(/\bOPR\/(\d+)/);
      if(tem!== null) {return 'Opera '+tem[1];}
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!== null) {M.splice(1, 1, tem[1]);}
    return M.join(' ');

  }
})();
