import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';
import upsert from '../utils/upsert';

export default Ember.Route.extend(authenticatedRoute, {
  beforeModel: function (transition, queryParams) {
    var route = this;
    var userId = this.controllerFor('application').get('userData.user.id');
    var url = '/api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function () {
        route.transitionTo('/dashboard');
      })
      .fail(function (error) {
        route.send('error', error);
      });
  },

  setupController: function (controller) {
    showLoadingIndicator(true);

    var url = '/api/prices/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        var prices = result.prices
          .map(function (price) {
            return upsert(controller.store, 'price', price);
          });
        var activePrices = prices.filter(function (price) {
          return price.active;
        });
        if (activePrices.length > 0) {
          activePrices[0].isSelected = true;
        }
        controller.set('prices', prices);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  activate: function () {
    console.log('ACTIVATE');
  }
});
