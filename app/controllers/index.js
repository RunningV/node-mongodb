var Movie = require('../models/movie');
var Cate = require('../models/catetory');
//index page
exports.index = function(req, res) {
	console.log(req.session.user);
	Cate.find({}).populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, cates) {
			if(err) console.log(err);

			res.render('index', {
				title: 'imooc 首页',
				cates: cates
			})
		})
}

// index search
exports.search = function(req, res) {
	var cateId = req.query.cate,
		q = req.query.q,
		page = parseInt(req.query.p) || 0,
		COUNT = 3,
		index = page * COUNT;
	if(cateId){
		Cate.find({_id: cateId}).populate({
			path: 'movies',
			select: 'title poster'
		}).exec(function(err, cates) {
			if(err) console.log(err);

			var cate = cates[0] || {};
			var movies = cate.movies || [];
			var results = movies.slice(index, index + COUNT);
			res.render('results', {
				title: 'imooc 结果列表页',
				keyword: cate.name,
				currentPage: (page+1),
				query: 'cate=' + cateId,
				totalPage: Math.ceil(movies.length/COUNT),
				movies: results
			})
		})
	}else{
		Movie.find({title: new RegExp(q,'i')}).exec(function(err, movies) {
			if(err) console.log(err);
			console.log(movies.length);
			var results = movies.slice(index, index + COUNT);
			res.render('results', {
				title: 'imooc 结果列表页',
				keyword: q,
				currentPage: (page+1),
				query: 'q=' + cateId,
				totalPage: Math.ceil(movies.length/COUNT),
				movies: results
			})
		})
	}
	
}