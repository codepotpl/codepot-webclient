import Ember from 'ember';

export default function cdptRequest(url, method, data) {
  var apiEndpoint = 'http://192.168.59.103:8080/';
  return Ember.$.ajax({
    url: apiEndpoint + url,
    type: method,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json'
  }).fail(function (error) {
    console.error(error);
  });
};
