import Ember from 'ember';

export default Ember.Component.extend({
  alreadySent: false,

  sendFeedback: function () {
    console.log(this.get('questionId'));
    console.log(this.get('userId'));
    console.log(this.get('userToken'));
    console.log(this.get('value'));

    this.set('alreadySent', false);
    this.$('.overlay').removeClass('hidden');
    var component = this;
    Ember.run.later(function () {
      component.$('.overlay').addClass('hidden');
      component.set('alreadySent', true);
    }, 1000);
  },

  actions: {
    inputFocusOut: function () {
      this.sendFeedback();
    }
  }
});
