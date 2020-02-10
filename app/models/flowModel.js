var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema,
ObjectId 		= Schema.ObjectId;
var User        =   require('./userModel');
module.exports 	= mongoose.model('Flow', {
		title	 		: 	{
				        		type: String
				    		},
		applicationType	: 	{
				        		type: String
				    		},
		applicationmodel: 	{
				        		type: String
				    		},
		parentId 		: 	ObjectId,

		icons	 		: 	{
				        		type: String
				    		},
		banner	 		: 	{
				        		type: String
				    		},
		backgroundImg	: 	{
				        		type: String
				    		},
		status	 		: 	{
				        		type: String
				    		},
		templateType	:   {
				        		type: String
				    		},
		message	 		: 	{
				        		type: String
				    		},
		bannerSize 		:   {
				        		type: String
				    		},
		screens			: 	[],
		service			: 	[],
});