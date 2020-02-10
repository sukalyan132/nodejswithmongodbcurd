'use strict';

angularApp.controller('CreateCtrl', function ($scope,$rootScope,BASE_URL, $dialog, FormService,API,$location,$routeParams,Upload) {
//console.log($rootScope.appData);
    // preview form mode
    $scope.domain                           = BASE_URL;
    $scope.previewMode                      = false;
    $scope.formEdit                         = true;
    $scope.configureView                    = true;
    $scope.viewField                        = {'template_type':'','dataSource':''};
    // new form
    $scope.form                             = {};
    $scope.serviceData                      = {'form':[]};
    $scope.form.form_id                     = 1;
    $scope.form.form_name                   = 'My Form';
    $scope.form.object_type                 = 'form';
    $scope.form.view_template_type          = '';
    $scope.form.action_fields_for_form      = [];
    $scope.form.action_fields_for_view      = [];
    //$scope.form.form_fields                 = [];
    //$scope.form.action_fields               = [];
    $scope.form.view_fields                 = [];
    $scope.form.form_data                   = [];
    $scope.form.savedata                    = [];
    $scope.actionData                       = {};
    $scope.fienlData                        = {};
    $scope.fienlData.field                  = [];
    // previewForm - for preview purposes, form will be copied into this
    // otherwise, actual form might get manipulated in preview mode
    $scope.previewForm                      = {};
    // add new field drop-down:
    $scope.addField                         = {};
    $scope.addField.types                   = FormService.fields;
    $scope.addField.new                     = $scope.addField.types[0].name;
    $scope.addField.lastAddedID             = 0;
    // accordion settings
    $scope.accordion                        = {};
    $scope.formEditData                     = {};
    $scope.actionForm                       = {};
    $scope.sequrity                         = {};
    $scope.accordion.oneAtATime             = true;
    $scope.formDataScope                    = $rootScope.flowData.screens[0][$rootScope.nodIndex];
    $scope.sequertyFormValue                = [];
    $scope.surchByname                      = false;
    $scope.form.form_type_code              = 'normal';
    $scope.serviceForm                      = false;
    $scope.serviceFormData                  = {};
    /********************************************************************/
    if($routeParams.aId && $routeParams.sId)
    {
        //console.log($routeParams.aId);
        $scope.aId = $routeParams.aId;
        if(!$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services)
        {
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services     =[];
        }
        $scope.servicesData= $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services;
        $scope.addServices=function(){
            //console.log($scope.serviceData);

            for($scope.count1=0;$scope.count1<$rootScope.flowData.screens[0].length;$scope.count1++)
            {
                if(!$rootScope.flowData.screens[0][$scope.count1].nodes.services)
                {
                    $rootScope.flowData.screens[0][$scope.count1].nodes.services     =[];
                }
                $rootScope.flowData.screens[0][$scope.count1].nodes.services.push($scope.serviceData);
            }
            $scope.alldata=$rootScope.flowData;
            $scope.alldata.screens=$scope.alldata.screens[0];
            API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
               $rootScope.flowData    =data;
            }).error(function(err,data){

            })
        }
        ////////////////////////////// add form to service ///////////
        $scope.addFormToService=function(data,index){
            //console.log(data);
            $scope.serviceIndex = index;
            $scope.serviceForm  = true;
            if(!$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services[index].form)
            {
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services[index].form     =[];
            }
            $scope.serviceFormFieldsForShow=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services[index].form;
        }
        /////////////////////////////// add form fields ////////////////
        $scope.addServicesFormFields=function(){
           // console.log($scope.serviceIndex);
            for($scope.count2=0;$scope.count2<$rootScope.flowData.screens[0].length;$scope.count2++)
            {
                if(!$rootScope.flowData.screens[0][$scope.count2].nodes.services[$scope.serviceIndex].form)
                {
                    $rootScope.flowData.screens[0][$scope.count2].nodes.services[$scope.serviceIndex].form     =[];
                }
                $rootScope.flowData.screens[0][$scope.count2].nodes.services[$scope.serviceIndex].form.push($scope.serviceFormData);
            }
            $scope.alldata=$rootScope.flowData;
            $scope.alldata.screens=$scope.alldata.screens[0];
            API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
               $rootScope.flowData    =data;
                $scope.serviceFormFieldsForShow=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.services[$scope.serviceIndex].form;
            }).error(function(err,data){

            }) 
        }
    }
    ////////////////////////////////////////////////////////////
    $scope.deleteServic=function(data,index){
        console.log(data);
        console.log(index);
    }
    ////////////////////////////////////////////////////////////
    // create new field button click
    $scope.addNewFormField = function(){
        //console.log($rootScope.flowData);
        //console.log($rootScope.flowData.screens[0][$rootScope.nodIndex]);
        $scope.formDataScope=$rootScope.flowData.screens[0][$rootScope.nodIndex];
        //return false;
       //console.log($rootScope.flowData.nodes[index].nodes.form_data.length);
        // incr field_id counter
        //$rootScope.flowData.nodes.length;
        if($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.length>0)
        {
            if($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.length>0)
            {
                if($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.length>0)
                {
                    $scope.addField.lastAddedID=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.length+1;
                }
                else
                {
                    $scope.addField.lastAddedID++;
                }
            }
            else
            {
                $scope.addField.lastAddedID++;
            }
        }
        else
        {
            $scope.addField.lastAddedID++;
        }
        
        if($scope.addField.new=='Publish')
        {
            $scope.form.form_type_code    = 'map';
        }
        //console.log($rootScope.flowData.nodes[index].nodes.form_data.length);
        var newField = {
            "field_id"          : $scope.addField.lastAddedID,
            "field_title"       : $scope.addField.field_title,
            "field_type"        : $scope.addField.new,
            "dataSource"        : $scope.addField.dataSource,
            "owner"             : $scope.addField.owner,
            "currentOwner"      : $scope.addField.owner,
            "field_value"       : "",
            "field_data"        : "",
            "field_name"        : "",
            "field_model"       : "data"+$scope.addField.lastAddedID,
            "field_required"    : true,
			"field_disabled"    : false,
        };
        if($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes)
        {
            //console.log("here");
            //console.log($rootScope.flowData.nodes[index].nodes.form_data.length);
            if(!$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data)
            {
                //console.log("here2");
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data     =[];
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_name     =$scope.form.form_name ;
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.object_type   =$scope.form.object_type ;
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_id       =$scope.form.form_id; 
                
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.push(newField);
            }
            else
            {
                //console.log("here3");
                //console.log($rootScope.flowData.nodes[index].nodes.form_data.length);
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.push(newField);
            }
        }
        else
        {   
            //console.log("here4");
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes           ={};
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data =[];
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data.push(newField);
        }
        //console.log($rootScope.flowData.nodes[index].nodes.form_data);
        //console.log($rootScope.flowData.nodes[index].nodes.form_data.length);
        $scope.form.form_data=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data;
        // put newField into fields array
        //console.log($rootScope.flowData.nodes[index].nodes.form_data);
        //$scope.form.form_data.push(newField);
        
        if($rootScope.flowData.screens[0].length>1)
        {
            for($scope.counter=1;$scope.counter<$rootScope.flowData.screens[0].length;$scope.counter++)
            {
                if($rootScope.nodIndex==0)
                {
                    $rootScope.flowData.screens[0][$scope.counter].nodes=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes;
                }
                
                
                
            }
            //console.log($rootScope.flowData);
        }
        
        $scope.alldata=$rootScope.flowData;
        $scope.alldata.screens[0][$rootScope.nodIndex].nodes=$scope.form;
        $scope.alldata.screens=$scope.alldata.screens[0];
        //console.log($scope.alldata);
        //return false;
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
            //console.log(data);
            
                $rootScope.flowData    =data;
            
            
        }).error(function(err,data){

        })
    }

    // deletes particular field on button click
    $scope.deleteField = function (field_id ,index,index2){
        for(var i = 0; i < $rootScope.flowData.screens[0][index2].nodes.form_data.length; i++){
            if($rootScope.flowData.screens[0][index2].nodes.form_data[i].field_id == field_id){
                $rootScope.flowData.screens[0][index2].nodes.form_data.splice(i, 1);
                break;
            }
        }
    }

    $scope.editFromPerticularElement = function(data,index) {
    console.log(data);
    if(data.field_type=='GPS')
    {
        $scope.formEditData.field_title     =data.field_title;
        $scope.formEditData.dataSource      =data.dataSource;
        $scope.formEditData.field_type      =data.field_type;
        $rootScope.formFieldIndex           =index;
        $scope.formEdit                     =false;
        $scope.mapsection                   =true;
    }
    else
    {
        $scope.formEditData.field_title     =data.field_title;
        $scope.formEditData.dataSource      =data.dataSource;
        $scope.formEditData.field_type      =data.field_type;
        $rootScope.formFieldIndex           =index;
        $scope.formEdit                     =false;
    }
   // return false;
    //console.log(index);
    
    //$location.path("/forms/editFormField");

    };
    // update form data
    $scope.updateFormField=function(index)
    {
        //console.log($scope.formEditData);
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data[index].field_title  =$scope.formEditData.field_title;
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data[index].dataSource   =$scope.formEditData.dataSource;
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data[index].field_type   =$scope.formEditData.field_type;
        //console.log($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data[index]);
        $scope.alldata          =$rootScope.flowData;
        //$scope.alldata.screens[0][$rootScope.nodIndex].nodes=$scope.form;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        //console.log($scope.alldata);
        //return false;
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
            //console.log(data);
            $rootScope.flowData    =data;
            $scope.formEdit        =true;
        }).error(function(err,data){

        })
    }
    // view config
    $scope.openViewConfigPage=function(){
        //$scope.configureView=!$scope.configureView;
    }
    // add new option to the field
    $scope.addOption = function (field){
        if(!field.field_options)
            field.field_options = new Array();

        var lastOptionID = 0;

        if(field.field_options[field.field_options.length-1])
            lastOptionID = field.field_options[field.field_options.length-1].option_id;

        // new option's id
        var option_id = lastOptionID + 1;

        var newOption = {
            "option_id"     : option_id,
            "option_title"  : "Option " + option_id,
            "option_value"  : option_id
        };

        // put new option into field_options array
        field.field_options.push(newOption);
    }

    // delete particular option
    $scope.deleteOption = function (field, option){
        for(var i = 0; i < field.field_options.length; i++){
            if(field.field_options[i].option_id == option.option_id){
                field.field_options.splice(i, 1);
                break;
            }
        }
    }


    // preview form
    $scope.previewOn = function(){
        //onsole.log('here');
        if($scope.form.form_fields == null || $scope.form.form_fields.length == 0) {
            var title   = 'Error';
            var msg     = 'No fields added yet, please add fields to the form before preview.';
            var btns    = [{result:'ok', label: 'OK', cssClass: 'btn-primary'}];

            $dialog.messageBox(title, msg, btns).open();
        }
        else {
            $scope.previewMode = !$scope.previewMode;
            $scope.form.submitted = false;
            angular.copy($scope.form, $scope.previewForm);
        }
    }

    $scope.saveAction=function(allData,nodeData){
       
            if($scope.actionData.actionName)
            {
                $scope.screenAction     ={"status":"","actionName":$scope.actionData.actionName,"screens":$scope.actionData.screens};
                $rootScope.flowData.nodes[nodeData].nodes.action_fields_for_form.push($scope.screenAction);
            }
            if($scope.actionData.actionNameForView)
            {
                $scope.viewAction       ={"status":"","actionName":$scope.actionData.actionNameForView,"screens":$scope.actionData.screensForView};
                $rootScope.flowData.nodes[nodeData].nodes.action_fields_for_view.push($scope.viewAction);
            }
            //console.log($rootScope.flowData);
            API.post_details($rootScope.flowData,'saveFlowDataStep2').success(function(data){
                //console.log(data);
                //$rootScope.appId    =data._id;
               // $rootScope.appName  =data.title;
               // $location.path("/forms/flowInnerPage");
                //$scope.saveData =data;
                alert("Save success.");
                //$scope.allFormData=data;
            }).error(function(err,data){

            })
    }
    
    // hide preview form, go back to create mode
    $scope.previewOff = function(){
        $scope.previewMode = !$scope.previewMode;
        $scope.form.submitted = false;
    }

    // decides whether field options block will be shown (true for dropdown and radio fields)
    $scope.showAddOptions = function (field){
        if(field.field_type == "radio" || field.field_type == "dropdown")
            return true;
        else
            return false;
    }

    // deletes all the fields
    $scope.reset = function (){
        $scope.form.form_fields.splice(0, $scope.form.form_fields.length);
        $scope.addField.lastAddedID = 0;
    }
    // Submit View
    $scope.submitView=function(){
       // console.log($scope.viewField);
        var i=0;
        //console.log($scope.flowData.screens[0][$rootScope.nodIndex].nodes);
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.view_template_type=$scope.viewField.template_type;
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.dataSource        =$scope.viewField.dataSource;
        
        $scope.viewDataArray=[];
        $scope.formData=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data;
        for($scope.count=0;$scope.count<$scope.formData.length;$scope.count++)
        {
           // console.log('here'+$scope.count);
            $scope.viewFieldData={'position':'','field_id':$scope.count+1,'field_title':$scope.formData[$scope.count].field_title};
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.view_fields.push($scope.viewFieldData);
            //$scope.viewDataArray.push($scope.viewFieldData);
            //$scope.viewFields.field_title=$scope.flowData.screens[0][$rootScope.nodIndex].nodes.form_data[i].field_title;
        }
       // console.log($scope.flowData);
        //return false;
        //
        $scope.alldata          =$rootScope.flowData;
        //$scope.alldata.screens[0][$rootScope.nodIndex].nodes=$scope.form;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        //console.log($scope.alldata);
        //return false;
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
            //console.log(data);
            $rootScope.flowData    =data;
            //$scope.formEdit        =true;
        }).error(function(err,data){

        })
    }
    // Submit Action
    $scope.createtAction=function(){
        //console.log($scope.actionForm);
        if($scope.actionForm.action_type=='Form Action')
        {
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.push($scope.actionForm);
        }
        else
        {
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view.push($scope.actionForm);
        }
       
        $scope.alldata          =$rootScope.flowData;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
           
            $rootScope.flowData    =data;
            $scope.formDataScope   = $rootScope.flowData.screens[0][$rootScope.nodIndex];
           
        }).error(function(err,data){

        })
    }
    if(!$routeParams.aId && !$routeParams.sId)
    {
        $scope.aId = $routeParams.AId;
        // Function for get all user
        API.post_details('','allUserDataFromUserTable').success(function(data){
            //console.log(data);

            $scope.allUserDataGeneral   =data;
            if(!$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data)
            {
                $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=[];
            }
            
            $scope.actionDataAll            =$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
            $scope.dataForshowAllUser       =[];
            $scope.sequertyFormValue        =[];
            
            for($scope.num=0;$scope.num<$scope.allUserDataGeneral.length;$scope.num++)
            {
                function isInArrarData(data) { 
                    //console.log(data);
                    if(data==null)
                    {
                        $scope.return=undefined;
                    }
                    else
                    {
                        if(data.uorgId===$scope.allUserDataGeneral[$scope.num]._id)
                        {
                            
                            $scope.return=data;
                        }
                        else
                        {
                            $scope.return=undefined;
                        }
                    }
                    
                    //console.log($scope.return);
                    return $scope.return;
                }
                if($scope.actionDataAll.find(isInArrarData)=='undefined' || $scope.actionDataAll.find(isInArrarData)==undefined)
                {
                    $scope.accessType = {"access_name":"","access_value":""};
                    $scope.accessData = [];
                    $scope.accessData.push({"access_name":"view","access_value":false});
                    $scope.accessData.push({"access_name":"edit","access_value":false});
                    $scope.actionForms=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.concat($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view);
                    for($scope.couAction=0;$scope.couAction<$scope.actionForms.length;$scope.couAction++)
                    {
                        $scope.accessType = {"access_name":$scope.actionForms[$scope.couAction].action_name,"access_value":false};
                        $scope.accessData.push($scope.accessType);
                        //$scope.sequertyFormValue.push(false);
                    }
                    $scope.sequrityObjects={"uorgId":data[$scope.num]._id,"name":data[$scope.num].name,"type":'user',"accessType":$scope.accessData};
                    //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                    $scope.sequertyFormValue.push($scope.sequrityObjects);  
                    $scope.dataForshowAllUser.push($scope.sequrityObjects);

                    //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                }
                else
                {
                    //$scope.sequertyFormValue.push($scope.actionDataAll.find(isInArrarData));  
                    $scope.dataForshowAllUser.push($scope.actionDataAll.find(isInArrarData));
                }
            }
            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=$scope.sequertyFormValue;
            console.log($rootScope.flowData);
        }).error(function(err,data){

        })
        //// function for all group
         // Function for get all user
         
        API.post_details('','allGroupDataFromGroupTable').success(function(data){
            console.log($rootScope.flowData);

            $scope.allGroupDataGeneral      =data;
            //$scope.actionDataAll            =$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
            $scope.dataForshowAllGroup      =[];
            $scope.securityFormValue        =[];
            function isInArrarDataForGroup(data) {
                    if(data==null)
                    {
                        $scope.return=undefined;
                    }
                    else
                    { 
                        if(data.uorgId===$scope.allGroupDataGeneral[$scope.num]._id)
                        {
                            
                            $scope.return=data;
                        }
                        else
                        {
                            $scope.return=undefined;
                        }
                    }
                    //console.log($scope.return);
                    return $scope.return;
                }
            for($scope.num=0;$scope.num<$scope.allGroupDataGeneral.length;$scope.num++)
            {
                
                if($scope.actionDataAll.find(isInArrarDataForGroup)=='undefined' || $scope.actionDataAll.find(isInArrarDataForGroup)==undefined)
                {
                    $scope.accessType = {"access_name":"","access_value":""};
                    $scope.accessData = [];
                    $scope.accessData.push({"access_name":"view","access_value":false});
                    $scope.accessData.push({"access_name":"edit","access_value":false});
                    $scope.actionForms=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.concat($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view);
                    for($scope.couAction=0;$scope.couAction<$scope.actionForms.length;$scope.couAction++)
                    {
                        $scope.accessType = {"access_name":$scope.actionForms[$scope.couAction].action_name,"access_value":false};
                        $scope.accessData.push($scope.accessType);
                        //$scope.sequertyFormValue.push(false);
                    }
                    $scope.securityObjects2={"uorgId":data[$scope.num]._id,"name":data[$scope.num].name,"type":'group',"accessType":$scope.accessData};
                    //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                    $scope.securityFormValue.push($scope.securityObjects2);  
                    $scope.dataForshowAllGroup.push($scope.securityObjects2);
                    $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.securityObjects2);
                    //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                }
                else
                {
                    $scope.securityFormValue.push($scope.actionDataAll.find(isInArrarDataForGroup));  
                    $scope.dataForshowAllGroup.push($scope.actionDataAll.find(isInArrarDataForGroup));
                    $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push(isInArrarDataForGroup);
                }
            }
            //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=$scope.sequertyFormValue;
            console.log($rootScope.flowData);
        }).error(function(err,data){

        })
    }
    
    // function for compare array
    $scope.checkInArrayElement=function(array,element){
        $scope.return=false;
        for($scope.count=0;$scope.count<array.length;$scope.count++)
        {
            if(array[$scope.count].uorgId==element._id)
            {
                $scope.return=true;
            }
        }
        return $scope.return;
    }
    // Create sequrety
    $scope.sequertyFormValue    =$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data; 
    $scope.allUserData          =$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
    $scope.findUserOrGroup=function(){
        $scope.allUserData          =[];
        $scope.sequertyFormValue    =[];
        $scope.surchByname          = true;
        //console.log($scope.sequrity);
        API.post_details($scope.sequrity,'perticularDataById').success(function(data){
            

                $scope.allUserDatafortest=data.data;
            

                if(!$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data)
                {
                    console.log("here");
                    $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=[];
                    for($scope.conunt=0;$scope.conunt<data.data.length;$scope.conunt++)
                    {
                        $scope.accessType = {"access_name":"","access_value":""};
                        $scope.accessData = [];
                        $scope.accessData.push({"access_name":"view","access_value":false});
                        $scope.accessData.push({"access_name":"edit","access_value":false});
                        $scope.actionForms=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.concat($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view);
                        for($scope.couAction=0;$scope.couAction<$scope.actionForms.length;$scope.couAction++)
                        {
                            $scope.accessType = {"access_name":$scope.actionForms[$scope.couAction].action_name,"access_value":false};
                            $scope.accessData.push($scope.accessType);
                            //$scope.sequertyFormValue.push($scope.accessType);
                        }
                        $scope.sequrityObjects={"uorgId":data.data[$scope.conunt]._id,"name":data.data[$scope.conunt].name,"type":data.type,"accessType":$scope.accessData};
                        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                    }
                    $scope.allUserData=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
                    $scope.sequertyFormValue=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
                }
                else
                {
                    
                    // Pending section *****
                    if($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.length>0)
                    {
                        console.log(data.data[0]);
                        $scope.actionDataAll=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;
                        function isCherries(fruit) { 
                            return fruit.uorgId === data.data[0]._id;
                        }
                        
                        console.log($scope.actionDataAll.find(isCherries));
                        if($scope.actionDataAll.find(isCherries)=='undefined' || $scope.actionDataAll.find(isCherries)==undefined)
                        {
                            $scope.accessType = {"access_name":"","access_value":""};
                            $scope.accessData = [];
                            $scope.accessData.push({"access_name":"view","access_value":false});
                            $scope.accessData.push({"access_name":"edit","access_value":false});
                            $scope.actionForms=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.concat($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view);
                            for($scope.couAction=0;$scope.couAction<$scope.actionForms.length;$scope.couAction++)
                            {
                                $scope.accessType = {"access_name":$scope.actionForms[$scope.couAction].action_name,"access_value":false};
                                $scope.accessData.push($scope.accessType);
                                //$scope.sequertyFormValue.push(false);
                            }
                            $scope.sequrityObjects={"uorgId":data.data[0]._id,"name":data.data[0].name,"type":data.type,"accessType":$scope.accessData};
                            //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                            $scope.sequertyFormValue.push($scope.sequrityObjects);  
                            $scope.allUserData.push($scope.sequrityObjects);
                        }
                        else
                        {
                            $scope.sequertyFormValue.push($scope.actionDataAll.find(isCherries));  
                            $scope.allUserData.push($scope.actionDataAll.find(isCherries));
                        }
                     //$scope.sequertyFormValue=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;  
                     //$scope.allUserData=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data;   
                    }
                    else
                    {
                        for($scope.conunt=0;$scope.conunt<data.data.length;$scope.conunt++)
                        {
                            $scope.accessType = {"access_name":"","access_value":""};
                            $scope.accessData = [];
                            $scope.accessData.push({"access_name":"view","access_value":"false"});
                            $scope.accessData.push({"access_name":"edit","access_value":"false"});
                            $scope.actionForms=$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_form.concat($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.action_fields_for_view);
                            for($scope.couAction=0;$scope.couAction<$scope.actionForms.length;$scope.actionForms++)
                            {
                                $scope.accessType = {"access_name":$scope.actionForms.action_name,"access_value":"false"};
                                $scope.accessData.push($scope.accessType);
                            }
                            $scope.sequrityObjects={"uorgId":data.data[$scope.conunt]._id,"type":data.type,"accessType":$scope.accessData};
                            $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data.push($scope.sequrityObjects);
                        }
                    }
                }
                
            
       // console.log($rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data);
        }).error(function(err,data){
            console.log(err);
            console.log(data);
        })
       
        /*
        API.post_details('','allUserData').success(function(data){
            //console.log(data);
            $scope.allUserData=data;
        }).error(function(err,data){

        })
        */
    }
    
    // change value of sequrity element
    $scope.changeValueOfSequerity=function(parentInsex,index)
    {
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data[parentInsex].accessType[index].access_value=$scope.sequertyFormValue[parentInsex].accessType[index].access_value;
        
        $scope.alldata          =$rootScope.flowData;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
           
            $rootScope.flowData    =data;
            //$scope.formDataScope   = $rootScope.flowData.screens[0][$rootScope.nodIndex];
           
        }).error(function(err,data){

        })
    }
    // change value of sequrity element
    $scope.changeValueOfSequerity2=function(parentInsex,index)
    {
        $scope.fullArray=$scope.dataForshowAllUser.concat($scope.dataForshowAllGroup);
        console.log($scope.fullArray);
        //console.log($scope.dataForshowAllGroup);
        //return false;
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=$scope.fullArray;
        
        $scope.alldata          =$rootScope.flowData;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        console.log($scope.alldata);
        //return false;
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
           
            $rootScope.flowData    =data;
            //$scope.formDataScope   = $rootScope.flowData.screens[0][$rootScope.nodIndex];
           
        }).error(function(err,data){

        })
    }
    // change value for group security 
    $scope.changeValueOfSequerity3=function(parentInsex,index){
        $scope.fullArray=$scope.dataForshowAllUser.concat($scope.dataForshowAllGroup);
        $rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data=$scope.fullArray;
        //$rootScope.flowData.screens[0][$rootScope.nodIndex].nodes.sequerty_data[parentInsex].accessType[index].access_value=$scope.dataForshowAllGroup[parentInsex].accessType[index].access_value;
        
        $scope.alldata          =$rootScope.flowData;
        $scope.alldata.screens  =$scope.alldata.screens[0];
        API.post_details($scope.alldata,'saveFlowDataStep2').success(function(data){
           
            $rootScope.flowData    =data;
            //$scope.formDataScope   = $rootScope.flowData.screens[0][$rootScope.nodIndex];
           
        }).error(function(err,data){

        }) 
    }
    /////////////////////////////////////////////
    $scope.showExelDownloader=false;
    $scope.downloadExcelFile=function(){
        //console.log("here");
        if($scope.dataField.template_type=='excel')
        {
            API.post_details($rootScope.nodeData,'createExcelFormat').success(function(data){
                console.log(data);
                if(data.data=='success')
                {
                    $scope.showExelDownloader=true;
                }
               // $scope.allFormData=data;
               //var blob = new Blob([data]);
                //window.navigator.msSaveBlob(blob, "filename.csv");
            }).error(function(err,data){

            })
        }
        
    }
    ////////////////////////////////////////////////////
    $scope.addDataToTranjuction=function(){
        //console.log($rootScope.nodeData.nodes.sequerty_data);
        //return false;
        Upload.upload({
          url: BASE_URL+'/api/saveExcelDataToDb',
          //file: params.file,   // Image to upload

          data: {
            application_data: $rootScope.flowData,
            file: $scope.excelData.file,
          } 
        }).then(function (resp) {
            //console.log(resp);
            //$scope.chieldApplicationData =resp.data;
            if(resp.status==200)
            {
               alert("All data submitted.");
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
    }
})
.controller('showFromsDataCtrl',function($scope,API){
    $scope.showModal    =false;
    $scope.allFormData  =[];
    API.post_details('','allFormsData').success(function(data){
        console.log(data);
        $scope.allFormData=data;
    }).error(function(err,data){

    })
    // open view modal for form 
    $scope.openForm=function(data){
        //console.log(data);
        $scope.data=data;
        $scope.showModal=true;
    }
    // delete form
    $scope.deleteForm=function(data){
        API.post_details(data,'deleteForm').success(function(data){
            console.log(data);
            $scope.allFormData=data;
        }).error(function(err,data){

        })
    }

})
.controller('CreateViewCtrl',function($scope, $dialog,ViewService, FormService,API,$location){
    // preview view mode
    $scope.previewMode = false;
    // new view
    $scope.form             = {};
    $scope.form.form_id     = 1;
    $scope.form.form_name   = 'My View';
    $scope.form.object_type = 'view';
    $scope.form.form_fields = [];

    // add new field drop-down:
    $scope.addField             = {};
    $scope.addField.types       = ViewService.fields;
    $scope.addField.new         = $scope.addField.types[0].name;
    $scope.addField.lastAddedID = 0;
    // accordion settings
    $scope.accordion = {}
    $scope.accordion.oneAtATime = true;

    // create new field button click
    $scope.addNewField = function(){

        // incr field_id counter
        $scope.addField.lastAddedID++;

        var newField = {
            "field_id"          : $scope.addField.lastAddedID,
            "field_title"       : "New field - " + ($scope.addField.lastAddedID),
            "field_type"        : $scope.addField.new,
            "field_value"       : "",
            "field_data"        : "",
            "field_name"        : "",
            "field_required"    : "",
            "field_disabled"    : "",
            "field_displayType" : true
        };

        // put newField into fields array
        $scope.form.form_fields.push(newField);
    }
    // decides whether field options block will be shown (true for dropdown and radio fields)
    $scope.showAddOptions = function (field){
        if(field.field_type == "Fields")
            return true;
        else
            return false;
    }
    // add new option to the field
    $scope.addOption = function (field){
        if(!field.field_options)
            field.field_options = new Array();

        var lastOptionID = 0;

        if(field.field_options[field.field_options.length-1])
            lastOptionID = field.field_options[field.field_options.length-1].option_id;

        // new option's id
        var option_id = lastOptionID + 1;

        var newOption = {
            "option_id"     : option_id,
            "option_title"  : "Option " + option_id,
            "option_value"  : option_id
        };

        // put new option into field_options array
        field.field_options.push(newOption);
    }
})
.controller('BasicExampleCtrl',function($scope,$rootScope,BASE_URL,$routeParams, $dialog, FormService,API,$location,holdobj){
    //console.log($routeParams);
    $scope.domain    = BASE_URL;
    $scope.screenData={'screen_name':''};
    // Get screen data
    API.post_details({'id':$routeParams.Id},'singleDataOfFlows').success(function(data){
                //console.log(data);
                $rootScope.appId    =data._id;
                $rootScope.appName  =data.title;
                $rootScope.appData  =data;
               // $location.path("/forms/flowInnerPage");
                //$scope.saveData =data;
                //alert("Save success.");
                //$scope.allFormData=data;
            }).error(function(err,data){

            })
    $scope.addScreen=function(){
        if($rootScope.appData.screens.length>0)
        {
            $rootScope.appData.screens=$rootScope.appData.screens[0];
        }
        else
        {
            $rootScope.appData.screens=$rootScope.appData.screens;
        }
        if($rootScope.appData.screens.length>0)
        {
            $rootScope.appData.screens.push({
                id: $rootScope.appData.screens.length+1,
                title: $scope.screenData.screen_name,
                nodes: $rootScope.appData.screens[0].nodes
            });
        }
        else
        {
            $rootScope.appData.screens.push({
                id: $rootScope.appData.screens.length+1,
                title: $scope.screenData.screen_name,
                nodes: []
            });
        }
        
       // console.log($rootScope.appData);
        
            //$rootScope.flowData             =$rootScope.appData.screens;
            //$rootScope.flowData.mongoId     =$rootScope.appData._id;
            
            API.post_details($rootScope.appData,'saveFlowDataStep2').success(function(data){
                //console.log(data);
                $scope.screenData={'screen_name':''};
                $rootScope.appId    =data._id;
                $rootScope.appName  =data.title;
                $rootScope.appData  =data;
               // $location.path("/forms/flowInnerPage");
                //$scope.saveData =data;
                //alert("Save success.");
                //$scope.allFormData=data;
            }).error(function(err,data){

            })
          
       // return false;
    }
    ///////////////////// go to service page////////////////
    $scope.gotoServicePage=function(data,appData,index){
        $rootScope.flowData         =$rootScope.appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =false;
        $location.path("/forms/createService/"+appData._id+"/"+index);
    }  
     ///////////////////// go to service page////////////////
    $scope.gotoDataPage=function(data,appData,index){
        console.log(appData);
        //return false;
        $rootScope.flowData         =appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =false;
        $location.path("/forms/dataPage/"+appData._id+"/"+index);
    }  
    /////////////////////////////////////
    $scope.goToFormPage=function(data,appData,index){
        //console.log(data);
        //console.log(index);
        //console.log($rootScope.appData);
        $rootScope.flowData         =$rootScope.appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =false;
        $location.path("/forms/flowInnerPage/"+appData._id+"/"+index);
    } 
    /***************** go to view page ************/
    $scope.goToViewPage=function(data,appData,index){
        $rootScope.flowData         =$rootScope.appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =false;
        $location.path("/forms/createView/"+appData._id+"/"+index);

    }
    /*********************** go to action page ************/
    $scope.goToActionPage=function(data,appData,index){
        $rootScope.flowData         =$rootScope.appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =false;
        $location.path("/forms/createAction/"+appData._id+"/"+index);
    }
    /*********************** go to sequrity page ***********/
    $scope.goToSequrityPage=function(data,appData,index){
        $rootScope.flowData         =$rootScope.appData;
        $rootScope.nodeData         =data;
        $rootScope.nodIndex         =index;
        $rootScope.sequritySection  =true;
        $location.path("/forms/createSequrity/"+appData._id+"/"+index);
    }
    
})
.controller('showFromsDataCtrl',function($scope,API){
    $scope.showModal    =false;
    $scope.allFormData  =[];
    API.post_details('','allFormsData').success(function(data){
        console.log(data);
        $scope.allFormData=data;
    }).error(function(err,data){

    })
    // open view modal for form 
    $scope.openForm=function(data){
        console.log(data);
        $scope.data=data;
        $scope.showModal=true;
    }
    // delete form
    $scope.deleteForm=function(data){
        API.post_details(data,'deleteForm').success(function(data){
            console.log(data);
            $scope.allFormData=data;
        }).error(function(err,data){

        })
    }
})
.controller('createApplicationCtrl',function($scope,BASE_URL,$routeParams,$rootScope,Upload,API,$location){
    //console.log($routeParams.id);
    $scope.domain    = BASE_URL;
    $scope.editData  = {};
    if($routeParams.id)
    {
        $scope.parentId=$routeParams.id;
        $scope.dataChield={'id':$routeParams.id};
        API.post_details($scope.dataChield,'allChieldApplicationData').success(function(data){
            //console.log(data);
            $scope.chieldApplicationData =data;
            //alert("Save success.");
            //$scope.allFormData=data;
        }).error(function(err,data){

        })
    }
    if($routeParams.Pid && $routeParams.Lid)
    {
        $scope.pid=$routeParams.Pid;
        $scope.lid=$routeParams.Lid;
        //console.log($routeParams.Pid);
        API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid},'layoutApplicationData').success(function(data){

            $scope.applicationData =data;
        }).error(function(err,data){

        })
         // edit application images
        $scope.editImageView=false;
        $scope.appId='';
        $scope.editApplicationImages=function(data,pid,lid){
            //console.log(data);
            $scope.appId=data._id;
            $scope.editImageView=true;
        }
        $scope.updateApplicationImages=function(){
            if($scope.editData.image_type=='banner')
            {
                $scope.file=$scope.editData.file;
                Upload.upload({
                  url: BASE_URL+'/api/editApplicationBannerImages',
                  //file: params.file,   // Image to upload

                  data: {
                    pageId      : $routeParams.Pid,
                    layoutId    : $routeParams.Lid,
                    appId       : $scope.appId,
                    type        : $scope.editData.image_type,
                    file        : $scope.file,
                  } 
                }).then(function (resp) {
                    //console.log(resp);
                    $scope.applicationData  =resp.data;
                    $scope.editImageView    =false;
                    
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                });
            }
            else
            {
                $scope.file=$scope.editData.file2;
                Upload.upload({
                  url: BASE_URL+'/api/editApplicationBgImages',
                  //file: params.file,   // Image to upload

                  data: {
                    pageId      : $routeParams.Pid,
                    layoutId    : $routeParams.Lid,
                    appId       : $scope.appId,
                    type        : $scope.editData.image_type,
                    file        : $scope.file,
                  } 
                }).then(function (resp) {
                    $scope.applicationData  =resp.data;
                    $scope.editImageView    =false;
                    
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                });
            }
            
        }
    }
    //////////////////////////////////////////
    API.post_details('','allLayoutList').success(function(data){
            console.log(data);
            $scope.layoutListData =data;
            //alert("Save success.");
            //$scope.allFormData=data;
        }).error(function(err,data){

        })
    // Function for chield app creation
    $scope.dataChield={"templateType" : 3,'parentId':''};
    $scope.submitFormForChieldApp=function(){
        $scope.dataChield.parentId=$routeParams.id;
        console.log($scope.dataChield);
        Upload.upload({
          url: BASE_URL+'/api/saveFlowDataImageUpload',
          //file: params.file,   // Image to upload

          data: {
            application_name    : $scope.dataChield.application_name,
            parentId            : $scope.dataChield.parentId,
            templateType        : $scope.dataChield.templateType,
            status              : 'InProgress',
            file                : $scope.dataChield.file,
            message             : $scope.dataChield.message,
            bannerSize          : $scope.dataChield.bannerSize, 
          } 
        }).then(function (resp) {
            console.log(resp);
            //$scope.chieldApplicationData =resp.data;
            if(resp.status==200)
            {
                Upload.upload({
                url: BASE_URL+'/api/saveFlowDataBannerUpload',
                //file: params.file,   // Image to upload

                data: {
                application_id      : resp.data._id,
                applicationType     : 'single',
                file                : $scope.dataChield.file2, 
                } 
                }).then(function (resp2) {
                console.log(resp2);
                if(resp2.status==200)
                {
                    Upload.upload({
                    url: BASE_URL+'/api/saveFlowDataBackgroundImageUpload',
                    //file: params.file,   // Image to upload

                    data: {
                    application_id  : resp.data._id,
                    //applicationType: 'single',
                    file            : $scope.dataChield.file3, 
                    parentId        : $scope.dataChield.parentId,
                    } 
                    }).then(function (resp3) {
                        $scope.chieldApplicationData =resp3.data;
                    }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    });
                }
                //$scope.applicationData =resp.data;
                // show all application
                /*API.post_details($scope.dataChield,'allChieldApplicationData').success(function(data){
                console.log(data);
                $scope.chieldApplicationData =data;
                //alert("Save success.");
                //$scope.allFormData=data;
                }).error(function(err,data){

                })*/
                }, function (resp) {
                console.log('Error status: ' + resp.status);
                });
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
    }
    // Function for main app
    $scope.data={"templateType" : 3};
    $scope.submitForm=function(){
        //console.log($routeParams.id);
        $scope.upload($scope.data);

      /* return false;
        API.post_details($scope.data,'babyImageUpload').success(function(data){
            console.log(data);
            //$rootScope.appId    =data._id;
            //$rootScope.appName  =data.title;
            //$location.path("/forms/main");
            //$scope.saveData =data;
            //alert("Save success.");
            //$scope.allFormData=data;
        }).error(function(err,data){

        })
        */
    }
     // upload on file select or drop
    $scope.upload = function (params) {
       // console.log(params.file);

       /* Upload.upload({
            url: 'http://192.168.20.101:3600/api/babyImageUpload',
            data: {file: file, 'data': data}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
        */
        Upload.upload({
          url: BASE_URL+'/api/saveFlowDataImageUpload',
          //file: params.file,   // Image to upload

          data: {
            application_name    : params.application_name,
            applicationType     : params.application_type,
            templateType        : params.templateType,
            message             : params.message,
            bannerSize          : params.bannerSize,
            //applimodelType      : params.applimodelType,
            applimodelType      : 'service',
            clonType            : params.clonAddData,
            clonAppName         : params.appNameForReference,
            status              : 'InProgress',
            file                : params.file, 
          } 
        }).then(function (resp) {
            console.log(resp);
            if(resp.status==200)
            {
                Upload.upload({
                url: BASE_URL+'/api/saveFlowDataBannerUpload',
                //file: params.file,   // Image to upload

                data: {
                application_id: resp.data._id,
                applicationType: params.application_type,
                file: $scope.data.file2, 
                } 
                }).then(function (resp2) {
                console.log(resp2);
                if(resp2.status==200)
                {
                    Upload.upload({
                    url: BASE_URL+'/api/saveFlowDataBackgroundImageUpload',
                    //file: params.file,   // Image to upload

                    data: {
                    application_id: resp.data._id,
                    applicationType: params.application_type,
                    pid: $routeParams.Pid,
                    lid: $routeParams.Lid,
                    file: $scope.data.file3, 
                    } 
                    }).then(function (resp3) {
                        //$scope.applicationData =resp3.data;
                         API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid},'layoutApplicationData').success(function(data){
                            //console.log(data+"here");
                            $scope.applicationData =data;
                            //alert("Save success.");
                            //$scope.allFormData=data;
                        }).error(function(err,data){

                        })
                    }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    });
                }
                //$scope.applicationData =resp.data;
                // show all application
                /*API.post_details($scope.dataChield,'allChieldApplicationData').success(function(data){
                console.log(data);
                $scope.chieldApplicationData =data;
                //alert("Save success.");
                //$scope.allFormData=data;
                }).error(function(err,data){

                })*/
                }, function (resp) {
                console.log('Error status: ' + resp.status);
                });
            }
            // show all application
    
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
    };
    // show all application
    API.post_details('','allApplicationData').success(function(data){
            console.log(data);
           // $scope.applicationData =data;
            //alert("Save success.");
            //$scope.allFormData=data;
        }).error(function(err,data){

        })
        // edit chield application
        $scope.editChieldApplication=function(data){
            $rootScope.appId    =data._id;
            $rootScope.appName  =data.title;
            $rootScope.appData  =data;
            $location.path("/main/"+data._id);
            //$location.path("/multiAppPage/"+data._id);
        }
        // edit parent application
        $scope.editApplication=function(data){
            //console.log(data);
           // return false;
            if(data.applicationType=='single')
            {

                $rootScope.appId    =data._id;
                $rootScope.appName  =data.title;
                $rootScope.appData  =data;
                $location.path("/main/"+data._id);
                
            }
            else
            {
                $rootScope.multiAppData  =data;
                $location.path("/multiAppPage/"+data._id);
            }
            
        }

        // Delete parent app data
        $scope.deleteApplication=function(data,pid,lid){
            API.post_details({'appData':data,'pid':pid,'lid':lid},'deleteFlows').success(function(data){
               // console.log(data);
                $scope.applicationData =data;
            }).error(function(err,data){

            })
        }
        $scope.deleteChildApplication=function(data){
            API.post_details(data,'deleteChildFlows').success(function(data){
               // console.log(data);
                $scope.chieldApplicationData =data;
                //alert("Save success.");
                //$scope.allFormData=data;
            }).error(function(err,data){

            })
        }
})
.controller('mobileAppImagesControlller',function($scope,BASE_URL,$routeParams,$rootScope,Upload,API,$location){
    $scope.data      ={};
    $scope.layout    ={};
    $scope.page      ={};
    $scope.newsFeed  ={};
    $scope.htmlData  ={};
    $scope.domain    = BASE_URL;
    if($routeParams.Id)
    {
        $scope.pageId   =$routeParams.Id;
        $scope.layout.id=$routeParams.Id;
        API.post_details({'id':$routeParams.Id},'allLayoutOfPerticularPage').success(function(data){
            //console.log(data);
            $scope.pageLayoutData=data[0].layouts;
        })
    }
    $scope.submitAppDashboardImageForm=function(){
       // $scope.dataChield.parentId=$routeParams.id;
        
        Upload.upload({
          url: BASE_URL+'/api/saveAppDashboardImages',
          //file: params.file,   // Image to upload

          data: {
            message     : $scope.data.message,
            bannerSize  : $scope.data.bannerSize,
            appSetting  : $scope.data.appSetting,
            file        : $scope.data.file, 
          } 
        }).then(function (resp) {
            console.log(resp);
            if(resp.status==200)
            {
                Upload.upload({
                  url: BASE_URL+'/api/saveAppDashboardBackgroundImages',
                  //file: params.file,   // Image to upload

                  data: {
                    bannerImgID: resp.data._id,
                    file: $scope.data.file2, 
                  } 
                }).then(function (resp2) {
                    $scope.replyData=resp2.data;
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                    });
            }
            
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
    }
    // Show all dashboard screen data
    API.post_details('','allDashboardImages').success(function(data){
        console.log(data);
        $scope.replyData=data;
    })
    // Delete images
    $scope.deleteImage=function(data){
        API.post_details(data,'deleteDashboardImage').success(function(data){
            console.log(data);
            $scope.replyData=data;
        })
    }
    // Change Status of image
    $scope.activeDeactiveImageStatus=function(data){

        if(data.status=='activate')
        {
            data.status='deactivate';
        }
        else
        {
            data.status='activate';
        }
        API.post_details(data,'changeImageStatus').success(function(data){
            //console.log(data);
            $scope.replyData=data;
        })
    }
    //////////////////////////////
    $scope.changeViewType=function(data){
       if(data.appSetting=='List')
        {
            data.appSetting='Grid';
        }
        else
        {
            data.appSetting='List';
        }
        API.post_details(data,'changeViewType').success(function(data){
            //console.log(data);
            $scope.replyData=data;
        }) 
    }
    /////////////////////////////////////////////////
    $scope.createLayout=function(){
        //console.log($scope.layout);
        //return false;

        API.post_details($scope.layout,'saveLayoutData').success(function(data){
            //console.log(data);
            $scope.pageLayoutData=data;
        }) 

    }
    /////////////////////////////////////////////
    $scope.addNewsFeed=function(){
        API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid,data:$scope.newsFeed},'saveNewsFeedData').success(function(data){
            //console.log(data);
            $scope.pageNewsFeedData=data;
        }) 
    }
    ///////////////////////////////////////////////
    $scope.deleteNews=function(data,index){
        console.log(data);
        
    }
    /////////////////////////////////////////////
    $scope.addHtmlData=function(){
        console.log($scope.htmlData);
        API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid,data:$scope.htmlData},'saveHtmlData').success(function(data){
            //console.log(data);
            $scope.pageHtmlData=data;
        })
    }
    //////////////////////////////////////////
    if($routeParams.Pid && $routeParams.Lid)
    {
        API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid},'allNewsData').success(function(data){
            //console.log(data);
            $scope.pageNewsFeedData=data;
        })
        API.post_details({'pid':$routeParams.Pid,'lid':$routeParams.Lid},'htmlData').success(function(data){
            //console.log(data);
            $scope.pageHtmlData=data;
        })
    }
    
    //////////////////////////////////////////
   /* API.post_details('','allLayoutList').success(function(data){
            //console.log(data);
            $scope.allLayoutData=data;
        })
        */
    /////////////////////////////////////////////
    $scope.deletelayoutType=function(id,data){
        console.log(id);
       API.post_details({'id':id,'layoutData':data},'deleteLayout').success(function(data){
            //console.log(data);
            $scope.pageLayoutData=data;
        }) 
    }
    //////////////////////////
    $scope.changeLayoutViewType=function(data){
        API.post_details(data,'changeLayoutViewType').success(function(data){
            
            $scope.allLayoutData=data;
            //console.log($scope.replyData);
        })
    }
    ////////// all page list ///////
    API.post_details('','allPageList').success(function(data){
            //console.log(data);
            $scope.allPageData=data;
        })
    ////////////// create page //////////
    $scope.createPage=function(){
        //console.log($scope.page);
        API.post_details($scope.page,'createPage').success(function(data){
            
            $scope.allPageData=data;
            //console.log($scope.replyData);
        })
    }
    ///////////////// goto layout page ///////
    $scope.showAllLayoutOfPage=function(data){
        $location.path("/layout/"+data._id);
    }
    ////////////////// goto app page ///////////
    $scope.goToAppPage=function(id,data){
        $location.path("/createApplicationCtrl/"+id+'/'+data._id);
    }
    ////////////////// goto news feed page ///////////
    $scope.goToFeedPage=function(id,data){
        $location.path("/newsFeedSection/"+id+'/'+data._id);
    }
    ////////////////// goto news feed page ///////////
    $scope.goToHtmlPage=function(id,data){
        $location.path("/htmlContentSection/"+id+'/'+data._id);
    }
    //////////////// delete html ////////////////////
    $scope.deleteHtmlData=function(data){
        console.log(data);

    }
    ////////////////////////////// delete page ///////////
    $scope.deletePage=function(data){
        //console.log(data);
        //return false;
        API.post_details(data,'deletePage').success(function(data){
            
            $scope.allPageData=data;
            //console.log($scope.replyData);
        })
    }
})
.controller('appLandinPageBg',function($scope,BASE_URL,$routeParams,$rootScope,Upload,API,$location){
    $scope.domain    = BASE_URL;
    // Show login screen data
    API.post_details('','loginPageBgImage').success(function(data){
        
        $scope.replyData=data;
        console.log($scope.replyData);
    })
    //  add image for app login//
    $scope.submitAppLoginPageImageForm=function(){
       // $scope.dataChield.parentId=$routeParams.id;
        
        Upload.upload({
          url: BASE_URL+'/api/submitAppLoginPageImageForm',
          //file: params.file,   // Image to upload

          data: {
            file        : $scope.data.file, 
          } 
        }).then(function (resp) {
            console.log(resp);
            $scope.replyData=resp.data;
            
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        });
    }
    // delete login page image //
    $scope.deleteLoginPageImage=function(data){
        console.log(data);
        
        API.post_details(data,'loginPageBgImageDelete').success(function(data){
            
            $scope.replyData=data;
            //console.log($scope.replyData);
        })
    }

})
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}])
.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    transclude: true, // Insert custom content inside the directive
    link: function(scope, element, attrs) {
      console.log('attrs: ' , attrs);
      scope.dialogStyle = {};
      if (attrs.boxWidth) {
        scope.dialogStyle.width = attrs.boxWidth;
      }
      if (attrs.boxHeight) {
        scope.dialogStyle.height = attrs.boxHeight;
      }
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: 'modalDialog.html'
  };
})