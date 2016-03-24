var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Cates = require('../app/controllers/catetory');

module.exports = function(app) {
	//pre handle user data
	app.use(function(req, res, next) {
		app.locals.user = req.session.user;
		
		next();
	})

	//index page
	app.get('/', Index.index)

	//admin add movie page
	app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.movie)
	//admin update movie
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.updateMovie)
	//admin post movie
	app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.savePoster, Movie.saveMovie)
	//detail page
	app.get('/movie/:id', Movie.detailMovie)
	//list page
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.movieList)
	//list delete movie
	app.delete('/admin/movie/delete', User.signinRequired, User.adminRequired, Movie.deleteMovie)

	//user signin
	app.get('/signin', User.showSignin)
	//user signout
	app.get('/signup', User.showSignup)
	//userlist page
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.users)
	//add signup
	app.post('/user/signup', User.signup)
	//add signin
	app.post('/user/signin', User.signin)
	//add logout
	app.get('/logout', User.logout)
	//userslist delete movie
	app.delete('/admin/user/delete', User.deleteUser)

	//comment
	app.post('/user/comment', User.signinRequired, Comment.save)

	//cates
	app.get('/admin/cates/new', User.signinRequired, Cates.newCate)
	app.post('/admin/cates', User.signinRequired, Cates.save)
	app.get('/admin/cates/list', User.signinRequired, Cates.cateList)

	app.get('/results', Index.search)
}