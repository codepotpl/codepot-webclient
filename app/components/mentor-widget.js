import Ember from 'ember';

export default Ember.Component.extend({
  githubURL: function () {
    return 'https://github.com/' + this.get('mentor.githubUsername');
  }.property('githubUsername'),

  stackoverflowURL: function () {
    return 'http://stackoverflow.com/users/' + this.get('mentor.stackoverflowId');
  }.property('stackoverflowId'),

  twitterURL: function () {
    return 'https://twitter.com/' + this.get('mentor.twitterUsername');
  }.property('twitterUsername'),

  googleplusURL: function() {
    return 'https://plus.google.com/' + this.get('mentor.googleplusHandler');
  }.property('googleplusHandler')
});
