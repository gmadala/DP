'use strict';

angular.module('nextgearWebApp')
  .factory('QualarooSurvey', function ($window) {

    return {
      init: function(apiKey, domainCode, isDealer, BusinessNumber, BusinessName) {
        var q = document.createElement('script');
        q.type = 'text/javascript';
        q.async = true;
        q.src = '//s3.amazonaws.com/ki.js/' + apiKey + '/' + domainCode + '.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(q, s);

        var api = this.getAPI();

        // Identify the user
        api.push(['identify', BusinessNumber + ' - ' + BusinessName]);

        // Set the users current location in the app whenever a survey answer is submitted
        api.push(['eventHandler', 'submit', this.setSurveyLocation.bind(this)]);

        // Send user type as custom property to allow for the survey to be shown conditionally by user type
        // ** Do this as the last step because this trigger the survey check to run and if the survey has 'known users'
        // ** as a condition the identify call needs to run first otherwise it won't show the survey when it checks.
        api.push(['set', {'user_is_dealer': isDealer ? 'yes' : 'no'}]);

      },
      /**
       * Sets the user's current location as a custom property on Qualaroo.
       *
       * We resort to this since Qualaroo presumes a regular website with multiple pages (not a Single Page
       * Application) and records the current Page (URL) when it loads its script. The problem is that after
       * the Qualaroo script gets loaded the user can navigate elsewhere without loading a new page so the Qualaroo
       * script is never reloaded and thus maintains a stale page location.
       *
       * There are methods in the Qualaroo script that we could use to reset the page location to the current URL but
       * since these are not documented API methods we run the risk of the Qualaroo script changing and thus breaking
       * our app. -- JOrtiz 4/15/2014
       */
      setSurveyLocation: function() {
        this.getAPI().push(['set', {'Location': $window.location.href}]);
      },
      getAPI: function() {
        $window._kiq = $window._kiq || [];
        return $window._kiq;
      }
    };
  });
