const SIXTY_MINUTES = 60 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

const SEGMENT_KEY_UAT = 'bw2QaHkMIcEiOyWB05un7LxoDPHjLigp';
const SEGMENT_KEY_DEMO = 'u6uZuH8MgCfZEV7wBBgVheRBL67bWZkQ';
const SEGMENT_KEY_TEST = 'rDVQ3BHgvEeS9dZEkoKMr3wW22PUrQAn';
const SEGMENT_KEY_TRAINING = '2uofWGF1e5Bkd18gE2B7LahCnGV8PQaX';
const SEGMENT_KEY_CARMAX = 'will-replace-later';
const SEGMENT_KEY_PRODUCTION = '9eaffv4cbe';

const userVoiceConfig = {
    dealerApiKey: 'P3imRq4ZCgWgrh0XuqHyrA',
    dealerForumId: 227793,
    dealerCustomTemplateId: 21815,
    auctionApiKey: 'WqAjMXsGO7Fj57N6sQ4Cw',
    auctionForumId: 229017,
    auctionCustomTemplateId: 23042,
}

function generateConfig( apiDomain, ngenDomain, segmentIoKey, timeoutMs, isDemo, mashToken ) {
    return {
        apiBase: `${ apiDomain }/MobileService/api`,
        apiDomain,
        ngenDomain: mashToken
            ? `${ ngenDomain }/ngen`
            : ngenDomain,
        masheryToken: mashToken,
        segmentIoKey,
        userVoice: userVoiceConfig,
        infiniteScrollingMax: 500,
        sessionTimeoutMs: timeoutMs,
        isDemo,
    };
}

export default[
    {
        name : 'local',
        config : generateConfig( '', '', SEGMENT_KEY_TEST, FIFTEEN_MINUTES, false, null ),
    }, {
        name : 'local_test',
        config : generateConfig( 'https://test.nextgearcapital.com', 'https://localhost:8080/', SEGMENT_KEY_TEST, FIFTEEN_MINUTES, false, null ),
    }, {
        name : 'uat',
        config : generateConfig( 'https://exp1uatdapp01.nextgearcapital.com', 'https://uat.api.nextgearcapital.com', SEGMENT_KEY_UAT, FIFTEEN_MINUTES, false, 'fbymcqgckrvh7a2h8eavek7e' ),
    }, {
        name : 'demo',
        config : generateConfig( 'https://demo.nextgearcapital.com', 'https://uat.api.nextgearcapital.com/demo', SEGMENT_KEY_DEMO, SIXTY_MINUTES, true, 'fbymcqgckrvh7a2h8eavek7e' ),
    }, {
        name : 'test',
        config : generateConfig( 'https://test.nextgearcapital.com', 'https://uat.api.nextgearcapital.com/test', SEGMENT_KEY_TEST, SIXTY_MINUTES, false, 'fbymcqgckrvh7a2h8eavek7e' ),
    }, {
        name : 'training',
        config : generateConfig( 'https://training.nextgearcapital.com', 'https://uat.api.nextgearcapital.com/training', SEGMENT_KEY_TRAINING, FIFTEEN_MINUTES, false, 'fbymcqgckrvh7a2h8eavek7e' ),
    }, {
        name : 'carmax_uat',
        config : generateConfig( 'http://exp1xmngws01.nextgearcapital.com', 'https://uat.api.nextgearcapital.com/carmax', SEGMENT_KEY_CARMAX, SIXTY_MINUTES, false, 'fbymcqgckrvh7a2h8eavek7e' ),
    }, {
        name : 'production',
        config : generateConfig( 'https://customer.nextgearcapital.com', 'https://api.nextgearcapital.com', SEGMENT_KEY_PRODUCTION, FIFTEEN_MINUTES, false, 'v8rjy9ddj48a9u569g836ez6' ),
    },
]
