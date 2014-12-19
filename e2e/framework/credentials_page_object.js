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
  }

});

module.exports = CredentialsObject;
