var mongoose 	= require('mongoose');
var BabySchema  =  require('./babyRegistration');
module.exports 	= mongoose.model('BabyImages', {
    	baby_id			: 	{
					        	type: String,
					        	ref : 'Baby'
					    	},
		image_url 		: 	{
				        		type: String,
				        		ref : 'Baby'
				    		},
});