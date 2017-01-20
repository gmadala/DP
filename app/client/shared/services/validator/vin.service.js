(function() {
    'use strict';

    angular
        .module('nextgearWebApp')
        .factory('VinValidator', VinValidator);

    function VinValidator() {
        var vinDigitPositionMultiplier = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
        var vinDigitValues = {
            'A': 1,
            'B': 2,
            'C': 3,
            'D': 4,
            'E': 5,
            'F': 6,
            'G': 7,
            'H': 8,
            'J': 1,
            'K': 2,
            'L': 3,
            'M': 4,
            'N': 5,
            'P': 7,
            'R': 9,
            'S': 2,
            'T': 3,
            'U': 4,
            'V': 5,
            'W': 6,
            'X': 7,
            'Y': 8,
            'Z': 9,
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '0': 0
        };

        return {
            isValid: isValid
        };

        /**
         * Service implementation to validate vin data. Implementation is based on code on Discover VinUtility.cs.
         *
         * @param {string} vinString - the vin data to be validated.
         */
        function isValid(vinString) {
            if (!vinString) {
                return false;
            }

            var checkSumTotal = 0;
            var vinArray = vinString.toUpperCase().split('');

            if (vinArray.length != 17) {
                return false;
            }

            for (var i = 0; i < vinDigitPositionMultiplier.length; i++) {
                if (_.has(vinDigitValues, vinArray[i])) {
                    checkSumTotal += vinDigitValues[vinArray[i]] * vinDigitPositionMultiplier[i];
                }
                else {
                    //chars not in the vin digit values list are not valid VIN characters - return false (invalid)
                    return false;
                }
            }

            var checkSumDigit = checkSumTotal % 11;
            var checkSumCharDigit = (checkSumDigit == 10) ? 'X' : '' + checkSumDigit;
            return checkSumCharDigit == vinArray[8];
        }
    }
})();