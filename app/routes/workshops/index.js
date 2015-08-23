import Ember from 'ember';
import authenticatedRoute from '../../mixins/authenticated-route';
import cdptRequest from '../../utils/cdpt-request';
import showLoadingIndicator from '../../utils/show-loading-indicator';
import upsert from '../../utils/upsert';

export default Ember.Route.extend(authenticatedRoute, {
  setupController: function (controller) {
    showLoadingIndicator(true);

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
          return workshop;
        });
        controller.set('workshops', workshops);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  }
});
