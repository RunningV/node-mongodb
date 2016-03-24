var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var mongoStore = require('connect-mongo')(session);
//打印服务器返回日志
var morgan = require('morgan');
//读取海报文件：multipart/form-data
var multiparty = require('connect-multiparty');

var port = process.env.PORT || 3000;
var app = express();

var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.bodyParser());
/*todo: Most middleware (like bodyParser) 
**is no longer bundled with Express and
**must be installed separately.
*/
app.use(multiparty());
app.use(express.static(path.join(__dirname,'node_modules')));
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'session'
	})
}))

if('development' === app.get('env')) {
	app.set('showStakeError', true);
	app.use(morgan('tiny'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}

require('./config/route')(app);
app.listen(port)
app.use(express.static(path.join(__dirname, 'app')))

console.log('imooc started on...')