var express             =   require("express");
var fs                  =   require('fs');
var formidable          =   require('formidable');
var util                =   require('util');
var multer              =   require('multer');
var fileUpload          =   require('express-fileupload');
var bodyParser          =   require('body-parser');
var gcm                 =   require('node-gcm');
var async               =   require('async');
var xlsx                =   require('node-xlsx');
var XLSX                =   require('xlsx');
// require the module

// Model Url 
var Forms               =   require('./models/formModel');
var Flows               =   require('./models/flowModel');
var Tranjuction         =   require('./models/flowTranjuctionModel');
var User                =   require('./models/userModel');
var Group               =   require('./models/groupModel');
var DashboardImg        =   require('./models/dashboardImageModel');
var LoginImg            =   require('./models/loginPagModal');
var LayOut              =   require('./models/layoutModel');
var Feed                =   require('./models/newsFeedModel');
var Page                =   require('./models/pageModel');
//const OneSignalClient   =   require('node-onesignal').default;;
var OneSignal           = require('onesignal-node');
// create a new Client for a single app
var myClient = new OneSignal.Client({userAuthKey: 'ODA5NDllMzEtYmEyYy00YTNlLWJlMjYtMGYyMDczMzNkYTk4',
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: 'Yzc5YjM1MTAtZmJmOS00ZjcwLTgzZWQtNjkwZGQxMzVlZGNh', appId: 'e5851cd4-2278-4a20-84eb-d5d4b6b3f012' }
});
//const client            =   new OneSignalClient('e5851cd4-2278-4a20-84eb-d5d4b6b3f012', 'Yzc5YjM1MTAtZmJmOS00ZjcwLTgzZWQtNjkwZGQxMzVlZGNh');
//var onesignal           = require('node-opensignal-api');
//var onesignal_client    = onesignal.createClient();
////////////////////////////////////////////////////////////////////////////////
function getFormData(res)
{
    Forms.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
       
        res.json(todos); // return all todos in JSON format
    });
}
// flow data
function getFlowsData(res)
{
    Flows.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
}
//
module.exports = function (app) {
     app.use(express.static('uploads'));
    // create form
    app.post('/api/createForm',function(req,res){
        Forms.create({
            object_id       : req.body.form_id,
            object_name     : req.body.form_name,
            object_type     : req.body.object_type,
            object_fields   : req.body.form_fields,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getFormData(res);
        });
    })
    // All forms data
    app.post('/api/allFormsData',function(req,res){
            Forms.find({}, function(err, users) {
            res.json(users);  
          });
    })
    // ALL CHIELD APP
    app.post('/api/allChieldApplicationData',function(req,res){
        console.log(req.body);
         Flows.find({'parentId':req.body.id}, function(error, data){ 
            res.json(data); 
          });
          
    })
    // Delete  parent application  data
    app.post('/api/deleteFlows',function(req,res){
            Flows.find({'parentId':req.body.appData._id}, function(error, data){ 
                        //res.json(data); 
                        for(i=0;i<data.length;i++)
                        {
                            fs.unlink('./uploads/'+data[i].icons, (err) => {
                              if (err) throw err;
                              Flows.remove({_id: data[i]._id}, function (err, todo) {});
                            });
                        }
                        Flows.findById(req.body.appData._id, function(error, data)
                        {
                            fs.unlink('./uploads/'+data.icons, (err) => {
                              if (err) throw err;
                              Flows.remove({_id: req.body.appData._id}, function (err, todo) {
                                    if (err)
                                        res.send(err);
                                        Page.update({'layouts.applications._id': req.body.appData._id},{ $pull: { 'layouts.$.applications': { '_id': req.body.appData._id} } },function(err, data) {
                                            console.log(err);
                                            Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
                                                //console.log(data);
                                                res.json(data[0].layouts[0].applications); 
                                            })
                                        });
                                });
                            });
                            
                            //console.log(user);
                        })
                      });
            /*
            Flows.findById(req.body._id, function(error, data)
            {
                fs.unlink('./uploads/'+data.icons, (err) => {
                  if (err) throw err;
                  Flows.remove({_id: req.body._id}, function (err, todo) {
                        if (err)
                            res.send(err);
                             Flows.find({}, function(err, users) {
                                res.json(users);  
                              })
                    });
                });
                
                //console.log(user);
            })
            */
            
    })
    // Delete  child application  data
    app.post('/api/deleteChildFlows',function(req,res){
            Flows.findById(req.body._id, function(error, data)
            {
                fs.unlink('./uploads/'+data.icons, (err) => {
                  if (err) throw err;
                  Flows.remove({_id: req.body._id}, function (err, todo) {
                        if (err)
                            res.send(err);
                             Flows.find({'parentId':req.body.parentId}, function(error, data){ 
                                res.json(data); 
                              });
                    });
                });
                
                //console.log(user);
            })
            
    })
    // Particular data of flow
    app.post('/api/singleDataOfFlows',function(req,res){
            Flows.findById(req.body.id, function(error, data)
            {
                
                res.json(data); 
                //console.log(user);
            })
            
    })
    app.post('/api/saveFlowData',function(req,res){
        //console.log(req.body);
        Flows.create({
            title           : req.body.application_name,
            icons           : req.body.application_icon,
            templateType    : req.body.templateType,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

                res.json(todo); 
        });
    })
    // push data to purticular set
    app.post('/api/saveFlowDataStep2',function(req,res){
       //console.log(req.body);
       
       async.waterfall([
                        function(callback) {
                          Flows.findByIdAndUpdate(
                            req.body._id,
                            {$pull: {"screens": {$exists: true}}},
                            {safe: true, upsert: true, new : true},
                            function(err, model) {
                                console.log(err);
                                callback(null,null);
                            });
                          // in case to go to next function provide callback like this.
                          
                          
                        },
                      ],function(err,data) {
                           
                            if(!req.body.screens)
                            {
                                 console.log("screen values does not exists ");
                                Flows.findById(req.body._id,function(err,data){
                                    res.json(data);
                                })
                            }
                            else
                            {
                                console.log("screen values does exists ");
                                console.log(req.body.screens);
                                Flows.findByIdAndUpdate(
                                req.body._id,
                                {$push: {"screens": req.body.screens}},
                                {safe: true, upsert: true, new : true},
                                function(err, model) {
                                    console.log(err);
                                    res.json(model); 
                                });
                            }

                     
                        
                    });
       
       
    })
     // All forms data
    app.post('/api/allFlowData',function(req,res){
            Flows.find(function(err, users) {
               
            var data        =[];
            var response    = data.push(users);
             console.log(response);
            res.json(response);  
          });
    })
     // All forms data
    app.post('/api/allApplicationData',function(req,res){
          Flows.find({$or:[ {'applicationType':'single'}, {'applicationType':'multi'}]}, function(err, users){
            res.json(users);  
          });
    })
     // All users data
    app.post('/api/allUserData',function(req,res){
            //console.log("here");
          User.find(function(err, users){
           // console.log(users);
            res.json(users); 
          });
          
    })
     // All users data
    app.post('/api/perticularUserData',function(req,res){
           
          User.find({'name':req.body.name,'userPassword':req.body.password},function(err, users){
           // console.log(users);
           if(users.length>0)
           {
                User.findByIdAndUpdate(
                users[0]._id,
                {$set: {"playId": req.body.playId}},
                {safe: true, upsert: true, new : true},
                function(err, model) {
                    console.log(err);
                    //res.json(model); 
                });
             var returnData={"status":true,"userData":users[0]};
           }
           else
           {
             var returnData={"status":false,"userData":""};
           }
            res.json(returnData); 
          });
          
    })
     // find one user or group by id  
    app.post('/api/perticularDataById',function(req,res){
            //console.log("here");
           // res.status(404).send('no book found');
          User.find({'name':req.body.userOrGroup},function(err, users){
           // console.log(users);
            //res.json(users);
            if(users.length>0)
            {
                var resData = {"type":"user","data":users};
                res.json(resData);
            }
            else
            {
                Group.find({'name':req.body.userOrGroup},function(err, data){
                    console.log(data);
                    var resData = {"type":"group","data":data};
                    res.json(resData);
                })
            }   
          })
          
    })
     // Add user
    app.post('/api/addUserData',function(req,res){
        //console.log(req.body);
            User.create({
                    name            : req.body.userName,
                    userPassword    : req.body.userPassword,
                    phoneNo         : req.body.phoneNo,
                    userType        : req.body.userType,
                    playId          : req.body.playId,
                    done            : false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        console.log(todo);
                        res.json(todo);
                });
          
    })
     // Add group
    app.post('/api/addGroupData',function(req,res){
        //console.log(req.body);
            Group.create({
                    name            : req.body.groupName,
                    description     : req.body.description,
                    done            : false
                }, function (err, data) {
                    if (err)
                        res.send(err);
                        console.log(data);
                        //res.json(todo);
                });
          
    })
     // Add user to group
    app.post('/api/addUserToGroupData',function(req,res){
        console.log(req.body);
            Group.findByIdAndUpdate(
                                    req.body.id,
                                    {$push: {"members": req.body.member}},
                                    {safe: true, upsert: true, new : false},
                                    function(err, model) {
                                        console.log(err);
                                        res.json(model); 
                                    });
                                      
    })
    ////////////// App Dashboard Images //////////////////
    app.post('/api/saveAppDashboardImages',function(req,res){
        var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads/dashboardImg');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });
        var upload = multer({ storage: storage }).single('file');
        upload(req, res, function (err) 
        {
            if (err) 
            {
                console.log("Photo API ERROR: "+err);
                return res.end("Error uploading file.");
            }
            console.log("SUCCESS");
            DashboardImg.create({
                    imgUrl          : req.file.filename,
                    status          : 'deactivate',
                    description     : req.body.message,
                    bannerSize      : req.body.bannerSize,
                    appSetting      : req.body.appSetting,
                    done: false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        
                        res.json(todo); 
                        
                });
        })
    })
    //////////////// all dashboard images /////////////////////////
    app.post('/api/allDashboardImages',function(req,res){
        DashboardImg.find({},function(error,data){
            res.json(data);

        })

    })
    ///////////////// Delete dashboard Image /////////////
    app.post('/api/deleteDashboardImage',function(req,res){
        fs.unlink('./uploads/dashboardImg/'+req.body.imgUrl, (err) => {
          if (err) throw err;
          DashboardImg.remove({_id: req.body._id}, function (err, todo) {
                if (err)
                    res.send(err);
                     DashboardImg.find({}, function(error, data){ 
                        res.json(data); 
                      });
            });
        });
    })
    // /////////// active deactive status ////////////
    app.post('/api/changeImageStatus',function(req,res){
        if(req.body.status=='deactivate')
        {
            DashboardImg.findOneAndUpdate({'_id':req.body._id},{ $set: { "status" : req.body.status}},function(err,data){
                if(err)
                    res.send(err);
                    DashboardImg.find({}, function(error, data){ 
                            res.json(data); 
                          });
            })
        }
        else
        {
            DashboardImg.find({}, function(error, data){ 
               // console.log(data);
                
                    
                        DashboardImg.findOneAndUpdate({'_id':req.body._id},{ $set: { "status" : req.body.status}},{upsert: true, 'new': false},function(err,data){
                            if(err)
                                res.send(err);
                                DashboardImg.find({}, function(error, data){ 
                                    res.json(data); 
                                });
                        })
                
                    
              });
        }
        
    })
    // CHANGE VIEW TYPE OF APP DASHBOARD /////
    app.post('/api/changeViewType',function(req,res){
        async.waterfall([
                            function(callback) {
                              DashboardImg.findOneAndUpdate({'_id':req.body._id},{$set:{'appSetting':req.body.appSetting}}, function (err, todo) {
                                    if (err)
                                        res.send(err);
                              })
                              // in case to go to next function provide callback like this.
                              callback(null,valueForNextFunction);
                              
                            }
                          ],function(err,data) {
                            DashboardImg.find(function(error, data){ 
                                    res.json(data); 
                                  });
                        });
        
    })
    // Img api for Mobile end ///////////////
    app.post('/api/returnDashboardBannerImg',function(req,res){
        DashboardImg.findOne({'status':'activate'},function(err,data){
                if(err)
                    res.send(err);
                    res.json(data);
            })
    })
    // Img api for backgrounf img //////////////////
    app.post('/api/saveAppDashboardBackgroundImages',function(req,res){
        var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads/dashboardImg/bg');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });
        var upload = multer({ storage: storage }).single('file');
        upload(req, res, function (err) 
        {
            if (err) 
            {
                console.log("Photo API ERROR: "+err);
                return res.end("Error uploading file.");
            }
            console.log("SUCCESS");
            DashboardImg.findOneAndUpdate({'_id':req.body.bannerImgID},{$set:{'bgimgUrl':req.file.filename}}, function (err, todo) {
                    if (err)
                        res.send(err);
                        
                            DashboardImg.find(function(error, data){ 
                                res.json(data); 
                              });
                        
                });
        })
    })

    //////////////////////////////////////////
    //app.use(bodyParser.json());
    app.post('/api/saveFlowDataImageUpload',function(req,res){

             //console.log(JSON.parse(req.body.data)); // email and name here
   // console.log(req);

            var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });

            var upload = multer({ storage: storage }).single('file');
            //console.log(upload);
            upload(req, res, function (err) 
            {
                //console.log(req.file);
               // console.log(req.body);
                //return false;
                if (err) 
                {
                    console.log("Photo API ERROR: "+err);
                    return res.end("Error uploading file.");
                }
                //console.log("SUCCESS");
                //var img_url="http://192.168.1.188:3600/"+req.file.filename;
                //console.log(req.body);

                Flows.create({
                    title           : req.body.application_name,
                    applicationType : req.body.applicationType,
                    parentId        : req.body.parentId,
                    icons           : req.file.filename,
                    status          : req.body.status,
                    templateType    : req.body.templateType,
                    message         : req.body.message,
                    bannerSize      : req.body.bannerSize,
                    applicationmodel: req.body.applimodelType,
                    done: false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        if(req.body.clonType=='yes')
                        {
                            async.waterfall([
                            function(callback){
                                 Flows.find({'_id':req.body.clonAppName}, function(err, flow) {
                                        callback(null,flow); 
                                    })
                            },
                            function(data,callback){
                                console.log(data);
                                Flows.findOneAndUpdate({'_id':todo._id},{$set:{'screens':data[0].screens}}, function (err,data2) {
                                            if (err)
                                                res.send(err);
                                                callback(null,''); 
                                        });
                            },
                            ],function(err,data){
                                res.json(todo); 
                            }) 
                        }
                        else
                        {
                            res.json(todo); 
                        }
                        /*
                        if(req.body.applicationType)
                        {
                            Flows.find({$or:[ {'applicationType':'singel'}, {'applicationType':'multi'}]}, function(err, users) {
                            res.json(users);  
                          }) 
                        }
                        if(req.body.parentId)
                        {
                            Flows.find({'parentId':req.body.parentId}, function(error, data){ 
                                res.json(data); 
                              });
                        }
                        */
                });
               // res.json(img_url);
            });
            
        })
    ////////////////////////////////////////////////////
    app.post('/api/saveFlowDataBannerUpload',function(req,res){
        var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads/applicationImg');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });

            var upload = multer({ storage: storage }).single('file');
            //console.log(upload);
            upload(req, res, function (err) 
            {
                if (err) 
                {
                    console.log("Photo API ERROR: "+err);
                    return res.end("Error uploading file.");
                }
                //console.log("SUCCESS");
                //var img_url="http://192.168.1.188:3600/"+req.file.filename;
                //console.log(req.body);

                Flows.findOneAndUpdate({'_id':req.body.application_id},{$set:{'banner':req.file.filename}}, function (err, todo) {
                    if (err)
                        res.send(err);

                        res.json(todo); 
                        
                        
                });
            })
    })
    ////////////////// api for login image///////////////////////////////
    app.post('/api/submitAppLoginPageImageForm',function(req,res){
        var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });

            var upload = multer({ storage: storage }).single('file');
            //console.log(upload);
            upload(req, res, function (err) 
            {
                if (err) 
                {
                    console.log("Photo API ERROR: "+err);
                    return res.end("Error uploading file.");
                }
                LoginImg.create({
                    bgimgUrl    : req.file.filename,
                    done: false
                }, function (err, todo) {
                    LoginImg.find(function(error, data){ 
                                res.json(data); 
                              });
                })

                
            })
    })
    //////////////////// get login page bg image ////////////
    app.post('/api/loginPageBgImage',function(req,res){
        LoginImg.find(function(error, data){ 
                                res.json(data); 
                              });

    })
    /////////////////// delete login page image ///////
    app.post('/api/loginPageBgImageDelete',function(req,res){
        
        async.waterfall([
                        function(callback) {
                          fs.unlink('./uploads/'+req.body.bgimgUrl, (err) => {
                              if (err) throw err;
                              
                            });
                          // in case to go to next function provide callback like this.
                          callback(null,null);
                          
                        },
                        function(data,callback) {
                          LoginImg.remove({_id: req.body._id}, function (err, todo) {});
                          // in case to go to next function provide callback like this.
                          callback(null,null);
                          
                        },
                      ],function(err,data) {
                        LoginImg.find(function(error, data){ 
                                res.json(data); 
                              });
                        
                    });
    })
    ////////////////////////////////////////////////////
    app.post('/api/saveFlowDataBackgroundImageUpload',function(req,res){
        var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads/applicationImg/bg');
                },
                filename: function (req, file, callback) {
                //console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });

            var upload = multer({ storage: storage }).single('file');
            //console.log(upload);
            upload(req, res, function (err) 
            {
                if (err) 
                {
                    console.log("Photo API ERROR: "+err);
                    res.send(err);
                }
                //console.log("SUCCESS");
                //var img_url="http://192.168.1.188:3600/"+req.file.filename;
                //console.log(req.body);
                async.waterfall([
                        function(callback){
                            Flows.findOneAndUpdate({'_id':req.body.application_id},{$set:{'backgroundImg':req.file.filename}}, function (err, todo) {
                                        if (err)
                                            res.send(err);
                                        
                                        callback(null,todo._id);
                                    });
                             
                        },
                        function(data1,callback)
                        {
                            //console.log(data1 +"here");
                            Flows.find({'_id':data1},function(err,data){
                                if (err)
                                res.send(err);
                                //console.log(data);
                                Page.update({'layouts._id': req.body.lid},{$push:{'layouts.$.applications':data[0]}},function(err,data){
                                    callback(null,data);
                                })
                            })
                        }
                        ],function(err,data){
                            if(req.body.applicationType)
                            {
                                Flows.find({$or:[ {'applicationType':'single'}, {'applicationType':'multi'}]}, function(err, users) {
                                    res.json(users);  
                                }) 
                            }
                            if(req.body.parentId)
                            {
                                Flows.find({'parentId':req.body.parentId}, function(error, data){ 
                                    res.json(data); 
                                });
                            } 
                        })

                
            })
    })
    // save edit data
        app.post('/api/saveEditData',function(req,res){
            Tranjuction.findOneAndUpdate({'_id':req.body.applicationId},{$set:{'data':[]}}, function (err, todo) {
                    if (err)
                        res.send(err);

                        Tranjuction.findByIdAndUpdate(
                                    req.body.applicationId,
                                    {$push: {"data": req.body.data}},
                                    {safe: true, upsert: true, new : false},
                                    function(err, model) {
                                        console.log(err);

                                        
                                        Tranjuction.findById(req.body.applicationId,function(err, data) {
                                            console.log(data);
                                            res.json(data); 
                                        })
                                    }); 
                        
                        
                });
            
        })
    // save tranjuction for gps module data
    app.post('/api/saveFlowTranjuctionDataForGps',function(req,res){
        //console.log(req.body);
        
            //console.log(error);
           // console.log(data[0].screens[0][0]);
            //res.json(data);
            Flows.find({'applicationId':req.body.applicationId,'actionByuserId'  : req.body.userId,'nextScreenName': ''}, function(error, data){ 
                                //res.json(data); 
                                if(data.length>0)
                                {
                                    res.json(data); 
                                }
                                else
                                {
                                    Tranjuction.create({
                                        applicationId   : req.body.applicationId,
                                        recentScreenName: req.body.screenName,
                                        nextScreenName  : req.body.nextScreenName,
                                        actionByuserId  : req.body.userId,
                                        data            : req.body.data,
                                        //latlong         : req.body.data,
                                        //securityData    : data[0].screens[0][0].nodes.sequerty_data,
                                        done: false
                                    }, function (err, todo) {
                                        if (err)
                                            res.send(err);
                                            //console.log(todo);
                                            Flows.find({'_id':req.body.applicationId}, function(error, data)
                                            {
                                                /*Tranjuction.findBy(todo._id, { $set: { securityData: data[0].screens[0][0].nodes.sequerty_data}}, { new: true }, function (err, tank) {
                                                if (err) return handleError(err);
                                                //res.send(tank);
                                                    Tranjuction.find({}, function(err, data) {
                                                        res.json(data);  
                                                    })
                                                })
                                                */
                                                for(k=0;k<data[0].screens[0].length;k++)
                                                {
                                                    if(data[0].screens[0][k].nodes.sequerty_data)
                                                    {
                                                        var sequrityData=data[0].screens[0][k].nodes.sequerty_data;
                                                         console.log(sequrityData.length);
                                                         for(i=0;i<sequrityData.length;i++)
                                                         {
                                                            var accessType=sequrityData[i].accessType;
                                                            // for user only
                                                            if(sequrityData[i].type=='user')
                                                            {
                                                                /*
                                                                Tranjuction.findAndUpdate({'_id':todo._id,"securityData.uorgId" : { $ne: sequrityData[i].uorgId }},
                                                                {$push: {"securityData": sequrityData[i]}},
                                                                {safe: true, upsert: true, new : true},
                                                                function(err, model) {
                                                                    console.log(err);
                                                                    //res.json(model); 
                                                                });
                                                                */
                                                                Tranjuction.findByIdAndUpdate(
                                                                    todo._id,
                                                                    {$push: {"securityData": sequrityData[i]}},
                                                                    {safe: true, upsert: true, new : false},
                                                                    function(err, model) {
                                                                        console.log(err);
                                                                        //res.json(model); 
                                                                    });
                                                            }
                                                            else
                                                            {
                                                                // for group only
                                                                if(sequrityData[i].name=='All')
                                                                {
                                                                    var data6={"type" : "group","name" : sequrityData[i].name,"uorgId" : sequrityData[i].uorgId,"accessType":accessType}
                                                                    Tranjuction.findByIdAndUpdate(
                                                                    todo._id,
                                                                    {$push: {"securityData": data6}},
                                                                    {safe: true, upsert: true, new : false},
                                                                    function(err, model) {
                                                                        console.log(err);
                                                                        //res.json(model); 
                                                                    });
                                                                }
                                                                else
                                                                {
                                                                    Group.find({'_id':sequrityData[i].uorgId}, function(error, data4)
                                                                    {
                                                                        console.log(data4);
                                                                        for(j=0;j<data4[0].members.length;j++)
                                                                        {
                                                                            var data6={"type" : "user","name" : data4[0].members[j].name,"uorgId" : data4[0].members[j].userId,"accessType":accessType}
                                                                            Tranjuction.findByIdAndUpdate(
                                                                            todo._id,
                                                                            {$push: {"securityData": data6}},
                                                                            {safe: true, upsert: true, new : false},
                                                                            function(err, model) {
                                                                                console.log(err);
                                                                                //res.json(model); 
                                                                            });
                                                                        }
                                                                    })
                                                                }
                                                                
                                                            }
                                                            
                                                         }
                                                    }
                                                     
                                                }
                                                 
                                                res.json(todo);  
                                            })
                                        })
                                    }
            
                
                
    })
    
        /*
        Tranjuction.create({
                    applicationId   : req.body.applicationId,
                    recentScreenName: req.body.screenName,
                    nextScreenName  : req.body.nextScreenName,
                    data            : req.body.data,
                    done: false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        console.log(todo);

                        /*
                        Tranjuction.find({}, function(err, data) {
                            res.json(data);  
                          }) 
                          
                });
    */
               
    })
    // save tranjuction data
    app.post('/api/saveFlowTranjuctionData',function(req,res){
        //console.log(req.body.data[req.body.owner]);
        //return false;
        
            //console.log(error);
           // console.log(data[0].screens[0][0]);
            //res.json(data);
            
            Tranjuction.create({
                    applicationId   : req.body.applicationId,
                    recentScreenName: req.body.screenName,
                    nextScreenName  : req.body.nextScreenName,
                    actionByuserId  : req.body.userId,
                    data            : req.body.data,
                    dataOwner       : req.body.data[req.body.owner],
                    //securityData    : data[0].screens[0][0].nodes.sequerty_data,
                    done: false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        //console.log(todo);

                        Flows.find({'_id':req.body.applicationId}, function(error, data)
                        {
                            async.waterfall([
                                                function(callback) {
                                                
                                                    Tranjuction.findByIdAndUpdate(
                                                                                todo._id,
                                                                                {'$set':{'serviceData':data[0].screens[0][0].nodes.services}},
                                                                                function(err, model) {
                                                                                    console.log(err);
                                                                                    //res.json(model); 
                                                                                    callback(null,'');
                                                                                });
                                                },
                                                function(data1,callback) {
                                                    User.find({'_id':req.body.userId}, function(error, data)
                                                    {
                                                        var deviceId=[];
                                                        for(m=0;m<data.length;m++)
                                                        {
                                                            if(data[m].playId)
                                                            {
                                                                deviceId.push(data[m].playId);    
                                                            }
                                                        }
                                                        var firstNotification = new OneSignal.Notification({
                                                            contents: {
                                                                en: data[0].name+" Transaction have been Created successfully.",
                                                                tr: "Transaction Created"
                                                            }
                                                        });

                                                        // set target users
                                                        firstNotification.setTargetDevices(deviceId);

                                                        // send this notification to All Users except Inactive ones
                                                        myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
                                                           if (err) {
                                                               console.log('Something went wrong...');
                                                           } else {
                                                               console.log(data, httpResponse.statusCode);
                                                           }
                                                        });
                                                    })
                                                    callback(null,'');
                                                },
                                                function(data2,callback) {
                                                    for(k=0;k<data[0].screens[0].length;k++)
                                                    {
                                                        if(data[0].screens[0][k].nodes.sequerty_data)
                                                        {
                                                            var sequrityData=data[0].screens[0][k].nodes.sequerty_data;
                                                             console.log(sequrityData.length);
                                                             for(var i=0;i<sequrityData.length;i++)
                                                             {
                                                                var accessType=sequrityData[i].accessType;
                                                                // for user only
                                                                if(sequrityData[i].type=='user')
                                                                {
                                                                    
                                                                    Tranjuction.findByIdAndUpdate(
                                                                        todo._id,
                                                                        {$push: {"securityData": sequrityData[i]}},
                                                                        {safe: true, upsert: true, new : false},
                                                                        function(err, model) {
                                                                            console.log(err);
                                                                            //res.json(model); 
                                                                        });
                                                                }
                                                                else
                                                                {
                                                                    // for group only
                                                                    if(sequrityData[i].name=='All')
                                                                    {
                                                                        var data6={"type" : "group","name" : sequrityData[i].name,"uorgId" : sequrityData[i].uorgId,"accessType":accessType}
                                                                        Tranjuction.findByIdAndUpdate(
                                                                        todo._id,
                                                                        {$push: {"securityData": data6}},
                                                                        {safe: true, upsert: true, new : false},
                                                                        function(err, model) {
                                                                            console.log(err);
                                                                            //res.json(model); 
                                                                        });
                                                                    }
                                                                    else
                                                                    {
                                                                        Group.find({'_id':sequrityData[i].uorgId}, function(error, data4)
                                                                        {
                                                                            console.log(data4);
                                                                            for(j=0;j<data4[0].members.length;j++)
                                                                            {
                                                                                var data6={"type" : "user","name" : data4[0].members[j].name,"uorgId" : data4[0].members[j].userId,"accessType":accessType}
                                                                                Tranjuction.findByIdAndUpdate(
                                                                                todo._id,
                                                                                {$push: {"securityData": data6}},
                                                                                {safe: true, upsert: true, new : false},
                                                                                function(err, model) {
                                                                                    console.log(err);
                                                                                    //res.json(model); 
                                                                                });
                                                                            }
                                                                        })
                                                                    }
                                                                    
                                                                }
                                                                
                                                             }
                                                        }
                                                      if((data[0].screens[0].length-1) == k)
                                                      {
                                                        callback(null,'');
                                                      }   
                                                    }
                                                
                                                },
                                                ],function(err,data3) {
                                                
                                                    Tranjuction.find({'applicationId':req.body.applicationId,'securityData.uorgId':req.body.userId}, function(err, data) {
                                                        res.json(data);  
                                                    })

                                            });
                        })
                
                
        })
        /*
        Tranjuction.create({
                    applicationId   : req.body.applicationId,
                    recentScreenName: req.body.screenName,
                    nextScreenName  : req.body.nextScreenName,
                    data            : req.body.data,
                    done: false
                }, function (err, todo) {
                    if (err)
                        res.send(err);
                        console.log(todo);

                        /*
                        Tranjuction.find({}, function(err, data) {
                            res.json(data);  
                          }) 
                          
                });
    */
               
    })
    // show all tranjuction application wise
    app.post('/api/showAllDataApplicationwise',function(req,res){
        console.log(req.body);
        //return false;
        
        Tranjuction.find({'applicationId':req.body.id,'securityData': { $elemMatch : {'uorgId':req.body.userId}}}, function(err, data) {
         
                            if(data.length>0)
                            {
                                var data6=[];
                                for(i=0;i<data.length;i++)
                                {
                                    for(j=0;j<data[i].securityData.length;j++)
                                    {
                                        if(data[i].securityData[j].uorgId==req.body.userId)
                                        {
                                            var data8=data[i].securityData[j];
                                        }
                                    }
                                    var data7={"_id" : data[i]._id,"applicationId":data[i].applicationId,"data":data[i].data,"securityData":data8,"nextScreenName":data[i].nextScreenName,"latlongData":data[i].latlong,"serviceData":data[i].serviceData};
                                    data6.push(data7);
                                }
                                res.json(data6); 
                                
                            }
                             else
                             {
                                Tranjuction.find({'applicationId':req.body.id,'securityData.name':'All'}, function(err, data){
                                    var data6=[];
                                    for(i=0;i<data.length;i++)
                                    {
                                        for(j=0;j<data[i].securityData.length;j++)
                                        {
                                            if(data[i].securityData[j].name=='All')
                                            {
                                                var data8=data[i].securityData[j];
                                            }
                                        }
                                        var data7={"_id" : data[i]._id,"applicationId":data[i].applicationId,"data":data[i].data,"securityData":data8,"nextScreenName":data[i].nextScreenName,"latlongData":data[i].latlong,"serviceData":data[i].serviceData};
                                        data6.push(data7);
                                    }
                                    res.json(data6);  
                                })
                             }
                          })
    })
    // user data aggregate
    app.post('/api/allUserDataFromUserTable',function(req,res){
        
        ///////////////////////////////////////////
        User.find(function(error, data){ 
                                res.json(data); 
                              });
               
    })
    // group data
    // user data aggregate
    app.post('/api/allGroupDataFromGroupTable',function(req,res){
        
        ///////////////////////////////////////////
        Group.find(function(error, data){ 
                                res.json(data); 
                              });
               
    })
    // save tranjuction gps data one by one data//
    app.post('/api/saveFlowTranjuctionDataForGpsTrackingData',function(req,res){
        //console.log("here");
        Tranjuction.findByIdAndUpdate(
                                        req.body.id,
                                        {$push: {"latlong": req.body.latlongData}},
                                        {safe: true, upsert: true, new : false},
                                        function(err, model) {
                                            console.log(err);
                                            res.json(model); 
                                        });
    })
     // stop and clear tranjuction gps data array //
    app.post('/api/cleanFlowTranjuctionDataForGpsTrackingData',function(req,res){
        Tranjuction.findByIdAndUpdate(
                                        req.body.id,
                                         {$set: { "latlong": [] }},
                                        {safe: true, upsert: true, new : false},
                                        function(err, model) {
                                            console.log(err);
                                            res.json(model); 
                                        });
    })
     // find one tranjuction data //
    app.post('/api/showOneTranjuctionData',function(req,res){
        Tranjuction.findById(req.body.id,function(err, data) {
                                    console.log(err);
                                    res.json(data); 
                                });
    })
    // push plugin check
     // find one tranjuction data //
    app.post('/api/testPushNotification',function(req,res){
        // send a notification 
       /* var notify=client.sendNotification('test notification', {
            included_segments: 'all'
        });*/
            // you can set limit and offset (optional) or you can leave it empty
       /* myClient.viewDevices('limit=100&offset=0', function (err, httpResponse, data) {
            //var data=JSON.stringify(data);
            console.log(httpResponse.body.players)
            return false;
                    var firstNotification = new OneSignal.Notification({
                    contents: {
                        en: "Test notification",
                        tr: "Test mesajı"
                    }
                });

                firstNotification.setTargetDevices(["1dd608f2-c6a1-11e3-851d-000c2940e62c", 
                    "2dd608f2-c6a1-11e3-851d-000c2940e62c"]);
                    
                myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
                   if (err) {
                       console.log('Something went wrong...');
                   } else {
                       console.log(data);
                   }
                });
        });*/
        // we need to create a notification to send
        var firstNotification = new OneSignal.Notification({
            contents: {
                en: "Test notification",
                tr: "Test mesajı"
            }
        });

        // set target users
        firstNotification.setTargetDevices(["f682817c-ff2c-4d3d-8a3f-6d7e9e4715d0"]);

        // send this notification to All Users except Inactive ones
        myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
           if (err) {
               console.log('Something went wrong...');
           } else {
               console.log(data, httpResponse.statusCode);
           }
        });
        res.json("success");
    })
    // save layout type
    app.post('/api/saveLayoutData',function(req,res){
        var layoutName;
        var layoutType;
        var passData=[];
        async.waterfall([
                        function(callback) {
                          if(req.body.type==1)
                          {
                            layoutName="Application With Grid  View";
                            layoutType="Grid";
                          }
                          if(req.body.type==2)
                          {
                            layoutName="Application With List View";
                            layoutType="List";
                          }
                          if(req.body.type==3)
                          {
                            layoutName="News Feed";
                            layoutType="Feed";
                          }
                          if(req.body.type==4)
                          {
                            layoutName="Html Display";
                            layoutType="Html";
                          }
                          passData.push(layoutName);
                          passData.push(layoutType);
                          // in case to go to next function provide callback like this.
                          callback(null,passData);
                          
                        },
                        function(data,callback) {
                        Page.findByIdAndUpdate(
                                        req.body.id,
                                        {$push: {"layouts": {layOutTitle:req.body.title,layOutName:data[0],layOutId:req.body.for,layOutType:data[1],layOutTypeId:req.body.type}}},
                                        {safe: true, upsert: true, new : false},
                                        function(err, model) {
                                            console.log(err);
                                            callback(null,'');
                                        });
                        },
                      ],function(err,data) {
                            Page.find({'_id':req.body.id},function(err, data1) {
                                res.json(data1[0].layouts);  
                              })
                        
                        
                    });
    })
