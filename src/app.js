'use strict';
var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');

var npdcStationBookingApp = angular.module('npdcStationBookingApp', ['npdcCommon','leaflet']);

npdcStationBookingApp.controller('StationBookingShowController', require('./show/StationBookingShowController'));
npdcStationBookingApp.controller('StationBookingSearchController', require('./search/StationBookingSearchController'));
npdcStationBookingApp.controller('StationBookingEditController', require('./edit/StationBookingEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/', 'resource': 'NpolarApi'},
  {'path': '/user', 'resource': 'User'},
  {'path': '/dataset', 'resource': 'Dataset'},
  {'path': '/project', 'resource': 'Project'},
  {'path': '/publication', 'resource': 'Publication'},
   {'path': '/expedition', 'resource': 'Expedition'},
  {'path': '/station-booking', 'resource': 'StationBooking'}
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcStationBookingApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
  return NpolarApiResource.resource(service);
  }]);
});

// Routing
npdcStationBookingApp.config(require('./router'));

npdcStationBookingApp.config(($httpProvider, npolarApiConfig) => {
  var autoconfig = new AutoConfig("production");
  angular.extend(npolarApiConfig, autoconfig, { resources });
  console.debug("npolarApiConfig", npolarApiConfig);

  $httpProvider.interceptors.push('npolarApiInterceptor');
});

npdcStationBookingApp.run(($http, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  NpolarTranslate.loadBundles('npdc-station-booking');
  npdcAppConfig.toolbarTitle = 'Station booking statistics';
});
