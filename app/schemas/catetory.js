var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var CateSchema = new mongoose.Schema({
	name: String,
	movies: [{type: ObjectId, ref: 'Movie'}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

CateSchema.pre('save', function(next) {
	if(this.isNew) {this.meta.createAt = this.meta.updateAt = Date.now();}

	else {this.meta.updateAt = Date.now();}

	next()
})

CateSchema.statics = {
	fetch: function(cd) {
		return this.find({}).sort('meta.updateAt').exec(cd);
	},
	findById: function(id,cd) {
		return this.findOne({_id: id}).exec(cd)
	}
}

module.exports = CateSchema;