import permissions from './permissionTypes'

export default [
    {
        title: 'sideMenu.defaultMenu.dashboard',
        state: 'dashboard',
        active: false,
        permission: permissions.ALL
    },
    {
        title: 'sideMenu.defaultMenu.profileSettings',
        state: 'profile_settings',
        active: false,
        permission: permissions.DEALER
    },
    {
        title: 'sideMenu.defaultMenu.accountManagement',
        state: 'account_management',
        active: false,
        permission: permissions.DEALER
    },
    {
        title: 'sideMenu.defaultMenu.settings',
        state: 'auction_settings',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.defaultMenu.dealerSearch',
        state: 'auction_dealersearch',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.floorplanMenu.floorAVehicle',
        state: 'auction_bulkflooring',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.defaultMenu.floorPlanSearch',
        state: 'auction_sellerfloorplan',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.defaultMenu.reports',
        state: 'auction_reports',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.defaultMenu.resources',
        state: 'auction_documents',
        active: false,
        permission: permissions.AUCTION
    },
    {
        title: 'sideMenu.defaultMenu.payments',
        active: false,
        permission: permissions.DEALER,
        subMenu: [
            {
                title: 'sideMenu.paymentsMenu.makeAPayment',
                state: 'payments',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.paymentsMenu.receipts',
                state: 'receipts',
                active: false,
                permission: permissions.ALL
            }
        ]
    },
    {
        title: 'sideMenu.defaultMenu.floorPlan',
        active: false,
        permission: permissions.DEALER,
        subMenu: [
            {
                title: 'sideMenu.floorplanMenu.viewFloorPlan',
                state: 'floorplan',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.floorplanMenu.floorAVehicle',
                state: 'floorcar',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.floorplanMenu.valueLookup',
                state: 'valueLookup',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.floorplanMenu.openAudits',
                state: 'audits',
                active: false,
                permission: permissions.NONE
            }, {
                title: 'sideMenu.floorplanMenu.titleReleases',
                state: 'titlereleases',
                active: false,
                permission: permissions.ALL
            }
        ]
    },
    {
        title: 'sideMenu.defaultMenu.resources',
        active: false,
        permission: permissions.DEALER,
        subMenu: [
            {
                title: 'sideMenu.resourcesMenu.resources',
                state: 'documents',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.resourcesMenu.reports',
                state: 'reports',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.resourcesMenu.analytics',
                state: 'analytics',
                active: false,
                permission: permissions.ALL
            }, {
                title: 'sideMenu.resourcesMenu.promos',
                state: 'promos',
                active: false,
                permission: permissions.ALL
            }
        ]
    },
    {
        id: 'support',
        title: 'sideMenu.defaultMenu.support',
        active: false,
        permission: permissions.ALL
    },
    {
        id: 'signOut',
        title: 'sideMenu.defaultMenu.signOut',
        active: false,
        permission: permissions.ALL
    }
]
