import Ember from 'ember';
import config from '../config/environment';

export default function cdptRequest(url, method, data) {
  return Ember.$.ajax({
    url: config.API_HOST + url,
    type: method,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json'
  }).fail(function (error) {
    console.error(error);
  });
}