// all layout type
app.post('/api/allLayoutOfPerticularPage',function(req,res){
        Page.find({'_id':req.body.id},function(err, data) {
                            console.log(err);
                            res.json(data); 
                        });
    })
/////////// pericular layout
// all layout type
app.post('/api/perticularTypeallLayoutList',function(req,res){
        console.log(req.body);
        var allLayout=[];
        async.waterfall([
                            function(callback) {
                              LayOut.find({'layOutType':req.body.type},function(err, data) {
                                    console.log(err);

                                    //console.log(data);
                                    if(data.length>0)
                                    {
                                        callback(null,data); 
                                    }
                                    else
                                    {
                                        callback(null,'');
                                    }
                                    
                                });
                              // in case to go to next function provide callback like this.
                              
                              
                            },
                            function(data,callback) {
                                for(var i=0;i<data.length;i++)
                                {
                                    console.log(data[i]._id +"here");
                                    Flows.find({'layoutType':data[i]._id},function(err, data1) {

                                        for(var k=0;k<data1.length;k++)
                                        {
                                            allLayout.push(data1[k]);
                                        } 
                                      })
                                }
                                callback(null,allLayout); 
                            },
                          ],function(err,data) {
                                console.log(data);
                                
                               // res.json(allLayout);
                                
                            });
        
    })
