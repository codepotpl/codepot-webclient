import Ember from 'ember';
import cdptRequest from '../utils/cdpt-request';
import upsert from '../utils/upsert';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend({
  allWorkshops: [],

  setupController: function (controller, model) {
    showLoadingIndicator(true);
    var route = this;
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
        route.set('allWorkshops', workshops);
        controller.set('workshops', workshops);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  actions: {
    filterWorkshops: function (controller, searchText) {
      if (!searchText) {
        controller.set('workshops', this.get('allWorkshops'));
        return;
      }

      showLoadingIndicator(true);
      var url = '/api/workshops/search/';
      var data = {
        query: searchText
      };
      cdptRequest(url, 'POST', data)
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
  }
});

