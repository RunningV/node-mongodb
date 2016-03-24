var mongoose = require('mongoose');
var CateSchema = require('../schemas/catetory');
var Cate = mongoose.model('Cates', CateSchema);

module.exports = Cate;