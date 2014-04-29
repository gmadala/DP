'use strict';

angular.module('nextgearWebApp')
  .factory('User', function($q, api, Base64, messages, segmentio, UserVoice, QualarooSurvey, nxgConfig) {
    // Private
    var info = null,
      statics = null,
      paySellerOptions = [],
      securityQuestions = null,
      infoRequest = null;

    var calculateCanPayBuyer = function() {
      if (!info) {
        return undefined;
      }

      return info.DealerAuctionStatusForGA === 'Dealer' &&
        info.IsBuyerDirectlyPayable &&
        info.HasUCC;
    };

    // Public API
    return {
      isLoggedIn: function() {
        return api.hasAuthToken();
      },

      recoverUserName: function(email) {
        return api.request('POST', '/userAccount/RecoverUserName/' + email);
      },

      fetchPasswordResetQuestions: function(username) {
        return api.request('GET', '/UserAccount/passwordResetQuestions/' + username).then(
          function (result) {
            if (result.List && result.List.length > 0) {
              return result.List;
            } else {
              var error = messages.add('You do not appear to have any security questions configured. ' +
                'Please contact NextGear for assistance.',
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
          })
        };
        return api.request('POST', '/userAccount/resetpassword', data);
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
                segmentio.identify(info.BusinessNumber, { name: info.BusinessName, username: username });
                return authResult;
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
            var apiKey = self.isDealer() ? nxgConfig.userVoice.dealerApiKey : nxgConfig.userVoice.auctionApiKey,
              info = self.getInfo();

            UserVoice.init(apiKey, authData.UserVoiceToken, self.isDealer(), info.BusinessNumber, info.BusinessName);
            QualarooSurvey.init(nxgConfig.qualarooSurvey.apiKey, self.isDealer(), info.BusinessNumber, info.BusinessName);
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
        return api.request('GET', '/Dealer/Static').then(function(data) {
          statics = {
            // API translation layer -- add transformation logic here as needed
            productTypes: data.ProductType || [],
            colors: data.Colors || [],
            states: data.States || [],
            locations: data.Locations || [],
            bankAccounts: data.BankAccounts || [],
            linesOfCredit: data.LinesOfCredit || [],
            titleLocationOptions: data.TitleLocationOptions || [],
            paymentMethods: data.PaymentMethods || []
          };
          return statics;
        });
      },

      getStatics: function() {
        return statics;
      },

      refreshInfo: function() {
        infoRequest = api.request('GET', '/Dealer/Info').then(function(data) {
          info = data;
          return info;
        });

        return infoRequest;
      },

      getInfo: function() {
        return info;
      },

      infoLoaded: function() {
        return info !== null;
      },

      infoPromise: function() {
        if(infoRequest === null) {
          this.refreshInfo();
        }

        return infoRequest;
      },

      isDealer: function() {
        return info && info.DealerAuctionStatusForGA === 'Dealer';
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

      canPayBuyer: calculateCanPayBuyer,

      getPaySellerOptions: function() {
        // when flooring a car, the options this user has to pay seller vs. pay buyer
        var payBuyerAllowed = calculateCanPayBuyer();

        if (!angular.isDefined(payBuyerAllowed)) {
          return null;
        }

        if (paySellerOptions.length === 0) {
          if (payBuyerAllowed) {
            paySellerOptions.push(false, true); // buyer or seller
          } else {
            paySellerOptions.push(true); // seller only
          }
        }

        // always return the same array object so that this can be used in a binding
        return paySellerOptions;
      },

      reset: function() {
        statics = null;
        info = null;
        paySellerOptions = [];
        securityQuestions = null;
      }

    };
  });
