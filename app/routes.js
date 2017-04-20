var express         =   require("express");
var fs              =   require('fs');
var formidable      =   require('formidable');
var util            =   require('util');
var multer          =   require('multer');
// Model Url 
var Todo            =   require('./models/todo');
var User            =   require('./models/userRegistation');
var Baby            =   require('./models/babyRegistration');
var BabyImages      =   require('./models/babyImages');
function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};
function getUser(res) {
    User.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};
function getUser(res) {
    User.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};
function getBabys(res)
{
    Baby.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
}
module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    /*app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });*/
    //app.get('/uploads', express.static('/'))
    app.use(express.static('uploads'));
    // user routs
    app.post('/api/userRegistation', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        //console.log(req.body);
       // var parice= {parts_name:req.body.parts,parts_price:req.body.price};
       
        User.create({
            user_name       : req.body.username,
            user_password   : req.body.password,
            full_name       : req.body.fullName,
            user_email      : req.body.email,
            user_phoneNo    : req.body.phone,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getUser(res);
        });
        

    });
    // doctor login
    app.post('/api/doctorLogin',function(req,res){
        User.findOne({user_name: req.body.username,user_password:req.body.password}, function(err,obj) { 
            console.log(obj); 
            if(obj=='null' || obj==null)
            {
                res.status(201).json({ error: "User not in our db" });
            }
            else
            {
                res.json(obj);
            }
        });
    })
    //fetch all data
    app.post('/api/allDoctor',function(req,res){
            User.find({}, function(err, users) {
            res.json(users);  
          });
    })
    // Baby registration
    app.post('/api/babyRegistation', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        //console.log(req.body);
       // var parice= {parts_name:req.body.parts,parts_price:req.body.price};
       
        Baby.create({
            user_name       : req.body.username,
            user_password   : req.body.password,
            full_name       : req.body.fullName,
            user_email      : req.body.email,
            user_phoneNo    : req.body.phone,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getBabys(res);
        });
        

    })
    // doctor login
    app.post('/api/babyLogin',function(req,res){
        Baby.findOne({user_name: req.body.username,user_password:req.body.password}, function(err,obj) { 
            console.log(obj); 
            if(obj=='null' || obj==null)
            {
                res.status(201).json({ error: "User not in our db" });
            }
            else
            {
                res.json(obj);
            }
        });
    })
    // doctor login
    app.post('/api/babyImageUpload',function(req,res){
            
            var storage = multer.diskStorage({
                destination: function (req, file, callback) {
                callback(null, './uploads');
                },
                filename: function (req, file, callback) {
                console.log(file.fieldname);
                callback(null, file.fieldname + '-' + Date.now()+".png");
                }
            });

            var upload = multer({ storage: storage }).single('image');
            console.log("Photo Api Hit");
            upload(req, res, function (err) 
            {
                console.log(req.file);
                console.log(req.body);
                if (err) 
                {
                    console.log("Photo API ERROR: "+err);
                    return res.end("Error uploading file.");
                }
                console.log("SUCCESS");
                var img_url="http://192.168.1.188:3600/"+req.file.filename;
                BabyImages.create({
                baby_id       : req.body.StudentId,
                image_url     : img_url,
                done: false
                }, function (err, todo) {
                if (err)
                res.send(err);

                // get and return all the todos after you create another
                //getBabys(res);
                });
                res.json("File is uploaded");
            });
        })
    // get all babys
    app.post('/api/babylist', function (req, res) {
        // use mongoose to get all todos in the database
        BabyImages.find().populate({path: 'full_name', model: 'Baby'}).exec(function (err, BabyImages) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            
            res.json(BabyImages);
        });
       // getTodos(res);
    })

};
