'use strict';

describe('Directive: nxgMessages', function () {
  beforeEach(module('nextgearWebApp'));

  describe('core directive', function () {

    var element,
      scope,
      uibModal,
      $q,
      messages,
      httpBackend,
      modalInstance;

    beforeEach(inject(function ($rootScope, $compile, _$q_, _messages_, $uibModal, $httpBackend) {
      $q = _$q_;
      messages = _messages_;
      scope = $rootScope;
      httpBackend = $httpBackend;
      uibModal = $uibModal;

      element = angular.element('<div nxg-messages></div>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();

      modalInstance = {
        close: jasmine.createSpy('$uibModalInstance.close')
      };

      httpBackend.whenGET('scripts/directives/nxg-messages/nxg-messages-modal.html').respond($q.when({}));

    }));

    it('should open the message dialog when message(s) become present', function () {
      spyOn(uibModal, 'open').and.callThrough();
      messages.add('msg1', 'debug1');
      scope.$apply();
      expect(uibModal.open).toHaveBeenCalled();
      var opts = uibModal.open.calls.mostRecent().args[0];
      expect(opts.templateUrl).toBe('scripts/directives/nxg-messages/nxg-messages-modal.html');
      expect(opts.controller).toBe('MessagesModalCtrl');
    });

    it('should close the message dialog when all messages are dismissed', function () {
      var msg1 = messages.add('msg1', 'debug1');
      var msg2 = messages.add('msg2', 'debug1');
      scope.$apply();

      msg1.dismiss();
      scope.$apply();
      expect(modalInstance.close).not.toHaveBeenCalled();
      msg2.dismiss();
      scope.$apply();
    });

  });

  describe('MessagesModalCtrl', function () {

    var scope,
      run,
      messages;

    beforeEach(inject(function ($controller, $rootScope, _messages_) {
      scope = $rootScope.$new();
      messages = _messages_;

      run = function () {
        $controller('MessagesModalCtrl', {
          $scope: scope
        });
      };
    }));

    it('should attach a close function that dismisses all messages', function () {
      messages.add('foo');
      messages.add('bar');
      run();
      expect(typeof scope.close).toBe('function');
      scope.close();
      expect(messages.list().length).toBe(0);
    });

    it('should organize messages as they arrive into a de-duplicated list on the scope', function () {
      messages.add('foo');
      messages.add('foo', 'blah');
      messages.add('bar');
      run();
      scope.$apply();
      expect(scope.messages.length).toBe(2);
      expect(scope.messages[0].text).toBe('foo');
      expect(scope.messages[1].text).toBe('bar');

      messages.add('baz');
      scope.$apply();
      expect(scope.messages.length).toBe(3);
      expect(scope.messages[2].text).toBe('baz');
    });

    it('should set title to the title of the only message if there is just one', function () {
      messages.add('foo', 'debug', 'myTitle');
      run();
      scope.$apply();
      expect(scope.title).toBe('myTitle');
    });

    it('should set title to "Multiple Messages" if there is more than one', function () {
      messages.add('foo', 'debug', 'myTitle');
      messages.add('foo2', 'debug', 'myTitle2');
      run();
      scope.$apply();
      expect(scope.title).toBe('Multiple Messages');
    });

  });

});
