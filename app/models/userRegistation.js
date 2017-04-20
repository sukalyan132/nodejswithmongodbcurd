var mongoose 	= require('mongoose');
module.exports 	= mongoose.model('User', {
    	user_name			: 	{
					        	type: String
					    	},
		user_password	: 	{
				        		type: String
				    		},
		full_name		: 	{
				        		type: String
				    		},
		user_email		: 	{
				        		type: String
				    		},
		user_phoneNo	: 	{
				        		type: String
				    		},
});