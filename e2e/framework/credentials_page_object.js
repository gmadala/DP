'use strict';

var CredentialsObject = function () {
};

CredentialsObject.prototype = Object.create({}, {

  loginUsername: {
    value: '53190md'
  },

  loginPassword: {
    value: 'password@1'
  },

  recoveryEmailAddress: {
    value: 'gayathri.madala@nextgearcapital.com'
  },

  recoveryUsername: {
    value: '53190md'
  },

  recoveryQuestionZero: {
    value: 'Mother\'s maiden name'
  },

  recoveryQuestionOne: {
    value: 'abcdef'
  },

  floorPlanStartDate: {
    value: '01/01/2014'
  },

  floorPlanEndDate: {
    value: '12/31/2014'
  },
  findFloorPlanVIN:{
    value: 'CH22415739545567'
  }

});

module.exports = CredentialsObject;
