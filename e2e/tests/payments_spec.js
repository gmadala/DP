'use strict';

var HelperObject = require('../framework/helper_object');
var PaymentsPageObject = require('../framework/payments_page_object.js');
var CheckoutPageObject = require('../framework/checkout_page_object.js');
var DatepickerPageObject = require('../framework/datepicker_page_object.js');

var helper = new HelperObject();
var paymentsPage = new PaymentsPageObject();
var checkoutPage = new CheckoutPageObject();
var datepickerPage = new DatepickerPageObject();

helper.describe('WMT-53', function () {
  describe('Dealer Portal Payments Navigation', function () {
    beforeEach(function () {
      helper.openPageAndWait(paymentsPage.url, false, true);
    });

    xit('should open request extension modal when request extension is clicked', function () {
      expect(paymentsPage.requestExtensionLinks.count()).toBeGreaterThan(0);
      expect(paymentsPage.getRequestExtensionLink()).toBeDefined();
      paymentsPage.getRequestExtensionLink().then(function (requestExtensionLink) {
        requestExtensionLink.click().then(function () {
          helper.waitForElementDisplayed(helper.modal);
          var modalHeaderText = 'Request Extension';
          expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
          expect(paymentsPage.getModalHeaderText()).toEqual(modalHeaderText);
          paymentsPage.cancelExtensionModal.click().then(function () {
            helper.waitForElementDismissed(helper.modal);
          });
        });
      });
    });

    xit('should navigate to vehicle details when vehicle description is clicked', function () {
      expect(browser.driver.getCurrentUrl()).toContain(paymentsPage.url);
      paymentsPage.vehicleDetailLinks.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.vehicleDetailLinks.count()).toBeGreaterThan(0);
          expect(paymentsPage.getVehicleDetailLink()).toBeDefined();
          paymentsPage.getVehicleDetailLink().then(function (vehicleDetailLink) {
            vehicleDetailLink.click().then(function () {
              helper.waitForUrlToContains('vehicle');
              expect(browser.driver.getCurrentUrl()).not.toContain(paymentsPage.url);
            });
          });
        }
      });
    });

    xit('should navigate to checkout when checkout is clicked', function () {
      expect(browser.driver.getCurrentUrl()).toContain(paymentsPage.url);
      expect(paymentsPage.checkoutButton.isEnabled()).not.toBeTruthy();
      paymentsPage.scheduleVehiclePaymentButtons.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.scheduleVehiclePaymentButtons.count()).toBeGreaterThan(0);
          expect(paymentsPage.getScheduleVehiclePaymentButton()).toBeDefined();
          paymentsPage.scheduleVehiclePaymentButtons.first().click().then(function () {
            expect(paymentsPage.checkoutButton.isEnabled()).toBeTruthy();
            paymentsPage.checkoutButton.click().then(function () {
              helper.waitForUrlToContains('checkout');
              expect(browser.driver.getCurrentUrl()).toContain(checkoutPage.url);
            });
          });
        }
      });
    });

    xit('should open cancel payment modal when unschedule link is clicked', function () {
      paymentsPage.unscheduleVehiclePaymentButtons.count().then(function (count) {
        if (count > 0) {
          expect(paymentsPage.getUnscheduleVehiclePaymentButton()).toBeDefined();
          paymentsPage.getUnscheduleVehiclePaymentButton().then(function (unschedulePaymentButton) {
            unschedulePaymentButton.click().then(function () {
              helper.waitForElementDisplayed(helper.modal);
              var modalHeaderText = 'Cancel';
              expect(paymentsPage.modal.isDisplayed()).toBeTruthy();
              expect(paymentsPage.getModalHeaderText()).toContain(modalHeaderText);
              paymentsPage.cancelScheduledModal.click().then(function () {
                helper.waitForElementDismissed(helper.modal);
              });
            });
          });
        }
      });
    });
  });
})
;

