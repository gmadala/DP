'use strict';

angular.module('nextgearWebApp')
  .value('metric', {
    //*****************NEW EVENTS TRACKED*******************
    LOGIN_SUCCESSFUL: 'Login Successful',
    SECURITY_QUESTIONS_COMPLETED: 'Security Questions Completed',

    //Login Events
    CLICK_LOGIN_USERNAME_RECOVERY_SUBMIT_BUTTON: 'Click Login UN Recovery Submit Button',//x
    CLICK_LOGIN_PASSWORD_RECOVERY_SUBMIT_BUTTON: 'Click Login PW Recovery Submit Button',//x

    // Flooring car
    DEALER_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED: 'Dealer - Successful Flooring Request Submitted',

    //Global Events
    CLICK_CHAT_NOW_LINK: 'Click Chat Now Link',//x

    //Checkout Events
    CLICK_CHECKOUT_EXPORT_PAYMENTS_SUMMARY_BUTTON: 'Click Checkout Export Payments Summary Button',//x

    //View a Report Events
    DEALER_REPORTS_VEHICLE_HISTORY_DETAIL:'Dealer Reports - Vehicle History Detail',
    DEALER_REPORTS_RECEIVABLE_DETAIL: 'Dealer Reports - Receivable Detail',
    DEALER_REPORTS_UPCOMING_CURTAILMENT_PAYOFF_QUOTE: 'Dealer Reports - Upcoming Curtailment/Payoff Quote',//x
    DEALER_REPORTS_EXPORTABLE_INVENTORY: 'Dealer Reports - Exportable Inventory',//x
    DEALER_REPORT_DEALER_STATEMENT: 'Dealer Reports - Dealer Statement',//x
    DEALER_REPORTS_DISBURSEMENT_DETAIL: 'Dealer Report - Disbursement Detail',//x
    DEALER_REPORTS_PAID_OFF_SUMMARY: 'Dealer Report - Paid Off Summary',//x

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
