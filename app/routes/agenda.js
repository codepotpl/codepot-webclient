import Ember from 'ember';
import cdptRequest from '../utils/cdpt-request';
import upsert from '../utils/upsert';

export default Ember.Route.extend({
  setupController: function (controller, model) {
    var url = '/api/workshops/';
    cdptRequest(url, 'GET')
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
      });
  }
});

