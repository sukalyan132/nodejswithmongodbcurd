var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema,
ObjectId 		= Schema.ObjectId;
module.exports 	= mongoose.model('newsFeed', {
		nameOfFeed 		: 	ObjectId,
		newsFeedContent :  {
				        		type: String
				    		},
		
		layoutType 		: 	ObjectId,
		
});