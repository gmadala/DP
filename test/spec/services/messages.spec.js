'use strict';

describe('Service: messages', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var messages;
  beforeEach(inject(function (_messages_) {
    messages = _messages_;
  }));

  it('should start out empty', function () {
    expect(messages.list().length).toBe(0);
  });

  it('should allow messages to be added', function () {
    messages.add('txt1', 'debug1', 'title1');
    var list = messages.list();
    expect(list.length).toBe(1);
    expect(list[0].text).toBe('txt1');
    expect(list[0].debug).toBe('debug1');
    expect(list[0].title).toBe('title1');
  });

  it('should return the added message object', function () {
    var msg = messages.add('txt1', 'debug1');
    expect(msg.text).toBe('txt1');
    expect(msg.debug).toBe('debug1');
    expect(msg.title).toBe('Error');
  });

  it('should provide a dismiss method on messages that removes them', function () {
    var msg = messages.add('txt1', 'debug1');
    expect(messages.list().length).toBe(1);
    expect(typeof msg.dismiss).toBe('function');

    msg.dismiss();
    expect(messages.list().length).toBe(0);
  });

  it('should allow dismiss to be called additional times with no effect', function () {
    var msg = messages.add('txt1', 'debug1');
    msg.dismiss();
    expect(messages.list().length).toBe(0);
    msg.dismiss();
    expect(messages.list().length).toBe(0);
  });

});
