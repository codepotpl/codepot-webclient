import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator';
import cdptRequest from '../utils/cdpt-request';

export default Ember.Controller.extend({
  needs: ['application'],

  currentPricing: function () {
    return this.get('prices') ? this.get('prices')[0] : null;
  }.property('prices'),

  firstName: function () {
    return this.get('controllers.application.userData.user.firstName');
  }.property('controllers.application.userData'),

  promoCodeChanged: function () {
    this.set('promoCodeInfo', null);
    var promoCode = this.get('promoCode').substring(0, 6);
    if (promoCode.length === 6) {
      this.fetchPromoCodeInfo(promoCode);
    }
  }.observes('promoCode'),

  priceAfterDiscount: function () {
    return this.get('currentPricing.bothDaysNet') * (100 - this.get('promoCodeInfo.discount')) / 100;
  }.property('prices', 'promoCodeInfo'),

  fetchPromoCodeInfo: function (promoCode) {
    showLoadingIndicator(true);
    var controller = this;
    var url = 'api/promo-codes/' + promoCode + '/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        controller.set('promoCodeInfo', result);
      })
      .fail(function () {
        controller.set('promoCodeInfo', null);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  showInvoiceForm: function () {
    return this.get('promoCodeInfo.discount') !== 100;
  }.property('promoCodeInfo'),


  actions: {
    createPurchase: function () {
      showLoadingIndicator(true);
      var controller = this;
      var url = 'api/purchases/new/';
      var data = {
        promoCode: this.get('promoCode'),
        ticketType: 'BOTH_DAYS',
        invoice: {
          name: 'dummy',
          street: 'dummy',
          zipCode: '00-222',
          taxId: '1234567890',
          country: 'dummy'

        }
      };
      cdptRequest(url, 'POST', data)
        .then(function (result) {
          console.log(result);
        })
        .fail(function (error) {
          console.log(error);
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  }
});
