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
    return this.get('isSignedIn') && this.get('purchaseComplete');
  }.property('isSignedIn', 'purchaseComplete'),

  refreshSelectedWorkshops: function () {
    showLoadingIndicator(true);
    var controller = this;
    var userId = this.get('controllers.application.userData').user.get('id');
    var url = '/api/users/' + userId + '/workshops/';
    cdptRequest(url, 'GET')
      .then(function (result) {
        var workshops = result.workshops.map(function (rawWorkshop) {
          return controller.store.getById('workshop', rawWorkshop.id);
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
      var url = '/api/users/' + userId + '/workshops/';
      var data = {
        workshopId: parseInt(workshop.get('id'))
      };
      cdptRequest(url, 'POST', data)
        .then(function (result) {
          alert('You have successfully selected "' + workshop.get('title') + '".');
          controller.refreshSelectedWorkshops();
        })
        .always(function () {
          showLoadingIndicator(false);
        });
    },

    leaveWorkshop: function (workshop) {
      showLoadingIndicator(true);
      var controller = this;
      var userId = this.get('controllers.application.userData').user.get('id');
      var url = '/api/users/' + userId + '/workshops/' + workshop.get('id') + '/';
      cdptRequest(url, 'DELETE')
        .then(function () {
          alert('You have successfully left "' + workshop.get('title') + '".');
          controller.refreshSelectedWorkshops();
        })
        .always(function () {
          showLoadingIndicator(false);
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
        var url = '/api/users/' + userId + '/workshops/';
        var data = {
          workshopId: parseInt(newWorkshop.get('id'))
        };
        cdptRequest(url, 'POST', data)
          .then(function () {
            alert('You have successfully selected "' + newWorkshop.get('title') + '".');
            controller.refreshSelectedWorkshops();
          })
          .always(function () {
            showLoadingIndicator(false);
          });
      });
  }
});
