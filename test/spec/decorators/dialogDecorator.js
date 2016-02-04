'use strict';

xdescribe('Decorator: dialogDecorator', function () {
  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var dialog, dialogInstance1, dialogInstance2, dialogInstance3, msgBoxInstance1, msgBoxInstance2, msgBoxInstance3;
  beforeEach(inject(function ($dialog) {
    dialog = $dialog;
    dialogInstance1 = dialog.dialog({ template: '<hr/>' });
    dialogInstance2 = dialog.dialog({ template: '<hr/>' });
    dialogInstance3 = dialog.dialog({ template: '<hr/>' });
    msgBoxInstance1 = dialog.messageBox('title', 'message', [{label: 'OK', cssClass: 'class'}]);
    msgBoxInstance2 = dialog.messageBox('title', 'message', [{label: 'OK', cssClass: 'class'}]);
    msgBoxInstance3 = dialog.messageBox('title', 'message', [{label: 'OK', cssClass: 'class'}]);
  }));

  it('should correctly increment/decrement the count of open dialogs', function() {
    expect(dialog.openDialogsCount()).toBe(0);
    dialogInstance1.open();
    expect(dialog.openDialogsCount()).toBe(1);
    dialogInstance2.open();
    expect(dialog.openDialogsCount()).toBe(2);
    dialogInstance3.open();
    expect(dialog.openDialogsCount()).toBe(3);
    msgBoxInstance1.open();
    expect(dialog.openDialogsCount()).toBe(4);
    msgBoxInstance2.open();
    expect(dialog.openDialogsCount()).toBe(5);
    dialogInstance3.close();
    expect(dialog.openDialogsCount()).toBe(4);
    msgBoxInstance1.close();
    expect(dialog.openDialogsCount()).toBe(3);
    msgBoxInstance2.close();
    expect(dialog.openDialogsCount()).toBe(2);
    dialogInstance2.close();
    expect(dialog.openDialogsCount()).toBe(1);
    dialogInstance1.close();
    expect(dialog.openDialogsCount()).toBe(0);
  });

  it('should correctly clear all open dialogs', function() {
    dialogInstance1.open();
    dialogInstance2.open();
    dialogInstance3.open();
    msgBoxInstance1.open();
    msgBoxInstance2.open();
    expect(dialog.openDialogsCount()).toBe(5);
    dialog.closeAll();
    expect(dialog.openDialogsCount()).toBe(0);
  });


});
