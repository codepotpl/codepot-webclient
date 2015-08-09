import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('terms-of-service');
  this.route('reset-password', function() {
    this.route('email-sent');
    this.route('provide-new-password', {path: '/:hash'});
    this.route('success');
  });
  this.route('dashboard');
  this.route('buy-a-ticket');
  this.route('check-payment-status');
  this.route('agenda');
});