/////// delete layout //////////////////
    app.post('/api/deleteLayout',function(req,res){
        
        async.waterfall([
                            function(callback) {
                              
                              // in case to go to next function provide callback like this.
                              if(req.body.layoutData.applications.length>0)
                              {
                                for(i=0;i < req.body.layoutData.applications.length;i++)
                                {
                                    //console.log("here2");
                                    Flows.remove({'_id': req.body.layoutData.applications[i]._id}, function (err, todo) {
                                        console.log(err);
                                    })
                                    if((req.body.layoutData.applications.length-1) == i)
                                    {
                                        callback(null,'');
                                    }
                                }
                              }
                              else
                              {
                                callback(null,'');
                              }
                              
                              
                            },
                            function(data,callback){
                                Page.update({'_id':req.body.id},{ $pull: { 'layouts': { '_id': req.body.layoutData._id} } },function(err, data) {
                                    console.log(err);
                                    //res.json(data); 
                                    callback(null,'');
                                });
                                //callback(null,'');
                            },
                          ],function(err,data) {
                                Page.find({'_id':req.body.id},function(err, data1) {
                                    res.json(data1[0].layouts);  
                                  })
                            });
    })
/////////////// change view type /////////////////////
    app.post('/api/changeLayoutViewType',function(req,res){
        var layOutType;

        async.waterfall([
                        function(callback) {
                            if(req.body.layOutType=='Grid')
                            {
                                layOutType='List'; 
                            }
                            else
                            {
                                layOutType='Grid';
                            }
                          LayOut.findOneAndUpdate({'_id':req.body._id},{'$set':{'layOutType':layOutType}},function(err, data) {
                                console.log(err);
                                //res.json(data); 
                                callback(null,'');
                            });
                          // in case to go to next function provide callback like this.
                          
                          
                        },
                      ],function(err,data) {

                            LayOut.find(function(err, data1) {
                                res.json(data1);  
                              })
                        });
    })
    ///////// create page ////////////
    app.post('/api/createPage',function(req,res){
        async.waterfall([
                        function(callback){
                            Page.create({
                                            pageName        : req.body.pageName,
                                            //securityData    : data[0].screens[0][0].nodes.sequerty_data,
                                            done: false
                                        }, function (err, todo) {
                                            callback(null,'');
                                        })
                        },

                        ],function(err,data){
                            Page.find(function(err,data1){
                                res.json(data1);  
                            })
                        })
    })
