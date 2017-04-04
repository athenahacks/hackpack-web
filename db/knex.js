var config = require('../knexfile')['development'];
var knex = require('knex')(config);

module.exports = knex;
