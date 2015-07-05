import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator';
import cdptRequest from '../utils/cdpt-request';
import config from '../config/environment';

export default Ember.Controller.extend({
  needs: ['application'],

  selectedPricing: function () {
    return this.get('prices').filter(function (price) {
      return price.isSelected;
    })[0];
  }.property('prices.@each.isSelected'),

  firstName: function () {
    return this.get('controllers.application.userData.user.firstName');
  }.property('controllers.application.userData'),

  promoCodeChanged: function () {
    this.set('promoCodeInfo', null);
    this.fetchPromoCodeInfo(this.get('promoCode'));
  }.observes('promoCode'),

  priceAfterDiscount: function () {
    var price = this.get('selectedPricing.totalPriceInPLN') * (100 - this.get('promoCodeInfo.discount')) / 100;
    var rounded = Math.round(price * 100) / 100;
    return rounded;
  }.property('selectedPricing', 'promoCodeInfo'),

  fetchPromoCodeInfo: function (promoCode) {
    showLoadingIndicator(true);
    var controller = this;
    var url = '/api/promo-codes/' + promoCode + '/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        controller.set('promoCodeInfo', result.active ? result : null);
      })
      .fail(function (error) {
        controller.set('promoCodeInfo', null);
        controller.send('error', error);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  ticketIsForFree: function () {
    return this.get('promoCodeInfo.discount') === 100;
  }.property('promoCodeInfo'),

  anyFieldInInvoiceFormIsFilled: function () {
    return this.get('name') || this.get('city') || this.get('street') || this.get('zipCode') || this.get('taxId') || this.get('country');
  }.property('name', 'city', 'street', 'zipCode', 'taxId', 'country'),

  invoiceFormValid: function () {
    if (this.get('anyFieldInInvoiceFormIsFilled')) {
      return this.get('name') &&
        this.get('street') &&
        new RegExp('\\d{2}-\\d{3}').test(this.get('zipCode')) &&
        new RegExp('\\d{10}|\\d{3}-\\d{3}-\\d{2}-\\d{2}').test(this.get('taxId')) &&
        this.get('country');
    } else {
      return true;
    }
  }.property('anyFieldInInvoiceFormIsFilled', 'name', 'city', 'street', 'zipCode', 'taxId', 'country'),

  disablePayButtons: function () {
    return !this.get('invoiceFormValid');
  }.property('invoiceFormValid'),

  actions: {
    selectPrice: function (priceId) {
      this.get('prices').forEach(function (price) {
        price.set('isSelected', price.id === priceId);
      });
    },

    onPromoCodeFocusOut: function () {
      if (!this.get('promoCode') || this.get('promoCodeInfo')) {
        this.clearPromoCodeError();
      } else {
        this.showPromoCodeError();
      }
    },

    createPurchase: function (type) {
      showLoadingIndicator(true);
      var url = '/api/purchases/new/';
      var data = {
        promoCode: this.get('promoCodeInfo') ? this.get('promoCode') : null,
        productId: this.get('selectedPricing.id'),
        paymentType: type,
        paymentInfo: {
          redirectLink: config.BASE_URL + 'check-payment-status'
        },
        invoice: type === 'FREE' ? null : {
          name: this.get('name') ? this.get('name') : null,
          city: this.get('city') ? this.get('city') : null,
          street: this.get('street') ? this.get('street') : null,
          zipCode: this.get('zipCode') ? this.get('zipCode') : null,
          taxId: this.get('taxId') ? this.get('taxId').replace(/-/g, '') : null,
          country: this.get('country') ? this.get('country') : null

        }
      };
      if (!this.get('name')) {
        data.invoice = null;
      }

      var controller = this;
      cdptRequest(url, 'POST', data)
        .then(function (result) {
          console.log(result);
          if (result.purchase.paymentType === 'PAYU') {
            window.location = result.purchase.paymentInfo.paymentLink;
          } else {
            controller.transitionToRoute('/check-payment-status');
          }
        })
        .fail(function (error) {
          controller.send('error', error);
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  },

  clearPromoCodeError: function () {
    Ember.$('#promo-code-input').removeClass('error');
    Ember.$('#promo-code-input').siblings('.error').addClass('hidden');
  },

  showPromoCodeError: function () {
    Ember.$('#promo-code-input').addClass('error');
    Ember.$('#promo-code-input').siblings('.error').removeClass('hidden');
  }
});
