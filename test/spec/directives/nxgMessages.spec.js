'use strict';

describe('Directive: nxgMessages', function () {
  beforeEach(module('nextgearWebApp'));

  describe('core directive', function () {

    var element,
      scope,
      $dialog,
      $q,
      messages,
      fakeDialog;

    beforeEach(inject(function ($rootScope, $compile, _$dialog_, _$q_, _messages_) {
      $dialog = _$dialog_;
      $q = _$q_;
      messages = _messages_;
      scope = $rootScope;

      var defer = $q.defer();
      fakeDialog = {
        open: function () { return defer.promise; },
        close: function () { defer.resolve(); }
      };

      spyOn($dialog, 'dialog').and.returnValue(fakeDialog);

      element = angular.element('<div nxg-messages></div>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should open the message dialog when message(s) become present', function () {
      spyOn(fakeDialog, 'open').and.callThrough();
      messages.add('msg1', 'debug1');
      scope.$apply();
      expect($dialog.dialog).toHaveBeenCalled();
      var opts = $dialog.dialog.calls.mostRecent().args[0];
      expect(opts.templateUrl).toBe('scripts/directives/nxgMessages/nxgMessagesModal.html');
      expect(opts.controller).toBe('MessagesModalCtrl');
      expect(fakeDialog.open).toHaveBeenCalled();
    });

    it('should close the message dialog when all messages are dismissed', function () {
      spyOn(fakeDialog, 'close');
      var msg1 = messages.add('msg1', 'debug1');
      var msg2 = messages.add('msg2', 'debug1');
      scope.$apply();

      msg1.dismiss();
      scope.$apply();
      expect(fakeDialog.close).not.toHaveBeenCalled();

      msg2.dismiss();
      scope.$apply();
      expect(fakeDialog.close).toHaveBeenCalled();
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
