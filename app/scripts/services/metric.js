'use strict';

angular.module('nextgearWebApp')
  .value('metric', {
    // Account/Support
    VIEW_PROFILE_SETTINGS: 'View Profile Settings',
    CHANGE_PROFILE_SETTINGS: 'Change Profile Settings',
    VIEW_ACCOUNT_MANAGEMENT: 'View Account Management',
    CHANGE_ACCOUNT_MANAGEMENT: 'Change Account Management',
    VIEW_AUCTION_SETTINGS: 'View Auction Settings',
    CHANGE_AUCTION_SETTINGS: 'Change Auction Settings',
    VIEW_ALL_TOP_AUCTIONS: 'View All Top Auctions',
    VIEW_CURRENT_REPORT: 'View Current Report', // reportName
    VIEW_HISTORICAL_REPORT: 'View Historical Report', // reportName
    // Flooring
    FLOOR_A_VEHICLE: 'Floor a Vehicle',
    BULK_FLOOR_A_VEHICLE: 'Bulk Floor a Vehicle',
    SEARCH_FOR_SELLER: 'Search for Seller',
    SEARCH_FOR_BUYER: 'Search for Buyer',
    VIEW_RESOURCE_DOCUMENT: 'View Resource Document', // documentName
    QUERY_BUYER_LINE_OF_CREDIT: 'Query Buyer Line of Credit',
    REQUEST_UNAPPLIED_FUNDS_PAYOUT: 'Request Unapplied Funds Payout',
    SCHEDULE_PAYMENT: 'Schedule Payment',
    MAKE_IMMEDIATE_PAYMENT: 'Make Immediate Payment',
    DOWNLOAD_MOBILE_APP: 'Download Mobile App',

    //*****************NEW EVENTS TRACKED*******************
    //Login Events
    VIEW_LOGIN_PAGE: 'View Login Page',//x
    CLICK_LOGIN_BUTTON: 'Click Login Button',//x
    CLICK_LOGIN_USERNAME_RECOVERY_SUBMIT_BUTTON: 'Click Login UN Recovery Submit Button',//x
    CLICK_LOGIN_PASSWORD_RECOVERY_SUBMIT_BUTTON: 'Click Login PW Recovery Submit Button',//x
    CLICK_LOGIN_SIGNUP_LINK: 'Click Login SignUp Link',//x

    //Navigational Events (see: navBar.js)
    CLICK_HOME_LINK: 'Click Home Link',//x
    CLICK_AUCTION_HOME_LINK: 'Click Auction Home Link',//x
    CLICK_FLOOR_A_CAR_LINK: 'Click Floor A Car Link',//x
    CLICK_VIEW_ANALYTICS_LINK: 'Click View Analytics Link',//x
    CLICK_RESOURCES_LINK: 'Click Resources Link',//x
    CLICK_AUCTION_RESOURCES_LINK: 'Click Auction Resources Link',//x
    CLICK_AUCTION_REPORTS_LINK: 'Click Auction Reports Link',//x
    //2nd tier nav
    CLICK_DASHBOARD_LINK: 'Click Dashboard Link',//x
    CLICK_PAYMENTS_LINK: 'Click Payments Link',//x
    CLICK_RECEIPTS_LINK: 'Click Receipts Link',//x
    CLICK_FLOORPLAN_LINK: 'Click Floor Plan Link',//x
    CLICK_TITLE_RELEASE_LINK: 'Click Title Release Link',//x

    //Global Events
    CLICK_CHAT_NOW_LINK: 'Click Chat Now Link',//x
    //Dropdown
    CLICK_SETTINGS_LINK: 'Click Settings Link',//x
    CLICK_PROFILE_SETTINGS_LINK: 'Click Profile Settings Link',//x
    CLICK_ACCOUNT_MANAGEMENT_LINK: 'Click Account Management Link',//x
    CLICK_LOGOUT_LINK: 'Click Logout Link',//x
    //Footer
    CLICK_PRIVACY_STATEMENT_LINK: 'Click Privacy Statement Link',//x
    CLICK_CONTACT_US_LINK: 'Click Contact Us Link',//x

    //Dashboard Events
    VIEW_DASHBOARD: 'View Dashboard',
    CLICK_DASHBOARD_CALENDAR_WEEK_BUTTON: 'Click Dashboard Calendar Week Button',//x
    CLICK_DASHBOARD_CALENDAR_MONTH_BUTTON: 'Click Dashboard Calendar Month Button',//x
    CLICK_DASHBOARD_CALENDAR_PAYMENT_LINK: 'Click Dashboard Calendar Payment Link',
    CLICK_DASHBOARD_REQUEST_CREDIT_INCREASE_BUTTON: 'Click Dashboard Request Credit Increase Button',//x
    CLICK_DASHBOARD_REQUEST_PAYOUT_BUTTON: 'Click Dashboard Request Payout Button',//x

    //Payments Events
    VIEW_PAYMENTS_PAGE: 'View Payments Page',
    CLICK_PAYMENTS_SEARCH_BUTTON: 'Click Payments Search Button',//x
    CLICK_PAYMENTS_FILTER_BY_DUE_DATE: 'Click Payments Filter By Due Date',//x
    CLICK_PAYMENTS_FILTER_BY_INVENTORY_LOCATION: 'Click Payments Filter By Inventory Location',//x
    CLICK_PAYMENTS_FILTER_FROM_DATE_INPUT: 'Click Payments Filter From Date Input',//x
    CLICK_PAYMENTS_FILTER_TO_DATE_INPUT: 'Click Payments Filter To Date Input',//x
    CLICK_PAYMENTS_REQUEST_EXTENSION: 'Click Payments Request Extension',//x

    //Scheduled Payments Events
    VIEW_SCHEDULED_PAYMENTS_PAGE: 'View Scheduled Payments Page',
    CLICK_SCHEDULED_PAYMENTS_CLEAR_SEARCH_LINK: 'Click Scheduled Payments Clear Search Link',//x
    CLICK_SCHEDULED_PAYMENTS_SEARCH_BUTTON: 'Click Scheduled Payments Search Button',//x
    CLICK_SCHEDULED_PAYMENTS_FILTER_BY_PAYMENT_STATUS: 'Click Scheduled Payments Filter By Payment Status',//x
    CLICK_SCHEDULED_PAYMENTS_FILTER_BY_INVENTORY_LOCATION: 'Click Scheduled Payments Filter By Inventory Location',//x
    CLICK_SCHEDULED_PAYMENTS_FILTER_FROM_DATE_INPUT: 'Click Scheduled Payments Filter From Date Input',//x
    CLICK_SCHEDULED_PAYMENTS_FILTER_TO_DATE_INPUT: 'Click Scheduled Payments Filter To Date Input',//x
    CLICK_SCHEDULED_PAYMENTS_VEHICLE_CANCEL_FEE_BUTTON: 'Click Scheduled Payments Vehicle Cancel Fee Button',//x

    //Checkout Events
    CLICK_CHECKOUT_EXPORT_PAYMENTS_SUMMARY_BUTTON: 'Click Checkout Export Payments Summary Button',//x
    CLICK_CHECKOUT_VEHICLE_EXPAND_INFORMATION: 'Click Checkout Vehicle Expand Information',//x
    CLICK_CHECKOUT_SUBMIT_PAYMENTS_BUTTON: 'Click Checkout Submit Payments Button',//x

    //Receipts Events
    VIEW_RECEIPTS_PAGE: 'View Receipts Page',

    //FloorPlan Events
    VIEW_FLOORPLAN_PAGE: 'View FloorPlan Page',//x
    CLICK_FLOORPLAN_VEHICLE_VIEW_TITLE: 'Click Floorplan Vehicle View Title',
    CLICK_FLOORPLAN_AUCTION_VEHICLE_VIEW_TITLE: 'Click Floorplan Auction Vehicle View Title',

    //Title Release Events
    VIEW_TITLE_RELEASE_PAGE: 'View Title Release Page',//x
    CLICK_TITLE_RELEASE_REMOVE_TITLE_BUTTON: 'Click Title Release Remove Title Button',//x

    //Title Release Checkout Events
    VIEW_TITLE_RELEASE_CHECKOUT_PAGE: 'View Title Release Checkout Page',//x
    CLICK_TITLE_RELEASE_CHECKOUT_CONFIRM_REQUEST_BUTTON: 'Click Title Release Checkout Confirm Request Button',//x

    //Floor a Vehicle Events
    VIEW_FLOOR_A_VEHICLE_PAGE: 'View Floor a Vehicle Page',//x
    CLICK_FLOOR_A_VEHICLE_BY_VIN_LOOKUP_BUTTON: 'Click Floor a Vehicle by VIN Look Up Button',//x
    CLICK_FLOOR_A_VEHICLE_FLOOR_BUTTON: 'Click Floor a Vehicle Floor Button',//x

    //View a Report Events
    VIEW_VIEW_A_REPORT_PAGE: 'View View a Report Page',//x
    CLICK_VIEW_A_REPORT_DATE_INPUT: 'Click View a Report Date Input',//x
    CLICK_VIEW_A_REPORT_CURTAILMENT_PAYOFF_QUOTE_BUTTON: 'Click View a Report Upcoming Curtailment/Payoff Quote Button',//x
    CLICK_VIEW_A_REPORT_EXPORTABLE_INVENTORY_BUTTON: 'Click View a Report Exportable Inventory Button',//x
    CLICK_VIEW_A_REPORT_DEALER_STATEMENT_BUTTON: 'Click View a Report Dealer Statement Button',//x
    CLICK_VIEW_A_REPORT_DISBURSEMENT_DETAIL_BUTTON: 'Click View a Report Disbursement Detail Button',//x
    CLICK_VIEW_A_REPORT_PAID_OFF_SUMMARY_VIEW_REPORT: 'Click View a Report Paid Off Summary View Report',//x

    //View Analytics Events
    VIEW_VIEW_ANALYTICS_PAGE: 'View View Analytics Page',//x
    CLICK_VIEW_ANALYTICS_VIEW_ALL_AUCTIONS_BUTTON: 'Click View Analytics View All Auctions Button',//x
    CLICK_VIEW_ANALYTICS_BEST_MOVERS_BUTTON: 'Click View Analytics Best Movers Button',//x
    CLICK_VIEW_ANALYTICS_WORST_MOVERS_BUTTON: 'Click View Analytics Worst Movers Button',//x

    //Resources Events
    VIEW_RESOURCES_PAGE: 'View Resources Page',//x

    //Value Lookup Events
    CLICK_VALUE_LOOKUP_VIN_WITH_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN With Zip Lookup Button',
    CLICK_VALUE_LOOKUP_VIN_WITHOUT_ZIP_LOOKUP_BUTTON: 'Click Value Lookup VIN Without Zip Lookup Button',
    CLICK_VALUE_LOOKUP_NGC_LOOKUP_BUTTON: 'Click Value Lookup NGC Lookup Button',
    CLICK_VALUE_LOOKUP_MMR_LOOKUP_BUTTON: 'Click Value Lookup MMR Lookup Button',
    CLICK_VALUE_LOOKUP_KBB_LOOKUP_BUTTON: 'Click Value Lookup KBB Lookup Button'
  });