////////////////////// all page list //////////////
    app.post('/api/allPageList',function(req,res){
        Page.find(function(err,data){
           res.json(data); 
        })
    })
///////////////////////// delete page //////////////
    app.post('/api/deletePage',function(req,res){
        //;console.log(req.body);
        //return false;
        
        async.waterfall([
                        function(callback){
                            for(i=0;i < req.body.layouts.length;i++)
                            {
                                if(req.body.layouts[i].applications.length>0)
                                {
                                    //console.log("here");
                                    for(j=0;j < req.body.layouts[i].applications.length;j++)
                                    {
                                        //console.log("here2");
                                        Flows.remove({'_id': req.body.layouts[i].applications[j]._id}, function (err, todo) {
                                            console.log(err);
                                        })
                                    }
                                }
                                if((parseInt(req.body.layouts.length)-1)==i)
                                {
                                    //console.log("here3");
                                    callback(null,'');
                                }
                            }
                            
                        },
                        function(data,callback){
                            Page.remove({_id: req.body._id}, function (err, todo) {
                                 callback(null,'');
                            })
                        },
                        ],function(err,data){
                            Page.find(function(err,data1){
                                res.json(data1);  
                            })
                        })
    })    

////////////////////// all page list //////////////
    app.post('/api/perticularPagedata',function(req,res){
        //console.log(req.body+"here");
        Page.find({'_id':req.body.pageId},function(err,data){
           res.json(data[0]); 
        })
    })
