import Ember from 'ember';
import cdptRequest from '../utils/cdpt-request';
import upsert from '../utils/upsert';
import showLoadingIndicator from '../utils/show-loading-indicator';

export default Ember.Route.extend({
  allWorkshops: [],

  setupController: function (controller, model) {
    showLoadingIndicator(true);
    var route = this;

    var workshopsPromise = (function () {
      var d = Ember.$.Deferred();
      var url = '/api/workshops/';
      cdptRequest(url, 'GET')
        .then(function (result) {
          d.resolve(result);
        })
        .fail(function (error) {
          d.resolve(error);
        });
      return d;
    })();

    var promises = {
      workshopsPromise: workshopsPromise
    };
    if (this.get('controller.isSignedIn')) {
      promises.purchasePromise = (function () {
        var d = Ember.$.Deferred();
        var userId = route.controller.get('controllers.application.userData').user.get('id');
        var url = '/api/users/' + userId + '/purchase/';
        cdptRequest(url, 'GET')
          .then(function (response) {
            d.resolve({purchaseComplete: response.purchase.paymentStatus === 'SUCCESS'});
          })
          .fail(function (error) {
            if (error.status === 404) {
              d.resolve({purchaseComplete: false});
            } else {
              d.resolve(error);
            }
          });
        return d;
      })();
    }

    Ember.RSVP.hash(promises)
      .then(function (results) {
        var workshops = results.workshopsPromise.workshops.map(function (rawWorkshop) {
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

        if (results.purchasePromise) {
          controller.set('purchaseComplete', results.purchasePromise.purchaseComplete);
        }
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(function () {
        showLoadingIndicator(false);
        route.refreshWorkshopsAttendeesCount();
      });
  },

  refreshWorkshopsAttendeesCount: function () {
    Ember.run.later(this, function() {
      var route = this;
      var url = '/api/workshops/places/';
      cdptRequest(url, 'POST')
        .then(function (result) {
          result.places.forEach(function(placeObject){
            var workshop = route.store.getById('workshop', placeObject.workshopId);
            if (workshop) {
              workshop.set('attendeesCount', placeObject.attendeesCount);
              workshop.set('maxAttendees', placeObject.maxAttendees);
              workshop.set('placesLeft', placeObject.maxAttendees - placeObject.attendeesCount);
            }
          });
        })
        .always(function () {
          route.refreshWorkshopsAttendeesCount();
        });
    }, 5000);
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

