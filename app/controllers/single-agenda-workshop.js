import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['agenda'],

  canSelectWorkshopsBinding: 'controllers.agenda.canSelectWorkshops',

  isThisWorkshopCollidingWithLunch: function () {
    var thisWorkshop = this.get('model');
    var inLunchSlot = false;
    var lunchDay;
    var lunchSlot;
    thisWorkshop.get('timeSlots').forEach(function (timeSlot) {
      if (timeSlot.get('order') === 1 || timeSlot.get('order') === 2) {
        inLunchSlot = true;
        lunchDay = timeSlot.get('day');
        lunchSlot = timeSlot.get('order');
      }
    });

    if (inLunchSlot) {
      var colliding = false;
      this.get('controllers.agenda.selectedWorkshops').forEach(function (workshop) {
        workshop.get('timeSlots').forEach(function (timeSlot) {
          if (timeSlot.get('day') === lunchDay) {
            if ((lunchSlot === 1 && timeSlot.get('order') === 2) || (lunchSlot === 2 && timeSlot.get('order') === 1)) {
              colliding = true;
            }
          }
        });
      });
      return colliding;
    } else {
      return false;
    }
  }.property('controllers.agenda.selectedWorkshops'),

  actions: {
    leaveWorkshop: function (workshop) {
      this.get('controllers.agenda').send('leaveWorkshop', workshop);
    },
    showWorkshopDetails: function (workshop) {
      $('.reveal-modal.open').foundation('reveal', 'close');
      var agendaController = this.get('controllers.agenda');
      Ember.run.later(function () {
        agendaController.transitionToRoute('workshops.details', workshop.get('id'), workshop.get('sluggedTitle'));
      }, 400);
    }
  }
});
