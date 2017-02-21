import React, { PropTypes, Component } from 'react'
import { TweenMax, TimelineMax, Power0 } from 'gsap'
import Menu from './menu/Menu'
import metrics from '../../data/metricList'
import permissions from '../../data/permissionTypes'

const containerStyle = {
    position: 'fixed',
    top: '48px',
    bottom: '0',
    left: '0',
    width: '80%',
    zIndex: '9999',
    visibility: 'hidden'
}

const overlayStyle = {
    ...containerStyle,
    backgroundColor: 'black',
    opacity: '0',
    zIndex: '9998',
    width: '100%',
    visibility: 'hidden'
}

const menuStyle = {
    backgroundColor: 'grey',
    position: 'absolute',
    top: '0',
    height: '100%',
    width: '100%',
    color: 'white',
    zIndex: '9999',
    visibility: 'hidden',
    overflow: 'scroll-y'
}

const listStyle = {
    top: '0',
    bottom:'0',
    left: '0',
    right: '0',
    position:'absolute',
    overflowY:'scroll',
    overflowX:'hidden'
}

let displayTitleRelease = false;

class SideMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            tl: new TimelineMax({
                onStart: this.preventScroll
            })
        }
    }

    componentDidMount() {
        this.updateLogoutLink()
    }

    componentDidUpdate() {
        if (this.state.tl.getChildren().length <= 0) {
            this.buildTimeline()
        }

        this.toggleTimeline(this.props.isOpen)
        const supportList = this.props.menuList.find(x => x.id === 'support');
        if (typeof(supportList.subMenu) === 'undefined' && typeof(supportList.set) === 'undefined' && this.props.nxgConfig) {
            supportList.set = true
            this.buildSupportMenu()
        }

        const floorplanList = this.props.menuList.find(x => x.title === 'sideMenu.defaultMenu.floorPlan');
        if (typeof(floorplanList.set) === 'undefined' && this.props.nxgConfig) {
            floorplanList.set = true
            this.getTitleRelease()
        }
    }

    getTitleRelease = () => {
        this.props.user.getInfo().then((info) => {
            if (info) {
                displayTitleRelease = info.DisplayTitleReleaseProgram
            }
        })
    }

    buildTimeline = () => {
        const t1 = TweenMax.fromTo(this.container, 0, { autoAlpha: 0 }, { autoAlpha: 1 })
        const t2 = TweenMax.fromTo(this.menuContainer, 0, { autoAlpha: 0 }, { autoAlpha: 1 })
        const t3 = TweenMax.fromTo(this.overlay, 0.5, { autoAlpha: 0, ease: Power0.easeOut }, { autoAlpha: 0.7, ease: Power0.easeIn })
        const t4 = TweenMax.fromTo(this.menu, 0.5, { autoAlpha: 0, left: '-100%', ease: Power0.easeOut }, { autoAlpha: 1, left: '0', ease: Power0.easeIn })

        this.state.tl.add([t1, t2, t3, t4], '+=0', 'start')
    }

    toggleTimeline = open => (open ? this.state.tl.play() : this.state.tl.reverse())
    reverseTimeline = () => { this.state.tl.reverse() }
    preventScroll = () => {
        $(document).bind('touchmove', (e) => { e.preventDefault(); return true; } )
        $(this.container).bind('touchmove', (e) => { e.stopPropagation(); return true; })
    }
    enableScroll = () => { $(document).unbind('touchmove') }

    buildSupportMenu = () => {
        const config = this.props.nxgConfig.userVoice

        // check user type, dealers and auctions will have different subdomains to go to
        const forumId = this.props.user.isDealer ? config.dealerForumId : config.auctionForumId
        const customTemplateId = this.props.user.isDealer ? config.dealerCustomTemplateId : config.auctionCustomTemplateId;
        this.props.user.getInfo( ).then((info) => {
            if (info) {
                const menu = [
                    {
                        title: 'sideMenu.supportMenu.chat',
                        metric: metrics.MOBILE_CLICK_CHAT_NOW_LINK,
                        href: 'https://home-c4.incontact.com/inContact/ChatClient/ChatClient.aspx?poc=0a63c698-c417-4ade-8e0d-55cccf2b0d85&bu=4592556',
                        target: '_blank',
                        active: false,
                        permission: permissions.DEALER,
                    }, {
                        title: 'sideMenu.supportMenu.callAccountExecutive',
                        metric: metrics.MOBILE_CLICK_CALL_ACCOUNT_EXECUTIVE,
                        href: `tel:+${ info.MarketPhoneNumber }`,
                        active: false,
                        permission: permissions.DEALER,
                    }, {
                        title: 'sideMenu.supportMenu.callCustomerService',
                        metric: metrics.MOBILE_CLICK_CALL_CUSTOMER_SERVICE,
                        href: `tel:+${ info.CSCPhoneNumber }`,
                        active: false,
                        permission: permissions.ALL,
                    }, {
                        title: 'sideMenu.supportMenu.sendEmail',
                        metric: metrics.MOBILE_CLICK_SEND_EMAIL,
                        href: `mailto:${ this.props.user.isDealer( ) ? info.MarketEMail : 'auctionservices@nextgearcapital.com' }`,
                        active: false,
                        permission: permissions.ALL,
                    }, {
                        title: 'sideMenu.supportMenu.feedback',
                        metric: metrics.MOBILE_CLICK_FEEDBACK,
                        href: `https://nextgearcapital.uservoice.com/clients/widgets/classic_widget?contact_enabled=true&custom_template_id=${customTemplateId}&default_mode=support&embed_type=lightbox&feedback_enabled=true&forum_id=${forumId}&link_color=1864A1&mobile=true&mode=full&primary_color=135889&referrer=${encodeURI(window.location.href)}&smartvote=true&strings=e30%3D&support_tab_name=Technical Support&trigger_background_color=135889&trigger_method=pin`, // eslint-disable-line
                        target: '_blank',
                        active: false,
                        permission: permissions.ALL,
                    },
                ]
                this.props.updateSubMenuItems('support', menu)
            }
        })
    }
    updateLogoutLink = () => {
        this.props.addTopLevelLinkFunc('signOut', () => { this.props.$rootScope.$emit( 'event:userRequestedLogout' ) })
    }

    handleItemClick = (itemIndex, menuIndex, item) => {
        this.props.toggleMenuItem(itemIndex, menuIndex)
        if (item) {
            if (item.metric)
                this.props.logMetric(item.metric)

            this.props.toggleMenu()
            this.state.tl.eventCallback('onReverseComplete', this.handleAngularLink, [item])
        }
    }

    handleAngularLink = (item) => {
        this.enableScroll()
        if (item) {
            if (item.state) {
                this.props.angularState.go(item.state)
            }
            if (item.func) {
                item.func();
            }
        }
    }

    render( ) {
        return (
            <div style={containerStyle} ref={(i) => { this.container = i }}>
                <div style={overlayStyle} ref={(i) => { this.overlay = i }} onClick={() => { this.props.toggleMenu(); }} />
                <div ref={(i) => { this.menuContainer = i }}>
                    <div className="list-group" style={menuStyle} ref={(i) => { this.menu = i }}>
                        <Menu
                            style={listStyle}
                            items={this.props.menuList}
                            onItemClick={this.handleItemClick}
                            isDealer={this.props.user.isDealer() || false}
                            isAuction={!this.props.user.isDealer() || false}
                            user={this.props.user}
                            titleRelease={displayTitleRelease}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

SideMenu.propTypes = {
    menuList: PropTypes.array.isRequired,
    toggleMenuItem: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    updateSubMenuItems: PropTypes.func.isRequired,
    angularState: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    $rootScope: PropTypes.object.isRequired,
    addTopLevelLinkFunc: PropTypes.func.isRequired,
    nxgConfig: PropTypes.object.isRequired,
    logMetric: PropTypes.func.isRequired
}

export default SideMenu
