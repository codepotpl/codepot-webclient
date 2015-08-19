import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['agenda'],

  isThisWorkshopAlreadySelected: function () {
    var thisWorkshop = this.get('model');
    return this.get('controllers.agenda.selectedWorkshops')
      .filter(function (workshop) {
        return thisWorkshop.get('id') === workshop.get('id');
      })
      .length > 0;
  }.property('controllers.agenda.selectedWorkshops'),

  //canSelectThisWorkshop: function () {
  //  var canSelect = true;
  //  var thisWorkshop = this.get('model');
  //  this.get('controllers.agenda.selectedWorkshops').forEach(function (workshop) {
  //    if (thisWorkshop.collidesWithWorkshop(workshop)) {
  //      canSelect = false;
  //    }
  //  });
  //  return canSelect;
  //}.property('controllers.agenda.selectedWorkshops'),


  actions: {
    leaveWorkshop: function (workshop) {
      this.get('controllers.agenda').send('leaveWorkshop', workshop);
    }
  }
});
