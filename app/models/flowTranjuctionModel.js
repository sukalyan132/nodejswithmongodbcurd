var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema,
ObjectId 		= Schema.ObjectId;
module.exports 	= mongoose.model('Transaction', {
		applicationId	: 	{
				        		type: ObjectId,
				        		index: true
				    		},
		recentScreenName:  {
				        		type: String
				    		},
		
		nextScreenName	:  {
				        		type: String
				    		},
		actionByuserId 	:  ObjectId,
		dataOwner 	 	:  {
				        		type: String
				    		},
		currentOwner  	:  {
				        		type: String
				    		},
		data 			:  [],
		flowStatus		:  [],
		securityData	:  [],
		serviceData 	:  [],
		latlong 		:  [
								{
									latitude 	: {type: String},
									longitude 	: {type: String},
									timeStamp 	: {type : Date, default: Date.now },
								}
							],
});