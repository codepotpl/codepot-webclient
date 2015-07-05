import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  active: DS.attr('boolean', {defaultValue: false}),
  priceNet: DS.attr('number'),
  priceVat: DS.attr('number'),
  netPriceInPln: function () {
    return this.get('priceNet') / 100;
  }.property('priceNet'),
  priceVatPercentage: function () {
    return this.get('priceVat') * 100;
  }.property('priceVat'),
  totalPriceInPLN: function () {
    return (this.get('priceNet') * (1 + this.get('priceVat')) ) / 100;
  }.property('priceNet', 'priceVat'),
  isActive: DS.attr('boolean', {defaultValue: false}),
  isDisabled: function () {
    return !this.get('active');
  }.property('active')
});
