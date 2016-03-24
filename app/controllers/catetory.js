var _ = require('underscore');
var Cates = require('../models/catetory');

exports.newCate = function(req,res) {
	res.render('cates_admin', {
		title: 'imooc 后台分类录入页',
		cates: {}
	})
}

exports.save =  function(req,res) {
	var _cates = req.body.cates;
	var cate = new Cates(_cates);

	cate.save(function(err, cate) {
		if(err) console.log(err);

		res.redirect('/admin/cates/list');
	})
}





//admin post movie
exports.newMovie =  function(req,res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie = null;

	if(id != 'undefined') {
		Movie.findById(id, function(err,movie) {
			if(err) console.log(err);

			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie) {
				err ? console.log(err) : res.redirect('/movie/' + movie._id);
			})
		})
	}
	else {
		_movie = new Movie({
			title: movieObj.title,
			doctor: movieObj.doctor,
			country: movieObj.country,
			year: movieObj.year,
			poster: movieObj.poster,
			flash: movieObj.flash,
			summary: movieObj.summary,
			lang: movieObj.lang
		});
		_movie.save(function(err,movie) {
			err ? console.log(err) : res.redirect('/movie/' + movie._id);
		})
	}
}

//detail page
exports.detailMovie =  function(req,res) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {
		Comment.find({movie: id}).populate('from','name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err, comments) {
			console.log(comments);
			err ? console.log(err) : 
			res.render('detail', {
				title: 'imooc 详情页',
				movie: movie,
				comments: comments
			})
		})
	})
}

//cates list page
exports.cateList =  function(req,res) {
	Cates.fetch(function(err,cates) {
		if(err) console.log(err);

		res.render('cates_list', {
			title: 'imooc 分类列表页',
			cates: cates
		})
	});
}

//list delete movie
exports.deleteMovie = function(req,res) {
	var id = req.query.id;

	if(id) {
		Movie.remove({_id: id}, function(err,movie) {
			err ? console.log(err) : res.json({success: 1});
		})
	}
}