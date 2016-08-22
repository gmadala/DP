(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('Audits', AuditsFn);

  AuditsFn.$inject = ['api', 'User'];

  function AuditsFn(api, User) {
    return {
      results: [],
      groupedResults: {},
      loading: false,
      sortField: 'UnitInspectionDateTime',
      sortDescending: false,
      refreshAudits: function () {
        this.loading = true;
        return User.getInfo().then(_.bind(function (info) {
          return api.request('GET', '/cam/' + info.BusinessId + '/open_audits', null, null, true).then(_.bind(function (result) {
            this.results = _.map(result, function (item) {
              item.daysOnFloorplan = moment().diff(moment(item.flooringDate), 'days');
              item.vehicleStatusDays = moment().diff(moment(item.inspectionDateTime), 'days');
              return item;
            });
            this.groupedResults = _.groupBy(this.results, 'recommendedVerification');
            this.loading = false;
            return {
              results: this.results,
              groupedResults: this.groupedResults,
            };
          }, this));
        }, this));
      },
      sortBy: function (fieldName) {
        if (this.sortField === fieldName) {
          // already sorting by this field, just flip the direction
          this.sortDescending = !this.sortDescending;
        } else {
          this.sortField = fieldName;
          this.sortDescending = false;
        }
      },
    };
  }
})();
