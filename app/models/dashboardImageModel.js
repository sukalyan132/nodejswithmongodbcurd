var mongoose 	= require('mongoose');
module.exports 	= mongoose.model('dashBoardImage', {
		imgUrl	 		: 	{
				        		type: String
				    		},
		bgimgUrl	 	: 	{
				        		type: String
				    		},
		description	 	: 	{
				        		type: String
				    		},
		status			: 	{
				        		type: String
				    		},
		bannerSize	 	: 	{
				        		type: String
				    		},
		appSetting	 	: 	{
				        		type: String
				    		},
});