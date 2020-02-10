'use strict';

angularApp.service('ViewService', function FormService($http) {

    var formsJsonPath = './static-data/sample_forms.json';

    return {
        fields:[
            {
                name : 'Title',
                value : 'titleDetails'
            },
            {
                name : 'imageDetails',
                value : 'imageDetails'
            },
            {
                name : 'Qrcode',
                value : 'qrcodeDetails'
            },
            {
                name : 'Fields',
                value : 'fieldsDetails'
            },
            {
                name : 'Footer',
                value : 'footerDetails'
            },
            {
                name : 'Description',
                value : 'descriptionDetails'
            }
        ],
        form:function (id) {
            // $http returns a promise, which has a then function, which also returns a promise
            return $http.get(formsJsonPath).then(function (response) {
                var requestedForm = {};
                angular.forEach(response.data, function (form) {
                    if (form.form_id == id) requestedForm = form;
                });
                return requestedForm;
            });
        },
        forms: function() {
            return $http.get(formsJsonPath).then(function (response) {
                return response.data;
            });
        }
    };
});
