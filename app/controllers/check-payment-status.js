import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator';
import cdptRequest from '../utils/cdpt-request';

export default Ember.Controller.extend({
  needs: 'application',

  isTransfer: function () {
    return this.get('purchase.paymentType') === 'TRANSFER';
  }.property('purchase'),

  isPayU: function () {
    return this.get('purchase.paymentType') === 'PAYU';
  }.property('purchase'),

  isFree: function () {
    return this.get('purchase.paymentType') === 'FREE';
  }.property('purchase'),

  isCompleted: function () {
    return this.get('purchase.paymentStatus') === 'SUCCESS'
  }.property('purchase'),

  showPayWithPayUButton: function () {
    return this.get('purchase.paymentType') === 'PAYU' && this.get('purchase.paymentStatus') === 'PENDING';
  }.property('purchase'),

  isFailed:function() {
    return this.get('purchase.paymentStatus') === 'FAILED';
  }.property('purchase'),

  actions: {
    payWithPayU: function () {
      window.location = this.get('purchase.paymentInfo.paymentLink');
    }
  }
});
