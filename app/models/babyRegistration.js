var mongoose 		= require('mongoose');
var BabyImgSchema  	=  require('./babyImages');
module.exports 	= mongoose.model('Baby', {
    	user_name			: 	{
					        	type: String
					    	},
		user_password	: 	{
				        		type: String
				    		},
		full_name		: 	{
				        		type: String,
				    		},
		user_email		: 	{
				        		type: String
				    		},
		user_phoneNo	: 	{
				        		type: String
				    		},
		user_doctorId	: 	{
				        		type: String
				    		},
});