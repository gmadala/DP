'use strict';

var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;

frisby.login()
  .after(function () {
    frisby.create('Financial Account: Get financial accounts')
      .get(base + 'useraccount/v1_1/summary')
      .expectJSONTypes('Data.BankAccounts.*', {
        AchAbaNumber: String,
        AchAccountNumberLast4: String,
        AchBankName: String,
        AllowPaymentByAch: Boolean,
        BankAccountId: String,
        BankAccountName: String,
        IsActive: Boolean
      })
      .expectSuccess()
      .toss();

    frisby.create('Financial Account: Get one financial account')
      .get(base + '/dealer/bankAccount/9e05f8c9-2e3b-4f80-a346-00004bceacb1')
      .expectJSONTypes({
        AccountId: String,
        AccountName: String,
        BankName: String,
        IsActive: Boolean,
        RoutingNumber: String,
        City: String,
        State: String,
        IsDefaultPayment: Boolean,
        IsDefaultDisbursement: Boolean,
        AccountNumber: String
      })
      .expectSuccess()
      .toss();

    frisby.create('Financial Account: Update one financial account')
      .put('/dealer/bankAccount/9e05f8c9-2e3b-4f80-a346-00004bceacb1',
      {
        AccountId: '9e05f8c9-2e3b-4f80-a346-00004bceacb1',
        AccountName: 'JP Morgan Chase Bank - 7905',
        BankName: 'JP Morgan Chase Bank',
        IsActive: true,
        RoutingNumber: '349886738',
        City: 'Phoenix',
        State: '77c78343-f0f1-4152-9f77-58a393f4099d',
        IsDefaultPayment: true,
        IsDefaultDisbursement: true,
        AccountNumber: '4199137905'
      }, {json: true})
      .expectJSONTypes('Data', {
        AccountId: String,
        AccountName: String,
        BankName: String,
        IsActive: Boolean,
        RoutingNumber: String,
        City: String,
        State: String,
        IsDefaultPayment: Boolean,
        IsDefaultDisbursement: Boolean,
        AccountNumber: String
      })
      .expectSuccess()
      .toss();
  })
  .toss();