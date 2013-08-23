'use strict';

describe('Service: optionDefaultHelper', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var helperSvc,
    scope;

  beforeEach(inject(function ($rootScope, OptionDefaultHelper) {
    scope = $rootScope.$new();
    helperSvc = OptionDefaultHelper;
  }));

  it('should have a create function', function () {
    expect(typeof helperSvc.create).toBe('function');
  });

  describe('create function', function () {

    it('should accept an array of mapping objects with scopeSrc and modelDest', function () {
      expect(function () {
        helperSvc.create([
          {
            scopeSrc: 'foo.bars',
            modelDest: 'fooBar'
          },
          {
            scopeSrc: 'foo.bazs',
            modelDest: 'fooBaz'
          }
        ]);
      }).not.toThrow();
    });

    it('should return an instance with an applyDefaults function', function () {
      var helper = helperSvc.create([]);
      expect(helper).toBeDefined();
      expect(typeof helper.applyDefaults).toBe('function');
    });

  });

  describe('applyDefaults function', function () {

    var helper,
      model;

    beforeEach(function () {
      scope.foo = {};
      model = {
        fooBar: null,
        fooBaz: null
      };

      helper = helperSvc.create([
        {
          scopeSrc: 'foo.bars',
          modelDest: 'fooBar'
        },
        {
          scopeSrc: 'foo.bazs',
          modelDest: 'fooBaz'
        }
      ]);
    });

    it('should do nothing if multiple options exist', function () {
      scope.foo.bars = ['one', 'two'];
      scope.foo.bazs = ['three', 'four'];

      scope.$apply(function () {
        helper.applyDefaults(scope, model);
      });
      expect(model.fooBar).toBe(null);
      expect(model.fooBaz).toBe(null);
    });

    it('should not overwrite existing non-null values in the model', function () {
      scope.foo.bars = ['one'];
      scope.foo.bazs = ['two'];
      model.fooBar = 'five';
      model.fooBaz = 'six';

      scope.$apply(function () {
        helper.applyDefaults(scope, model);
      });
      expect(model.fooBar).toBe('five');
      expect(model.fooBaz).toBe('six');
    });

    it('should apply solitary options as the default, when they are already present', function () {
      scope.foo.bars = ['one'];
      scope.foo.bazs = ['two'];

      scope.$apply(function () {
        helper.applyDefaults(scope, model);
      });
      expect(model.fooBar).toBe('one');
      expect(model.fooBaz).toBe('two');
    });

    it('should apply solitary options as the default, when they arrive after the call', function () {
      scope.$apply(function () {
        helper.applyDefaults(scope, model);
      });

      scope.$apply(function () {
        scope.foo.bars = ['three'];
        scope.foo.bazs = ['four'];
      });

      expect(model.fooBar).toBe('three');
      expect(model.fooBaz).toBe('four');
    });

    it('should drop prior existing linkages on subsequent calls', function () {
      var model2 = angular.copy(model);
      scope.$apply(function () {
        helper.applyDefaults(scope, model);
      });

      scope.$apply(function () {
        scope.foo.bars = ['three'];
        scope.foo.bazs = ['four'];
      });

      // break the linkage with model
      scope.$apply(function () {
        helper.applyDefaults(scope, {});
      });

      // change the options
      scope.$apply(function () {
        scope.foo.bars = ['seven'];
        scope.foo.bazs = ['eight'];
      });

      // apply them to new model
      scope.$apply(function () {
        helper.applyDefaults(scope, model2);
      });

      expect(model.fooBar).toBe('three');
      expect(model.fooBaz).toBe('four');

      expect(model2.fooBar).toBe('seven');
      expect(model2.fooBaz).toBe('eight');
    });

  });

});
