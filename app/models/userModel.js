var mongoose 	= require('mongoose');
var User  		=  require('./flowModel');
module.exports 	= mongoose.model('User', {
		name	 		: 	{
				        		type: String,
				        		ref : 'Flow'
				    		},
		userPassword	: 	{
				        		type: String
				    		},
		phoneNo	 		: 	{
				        		type: String
				    		},
		userType	 	: 	{
				        		type: String
				    		},
		playId	 		: 	{
				        		type: String
				    		},
});