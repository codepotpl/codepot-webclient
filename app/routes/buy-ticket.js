import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller, model) {
    showLoadingIndicator(true);

    var url = 'api/tickets/prices/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        controller.set('prices', result.prices.filter(function (price) {
          return price.active;
        }));
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  activate : function() {
    console.log('ACTIVATE');
  }
});
