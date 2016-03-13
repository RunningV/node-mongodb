var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var _ = require('underscore');
var Movie = require('./models/movie');
var path = require('path');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views','./views/pages');
app.set('view engine','jade');
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.bodyParser())
app.use(express.static(path.join(__dirname,'node_modules')))
app.listen(port)

console.log('imooc started on...')

//index page
app.get('/',function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) console.log(err);

		res.render('index', {
			title: 'imooc 首页',
			movies: movies
		})
	})
	/*res.render('index', {
		title: 'imooc 首页',
		movies: [
			{
				title: '叶问3',
				_id: 1,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			},
			{
				title: '叶问3',
				_id: 2,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			},
			{
				title: '叶问3',
				_id: 3,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			},
			{
				title: '叶问3',
				_id: 4,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			},
			{
				title: '叶问3',
				_id: 5,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			},
			{
				title: '叶问3',
				_id: 6,
				poster: 'https://img3.doubanio.com/view/movie_poster_cover/spst/public/p2322954776.jpg'
			}
		]
	})*/
})

//admin page
app.get('/admin/movie',function(req,res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			lang: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id',function(req,res) {
	var id = req.params.id;

	if(id) {
		Movie.findById(id, function(err, movie) {
			res.render('admin', {
				title: 'imooc 后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie
app.post('/admin/movie/new', function(req,res) {
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
})
//detail page
app.get('/movie/:id',function(req,res) {
	var id = req.params.id;

	Movie.findById(id, function(err, movie) {
		err ? console.log(err) : res.render('detail', {
			title: 'imooc 详情页',
			movie: movie
		})
	})
	/*res.render('detail', {
		title: 'imooc 详情页',
		movie: {
			title: '疯狂动物城',
			_id: 1,
			doctor: '拜伦·霍华德',
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf?max_age=86400&v=20151010',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所,
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		}
	})*/
})

//list page
app.get('/admin/list',function(req,res) {
	Movie.fetch(function(err,movies) {
		if(err) console.log(err);

		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		})
	});
	/*res.render('list', {
		title: 'imooc 列表页',
		movies: [
			{
			title: '疯狂动物城',
			_id: 1,
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://www.iqiyi.com/w_19rt0wsk9p.html#vfrm=2-3-0-1',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所，
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		},
		{
			title: '疯狂动物城',
			_id: 2,
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://www.iqiyi.com/w_19rt0wsk9p.html#vfrm=2-3-0-1',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所，
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		},
		{
			title: '疯狂动物城',
			_id: 3,
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://www.iqiyi.com/w_19rt0wsk9p.html#vfrm=2-3-0-1',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所，
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		},
		{
			title: '疯狂动物城',
			_id: 4,
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://www.iqiyi.com/w_19rt0wsk9p.html#vfrm=2-3-0-1',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所，
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		},
		{
			title: '疯狂动物城',
			_id: 5,
			country: '美国',
			year: 2014,
			poster: 'https://img1.doubanio.com/view/movie_poster_cover/mpst/public/p2315672647.jpg',
			lang: '英语',
			flash: 'http://www.iqiyi.com/w_19rt0wsk9p.html#vfrm=2-3-0-1',
			summary: `疯狂动物城是一座独一无二的现代动物都市。每种动物在这里都有自己的居所，
				比如富丽堂皇的撒哈拉广场，或者常年严寒的冰川镇。它就像一座大熔炉，动物们在这里和
				平共处——无论是大象还是小老鼠，只要你努力，都能在此闯出一番名堂。不过乐观的警官兔朱迪
				（金妮弗·古德温 Ginnifer Goodwin 配音）却发现，作为史上第一任兔子警官，要和一群强硬的
				大块头动物警察合作可不是件容易事。为了证明自己，她决心侦破一桩神秘案件；追寻真相的路上
				她被迫与口若悬河、谎技高超的狐尼克（杰森·贝特曼 Jason Bateman 配音）联手，却发现这桩案
				件背后隐藏着一个意欲颠覆动物城的巨大阴谋……`
		}
		]
	})*/
})

//list delete movie
app.delete('/admin/list', function(req,res) {
	var id = req.query.id;

	if(id) {
		Movie.remove({_id: id}, function(err,movie) {
			err ? console.log(err) : res.json({success: 1});
		})
	}
})