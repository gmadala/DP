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
    DEALER_RESOURCES_RATES_AND_FEES_PAGE: 'Dealer Resources - Rates and Fees',//x
    DEALER_RESOURCES_WELCOME_PACKET_PAGE: 'Dealer Resources - Welcome Packet',//x
    DEALER_RESOURCES_DEALER_FUNDING_CHECKLIST_PAGE: 'Dealer Resources - Dealer Funding Checklist',//x
    DEALER_RESOURCES_INSTRUCTIONS_FOR_BUYERS_PAGE: 'Dealer Resources - Instructions For Buyers',//x
    DEALER_RESOURCES_WELCOME_LETTER_PAGE: 'Dealer Resources - Welcome Letter',//x
    DEALER_RESOURCES_GUIDELINES_PAGE: 'Dealer Resources - Guidelines',//X
    DEALER_RESOURCES_INFORMATION_SHEET_PAGE: 'Dealer Resources - Information Sheet',//X
    DEALER_RESOURCES_CLAIM_FORM_PAGE: 'Dealer Resources - Claim Form',//X
    DEALER_TEMP_CREDIT_INCREASE_REQUEST_SUBMITTED_PAGE: 'Dealer - Temp Credit Increase Request Submitted',//X
    DEALER_PERMANENT_CREDIT_INCREASE_REQUEST_SUBMITTED: 'Dealer - Permanent Credit Increase Request Submitted',//X

    //Resources Events for  - Auction
    VIEW_AUCTION_REPORTS_PAGE: 'View Auction Reports',
    AUCTION_RESOURCES_WELCOME_PACKET_PAGE: 'Auction Resources - Welcome Packet',//X
    AUCTION_RESOURCES_INSTRUCTIONS_FOR_SELLERS_PAGE: 'Auction Resources - Instructions for Sellers',//X
    AUCTION_REPORTS_CREDIT_AVAILABILITY_QUERY_HISTORY_PAGE: 'Auction Reports - Credit Availability Query History',//X
    AUCTION_REPORTS_DISBURSEMENT_DETAIL_PAGE: 'Auction Reports - Disbursement Detail',//X
    MANUFACTURER_REPORTS_AGING_REPORT_PAGE: 'Manufacturer Reports - Aging Report',

    AUCTION_SUCCESSFUL_FLOORING_REQUEST_SUBMITTED_PAGE: 'Auction - Successful Flooring Request Submitted',//X
    AUCTION_INDIVIDUAL_DEALER_LOC_QUERY_PAGE: 'Auction - Individual Dealer LOC Query',//X



    //Value Lookup Events
    CLICK_VALUE_LOOKUP_VIN_WITH_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN With Zip Lookup Button',
    CLICK_VALUE_LOOKUP_VIN_WITHOUT_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN Without Zip Lookup Button',
    CLICK_VALUE_LOOKUP_NGC_LOOKUP_BUTTON: 'Click Value Lookup NGC Lookup Button',
    CLICK_VALUE_LOOKUP_MMR_LOOKUP_BUTTON: 'Click Value Lookup MMR Lookup Button',
    CLICK_VALUE_LOOKUP_KBB_LOOKUP_BUTTON: 'Click Value Lookup KBB Lookup Button',

    //Account Management Events
    DEALER_VIEW_ACCOUNT_MANAGEMENT_PAGE: 'Dealer - View Account Management Page',
    DEALER_ADD_BANK_ACCOUNT: 'Dealer - Add Bank Account',
    DEALER_EDIT_BANK_ACCOUNT: 'Dealer - Edit Bank Account'
  });