///////////////////////// all application data page wise ////////
    app.post('/api/layoutApplicationData',function(req,res){
        Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
            //console.log(data);
            res.json(data[0].layouts[0].applications); 
        })
    })
///////////////////// add news feed /////////////////////////
    app.post('/api/saveNewsFeedData',function(req,res){
        
        async.waterfall([
                        function(callback){
                            Page.update({'layouts._id': req.body.lid},{$push:{'layouts.$.news':req.body.data}},function(err,data){
                                callback(null,data);
                            })
                        },

                        ],function(err,data){
                            Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
                                //console.log(data);
                                res.json(data[0].layouts[0].news); 
                            })
                        })
    })
///////////////////////// all news data page wise ////////
    app.post('/api/allNewsData',function(req,res){
        Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
            //console.log(data+"here");
            res.json(data[0].layouts[0].news); 
        })
    })
/////////////////////// save news data ////////////////////
    app.post('/api/saveHtmlData',function(req,res){
        async.waterfall([
                        function(callback){
                            Page.update({'layouts._id': req.body.lid},{$push:{'layouts.$.html':req.body.data}},function(err,data){
                                callback(null,data);
                            })
                        },

                        ],function(err,data){
                            Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
                                //console.log(data);
                                res.json(data[0].layouts[0].html); 
                            })
                        })
    })
