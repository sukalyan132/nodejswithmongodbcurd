var cors 			= 	require('cors');
var express 		= 	require("express");
var app				= 	express();
var mongoose		=	require('mongoose');
var morgan			=	require('morgan');
var bodyParser		=	require('body-parser');
var methodOverride	=	require('method-override');
var fs       		= 	require('fs');
var formidable 		= 	require('formidable');
var util 			= 	require('util');
var multer 			= 	require('multer');
var path 			= 	require('path');
var port    		=   process.env.PORT || 3600;
var database 		= 	require('./config/database'); 	
var router 			= 	express.Router(); 
var fileUpload  	= 	require('express-fileupload');
var serveStatic 	= 	require('serve-static');
var async 			= 	require("async");
app.use(cors());
app.use(bodyParser.json());
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
/***************************************************/
mongoose.connect(database.localUrl);
app.use(morgan('dev')); // log every request to the console
app.use(serveStatic('./uploads'));
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
 
/***********************************************************/
/*
router.post('/', function(req, res) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type');
	console.log(req);
    res.json({ message: 'hooray! welcome to our api!' });   
});
app.use('/api', router);
*/

app.use(express.static('uploads'))
app.use ( express.static ( __dirname + "/public" ) );
app.use(express.static('uploads'));
require('./app/routes.js')(app);
//app.post('/api', router);

app.listen(port,function(){
	console.log("server created "+port);
})