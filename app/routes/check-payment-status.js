import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller, model) {
    showLoadingIndicator(true);

    var route = this;
    var userId = this.controllerFor('application').get('userData').user.get('id');
    var url = 'api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        controller.set('purchase', response.purchase);
        console.log(response.purchase);
      })
      .fail(function (error) {
        if (error.status === 404) {
          route.transitionTo('/buy-a-ticket');
        } else {
          transition.retry();
        }
      })
      .always(function(){
        showLoadingIndicator(false);
      });
  }
});
