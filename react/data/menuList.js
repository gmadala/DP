export default [
    {
        title: 'sideMenu.defaultMenu.dashboard',
        metric: '',
        state: 'dashboard',
        active: false
    },
    {
        title: 'sideMenu.defaultMenu.profileSettings',
        metric: '',
        state: 'profile_settings',
        active: false
    },
    {
        title: 'sideMenu.defaultMenu.accountManagement',
        metric: '',
        state: 'account_management',
        active: false
    },
    {
        title: 'sideMenu.defaultMenu.payments',
        active: false,
        subMenu: [
            {
                title: 'sideMenu.paymentsMenu.makeAPayment',
                metric: '',
                state: 'payments',
                active: false,
            }, {
                title: 'sideMenu.paymentsMenu.receipts',
                metric: '',
                state: 'receipts',
                active: false,
            }
        ]
    },
    {
        title: 'sideMenu.defaultMenu.floorPlan',
        active: false,
        subMenu: [
            {
                title: 'sideMenu.floorplanMenu.viewFloorPlan',
                metric: '',
                state: 'floorplan',
                active: false,
            }, {
                title: 'sideMenu.floorplanMenu.floorAVehicle',
                metric: '',
                state: 'floorcar',
                active: false,
            }, {
                title: 'sideMenu.floorplanMenu.valueLookup',
                metric: '',
                state: 'valueLookup',
                active: false,
            }, {
                title: 'sideMenu.floorplanMenu.openAudits',
                metric: '',
                state: 'audits',
                active: false,
            }, {
                title: 'sideMenu.floorplanMenu.titleReleases',
                metric: '',
                state: 'titlereleases',
                active: false,
            }
        ]
    },
    {
        title: 'sideMenu.defaultMenu.resources',
        active: false,
        subMenu: [
            {
                title: 'sideMenu.resourcesMenu.resources',
                metric: '',
                state: 'documents',
                active: false,
            }, {
                title: 'sideMenu.resourcesMenu.reports',
                metric: '',
                state: 'reports',
                active: false,
            }, {
                title: 'sideMenu.resourcesMenu.analytics',
                metric: '',
                state: 'analytics',
                active: false,
            }, {
                title: 'sideMenu.resourcesMenu.promos',
                metric: '',
                state: 'promos',
                active: false,
            }
        ]
    },
    {
        id: 'support',
        title: 'sideMenu.defaultMenu.support',
        active: false
    },
    {
        id: 'signOut',
        title: 'sideMenu.defaultMenu.signOut',
        metric: '',
        active: false
    }
]
