var mongoose 	= require('mongoose');
module.exports 	= mongoose.model('layout', {
		layOutName 		: 	{
				        		type: String
				    		},
		layOutId 		: 	{
				        		type: String
				    		},
		layOutType 		: 	{
				        		type: String
				    		},
		layOutTypeId	: 	{
				        		type: String
				    		},
});