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
    // Analytics & Reports
    VIEW_ANALYTICS_DASHBOARD: 'View Analytics Dashboard',
    VIEW_ALL_TOP_AUCTIONS: 'View All Top Auctions',
    VIEW_CURRENT_REPORT: 'View Current Report', // reportName
    VIEW_HISTORICAL_REPORT: 'View Historical Report', // reportName
    // Flooring
    FLOOR_A_VEHICLE: 'Floor a Vehicle',
    BULK_FLOOR_A_VEHICLE: 'Bulk Floor a Vehicle',
    SEARCH_FOR_SELLER: 'Search for Seller',
    SEARCH_FOR_BUYER: 'Search for Buyer',
    // Floorplan
    VIEW_FLOOR_PLAN_DETAILS: 'View Floor Plan Details',
    VIEW_TITLE: 'View Title',
    // General
    VIEW_MAIN_DASHBOARD: 'View Main Dashboard',
    VIEW_RESOURCE_DOCUMENT: 'View Resource Document', // documentName
    QUERY_BUYER_LINE_OF_CREDIT: 'Query Buyer Line of Credit',
    REQUEST_UNAPPLIED_FUNDS_PAYOUT: 'Request Unapplied Funds Payout',
    // Payments
    VIEW_PAYMENTS_LIST: 'View Payments List',
    SCHEDULE_PAYMENT: 'Schedule Payment',
    MAKE_IMMEDIATE_PAYMENT: 'Make Immediate Payment', // revenue => NOT IMPLEMENTED: this was removed by client's request
    ADD_TO_BASKET: 'Add to Basket',
    VIEW_SCHEDULED_PAYMENTS_LIST: 'View Scheduled Payments List',
    // Receipts
    VIEW_RECEIPTS_LIST: 'View Receipts List',
    VIEW_RECEIPT_DETAIL: 'View Receipt Detail',//NOT IMPLEMENTED
    // Download Mobile App Links - App Stores
    DOWNLOAD_MOBILE_APP: 'Download Mobile App',

    //*****************NEW EVENTS TRACKED*******************
    //Login Events
    VIEW_LOGIN_PAGE: 'View Login Page',//x
    CLICK_LOGIN_BUTTON: 'Click Login Button',//x
    CLICK_FORGOT_USERNAME_OR_PASSWORD: 'Click Forgot Username or Password',//x
    CLICK_LOGIN_USERNAME_RECOVERY_SUBMIT_BUTTON: 'Click Login UN Recovery Submit Button',//x
    CLICK_LOGIN_PASSWORD_RECOVERY_SUBMIT_BUTTON: 'Click Login PW Recovery Submit Button',//x
    CLICK_LOGIN_SIGNUP_LINK: 'Click Login SignUp Link',//x

    //Navigational Events
    CLICK_HOME_LINK: 'Click Home Link',
    CLICK_FLOOR_A_CAR_LINK: 'Click Floor A Car Link',
    CLICK_VIEW_A_REPORT_LINK: 'Click View A Report Link',
    CLICK_VIEW_ANALYTICS_LINK: 'Click View Analytics Link',
    CLICK_RESOURCES_LINK: 'Click Resources Link',
    CLICK_DASHBOARD_LINK: 'Click Dashboard Link',
    CLICK_PAYMENTS_LINK: 'Click Payments Link',
    CLICK_SCHEDULED_PAYMENTS_LINK: 'Click Scheduled Payments Link',
    CLICK_RECEIPTS_LINK: 'Click Receipts Link',
    CLICK_FLOORPLAN_LINK: 'Click Floor Plan Link',
    CLICK_TITLE_RELEASE_LINK: 'Click Title Release Link',

    //Global Events
    CLICK_NEXTGEAR_LOGO: 'Click NextGear Logo',
    CLICK_CHAT_NOW_LINK: 'Click Chat Now Link',
    CLICK_PROFILE_SETTINGS_LINK: 'Click Profile Settings Link',
    CLICK_ACCOUNT_MANAGEMENT_LINK: 'Click Account Management Link',
    CLICK_TAKE_BOS_PHOTO: 'Click Take a BOS Photo',
    CLICK_PRIVACY_STATEMENT_LINK: 'Click Privacy Statement Link',
    CLICK_CONTACT_US_LINK: 'Click Contact Us Link',

    //Dashboard Events
    VIEW_DASHBOARD: 'View Dashboard',
    CLICK_DASHBOARD_CALENDAR_TODAY_LINK: 'Click Dashboard Calendar Today Link',
    CLICK_DASHBOARD_CALENDAR_WEEK_BUTTON: 'Click Dashboard Calendar Week Button',
    CLICK_DASHBOARD_CALENDAR_MONTH_BUTTON: 'Click Dashboard Calendar Month Button',
    CLICK_DASHBOARD_CALENDAR_BACK_BUTTON: 'Click Dashboard Calendar Back Button',
    CLICK_DASHBOARD_CALENDAR_FORWARD_BUTTON: 'Click Dashboard Calendar Forward Button',
    CLICK_DASHBOARD_CALENDAR_PAYMENT_LINK: 'Click Dashboard Calendar Payment Link',
    CLICK_DASHBOARD_PAYMENTS_OVERDUE: 'Click Dashboard Payments Overdue',
    CLICK_DASHBOARD_PAYMENTS_DUE_TODAY: 'Click Dashboard Payments Due Today',
    CLICK_DASHBOARD_PAYMENTS_WEEK: 'Click Dashboard Payments Week',
    CLICK_DASHBOARD_PAYMENTS_FEES: 'Click Dashboard Payments Fees',
    CLICK_DASHBOARD_REQUEST_CREDIT_INCREASE_BUTTON: 'Click Dashboard Request Credit Increase Button',
    CLICK_DASHBOARD_REQUEST_PAYOUT_BUTTON: 'Click Dashboard Request Payout Button',
    CLICK_DASHBOARD_VIEW_FLOORPLAN_BUTTON: 'Click Dashboard View Floor Plan Button',
    CLICK_DASHBOARD_VIEW_ALL_RECEIPTS: 'Click Dashboard View All Receipts',
    CLICK_DASHBOARD_VIEW_RECEIPTS: 'Click Dashboard View Receipts',

    //Payments Events
    VIEW_PAYMENTS_PAGE: 'View Payments Page',
    CLICK_PAYMENTS_SEARCH_INPUT: 'Click Payments Search Input',
    CLICK_PAYMENTS_CLEAR_SEARCH_LINK: 'Click Payments Clear Search Link',
    CLICK__PAYMENTS_SEARCH_BUTTON: 'Click Payments Search Button',
    CLICK__PAYMENTS_FILTER_BY_INPUT: 'Click Payments Filter By Input',
    CLICK__PAYMENTS_FILTER_FROM_DATE_INPUT: 'Click Payments Filter From Date Input',
    CLICK__PAYMENTS_FILTER_TO_DATE_INPUT: 'Click Payments Filter To Date Input',
    CLICK__PAYMENTS_VEHICLE_EXPAND_INFORMATION: 'Click Payments Vehicle Expand Information',
    CLICK__PAYMENTS_VEHICLE_DETAILED_REPORT: 'Click Payments Vehicle Detailed Report',
    CLICK__PAYMENTS_VEHICLE_ADD_PAYMENT: 'Click Payments Vehicle Add Payment',
    CLICK__PAYMENTS_VEHICLE_ADD_PAYOFF: 'Click Payments Vehicle Add Payoff',
    CLICK__PAYMENTS_VEHICLE_REMOVE_PAYMENT: 'Click Payments Vehicle Remove Payment',
    CLICK_PAYMENTS_VEHICLE_REMOVE_PAYOFF: 'Click Payments Vehicle Remove Payoff',
    CLICK__PAYMENTS_VEHICLE_VIEW_TITLE: 'Click Payments Vehicle View Title',
    CLICK_PAYMENTS_ACCOUNT_FEES: 'Click Account Fees: Payment',

    //Checkout Events
    CLICK_CHECKOUT_PANEL_CONTINUE_TO_CHECKOUT_BUTTON: 'Click Checkout Panel Continue to Checkout Button',
    CLICK_CHECKOUT_PANEL_REMOVE_PAYMENT: 'Click Checkout Panel Remove Payment',
    CLICK_CHECKOUT_EXPOERT_PAYMENTS_SUMMARY_BUTTON: 'Click Checkout Export Payments Summary Button',
    CLICK_CHECKOUT_VEHICLE_EXPAND_INFORMATION: 'Click Checkout Vehicle Expand Information',
    CLICK_CHECKOUT_VEHICLE_DETAILED_REPORT: 'Click Checkout Vehicle Detailed Report',
    CLICK_CHECKOUT_SUBMIT_PAYMENTS_BUTTON: 'Click Checkout Submit Payments Button',
    CLICK_CHECKOUT_REMOVE_PAYMENT_LINK: 'Click Checkout Remove Payment Link',
    CLICK_CHECKOUT_APPLY_FUNDS_YES: 'Click Checkout Apply Funds Yes',
    CLICK_CHECKOUT_SELECT_ACCOUNT: 'Click Checkout Select Account',
    CLICK_CHECKOUT_ACCOUNT_FEES: 'Click Account Fees: Checkout',

     //Scheduled Payments Events
    VIEW_SCHEDULED_PAYMENTS_PAGE: 'View Scheduled Payments Page',
    CLICK_SCHEDULED_PAYMENTS_SEARCH_INPUT: 'Click Scheduled Payments Search Input',
    CLICK_SCHEDULED_PAYMENTS_CLEAR_SEARCH_LINK: 'Click Scheduled Payments Clear Search Link',
    CLICK_SCHEDULED_PAYMENTS_SEARCH_BUTTON: 'Click Scheduled Payments Search Button',
    CLICK_SCHEDULED_PAYMENTS_FILTER_BY_INPUT: 'Click Scheduled Payments Filter By Input',
    CLICK_SCHEDULED_PAYMENTS_FILTER_FROM_DATE_INPUT: 'Click Scheduled Payments Filter From Date Input',
    CLICK_SCHEDULED_PAYMENTS_FILTER_TO_DATE_INPUT: 'Click Scheduled Payments Filter To Date Input',
    CLICK_SCHEDULED_PAYMENTS_VEHICLE_EXPAND_INFORMATION: 'Click Scheduled Payments Vehicle Expand Information',
    CLICK_SCHEDULED_PAYMENTS_VEHICLE_DETAILED_REPORT: 'Click Scheduled Payments Vehicle Detailed Report',

    //Receipts Events
    VIEW_RECEIPTS_PAGE: 'View Receipts Page',
    CLICK_RECEIPTS_SEARCH_INPUT: 'Click Receipts Search Input',
    CLICK_RECEIPTS_CLEAR_SEARCH_LINK: 'Click Receipts Clear Search Link',
    CLICK_RECEIPTS_SEARCH_BUTTON: 'Click Receipts Search Button',
    CLICK_RECEIPTS_FILTER_BY_INPUT: 'Click Receipts Filter By Input',
    CLICK_RECEIPTS_FILTER_FROM_DATE_INPUT: 'Click Receipts Filter From Date Input',
    CLICK_RECEIPTS_FILTER_TO_DATE_INPUT: 'Click Receipts Filter To Date Input',
    CLICK_RECEIPTS_VEHICLE_EXPAND_INFORMATION: 'Click Receipts Vehicle Expand Information',
    CLICK_RECEIPTS_VEHICLE_DETAILED_REPORT: 'Click Receipts Vehicle Detailed Report',
    CLICK_RECEIPTS_VIEW_RECEIPT_INPUT: 'Click Receipts View Receipt Input',
    CLICK_RECEIPTS_VIEW_SELECTED_RECEIPTS_BUTTON: 'Click Receipts View Selected Receipts Button',

    //FloorPlan Events
    VIEW_FLOORPLAN_PAGE: 'View FloorPlan Page',
    CLICK_FLOORPLAN_FILTER_RESULTS_INPUT: 'Click FloorPlan Filter Results Input',
    CLICK_FLOORPLAN_APPROVED: 'Click Floorplan Approved',
    CLICK_FLOORPLAN_PENDING: 'Click Floorplan Pending',
    CLICK_FLOORPLAN_DENIED: 'Click Floorplan Denied',
    CLICK_FLOORPLAN_COMPLETED: 'Click Floorplan Completed',
    CLICK_FLOORPLAN_SEARCH_FIELD: 'Click Floorplan Search Field',
    CLICK_FLOORPLAN_SEARCH_BUTTON: 'Click Floorplan Search Button',
    CLICK_FLOORPLAN_FILTER_FROM_DATE_INPUT: 'Click Floorplan Filter From Date Input',
    CLICK_FLOORPLAN_FILTER_TO_DATE_INPUT: 'Click Floorplan Filter To Date Input',
    FLOORPLAN_SEARCH_TERM: 'Floorplan Search Term',
    CLICK_FLOORPLAN_VEHICLE_EXPAND_INFORMATION: 'Click Floorplan Vehicle Expand Information',
    CLICK_FLOORPLAN_VEHICLE_DETAILED_REPORT: 'Click Floorplan Vehicle Detailed Report',
    CLICK_FLOORPLAN_VEHICLE_VIEW_TITLE: 'Click Floorplan Vehicle View Title',

    //Title Release Events
    VIEW_TITLE_RELEASE_PAGE: 'View Title Release Page',
    CLICK_TITLE_RELEASE_SEARCH_FIELD: 'Click Title Release Search Field',
    CLICK_TITLE_RELEASE_SEARCH_BUTTON: 'Click Title Release Search Button',
    CLICK_TITLE_RELEASE_FILTER_FROM_DATE_INPUT: 'Click Title Release Filter From Date Input',
    CLICK_TITLE_RELEASE_FILTER_TO_DATE_INPUT: 'Click Title Release Filter To Date Input',
    CLICK_TITLE_RELEASE_FILTER_RESULTS_INPUT: 'Click Title Release Filter Results Input',
    CLICK_TITLE_RELEASE_RELEASED: 'Click Title Release Released',
    CLICK_TITLE_RELEASE_ELIGIBLE: 'Click Title Release Eligible',
    CLICK_TITLE_RELEASE_NOT_ELIGIBLE: 'Click Title Release Not Eligible',
    CLICK_TITLE_RELEASE_REQUEST_TITLE_BUTTON: 'Click Title Release Request Title Button',
    CLICK_TITLE_RELEASE_VEHICLE_EXPAND_INFORMATION: 'Click Title Release Vehicle Expand Information',
    CLICK_TITLE_RELEASE_VEHICLE_DETAILED_REPORT: 'Click Title Release Vehicle Detailed Report',
    CLICK_TITLE_RELEASE_CONTINUE_TO_CHECKOUT_BUTTON: 'Click Title Release Continue to Checkout Button',

    //Title Release Checkout Events
    VIEW_TITLE_RELEASE_CHECKOUT_PAGE: 'View Title Release Checkout Page',
    CLICK_TITLE_RELEASE_CHECKOUT_REMOVE_REQUEST_BUTTON: 'Click Title Release Checkout Remove Request Button',
    CLICK_TITLE_RELEASE_CHECKOUT_SEND_TO_ADDRESS_FIELD: 'Click Title Release Checkout Send To Address Field',
    CLICK_TITLE_RELEASE_CHECKOUT_CONFIRM_REQUEST_BUTTON: 'Click Title Release Checkout Confirm Request Button',

    //Floor a Vehicle Events
    VIEW_FLOOR_A_VEHICLE_PAGE: 'View Floor a Vehicle Page',
    CLICK_FLOOR_A_VEHICLE_SELLER_LOOKUP_BUTTON: 'Click Floor a Vehicle  Seller Lookup Button',
    CLICK_FLOOR_A_VEHICLE_BY_VIN_FIELD: 'Click Floor a Vehicle by VIN Field',
    CLICK_FLOOR_A_VEHICLE_BY_VIN_LOOKUP_BUTTON: 'Click Floor a Vehicle by VIN Look Up Button',
    CLICK_FLOOR_A_VEHICLE_COLOR_FIELD: 'Click Floor a Vehicle Color Field',
    CLICK_FLOOR_A_VEHICLE_MILEAGE_FIELD: 'Click Floor a Vehicle Mileage Field',
    CLICK_FLOOR_A_VEHICLE_WHO_HAS_THE_TITLE_FIELD: 'Click Floor a Vehicle Who has the Title Field',
    CLICK_FLOOR_A_VEHICLE_INVENTORY_LOCATION_FIELD: 'Click Floor a Vehicle Inventory Location Field',
    CLICK_FLOOR_A_VEHICLE_CANCEL_BUTTON: 'Click Floor a Vehicle Cancel Button',
    CLICK_FLOOR_A_VEHICLE_FLOOR_BUTTON: 'Click Floor a Vehicle Floor Button',

    //View a Report Events
    VIEW_VIEW_A_REPORT_PAGE: 'View View a Report Page',
    CLICK_VIEW_A_REPORT_RECEIVABLE_DETAIL_LINK: 'Click View a Report Receivable Detail Link',
    CLICK_VIEW_A_REPORT_DATE_INPUT: 'Click View a Report Date Input',
    CLICK_VIEW_A_REPORT_EXPORTABLE_INVENTORY_BUTTON: 'Click View a Report Exportable Inventory Button',
    CLICK_VIEW_A_REPORT_DEALER_STATEMENT_BUTTON: 'Click View a Report Dealer Statement Button',
    CLICK_VIEW_A_REPORT_PAID_OFF_SUMMARY_VIEW_REPORT: 'Click View a Report Paid Off Summary View Report',

    //View Analytics Events
    VIEW_ANALYTICS_PAGE: 'View Analytics Page',
    CLICK_VIEW_ANALYTICS_SHOW_DETAILS_LINK: 'Click View Analytics Show Details Link',
    CLICK_VIEW_ANALYTICS_VIEW_ALL_ACUTIONS_BUTTON: 'Click View Analytics View All Auctions Button',

    //Resources Events
    VIEW_RESOURCES_PAGE: 'View Resources Page'

  });