helper.describe('WMT-106', function () {
  describe('Dealer Portal Payments Content.', function () {
    beforeEach(function () {
      helper.openPageAndWait(paymentsPage.url, false, true);
    });

    xit('should validate payments page object is accessing the correct fields.', function () {
      expect(paymentsPage.searchField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchFilterSelection.isDisplayed()).toBeTruthy();
      expect(paymentsPage.getInventoryLocation()).toBeDefined();
      paymentsPage.getInventoryLocation().then(function (inventoryLocation) {
        expect(inventoryLocation.isDisplayed()).toBeTruthy();
      });

      expect(paymentsPage.searchButton.isDisplayed()).toBeTruthy();
      expect(paymentsPage.clearSearchButton.isDisplayed()).toBeTruthy();
    });

    xit('should validate payments page object is accessing the correct option fields.', function () {
      expect(paymentsPage.searchFilterOptions.count()).toEqual(4);
      // filter only gets displayed if the options is more than 2
      paymentsPage.getInventoryLocation().then(function (inventoryLocation) {
        inventoryLocation.isDisplayed().then(function (displayed) {
          if (displayed) {
            expect(inventoryLocation.all(by.css('option')).count()).toBeGreaterThan(1);
          }
        });
      });
    });

    xit('should validate payments page object is accessing the correct range fields.', function () {
      expect(paymentsPage.searchStartDateField.isDisplayed()).not.toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).not.toBeTruthy();
    });

    xit('should validate payments page object is accessing the correct error message.', function () {
      expect(paymentsPage.errorMessage.isDisplayed()).not.toBeTruthy();
    });

    xit('should display start date and end date when filter option selected is by date range.', function () {
      expect(paymentsPage.getFilterOption()).toEqual('View All');
      paymentsPage.setFilterOption('Date Range');
      expect(paymentsPage.getFilterOption()).toEqual('Date Range');

      expect(paymentsPage.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).toBeTruthy();

      paymentsPage.setFilterOption('Due Today');
      expect(paymentsPage.getFilterOption()).toEqual('Due Today');

      expect(paymentsPage.searchStartDateField.isDisplayed()).not.toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).not.toBeTruthy();
    });

    xit('should allow setting start date and end date using datepicker.', function () {
      paymentsPage.setFilterOption('Date Range');

      expect(paymentsPage.searchStartDateField.isDisplayed()).toBeTruthy();
      expect(paymentsPage.searchEndDateField.isDisplayed()).toBeTruthy();

      paymentsPage.clickSearchStartDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(30, 'Dec', 2001);
      expect(paymentsPage.getSearchStartDate()).toEqual('12/30/2001');

      paymentsPage.clickSearchEndDate();
      expect(datepickerPage.datepicker.isDisplayed()).toBeTruthy();
      datepickerPage.setDate(28, 'Jan', 2011);
      expect(paymentsPage.getSearchEndDate()).toEqual('01/28/2011');
    });

    xit('should verify that user is able to enter text in search field.', function () {
      var searchString = 'Example search object!';
      paymentsPage.setSearchField(searchString);
      expect(paymentsPage.getSearchField()).toEqual(searchString);
    });

    xit('should verify that search field have the correct watermark.', function () {
      var watermark = 'By Stock #, VIN, or Description';
      expect(paymentsPage.searchField.getAttribute('placeholder')).toEqual(watermark);
    });

    xit('account fees should contains the correct elements.', function () {
      paymentsPage.accountFeeRepeater.count().then(function (count) {
        if (count <= 0) {
          expect(paymentsPage.accountFeeSection.isDisplayed()).toBeFalsy();
        } else {
          var repeater = 'fee in fees.results';
          expect(paymentsPage.accountFeeSection.isDisplayed()).toBeTruthy();
          paymentsPage.getAccountFeesContent().then(function (contents) {
            // check the view will have the correct amount of cells
            paymentsPage.accountFeeRepeater.count(function (count) {
              expect(contents.length).toEqual(count * paymentsPage.accountFeeHeaders.length);
            });
            var columnCounter = 0;
            var columnCount = paymentsPage.accountFeeHeaders.length;
            // check if the table (view) have the correct data (model).
            paymentsPage.accountFeeColumns.forEach(function (accountFeeColumn) {
              paymentsPage.formattedDataFromRepeater(repeater, accountFeeColumn).then(function (formattedData) {
                var rowCounter = 0;
                formattedData.forEach(function (data) {
                  expect(data).toEqual(contents[rowCounter * columnCount + columnCounter]);
                  rowCounter++;
                });
                columnCounter++;
              });
            });
            var scheduledList, balanceList, scheduledDateList;
            paymentsPage.unformattedDataFromRepeater(repeater, 'fee.Scheduled').then(function (rawData) {
              scheduledList = rawData;
            }).then(function () {
              paymentsPage.unformattedDataFromRepeater(repeater, 'fee.Balance').then(function (rawData) {
                balanceList = rawData;
              });
            }).then(function () {
              paymentsPage.unformattedDataFromRepeater(repeater, 'fee.ScheduledDate').then(function (rawData) {
                scheduledDateList = rawData;
              });
            }).then(function () {
              // if the fee.Scheduled true, then should display 'Scheduled'
              // if the fee.Scheduled true, should not display the balance amount
              // if the fee.Scheduled true, should display the scheduled date
              // if the fee.Scheduled true, should display link to un-schedule the payment
              expect(balanceList.length).toEqual(scheduledList.length);
              expect(balanceList.length).toEqual(scheduledDateList.length);
              for (var i = 0; i < scheduledList.length; i++) {
                var balance = balanceList[i];
                var scheduled = scheduledList[i];
                var scheduledDate = scheduledDateList[i];
                // replace the $ sign, ',' sign and .00 from the content
                var content = contents[i * columnCount + (columnCount - 1)].trim().replace(/^\$|,|\.00$/g, '');
                if (scheduled) {
                  expect(content).toContain('Scheduled');
                  expect(content).toContain('Unschedule');
                  expect(content).not.toContain(balance);
                  // reformat the date and trim '0'
                  var trimZeroRegex = /-0/g;
                  var defaultDateRegex = /(\d{4})-(\d+)-(\d+)/;
                  scheduledDate = scheduledDate.replace(trimZeroRegex, '-');
                  scheduledDate = scheduledDate.replace(defaultDateRegex, '$2/$3/$1');
                  expect(content).toContain(scheduledDate);
                } else {
                  expect(content).not.toContain('Scheduled');
                  expect(content).not.toContain('Unschedule');
                  expect(content).toContain(balance);
                  expect(scheduledDate).toEqual(null);
                }
              }
            });
          });
        }
      });
    });

    xit('vehicle payments should contains the correct elements.', function () {
      paymentsPage.vehiclePaymentRepeater.count().then(function (count) {
        if (count <= 0) {
          expect(paymentsPage.vehicleNoticeBox.isDisplayed()).toBeTruthy();
          expect(paymentsPage.vehicleNoticeBox.getText()).toContain('Sorry, no results found.');
        } else {
          // try filling search term to remove search results
          paymentsPage.setSearchField('ZZ');
          paymentsPage.searchButton.click().then(function () {
            paymentsPage.vehiclePaymentRepeater.count().then(function (count) {
              if (count <= 0) {
                expect(paymentsPage.vehicleNoticeBox.isDisplayed()).toBeTruthy();
                expect(paymentsPage.vehicleNoticeBox.getText()).toContain('Sorry, no results found.');
                paymentsPage.searchField.clear();
                paymentsPage.searchButton.click().then(function () {
                  helper.expectingInfiniteLoading();
                });
              }
              // by now, the search field should be cleared and the infinite loading should be hidden already
              if (count > 0) {
                paymentsPage.getVehiclePaymentsContent().then(function (contents) {
                  expect(contents.length).toEqual(count * paymentsPage.vehiclePaymentHeaders.length);

                  var repeater = 'payment in payments.results';
                  var columnCount = paymentsPage.vehiclePaymentHeaders.length;

                  // if the amount due === current pay off, should have request extension link
                  // should contains the payment due date.
                  var amountDues, currentPayoffs, paymentDueDates;
                  paymentsPage.unformattedDataFromRepeater(repeater, 'payment.AmountDue').then(function (rawData) {
                    amountDues = rawData;
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.CurrentPayoff').then(function (rawData) {
                      currentPayoffs = rawData;
                    });
                  }).then(function () {
                    paymentsPage.formattedDataFromRepeater(repeater, 'payment.DueDate').then(function (rawData) {
                      paymentDueDates = rawData;
                      expect(paymentDueDates.length).toEqual(count);
                      expect(paymentDueDates.length).toEqual(amountDues.length);
                      expect(paymentDueDates.length).toEqual(currentPayoffs.length);
                      for (var i = 0; i < paymentDueDates.length; i++) {
                        var amountDue = amountDues[i];
                        var currentPayoff = currentPayoffs[i];
                        var paymentDueDate = paymentDueDates[i];
                        var content = contents[i * columnCount];
                        if (amountDue === currentPayoff) {
                          expect(content).toContain('Request');
                          expect(content).toContain('Extension');
                        } else {
                          expect(content).not.toContain('Request');
                          expect(content).not.toContain('Extension');
                        }
                        expect(content).toContain(paymentDueDate);
                      }
                    });
                  });

                  // description should contain vin and description of the car
                  var descriptions, vinNumbers, stockNumbers;
                  paymentsPage.unformattedDataFromRepeater(repeater, 'payment.UnitDescription').then(function (rawData) {
                    descriptions = rawData;
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.Vin').then(function (rawData) {
                      vinNumbers = rawData;
                    });
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.StockNumber').then(function (rawData) {
                      stockNumbers = rawData;
                    });
                  }).then(function () {
                    expect(descriptions.length).toEqual(count);
                    expect(descriptions.length).toEqual(vinNumbers.length);
                    expect(descriptions.length).toEqual(stockNumbers.length);
                    for (var i = 0; i < descriptions.length; i++) {
                      var vinNumber = vinNumbers[i];
                      var stockNumber = stockNumbers[i];
                      var description = descriptions[i];
                      var content = contents[i * columnCount + 1];
                      expect(content).toContain(vinNumber);
                      expect(content).toContain(stockNumber);
                      expect(content).toContain(description);
                    }
                  });

                  // floored should contains the date and number of days
                  paymentsPage.formattedDataFromRepeater(repeater, 'payment.FlooringDate').then(function (flooringDates) {
                    var daysOnFloorplans;
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.DaysOnFloorplan').then(function (rawData) {
                      daysOnFloorplans = rawData;
                      expect(flooringDates.length).toEqual(count);
                      expect(flooringDates.length).toEqual(daysOnFloorplans.length);
                      for (var i = 0; i < flooringDates.length; i++) {
                        var flooringDate = flooringDates[i];
                        var daysOnFloorplan = daysOnFloorplans[i];
                        var content = contents[i * columnCount + 2];
                        expect(content).toContain(flooringDate);
                        expect(content).toContain(daysOnFloorplan + ' days');
                      }
                    });
                  });

                  // status should contains the status info
                  paymentsPage.formattedDataFromRepeater(repeater, 'payment.UnitStatus').then(function (unitStatuses) {
                    expect(unitStatuses.length).toEqual(count);
                    for (var i = 0; i < unitStatuses.length; i++) {
                      var unitStatus = unitStatuses[i];
                      var content = contents[i * columnCount + 3];
                      expect(content).toContain(unitStatus);
                    }
                  });

                  // payment should contains number and scheduled and scheduled date
                  var curtailmentList, scheduledList, amountDueList, currentPayoffList, scheduledPaymentDateList;
                  paymentsPage.unformattedDataFromRepeater(repeater, 'payment.CurtailmentPaymentScheduled').then(function (rawData) {
                    curtailmentList = rawData;
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.Scheduled').then(function (rawData) {
                      scheduledList = rawData;
                    });
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.AmountDue').then(function (rawData) {
                      amountDueList = rawData;
                    });
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.CurrentPayoff').then(function (rawData) {
                      currentPayoffList = rawData;
                    });
                  }).then(function () {
                    paymentsPage.unformattedDataFromRepeater(repeater, 'payment.ScheduledPaymentDate').then(function (rawData) {
                      scheduledPaymentDateList = rawData;
                    });
                  }).then(function () {
                    // if the fee.Scheduled true, then should display 'Scheduled'
                    // if the fee.Scheduled true, should not display the balance amount
                    // if the fee.Scheduled true, should display the scheduled date
                    // if the fee.Scheduled true, should display link to un-schedule the payment
                    expect(amountDueList.length).toEqual(count);
                    expect(amountDueList.length).toEqual(scheduledList.length);
                    expect(amountDueList.length).toEqual(curtailmentList.length);
                    expect(amountDueList.length).toEqual(currentPayoffList.length);
                    expect(amountDueList.length).toEqual(scheduledPaymentDateList.length);
                    for (var i = 0; i < scheduledList.length; i++) {
                      var amountDue = amountDueList[i];
                      var scheduled = scheduledList[i];
                      var curtailment = curtailmentList[i];
                      var currentPayoff = currentPayoffList[i];
                      var scheduledPaymentDate = scheduledPaymentDateList[i];
                      var paymentContent = contents[i * columnCount + 4].trim().replace(/^\$|,|\.00$/g, '');
                      var payoffContent = contents[i * columnCount + 5].trim().replace(/^\$|,|\.00$/g, '');
                      // reformat the date and trim '0'
                      var trimZeroRegex = /-0/g;
                      var defaultDateRegex = /(\d{4})-(\d+)-(\d+)/;
                      scheduledPaymentDate = scheduledPaymentDate.replace(trimZeroRegex, '-');
                      scheduledPaymentDate = scheduledPaymentDate.replace(defaultDateRegex, '$2/$3/$1');
                      if (scheduled) {
                        if (curtailment) {
                          // payment will have 'Scheduled'
                          expect(paymentContent).toContain('Scheduled');
                          expect(paymentContent).toContain('Unschedule');
                          expect(paymentContent).not.toContain(amountDue);
                          expect(paymentContent).toContain(scheduledPaymentDate);
                          // payoff will have amount of payoff
                          expect(payoffContent).not.toContain('Scheduled');
                          expect(payoffContent).not.toContain('Unschedule');
                          expect(payoffContent).toContain(currentPayoff);
                          expect(payoffContent).not.toContain(scheduledPaymentDate);
                        } else {
                          // payoff will have 'Scheduled'
                          expect(payoffContent).toContain('Scheduled');
                          expect(payoffContent).toContain('Unschedule');
                          expect(payoffContent).not.toContain(currentPayoff);
                          expect(payoffContent).toContain(scheduledPaymentDate);
                          // payment will have the amount due
                          expect(paymentContent).not.toContain('Scheduled');
                          expect(paymentContent).not.toContain('Unschedule');
                          expect(paymentContent).toContain(amountDue);
                          expect(paymentContent).not.toContain(scheduledPaymentDate);
                        }
                      } else {
                        // both payment and payoff will have amount and current payoff
                        expect(paymentContent).not.toContain('Scheduled');
                        expect(paymentContent).not.toContain('Unschedule');
                        expect(paymentContent).toContain(amountDue);
                        expect(paymentContent).not.toContain(scheduledPaymentDate);
                        expect(payoffContent).not.toContain('Scheduled');
                        expect(payoffContent).not.toContain('Unschedule');
                        expect(payoffContent).toContain(currentPayoff);
                        expect(payoffContent).not.toContain(scheduledPaymentDate);
                      }
                    }
                  });
                });
              }
            });
          });
        }
      });
    });

    it('payment summary should contains the correct elements.', function () {
      var feePaymentCount, vehiclePaymentCount;
      paymentsPage.feePaymentQueue.count().then(function (count) {
        feePaymentCount = count;
      }).then(function () {
        paymentsPage.vehiclePaymentQueue.count().then(function (count) {
          vehiclePaymentCount = count;
        });
      }).then(function () {
        if (feePaymentCount === 0 && vehiclePaymentCount === 0) {
          expect(paymentsPage.paymentSummaryMessage.isDisplayed()).toBeTruthy();
        }

        var accountFeeCount, accountVehicleCount;
        paymentsPage.accountFeeRepeater.count().then(function (count) {
          accountFeeCount = count;
        }).then(function () {
          paymentsPage.vehiclePaymentRepeater.count().then(function (count) {
            accountVehicleCount = count;
          });
        }).then(function () {
          if (accountVehicleCount > 0) {
            paymentsPage.getScheduleVehiclePaymentButton().then(function (button) {
              button.click().then(function () {
                paymentsPage.feePaymentQueue.each(function (queueElement) {
                  helper.waitForElementDisplayed(queueElement);
                });
              });
            });
            var vehiclePaymentRepeater = 'payment in paymentQueue.payments';
            var vehicleDescriptions, vinNumbers, checkoutAmounts, extraPrincipals;
            paymentsPage.formattedDataFromRepeater(vehiclePaymentRepeater, 'payment.description')
              .then(function (rawData) {
                vehicleDescriptions = rawData;
              }).then(function () {
                paymentsPage.formattedDataFromRepeater(vehiclePaymentRepeater, 'payment.vin')
                  .then(function (rawData) {
                    vinNumbers = rawData;
                  });
              }).then(function () {
                paymentsPage.unformattedDataFromRepeater(vehiclePaymentRepeater, 'payment.getCheckoutAmount()')
                  .then(function (rawData) {
                    checkoutAmounts = rawData;
                  });
              }).then(function () {
                paymentsPage.unformattedDataFromRepeater(vehiclePaymentRepeater, 'payment.getExtraPrincipal()')
                  .then(function (rawData) {
                    extraPrincipals = rawData;
                  });
              }).then(function () {
                paymentsPage.vehiclePaymentQueue.map(function (queueElement) {
                  return queueElement.getText();
                }).then(function (queueTexts) {
                  expect(queueTexts.length).toEqual(vehicleDescriptions.length);
                  expect(queueTexts.length).toEqual(vinNumbers.length);
                  expect(queueTexts.length).toEqual(checkoutAmounts.length);
                  expect(queueTexts.length).toEqual(extraPrincipals.length);
                  for (var i = 0; i < queueTexts.length; i++) {
                    var vinNumber = vinNumbers[i];
                    var vehicleDescription = vehicleDescriptions[i];
                    var totalAmount = checkoutAmounts[i] - extraPrincipals[i];
                    var queueText = queueTexts[i].trim().replace(/\$|,|\.00/g, '');
                    expect(queueText).toContain(vinNumber);
                    expect(queueText).toContain(totalAmount);
                    expect(queueText).toContain(vehicleDescription);
                  }
                });
              });
          }
          if (accountFeeCount > 0) {
            paymentsPage.getScheduleFeePaymentButton().then(function (button) {
              button.click().then(function () {
                paymentsPage.vehiclePaymentQueue.each(function (queueElement) {
                  helper.waitForElementDisplayed(queueElement);
                });
              });
            });
            // check the data displayed
            var feePaymentRepeater = 'fee in paymentQueue.fees';
            var feeDescriptions, feeAmounts;
            paymentsPage.formattedDataFromRepeater(feePaymentRepeater, 'fee.description').then(function (rawData) {
              feeDescriptions = rawData;
            }).then(function () {
              paymentsPage.formattedDataFromRepeater(feePaymentRepeater, 'fee.amount').then(function (rawData) {
                feeAmounts = rawData;
              });
            }).then(function () {
              paymentsPage.feePaymentQueue.map(function (queueElement) {
                return queueElement.getText();
              }).then(function (queueTexts) {
                expect(queueTexts.length).toEqual(feeAmounts.length);
                expect(queueTexts.length).toEqual(feeDescriptions.length);
                for (var i = 0; i < queueTexts.length; i++) {
                  var feeAmount = feeAmounts[i];
                  var queueText = queueTexts[i];
                  var feeDescription = feeDescriptions[i];
                  console.log(feeDescription, queueText, feeAmount);
                  expect(queueText).toContain(feeAmount);
                  expect(queueText).toContain(feeDescription);
                }
              });
            });
          }
        });
      });
    });
  });
});
