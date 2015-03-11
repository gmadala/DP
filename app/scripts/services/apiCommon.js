/**
 * Simple proxy to allow nextgearWebCommon to start using the API.
 * The actual 'api' service in each project has dependenc
 *
 * For Manual lookup
 * 1. GET /kbb/vehicle/getyears/UsedCar/Dealer
 * 2. User selects the year
 * 3. GET /kbb/vehicle/getmakesbyyear/UsedCar/Dealer/{yearId}
 * 4. User selects the make
 * 5. GET /kbb/vehicle/getmodelsbyyearandmake/UsedCar/Dealer/{makeId}/{yearId}
 * 6. User selects the model
 * 7. GET /kbb/vehicle/gettrimsandvehicleidsbyyearandmodel/UsedCar/Dealer/{modelId}/{yearId}
 * 8. User selects the style
 * 9. User enters the mileage
 * 10. User enters the ZIP code
 * 11. User clicks lookup
 * 12. GET /kbb/vehicle/getvehiclevaluesallconditions/UsedCar/Dealer/{vehicleId}/{mileage}/{zipCode}
 *
 * For VIN lookup
 * 1. User enters VIN
 * 2. User enters mileage
 * 3. User enters ZIP code
 * 4. User clicks lookup
 * 5. GET /kbb/vehicle/getvehiclevaluesbyvinallconditions/UsedCar/Dealer/{vin}/{mileage}/{zipCode}
 */

'use strict';

angular.module('nextgearWebCommon')
  .factory('apiCommon', function () {
    var api;
    var service = {
      init: function init(appApi) { api = appApi; },
      request: function() { return api.request.apply(api, arguments); }
    };

    return service;
  });