///////////////////////// all html data page wise ////////
    app.post('/api/htmlData',function(req,res){
        Page.find({'_id':req.body.pid},{ 'layouts' : { $elemMatch: { '_id': req.body.lid } } },function(err,data){
            //console.log(data+"here");
            res.json(data[0].layouts[0].html); 
        })
    })
/////////////////////// add service data to tranjuction ////////////
    app.post('/api/addServiceDataToTransaction',function(req,res){
        //console.log(req.body);
        async.waterfall([
                        function(callback){
                            if(req.body.createArray==1 || req.body.createArray=='1')
                            {
                                //console.log("here2");
                                Tranjuction.findByIdAndUpdate(
                                    req.body.tData,
                                    {$pull: {"serviceData": {$exists: true}}},
                                    {safe: true, upsert: true, new : true},
                                    function(err, model) {
                                        console.log(err);
                                    });
                                    for(i=0;i<req.body.serviceDetails.length;i++)
                                    {
                                        Tranjuction.update({'_id':req.body.tData},{$push:{'serviceData':req.body.serviceDetails[i]}},function(err,data){
                                         })
                                        if((req.body.serviceDetails.length-1) == i)
                                        {
                                            callback(null,'');
                                        }
                                    }
                                /*
                                Tranjuction.findOneAndUpdate({'_id':req.body.tData},{'$set':{'serviceData':req.body.serviceDetails}},function(err, data) {
                                    console.log(err);
                                    //res.json(data); 
                                    callback(null,'');
                                });
                                */
                                
                            }
                            else
                            {
                                //console.log("here1");
                                Tranjuction.update({'serviceData.service_name':req.body.serviceDetails[req.body.index].service_name},{$push:{'serviceData.$.tranjuctionData':req.body.data}},function(err,data){
                                    //console.log(err);
                                    //console.log(data);
                                    callback(null,'');
                                })
                            }
                            //callback(null,'');
                        },

                        ],function(err,data){
                            //console.log(req.body.tData+"here");
                             //console.log(req.body.tData+"here");
                            Tranjuction.find({'_id':req.body.tData},function(err,data3){
                                 console.log(data3);
                                User.find({'name':data3[0].dataOwner},function(err,data5){
                                    //console.log(data5);
                               // return false;
                                var deviceId=[];
                                deviceId.push(data5[0].playId);  
                                var firstNotification = new OneSignal.Notification({
                                                            contents: {
                                                                en: " You have one message.",
                                                                tr: "Message"
                                                            }
                                                        });

                                                        // set target users
                                                        firstNotification.setTargetDevices(deviceId);

                                                        // send this notification to All Users except Inactive ones
                                                        myClient.sendNotification(firstNotification, function (err, httpResponse,data) {
                                                           if (err) {
                                                               console.log('Something went wrong...');
                                                           } else {
                                                               console.log(data, httpResponse.statusCode);
                                                           }
                                                        });
                                })
                                
                            })
                            Tranjuction.find({'_id':req.body.tData,'serviceData.service_name':req.body.serviceDetails[req.body.index].service_name},function(err,data2){
                                    //console.log(data2);
                                    res.json(data2[0].serviceData[req.body.index]); 
                                })
                        })
    })
    ////////////////// ALL TRANJUCTION LIST FOR ONE SERVICES ///////////
    app.post('/api/allTranjuctionListForPerticularService',function(req,res){
        Tranjuction.find({'_id':req.body.tData,'serviceData.service_name':req.body.serviceDetails[req.body.index].service_name},function(err,data2){
                        //console.log(data2);
                        res.json(data2[0].serviceData[req.body.index]); 
                    })
    })
    ///////////////////////// create excel file /////////////////
    app.post('/api/createExcelFormat',function(req,res){
        async.waterfall([
                        function(callback){
                            var jsn         = [];
                            var dataRecive  ={}
                            var data        ='';
                            for(i=0;i< req.body.nodes.form_data.length;i++)
                            {
                                //dataRecive[req.body.nodes.form_data[i].field_title] = '';
                                data+=req.body.nodes.form_data[i].field_title+"\t";
                            }
                            data+="actionByuserId"+"\t";
                            //data+="CreatedBy"+"\t";
                            fs.truncate('./uploads/DataFormat.xls', 0, function(){
                                                                                    console.log('done');
                                                                                    callback(null,data);
                                                                                })
                        },

                        ],function(err,data){
                            fs.appendFile('./uploads/DataFormat.xls', data, (err,data) => {
                                if (err) throw err;
                                console.log(data);
                                /*
                                res.setHeader('Content-Type', 'xls');
                                res.setHeader('Content-Disposition','attachment;filename=DataFormat.xls');
                                // var readStream = fileSystem.createReadStream('../Filename.xls');
                                  //res.sendfile('../Filename.xls');
                                  var filestream = fs.createReadStream('./DataFormat.xls');
                                    filestream.pipe(res);
                                    */
                                res.json({'data':'success'}); 
                             });
                        })

        
    })
    ////////////////////////////////  save exel data ///////////////
    app.post('/api/saveExcelDataToDb',function(req,res){
        //console.log(req.body);


            async.waterfall([
                        function(callback){
                                var storage = multer.diskStorage({
                                destination: function (req, file, callback) {
                                callback(null, './uploads');
                                },
                                filename: function (req, file, callback) {
                                //console.log(file.fieldname);
                                callback(null, file.fieldname + '-' + Date.now()+".xls");
                                }
                            });

                            var upload = multer({ storage: storage }).single('file');
                            //console.log(upload);
                            upload(req, res, function (err) 
                            {
                                //console.log(req.file);
                                //console.log(req.body);
                                if (err) 
                                {
                                    //console.log("Photo API ERROR: "+err);
                                    return res.end("Error uploading file.");
                                }
                                var workbook = XLSX.readFile('./uploads/'+req.file.filename);
                                var sheet_name_list = workbook.SheetNames;
                                var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
                                //console.log(xlData);

                                for(i=0;i<xlData.length;i++)
                                {
                                    Tranjuction.create({
                                    applicationId   : req.body.application_data._id,
                                    recentScreenName: req.body.application_data.screens[0][0].title,
                                    nextScreenName  : req.body.application_data.screens[0][0].nodes.action_fields_for_form[0].next_screen,
                                    serviceData     : req.body.application_data.screens[0][0].nodes.services,
                                    data            : xlData[i],
                                    securityData    : req.body.application_data.screens[0][0].nodes.sequerty_data,
                                    done: false
                                    }, function (err, todo) {
                                        if (err)
                                            res.send(err);
                                       
                                    })
                                    if((xlData.length-1) == i)
                                    {
                                        callback(null,'');
                                    }
                                }
                            });
                        },
                        function(data,callback){
                            fs.unlink('./uploads/'+req.file.filename, (err) => {
                              if (err) throw err;
                              callback(null,'');
                            });
                        },
                        ],function(err,data){
                            res.json({'data':'success'}); 
                        })
    })
