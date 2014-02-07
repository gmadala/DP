'use strict';

angular.module('nextgearWebApp')
  .value('metric', {
    // Account/Support
    VIEW_SETTINGS: 'View Settings',
    CHANGE_SETTINGS: 'Change Settings',
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
    MAKE_IMMEDIATE_PAYMENT: 'Make Immediate Payment', // revenue
    ADD_TO_BASKET: 'Add to Basket',
    VIEW_SCHEDULED_PAYMENTS_LIST: 'View Scheduled Payments List',
    // Receipts
    VIEW_RECEIPTS_LIST: 'View Receipts List',
    VIEW_RECEIPT_DETAIL: 'View Receipt Detail',
    // Download Mobile App Links - App Stores
    DOWNLOAD_MOBILE_APP: 'Download Mobile App'
  });
