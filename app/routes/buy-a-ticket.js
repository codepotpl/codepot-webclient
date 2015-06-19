import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';
import upsert from '../utils/upsert';

export default Ember.Route.extend(authenticatedRoute, {
  beforeModel: function (transition, queryParams) {
    this._super(transition, queryParams);
    //transition.abort();
    var route = this;
    var userId = this.controllerFor('application').get('userData').user.get('id');
    var url = 'api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        route.transitionTo('/dashboard');
      })
      .fail(function (error) {
          transition.retry();
      });
  },

  setupController: function (controller, model) {
    showLoadingIndicator(true);

    var url = 'api/prices/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        var prices = result.prices
          .filter(function (price) {
            return price.active;
          })
          .map(function (price) {
            return upsert(controller.store, 'price', price)
          });
        if (prices.length > 0) {
          prices[0].isSelected = true;
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
