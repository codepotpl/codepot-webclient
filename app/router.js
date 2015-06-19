import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('terms-of-service');
  this.route('dashboard');
  this.route('buy-a-ticket');
  this.route('check-payment-status');
});
