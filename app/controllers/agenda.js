import Ember from 'ember';
import showLoadingIndicator from '../utils/show-loading-indicator';
import cdptRequest from '../utils/cdpt-request';


export default Ember.Controller.extend({
  needs: ['application'],
  isSignedInBinding: 'controllers.application.isUserSignedInProperty',
  workshops: [],
  selectedWorkshops: [],

  showPurchaseNotCompletedInfo: function () {
    return this.get('isSignedIn') && !this.get('purchaseComplete');
  }.property('isSignedIn', 'purchaseComplete'),

  canSelectWorkshops: function () {
    return this.get('isSignedIn') && this.get('purchaseComplete') && false;
  }.property('isSignedIn', 'purchaseComplete'),

  refreshSelectedWorkshops: function () {
    showLoadingIndicator(true);
    var controller = this;
    var userId = this.get('controllers.application.userData').user.get('id');
    var url = '/api/users/' + userId + '/workshops/' + '?nocache=' + new Date().getTime();
    cdptRequest(url, 'POST')
      .then(function (result) {
        controller.get('workshops').forEach(function (workshop) {
          workshop.set('isSelected', false);
        });
        var workshops = result.workshops.map(function (rawWorkshop) {
          return controller.store.getById('workshop', rawWorkshop.id);
        });
        workshops.forEach(function (workshop) {
          workshop.set('isSelected', true);
        });
        controller.set('selectedWorkshops', workshops);
      })
      .always(function () {
        showLoadingIndicator(false);
      });
  },

  canSelectWorkshopsChanged: function () {
    if (this.get('canSelectWorkshops')) {
      this.refreshSelectedWorkshops();
    }
  }.observes('canSelectWorkshops'),

  filterWorkshopsByDay: function (day) {
    var workshops = this.get('workshops').filter(function (workshop) {
      var timeSlots = workshop.get('timeSlots').filter(function (timeSlot) {
        return timeSlot.get('day') === day;
      });
      return timeSlots.length > 0;
    });
    return workshops;
  },

  cantModifyWorkshopBecauseOfBeingAMentorInThisTimeSlot: function () {
    var myId = this.get('controllers.application.userData').user.get('id');
    var myTimeSlots = [];
    this.get('selectedWorkshops').forEach(function (workshop) {
      workshop.get('mentors').forEach(function (mentor) {
        if (mentor.get('id') === myId) {
          myTimeSlots.pushObjects(workshop.get('timeSlots').map(function (timeSlot) {
            return timeSlot;
          }));
        }
      });
    });

    this.get('workshops')
      .forEach(function (workshop) {
        workshop.get('timeSlots').forEach(function (workshopTimeSlot) {
          myTimeSlots.forEach(function (myTimeSlot) {
            if (workshopTimeSlot.get('day') === myTimeSlot.get('day') && workshopTimeSlot.get('order') === myTimeSlot.get('order')) {
              workshop.set('cantModifyWorkshopBecauseOfBeingAMentorInThisTimeSlot', true);
            }
          });
        });
      });
  }.observes('workshops', 'selectedWorkshops'),

  noWorkshopsFoundDay1: function () {
    return !this.filterWorkshopsByDay('FIRST').length;
  }.property('workshops'),

  noWorkshopsFoundDay2: function () {
    return !this.filterWorkshopsByDay('SECOND').length;
  }.property('workshops'),

  searchTextChanged: function () {
    Ember.run.debounce(this, this.filterWorkshops, 500);
  }.observes('searchText'),

  filteredWorkshopsOnly: function () {
    return !!this.get('searchText');
  }.property('workshops'),

  filterWorkshops: function () {
    ga('send', 'event', 'seach', 'performed', this.get('searchText'));
    this.target.send('filterWorkshops', this, this.get('searchText'));
  },

  actions: {
    filterWorkshops: function () {
      this.filterWorkshops();
    },

    selectWorkshop: function (workshop) {
      var collidingWorkshop = this.get('selectedWorkshops').filter(function (selectedWorkshop) {
        return selectedWorkshop.collidesWithWorkshop(workshop);
      })[0];

      if (collidingWorkshop) {
        var confirmed = confirm('Are you sure? This workshop overlaps: "' + collidingWorkshop.get('title') + '". You will be signed out of this workshop.');
        if (confirmed) {
          this.leaveWorkshopAndThenSelectNewOne(collidingWorkshop, workshop);
        }
        return;
      }

      showLoadingIndicator(true);
      var controller = this;
      var userId = this.get('controllers.application.userData').user.get('id');
      var url = '/api/users/' + userId + '/workshops/sign/';
      var data = {
        workshopId: parseInt(workshop.get('id'))
      };
      cdptRequest(url, 'POST', data)
        .then(function () {
          $('.reveal-modal.open').foundation('reveal', 'close');
        })
        .always(function () {
          showLoadingIndicator(false);
          controller.refreshSelectedWorkshops();
        });
    },

    leaveWorkshop: function (workshop) {
      showLoadingIndicator(true);
      var controller = this;
      var userId = this.get('controllers.application.userData').user.get('id');
      var url = '/api/users/' + userId + '/workshops/' + workshop.get('id') + '/';
      cdptRequest(url, 'DELETE')
        .then(function () {
          $('.reveal-modal.open').foundation('reveal', 'close');
        })
        .always(function () {
          showLoadingIndicator(false);
          controller.refreshSelectedWorkshops();
        });
    }
  },

  leaveWorkshopAndThenSelectNewOne: function (oldWorkshop, newWorkshop) {
    showLoadingIndicator(true);
    var controller = this;
    var userId = this.get('controllers.application.userData').user.get('id');
    var url = '/api/users/' + userId + '/workshops/' + oldWorkshop.get('id') + '/';
    cdptRequest(url, 'DELETE')
      .then(function () {
        var url = '/api/users/' + userId + '/workshops/sign/';
        var data = {
          workshopId: parseInt(newWorkshop.get('id'))
        };
        cdptRequest(url, 'POST', data)
          .then(function () {
            $('.reveal-modal.open').foundation('reveal', 'close');
          })
          .always(function () {
            showLoadingIndicator(false);
            controller.refreshSelectedWorkshops();
          });
      });
  },

  firstDaySelectedWorkshops: function () {
    return this.get('selectedWorkshops').filter(function (workshop) {
      return workshop.get('day') === 'FIRST';
    });
  }.property('selectedWorkshops'),

  secondDaySelectedWorkshops: function () {
    return this.get('selectedWorkshops').filter(function (workshop) {
      return workshop.get('day') === 'SECOND';
    });
  }.property('selectedWorkshops')
});
