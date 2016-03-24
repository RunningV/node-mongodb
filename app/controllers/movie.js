var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Cates = require('../models/catetory');

//admin add movie page
exports.movie = function(req,res) {
	Cates.find({}, function(err, cates) {
			res.render('admin', {
			title: 'imooc 后台录入页',
			cates: cates,
			movie: {}
		})
	})	
}

//admin update movie
exports.updateMovie =  function(req,res) {
	var id = req.params.id;

	if(id) {
		Movie.findById(id, function(err, movie) {
			if(err) console.log(err)
				
			Cates.find({}, function(err,cates) {
				res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie,
				cates: cates
				});
			});
		})
	}
}




//admin save poster
exports.savePoster =  function(req,res,next) {
	var posterData = req.files.uploadPoster,
		filePath = posterData.path,
		originalFilename = posterData.originalFilename;

	if(originalFilename) {
		fs.readFile(filePath, function(err, data) {
			var timestamp = Date.now(),
				type 	  = posterData.type.split('/')[1],
				poster    = timestamp + '.' + type,
				newPath   = path.join(__dirname, '../', '/img/' + poster);

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster;
				next();
			})
		})
	}else{
		next();
	}
}

//admin post movie
exports.saveMovie =  function(req,res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie = null;
	console.log("上传海报");
	console.log(req.poster);
	if(req.poster) movieObj.poster = req.poster;
	console.log(movieObj);
	if(id) {
		Movie.findById(id, function(err,movie) {
			if(err) console.log(err);

			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie) {
				err ? console.log(err) : res.redirect('/movie/' + movie._id);
			})
		})
	}
	else {
		_movie = new Movie(movieObj);

		var catesId = movieObj.cates;
		var catesName = movieObj.catesName;

		_movie.save(function(err,movie) {
			if(err) console.log(err);

			if(catesId) {
				Cates.findById(catesId, function(err,cates) {
					cates.movies.push(movie._id);
					cates.save(function(err, cates) {
						res.redirect('/movie/' + movie._id);
					});
				})
			}else if(catesName) {
				console.log(catesName);
				var hasCatesName = null;
				Cates.find({}, function(err, cates) {
					hasCatesName = cates.filter(function(cate) {
						console.log(cate.name);
						return cate.name.toString() == catesName.toString();
					});
					console.log("有木有？")
					console.log(hasCatesName);

					if(hasCatesName && hasCatesName.length) {
						console.log(hasCatesName)
						catesId = hasCatesName[0]._id;
						Cates.findById(catesId, function(err,cates) {
							cates.movies.push(movie._id);
							cates.save(function(err, cates) {
								res.redirect('/movie/' + movie._id);
							});
						})
					}else{
						var cates = new Cates({
							name: catesName,
							movies: movie._id
						});
						cates.save(function(err, cates) {
							movie.cates = cates._id;
							movie.save(function(err, movie) {
								res.redirect('/movie/' + movie._id);
							})
						});
					}

				})
				
			}
		})
	}
}

//detail page
exports.detailMovie =  function(req,res) {
	var id = req.params.id;

	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
		if(err) console.log(err);
	})
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

//list page
exports.movieList =  function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) console.log(err);

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
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