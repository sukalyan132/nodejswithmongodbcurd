var mongoose 		= require('mongoose');
var Schema 			= mongoose.Schema,
ObjectId 			= Schema.ObjectId;
var User        	= require('./userModel');
var AppSchema 		= new Schema({
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
								});
var news 	 		= new Schema({
									 name 			: 	{
											        		type: String
											    		},
									description		: 	{
											        		type: String
											    		},
									});
var html 	 		= new Schema({
									 name 			: 	{
											        		type: String
											    		},
									description		: 	{
											        		type: String
											    		},
									});
var LayoutSchema 	= new Schema({
									 layOutTitle 	: 	{
											        		type: String
											    		},
									 layOutName 	: 	{
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
									html			:  [html],		
									news			:  [news],
									applications 	: 	[AppSchema],
									});

module.exports 	= mongoose.model('Page', {
										pageName 		: 	{
												        		type: String
												    		},
										isHomePage 		: 	{
												        		type: String
												    		},
											    		
										layouts			:  [LayoutSchema]
										
								});