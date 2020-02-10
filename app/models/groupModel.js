var mongoose 	= require('mongoose');
module.exports 	= mongoose.model('Group', {
		name	 		: 	{
				        		type: String
				    		},
		description		: 	{
				        		type: String
				    		},
		members 	 	: 	[],
});