//////////////// Update application images ////////////////////
    app.post('/api/editApplicationBannerImages',function(req,res){
                        async.waterfall([
                            function(callback){
                                var storage = multer.diskStorage({
                                    
                                    destination: function (req, file, callback) {
                                        //console.log(req.body.internalUserID) // YAY, IT'S POPULATED
                                        callback(null, './uploads/applicationImg/')
                                      },                    
                                      filename: function (req, file, callback) {
                                        callback(null, file.fieldname + '-' + Date.now()+".png")
                                      }
                                   
                                });

                                var upload2 = multer({ storage: storage }).single('file');
                                //console.log(upload);
                                upload2(req, res, function (err) 
                                {
                                   // console.log(req);
                                    //return false;
                                   Flows.find({'_id':req.body.appId},function(err,data5){
                                        
                                        //return false;
                                        fs.unlink("./uploads/applicationImg/"+data5[0][req.body.type], (err) => {
                                          if (err) throw err;
                                    
                                            Flows.findByIdAndUpdate(
                                                req.body.appId,
                                                {"banner": req.file.filename},
                                                {safe: true, upsert: true, new : true},
                                                function(err, model) {
                                                    console.log(err);
                                                    
                                                    Page.update({'layouts.applications._id':req.body.appId},{ $pull: { 'layouts.$.applications': { '_id': req.body.appId} } },function(err, data1) {
                                                            console.log(err);
                                                            //console.log(model); 
                                                            Page.update({'_id':req.body.pageId,'layouts._id':req.body.layoutId},
                                                                                    {$push: {"layouts.$.applications": model}},
                                                                                    {safe: true, upsert: true, new : true},
                                                                                    function(err, model) {
                                                                                        console.log(err);
                                                                                       callback(null,{'pId':req.body.pageId,'lId':req.body.layoutId});
                                                                                    });
                                                            
                                                        });
                                                });
                
                                            
                                        });
                                    })
                                })
                                
                            },
                        ],function(err,data2){
                            console.log(data2);
                            //return false;
                            Page.find({'_id':data2.pId},{ 'layouts' : { $elemMatch: { '_id': data2.lId } } },function(err,data){
                                //console.log(data);
                                res.json(data[0].layouts[0].applications); 
                            }) 
                        })

    })
