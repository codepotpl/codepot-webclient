import Ember from 'ember';
import cdptRequest from '../utils/cdpt-request';
import upsert from '../utils/upsert';
import showLoadingIndicator from '../utils/show-loading-indicator';
import authenticatedRoute from '../mixins/authenticated-route';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller) {
    showLoadingIndicator(true);

    var isMentor = false;
    var userId = this.controller.get('controllers.application.userData').user.get('id');
    var url = '/api/users/' + userId + '/workshops/';
    cdptRequest(url, 'POST')
      .then(function (result) {
        var workshops = result.workshops.map(function (rawWorkshop) {
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

          workshop.set('isMentor', false);
          workshop.get('mentors').forEach(function (mentor) {
            if (mentor.get('id') == userId) {
              isMentor = true;
              workshop.set('isMentor', true);
            }
          });
          return workshop;
        });

        workshops = workshops.filter(function (workshop) {
          return !workshop.get('isMentor');
        });

        controller.set('workshops', workshops);
        controller.set('isMentor', isMentor);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  }
});

