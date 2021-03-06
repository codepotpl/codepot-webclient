import Ember from 'ember';
import cdptRequest from '../../utils/cdpt-request';
import showLoadingIndicator from '../../utils/show-loading-indicator';
import upsert from '../../utils/upsert';

export default Ember.Route.extend({
  setupController: function (controller, model) {
    showLoadingIndicator(true);

    var route = this;
    var userId;
    if (this.controller.get('controllers.application.userData') && this.controller.get('controllers.application.userData').user.get('id')) {
      userId = this.controller.get('controllers.application.userData').user.get('id');
    }
    var signedIn = !!userId;
    this.controller.set('signedIn', signedIn);

    var url = '/api/workshops/' + model.id + '/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        var timeSlots = result.timeSlots.map(function (rawTimeSlot) {
          return upsert(controller.store, 'time-slot', rawTimeSlot);
        });
        delete result.timeSlots;
        var mentors = result.mentors.map(function (rawMentor) {
          return upsert(controller.store, 'mentor', rawMentor);
        });
        delete result.mentors;
        var workshop = upsert(controller.store, 'workshop', result);
        workshop.get('timeSlots').pushObjects(timeSlots);
        workshop.get('mentors').pushObjects(mentors);

        route.controller.set('workshop', workshop);

        if (signedIn) {
          var url = '/api/users/' + userId + '/workshops/';
          cdptRequest(url, 'POST')
            .then(function (result) {
              var selectedWorkshop = result.workshops
                .map(function (rawWorkshop) {
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
                }).filter(function (workshop) {
                  return workshop.id == model.id;
                })[0];

              route.controller.set('hasAccessToThisWorkshop', !!selectedWorkshop);

              var workshop = route.store.getById('workshop', model.id);
              if (!workshop) {
                alert('No workshop found, or you have no access to it.');
                route.transitionTo('workshops.index');
                return;
              }
              route.controller.set('workshop', workshop);

              if (workshop.get('mentors').filter(function (mentor) {
                  return mentor.get('id') == userId;
                }).length > 0) {
                route.loadAttendees();
              }

              route.refreshMessages();
            })
            .always(function () {
              showLoadingIndicator(false);
            });
        }
      })
      .fail(function (error) {
        console.error(error);
        route.transitionTo('workshops.index');
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  refreshMessages: function () {
    var route = this;
    var workshopId = this.controller.get('workshop.id');
    var url = '/api/workshops/' + workshopId + '/messages/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        route.controller.set('messages', response.messages)
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  loadAttendees: function () {
    var route = this;
    var workshopId = this.controller.get('workshop.id');
    var url = '/api/workshops/' + workshopId + '/attendees/';
    cdptRequest(url, 'GET')
      .then(function (response) {
        route.controller.set('attendees', response.attendees);
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
        .then(function () {
          route.controller.set('newMessage', '');
          route.refreshMessages();
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    },
    willTransition: function () {
      this.controller.set('attendees', []);
      this.controller.set('signedIn', false);
      this.controller.set('hasAccessToThisWorkshop', false);
    }
  }
});
