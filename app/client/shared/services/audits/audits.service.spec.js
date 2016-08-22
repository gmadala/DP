'use strict';

describe('Model: audits', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var audits,
    httpBackend,
    userService,
    q;
  beforeEach(inject(function (Audits, $httpBackend, _User_, $q) {
    audits = Audits;
    httpBackend = $httpBackend;
    userService = _User_;
    q = $q;
  }));

  describe('refreshAudits method', function () {
    var resultData = null;

    beforeEach(function () {
      spyOn(userService, "getInfo").and.returnValue(q.when({
        businessId: '8c17ed1c-284d-46da-a43f-00115f3ea0dd',
        features: {},
      }));
      spyOn(userService, "isUnitedStates").and.returnValue(true);
      spyOn(userService, "isDealer").and.returnValue(true);
      spyOn(userService, "getFeatures").and.returnValue({});
      httpBackend.whenGET(/^\/cam\/[\w-]+\/open_audits$/).respond({
        "Success": true,
        "Message": null,
        "Data": [
          {
            "id": "11111111-1111-1111-1111-111111111111",
            "unitVin": "1FTYR10U92PB37336",
            "stockNumber": 123,
            "flooringDate": "2016-06-01 10:22:00.000",
            "unitMake": "Toyota",
            "unitModel": "Highlander",
            "unitYear": 2014,
            "unitStyle": "4D SUV 4X4 V6 4.0L V6 EFI DOHC",
            "inspectionDateTime": "2016-06-08 10:22:00.000",
            "unitStatusCode": "CUV",
            "recommendedVerification": "Photo"
          },
          {
            "id": "11111111-1111-1111-1111-111111111111",
            "unitVin": "2FTYR10U92PB37336",
            "stockNumber": 124,
            "flooringDate": "2016-05-21 08:02:00.000",
            "unitMake": "Toyota",
            "unitModel": "Prius",
            "unitYear": 2014,
            "unitStyle": "4D SEDAN",
            "inspectionDateTime": "2016-06-08 10:22:00.000",
            "unitStatusCode": "CUV",
            "recommendedVerification": "Video"
          },
          {
            "id": "11111111-1111-1111-1111-111111111111",
            "unitVin": "3FTYR10U92PB37336",
            "stockNumber": 125,
            "flooringDate": "2016-06-03 13:23:00.000",
            "unitMake": "Ford",
            "unitModel": "Pinto",
            "unitYear": 1977,
            "unitStyle": "HATCHBACK NON-EXPLODING ENGINE",
            "inspectionDateTime": "2016-06-08 10:22:00.000",
            "unitStatusCode": "CUV",
            "recommendedVerification": "Photo"
          }
        ]
      });

      audits.refreshAudits().then(function (results) {
        resultData = results;
      }, function (error) {
        throw new Error('request failed');
      });
      httpBackend.flush();

    });


    it('should pass through the standard audits info', function () {
      expect(resultData.results).not.toBe(null);
      expect(resultData.results.length).toBe(3);
      expect(resultData.results[0].unitVin).toBe("1FTYR10U92PB37336");
    });


    it('should calculate the days on floorplan and vehicle status days', function () {
      expect(angular.isNumber(resultData.results[0].daysOnFloorplan)).toBe(true);
      expect(angular.isNumber(resultData.results[0].vehicleStatusDays)).toBe(true);
      expect(angular.isNumber(resultData.results[1].daysOnFloorplan)).toBe(true);
      expect(angular.isNumber(resultData.results[1].vehicleStatusDays)).toBe(true);
      expect(angular.isNumber(resultData.results[2].daysOnFloorplan)).toBe(true);
      expect(angular.isNumber(resultData.results[2].vehicleStatusDays)).toBe(true);
    });


    it('should group the results by verification method', function () {
      expect(Object.keys(resultData.groupedResults).length).toBe(2);
      expect(resultData.groupedResults.Photo.length).toBe(2);
      expect(resultData.groupedResults.Video.length).toBe(1);
    });

  });

});
