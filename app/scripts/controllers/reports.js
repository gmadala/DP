'use strict';

angular.module('nextgearWebApp')
  .controller('ReportsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.currentReports = [
      { "title": 'Credit Availability Report (PDF)',
        "date": 'MMDDYYYY',
        "url": 'path/to/link'
      },
      { "title": "Receivable Detail (PDF)",
        "date": "MMDDYYYY",
      "url": "path/to/link"
      },
      { "title": "Upcoming Curtailment / Payoff Quote (PDF)",
        "date": "MMDDYYYY",
        "url": "path/to/link"
      }
    ];
  });
