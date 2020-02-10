var mongoose 	= require('mongoose');
module.exports 	= mongoose.model('Forms', {
    	object_id			: 	{
					        	type: String
					    	},
		object_name 		: 	{
				        		type: String
				    		},
		object_type		: 	{
				        		type: String
				    		},
		object_fields		: 	[
								{
									field_id 		: {type: String},
									field_title 	: {type: String},
									field_type 		: {type: String},
									field_data 		: {type: String},
									field_name 		: {type: String},
									field_value 	: {type: String},
									field_required 	: {type: String},
									field_disabled 	: {type: String},
									field_options 	: [
														{
															option_id 		: {type:String},
															option_title 	: {type:String},
															option_value 	: {type:String}
														}
													  ]
								}
							],
});