'use strict';

var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;

frisby.login()
  .after(function () {

    frisby.create('UserAccount: Get settings')
      .get(base + 'useraccount/v1_1/settings')
      .expectJSONTypes('Data', {
        Username: String,
        SecurityQuestions: [],
        Email: String,
        CellPhone: String,
        BusinessEmail: String,
        EnhancedRegistrationEnabled: Boolean,
        AutoPayEnabled: Boolean,
        IsStakeholder: Boolean,
        IsStakeholderActive: Boolean,
        IsQuickBuyer: Boolean,
        UseAutoACH: Boolean,
        Notifications: []
      })
      .expectSuccess()
      .toss();

    frisby.create('UserAccount: Business settings edit')
      .post(base + 'useraccount/businesssettings', {
        BusinessEmailAddress: 'DevTest@nextgearcapital.com',
        EnhancedRegistrationEnabled: false,
        AutoPayEnabled: false
      })
      .expectSuccess()
      .toss();
  })
  .toss();
