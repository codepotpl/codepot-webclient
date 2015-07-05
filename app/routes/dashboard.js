import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';

export default Ember.Route.extend(authenticatedRoute, {
  beforeModel: function (transition, queryParams) {
    this._super(transition, queryParams);
    //transition.abort();
    var route = this;
    var userId = this.controllerFor('application').get('userData').user.get('id');
    var url = 'api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        if (response.purchase.paymentStatus !== 'SUCCESS') {
          route.transitionTo('/check-payment-status');
        } else {
          transition.retry();
        }
      })
      .fail(function (error) {
        if (error.status === 404) {
          route.transitionTo('/buy-a-ticket');
        } else {
          transition.retry();
        }
      });
  }
});
