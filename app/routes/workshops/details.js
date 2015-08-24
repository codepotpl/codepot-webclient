import Ember from 'ember';
import authenticatedRoute from '../../mixins/authenticated-route';
import cdptRequest from '../../utils/cdpt-request';
import showLoadingIndicator from '../../utils/show-loading-indicator';
import upsert from '../../utils/upsert';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller, model) {
    showLoadingIndicator(true);

    var route = this;
    var userId = this.controller.get('controllers.application.userData').user.get('id');
    var url = '/api/users/' + userId + '/workshops/';
    cdptRequest(url, 'POST')
      .then(function (result) {
        result.workshops.map(function (rawWorkshop) {
          var timeSlots = rawWorkshop.timeSlots.map(function (rawTimeSlot) {
            return upsert(controller.store, 'time-slot', rawTimeSlot);
          });
          delete rawWorkshop.timeSlots;
          var mentors = rawWorkshop.mentors.map(function (rawMentor) {
            return upsert(controller.store, 'mentor', rawMentor);
          });
          delete rawWorkshop.mentors;
          var workshop = upsert(controller.store, 'workshop', rawWorkshop);
          workshop.get('timeSlots').pushObjects(timeSlots);
          workshop.get('mentors').pushObjects(mentors);
          return workshop;
        });
        var workshop = route.store.getById('workshop', model.id);
        if (!workshop) {
          alert('No workshop found, or you have no access to it.');
          route.transitionTo('workshops.index');
          return;
        }
        route.controller.set('workshop', route.store.getById('workshop', model.id));
        route.refreshMessages();
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  refreshMessages: function() {
    var route = this;
    var workshopId = this.controller.get('workshop.id');
    var url = '/api/workshops/' + workshopId + '/messages/';
    cdptRequest(url, 'GET')
      .then(function(response) {
        console.log(response);
        route.controller.set('messages', response.messages)
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  actions: {
    sendNewMessage: function (message) {
      var route = this;
      var workshopId = this.controller.get('workshop.id');
      var url = '/api/workshops/' + workshopId + '/messages/';
      var data = {
        content: message
      };
      cdptRequest(url, 'POST', data)
        .then(function() {
          route.controller.set('newMessage', '');
          route.refreshMessages();
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    }
  }
});
