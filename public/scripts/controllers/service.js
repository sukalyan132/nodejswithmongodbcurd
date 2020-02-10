angular.module('formAndView.services', [])

    .factory('API', function ( $http,BASE_URL) {
	var base2= BASE_URL+"/api/";
	
        return {
					get_details : function (url) {
						return $http.get(base2,
											  {
												  method : 'GET',  
												  headers:{'Content-Type': 'application/json'}
											  }
											  );
						
					},
					post_details2 : function (url,form) {
						return $http.post(base2+url,
											form,
											  {
												  method : 'POST',  
												 // headers:{"Content-Type": "application/json"}
												  headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
											  }
											  );
						
					},
					post_details3 : function (url,form) {
						return $http.post(base2+url,
											form,
											  {
												  method : 'POST',  
												 // headers:{"Content-Type": "application/json"}
												  headers: { 'Content-Type': 'undefined'},
											  }
											  );
						
					},
					post_details : function (form,url) {
						return $http.post(base2+url,
											 form,
											  {
												  method : 'POST',  
												  headers:{'Content-Type': 'application/json'}
											  }
											  );
						
					}
				}
    })
.service('holdobj',function(){

	var myobj;

	this.set= function(obj){
	 myobj = obj;
	};

	this.get= function(){
	 return myobj;
	};

})