//////////////////////////////////////////////////////////////////
    app.post('/api/editApplicationBgImages',function(req,res){
        async.waterfall([
                    function(callback){
                        var storage = multer.diskStorage({
                            
                            destination: function (req, file, callback) {
                                //console.log(req.body.internalUserID) // YAY, IT'S POPULATED
                                callback(null, './uploads/applicationImg/bg/')
                              },                    
                              filename: function (req, file, callback) {
                                callback(null, file.fieldname + '-' + Date.now()+".png")
                              }
                           
                        });

                        var upload2 = multer({ storage: storage }).single('file');
                        //console.log(upload);
                        upload2(req, res, function (err) 
                        {
                           // console.log(req);
                            //return false;
                           Flows.find({'_id':req.body.appId},function(err,data5){
                                
                                //return false;
                                fs.unlink("./uploads/applicationImg/bg/"+data5[0][req.body.type], (err) => {
                                  if (err) throw err;
                            
                                    Flows.findByIdAndUpdate(
                                        req.body.appId,
                                        {"backgroundImg": req.file.filename},
                                        {safe: true, upsert: true, new : true},
                                        function(err, model) {
                                            console.log(err);
                                            
                                            Page.update({'layouts.applications._id':req.body.appId},{ $pull: { 'layouts.$.applications': { '_id': req.body.appId} } },function(err, data1) {
                                                    console.log(err);
                                                    //console.log(model); 
                                                    Page.update({'_id':req.body.pageId,'layouts._id':req.body.layoutId},
                                                                            {$push: {"layouts.$.applications": model}},
                                                                            {safe: true, upsert: true, new : true},
                                                                            function(err, model) {
                                                                                console.log(err);
                                                                               callback(null,{'pId':req.body.pageId,'lId':req.body.layoutId});
                                                                            });
                                                    
                                                });
                                        });
        
                                    
                                });
                            })
                        })
                        
                    },
                ],function(err,data2){
                    console.log(data2);
                    //return false;
                    Page.find({'_id':data2.pId},{ 'layouts' : { $elemMatch: { '_id': data2.lId } } },function(err,data){
                        //console.log(data);
                        res.json(data[0].layouts[0].applications); 
                    }) 
                })

    })
///////////////////////// create service for perticular tranjuction ///////////
    app.post('/api/saveServiceDataInTranjuction',function(req,res){
        

                Tranjuction.findByIdAndUpdate(
                            req.body._id,
                            {$push: {"serviceData": req.body.tranjuctionDta}},
                            {safe: true, upsert: true, new : false},
                            function(err, model) {
                                console.log(err);

                                
                                Tranjuction.findById(req.body._id,function(err, data) {
                                    //console.log(data);
                                    res.json(data); 
                                    
                                })
                            }); 
                        
                        
                
    })
};
