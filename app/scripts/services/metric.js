'use strict';

angular.module('nextgearWebApp')
  .value('metric', {
    //*****************NEW EVENTS TRACKED*******************
    //Login Events
    CLICK_LOGIN_USERNAME_RECOVERY_SUBMIT_BUTTON: 'Click Login UN Recovery Submit Button',//x
    CLICK_LOGIN_PASSWORD_RECOVERY_SUBMIT_BUTTON: 'Click Login PW Recovery Submit Button',//x

    //Global Events
    CLICK_CHAT_NOW_LINK: 'Click Chat Now Link',//x

    //Checkout Events
    CLICK_CHECKOUT_EXPORT_PAYMENTS_SUMMARY_BUTTON: 'Click Checkout Export Payments Summary Button',//x

    //View a Report Events
    CLICK_VIEW_A_REPORT_CURTAILMENT_PAYOFF_QUOTE_BUTTON: 'Click View a Report Upcoming Curtailment/Payoff Quote Button',//x
    CLICK_VIEW_A_REPORT_EXPORTABLE_INVENTORY_BUTTON: 'Click View a Report Exportable Inventory Button',//x
    CLICK_VIEW_A_REPORT_DEALER_STATEMENT_BUTTON: 'Click View a Report Dealer Statement Button',//x
    CLICK_VIEW_A_REPORT_DISBURSEMENT_DETAIL_BUTTON: 'Click View a Report Disbursement Detail Button',//x
    CLICK_VIEW_A_REPORT_PAID_OFF_SUMMARY_VIEW_REPORT: 'Click View a Report Paid Off Summary View Report',//x

    //View Analytics Events
    VIEW_VIEW_ANALYTICS_PAGE: 'View View Analytics Page',//x

    //Resources Events
    VIEW_RESOURCES_PAGE: 'View Resources Page',//x

    //Value Lookup Events
    CLICK_VALUE_LOOKUP_VIN_WITH_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN With Zip Lookup Button',
    CLICK_VALUE_LOOKUP_VIN_WITHOUT_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN Without Zip Lookup Button',
    CLICK_VALUE_LOOKUP_NGC_LOOKUP_BUTTON: 'Click Value Lookup NGC Lookup Button',
    CLICK_VALUE_LOOKUP_MMR_LOOKUP_BUTTON: 'Click Value Lookup MMR Lookup Button',
    CLICK_VALUE_LOOKUP_KBB_LOOKUP_BUTTON: 'Click Value Lookup KBB Lookup Button'
  });
