import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller) {
    showLoadingIndicator(true);

    var route = this;
    var userId = this.controllerFor('application').get('userData').user.get('id');
    var url = '/api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        controller.set('purchase', response.purchase);
        controller.set('priceTotal', response.purchase.priceTotal / 100);
        controller.set('paymentInfo', response.purchase.paymentInfo);
      })
      .fail(function (error) {
        if (error.status === 404) {
          route.transitionTo('/buy-a-ticket');
        }
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  }
});
