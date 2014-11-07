'use strict';

angular.module('nextgearWebApp')
  .factory('User', function($q, api, Base64, messages, segmentio, UserVoice, QualarooSurvey, nxgConfig, Addresses, gettextCatalog) {
    // Private
    var staticsRequest = null,
      paySellerOptions = [],
      securityQuestions = null,
      infoRequest = null,
      infoLoaded = false,
      isDealer,
      info = null; // only user cached info for synchronous function

    function filterByBusinessName(subsidiaries) {
      return _.sortBy(subsidiaries, function(s) {
        return s.BusinessName;
      });
    }

    // Public API
    return {
      isLoggedIn: function() {
        return api.hasAuthToken();
      },

      recoverUserName: function(email) {
        return api.request('POST', '/userAccount/RecoverUserName/' + email + '/false');
      },

      fetchPasswordResetQuestions: function(username) {
        return api.request('GET', '/UserAccount/passwordResetQuestions/' + username).then(
          function (result) {
            if (result.List && result.List.length > 0) {
              return result.List;
            } else {
              var error = messages.add(gettextCatalog.getString('You do not appear to have any security questions configured. ' +
                  'Please contact NextGear for assistance.'),
                '/UserAccount/passwordResetQuestions/ returned no security questions');
              return $q.reject(error);
            }
          }
        );
      },

      getSecurityQuestions: function() {
        if (!securityQuestions) {
          securityQuestions = api.request('GET', '/UserAccount/securityquestions').then(
            function(results) {
              return results.List;
            }
          );
        }
        return securityQuestions;
      },

      resetPassword: function(username, questionAnswers) {
        var data = {
          UserName: username,
          List: _.map(questionAnswers, function (question) {
            return {
              QuestionId: question.QuestionId,
              QuestionText: question.Answer
            };
          }),
          IsMobileApp: false
        };
        return api.request('POST', '/userAccount/v1_2/resetpassword', data);
      },

      changePassword: function(newPassword) {
        return api.request('POST', '/UserAccount/usersettings', { Password: newPassword });
      },

      authenticate: function(username, password) {
        var self = this;
        return api.request(
          'POST',
          '/UserAccount/Authenticate', {}, {
            Authorization: 'CT ' + Base64.encode(username + ':' + password)
          })
          .then(function(authResult) {
            return self.initSession(authResult).then(function () {
              return self.getInfo().then(function(info) {
                segmentio.identify(info.BusinessNumber, { name: info.BusinessName, username: username });
                return authResult;
              });
            });
          });
      },

      /**
       * Take authentication results (tokens, etc.) and turn them into a valid user session
       */
      initSession: function(authData) {
        var self = this;

        api.setAuth(authData);
        return $q.all([this.refreshInfo(), this.refreshStatics()]).then(function () {
          if (authData.UserVoiceToken) {
            var apiKey;

            self.getInfo().then(function(info) {
              apiKey = self.isDealer() ? nxgConfig.userVoice.dealerApiKey : nxgConfig.userVoice.auctionApiKey;
              if (!nxgConfig.isDemo && gettextCatalog.currentLanguage === 'en') {
                UserVoice.init(apiKey, authData.UserVoiceToken, self.isDealer(), info.BusinessNumber, info.BusinessName);
                QualarooSurvey.init(nxgConfig.qualarooSurvey.apiKey, nxgConfig.qualarooSurvey.domainCode, self.isDealer(), info.BusinessNumber, info.BusinessName);
              }
            });
          }
        });
      },

      logout: function() {
        var self = this;
        return api.request('GET', '/userAccount/logout').then(function (result) {
          self.dropSession();
          return result;
        }, function (/*error*/) {
          // ignore the error and proceed - we can still log out locally, the server is on its own
          self.dropSession();
          return null;
        });
      },

      /**
       * This should only be used in cases where we know the session is already toast.
       * Normally, you'd call logout() instead, which will try to clean it up server side
       * and will then call this function
       */
      dropSession: function() {
        api.resetAuth();
      },

      refreshStatics: function() {
        staticsRequest = api.request('GET', '/Dealer/v1_2/Static').then(function(data) {
          return {
            // API translation layer -- add transformation logic here as needed
            productTypes: data.ProductType || [],
            colors: data.Colors || [],
            states: data.States || [],
            titleLocationOptions: data.TitleLocationOptions || [],
            paymentMethods: data.PaymentMethods || []
          };
        }, function() {
          // Fail gracefully. If dealer/info fails we will be very constrained but it shouldn't
          // cause any JavaScript errors. There is code that assumes that statics has been
          // populated. Set up the basic structure to avoid 'accessing property of undefined'
          // errors.
          return {
            productTypes: [],
            colors: [],
            states: [],
            titleLocationOptions: [],
            paymentMethods: []
          };
        });

        return staticsRequest;
      },

      getStatics: function() {
        return staticsRequest || this.refreshStatics();
      },

      refreshInfo: function() {
        infoRequest = api.request('GET', '/Dealer/v1_2/Info').then(function(data) {
          infoLoaded = true;
          isDealer = data.DealerAuctionStatusForGA === 'Dealer';
          data.ManufacturerSubsidiaries = filterByBusinessName(data.ManufacturerSubsidiaries);
          Addresses.init(data.DealerAddresses || []);
          info = data;
          return data;
        }, function() {
          infoLoaded = false;
          infoRequest = null;
          info = null;
          Addresses.init([]);
        });

        return infoRequest;
      },

      getInfo: function() {
        return infoRequest || this.refreshInfo();
      },

      infoLoaded: function() {
        return infoLoaded;
      },

      getInfoSync: function() { // LastState service needs to run synchronously, so we can't return a promise
        return info;
      },

      isDealer: function() {
        if(!angular.isDefined(isDealer)) {
          return null;
        } else {
          return isDealer;
        }
      },

      isPasswordChangeRequired: function() {
        return !!(api.getAuthParam('TemporaryPasswordUsed'));
      },

      clearPasswordChangeRequired: function() {
        api.setAuthParam('TemporaryPasswordUsed', false);
      },

      isUserInitRequired: function() {
        return !!(api.getAuthParam('ShowUserInitialization'));
      },

      clearUserInitRequired: function() {
        api.setAuthParam('ShowUserInitialization', false);
      },

      canPayBuyer: function () {
        return this.getInfo().then(function(info) {
          return info.DealerAuctionStatusForGA === 'Dealer' &&
            info.IsBuyerDirectlyPayable &&
            info.HasUCC;
        });
      },

      getPaySellerOptions: function() {
        // when flooring a car, the options this user has to pay seller vs. pay buyer
        return this.canPayBuyer().then(function(payBuyerAllowed) {
          if (paySellerOptions.length === 0) {
            if (payBuyerAllowed) {
              paySellerOptions.push(false, true); // buyer or seller
            } else {
              paySellerOptions.push(true); // seller only
            }
          }

          // always return the same array object so that this can be used in a binding
          return paySellerOptions;
        });
      }
    };
  });
