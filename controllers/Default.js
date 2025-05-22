'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.register = function register (req, res, next, body) {
  Default.register(req, res);
};

module.exports.login = function login (req, res, next, body) {
  Default.login(req, res);
};

module.exports.calculate = function calculate (req, res, next, body, operation) {
  Default.calculate(body, operation)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (err) {
      const status = err.status || 500;
      utils.writeJson(res, { message: err.message || 'Server error' }, status);
    });
};
