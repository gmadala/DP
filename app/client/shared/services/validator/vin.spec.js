'use strict';

fdescribe('Model: VinValidator', function () {
    beforeEach(module('nextgearWebApp'));

    var vinValidator;
    beforeEach(inject(function(_VinValidator_) {
        vinValidator = _VinValidator_;
    }));

    it('should return true when validating valid vin', function() {
        expect(vinValidator.isValid('1FTYR10U92PB37336')).toEqual(true);
        expect(vinValidator.isValid('1FTYR10U92PB37336')).toEqual(true);
        expect(vinValidator.isValid('2D4FV48V35H148765')).toEqual(true);
        expect(vinValidator.isValid('2G1WF55E219241276')).toEqual(true);
        expect(vinValidator.isValid('1G2ZH158864154319')).toEqual(true);
        expect(vinValidator.isValid('3C3EL55H4YT230409')).toEqual(true);
        expect(vinValidator.isValid('1FAFP37N36W208278')).toEqual(true);
        expect(vinValidator.isValid('1D7HU16N34J287906')).toEqual(true);
        expect(vinValidator.isValid('1GKDT13S732176729')).toEqual(true);
        expect(vinValidator.isValid('1G1JC5249S7213945')).toEqual(true);
        expect(vinValidator.isValid('1FTRW07601KC52661')).toEqual(true);
        expect(vinValidator.isValid('1G8AN14F15Z100034')).toEqual(true);
    });

    it('should return false when validating valid vin', function() {
        expect(vinValidator.isValid('')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F45Z10003')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F15Z10003')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F15Z1I0034')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F15Z1O0034')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F15Z1Q0034')).toEqual(false);
        expect(vinValidator.isValid('1G8AN14F16Z100034')).toEqual(false);
        expect(vinValidator.isValid('ZACCJABT0FPB74748')).toEqual(false);
    });
});