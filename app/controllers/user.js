var User = require('../models/user');

//user show signup
exports.showSignup = function(req,res) {
	res.render('signup', {
			title: '注册完成页面'
		})
}

//user show signin
exports.showSignin = function(req,res) {
	res.render('signin', {
			title: '登陆完成页面'
		})
}

//add signup
exports.signup = function(req,res) {
	var _user = req.body.user;

	User.findOne({name: _user.name},function(err,user) {
		if(err) console.log(err);

		if(user) return res.redirect('/signin');
		else {
			var user = new User(_user);
			user.save(function(err,user) {
				if(err) console.log(err);

				req.session.user = user;
				res.redirect('/');
			})
		}
	})
}

//add signin
exports.signin = function(req,res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password

	User.findOne({name: name},function(err,user) {
		if(err) console.log(err);

		if(!user) return res.redirect('/signup');

		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				console.log(err); 
			}

			if(isMatch) {
				console.log('signin success'); 
				req.session.user = user;
				return res.redirect('/');
			}
			else {
				console.log('password is wrong !');
				return res.redirect('/signin');
			}
		})
		
	})
}

//add logout
exports.logout = function(req,res) {
	delete req.session.user;
	//delete app.locals.user;

	res.redirect('/');
}

//userlist page
exports.users = function(req,res) {
	User.fetch(function(err,users) {
		if(err) console.log(err);

		res.render('users', {
			title: 'imooc 用户列表页',
			users: users
		})
	})
}

//midware for user
exports.signinRequired = function(req,res,next) {
	var user = req.session.user;

	if(!user) return res.redirect('/signin');
	
	next();
}

exports.adminRequired = function(req,res,next) {
	var user = req.session.user;

	if(user.role <= 10) return res.redirect('/signin');
	
	next();
}

//userslist delete
//todo: there is sth wrong with this method
exports.deleteUser =  function(req,res) {
	var id = req.query.id;

	if(id) {
		User.remove({_id: id}, function(err,user) {
			err ? console.log(err) : res.json({success: 1});
		})
	}
}