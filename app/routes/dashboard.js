import Ember from 'ember';
import authenticatedRoute from '../mixins/authenticated-route';
import cdptRequest from '../utils/cdpt-request';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend(authenticatedRoute, {
  beforeModel: function (transition) {
    //transition.abort();
    var route = this;
    var userId = this.controllerFor('application').get('userData').user.get('id');
    var url = 'api/users/' + userId + '/purchase/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        transition.retry();
      })
      .fail(function (error) {
        if (error.status === 404) {
          route.transitionTo('/buy-ticket');
        } else {
          transition.retry();
        }
      });
  }
});
