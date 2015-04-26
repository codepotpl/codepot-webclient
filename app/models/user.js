import DS from 'ember-data';

export default DS.Model.extend({
  toJSON: function () {
    return this._super({includeId: true});
  },
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string')
});
