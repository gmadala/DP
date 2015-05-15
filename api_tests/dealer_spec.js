'use strict';

var frisby = require('./frisby_mobile_service');
var base = frisby.apiBase;

frisby.login()
  .after(function () {

    frisby.create('Dealer: Get info')
      .get(base + 'dealer/v1_2/info')
      .expectJSONTypes('Data', {
        BusinessId: String,
        BusinessNumber: Number,
        BusinessName: String,
        MarketName: String,
        MarketPhoneNumber: String,
        CSCPhoneNumber: String,
        MarketEMail: String,
        IsBuyerDirectlyPayable: Boolean,
        HasUCC: Boolean,
        MarketNumber: Number,
        DealerAuctionStatusForGA: String,
        CurrentlyApprovedMinFlooringDate: String,
        BusinessEmail: String,
        BusinessContactEmail: String,
        BusinessContactUserName: String,
        Phone: String,
        CellPhone: String,
        DealerAddresses: [],
        BankAccounts: [],
        DefaultDisbursementBankAccountId: String,
        DefaultBillingBankAccountId: String,
        LinesOfCredit: [],
        DisplayTitleReleaseProgram: true,
        ManufacturerSubsidiaries: [],
        CountryId: String,
        LanguageId: Number
      })
      // expectJSONTypes does not recurse into arrays so test those separately
      .expectJSONTypes('Data.DealerAddresses.*', {
        AddressId: String,
        Line1: String,
        Line2: Object,
        City: String,
        State: String,
        Zip: String,
        Phone: String,
        Fax: String,
        IsActive: Boolean,
        IsPhysicalInventory: Boolean,
        HasFloorplanFlooredAgainst: Boolean,
        HasApprovedFloorplanFlooredAgainst: Boolean,
        IsTitleReleaseAddress: Boolean,
        IsMailingAddress: Boolean,
        IsPostOfficeBox: Boolean
      })
      .expectJSONTypes('Data.BankAccounts.*', {
        BankAccountId: String,
        BankAccountName: String,
        AchAccountNumberLast4: String,
        IsActive: Boolean,
        AchAbaNumber: String,
        AchBankName: String,
        AllowPaymentByAch: Boolean
      })
      .expectJSONTypes('Data.LinesOfCredit.*', {
        LineOfCreditId: String,
        LineOfCreditName: String
      })
      .expectJSONTypes('Data.ManufacturerSubsidiaries.*', {
        BusinessId: String,
        BusinessNumber: Number,
        BusinessName: String,
        Line1: String,
        City: String,
        State: String,
        Zip: String,
        Phone: String
      })
      .expectSuccess()
      .toss();

  })
  .toss();
