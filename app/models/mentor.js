import config from '../config/environment';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  tagline: DS.attr('tagline'),
  pictureURL: DS.attr('pictureURL'),
  fullPictureURL: function () {
    return config.FRONTPAGE_URL + this.get('pictureURL');
  }.property('pictureURL'),
  bioInMd: DS.attr('bioInMd'),
  websiteURL: DS.attr('websiteURL'),
  linkedinProfileURL: DS.attr('linkedinProfileURL'),
  githubUsername: DS.attr('githubUsername'),
  stackoverflowId: DS.attr('stackoverflowId'),
  twitterUsername: DS.attr('twitterUsername'),
  googleplusHandler: DS.attr('googleplusHandler')
});
