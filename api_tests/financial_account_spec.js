'use strict';

var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;

frisby.login()
  .after(function () {
    frisby.create('Financial Account: Get financial accounts')
      .get(base + '/dealer/v1_1/summary')
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
      .get(base + 'dealer/bankAccount/4ed7e947-db20-43e1-a36e-b2dbb79c3ce5')
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

    frisby.create('Financial Account: Update one financial account')
      .put(base + 'dealer/bankAccount',
      {
        AccountId: '4ed7e947-db20-43e1-a36e-b2dbb79c3ce5',
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
      .expectSuccess()
      .toss();

    frisby.create('Financial Account: Add one financial account')
      .post(base + 'dealer/bankAccount/',
      {
        AccountName: 'Stage Coach Primary',
        BankName: 'Stage Coach Primary',
        IsActive: false,
        RoutingNumber: '123456789',
        City: 'Phoenix',
        State: '0b3ee659-d0e5-4d24-a851-f164bb5fe70c',
        IsDefaultPayment: false,
        IsDefaultDisbursement: false,
        AccountNumber: '4199137905',
        TOSAcceptanceFlag: true
      }, {json: true})
      .expectJSONTypes('Data', String)
      .expectSuccess()
      .toss();

    frisby.create('Financial Account: Fail to add one financial account because Terms and Conditions were not accepted')
      .post(base + 'dealer/bankAccount/',
      {
        AccountName: 'Bank of America',
        BankName: 'Stage Coach Primary',
        IsActive: false,
        RoutingNumber: '123456789',
        City: 'Phoenix',
        State: '0b3ee659-d0e5-4d24-a851-f164bb5fe70c',
        IsDefaultPayment: false,
        IsDefaultDisbursement: false,
        AccountNumber: '12345432',
        TOSAcceptanceFlag: false
      }, {json: true})
      .expectJSON({
        Success: false,
        Message: 'The Terms and Conditions must be accepted before adding a bank account'
      })
      .expectSuccess()
      .toss();
  })
  .toss();
