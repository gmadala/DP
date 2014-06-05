'use strict';

angular.module('nextgearWebApp')
  .directive('nxgChatWithUs', function($window) {

    var url = 'https://home-c4.incontact.com/inContact/ChatClient/ChatClient.aspx?poc=0a63c698-c417-4ade-8e0d-55cccf2b0d85&bu=4592556';

    return {
      restrict: 'A',
      compile: function(element) {
        if(element[0].tagName.toLowerCase() === 'a') {
          element.attr('href', url);
          element.attr('target', '_blank');
        } else {
          element.on('click', function() {
            $window.open(url, '_blank');
          });
        }
      }
    };
  });
