(function () {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('PartnerFormService', PartnerFormService);

        PartnerFormService.$inject = ['$http'];
    function PartnerFormService($http) {
        var service = {};

        service.GetAll = GetAllPartners;
        service.GetById = GetPartnerById;
        service.GetByUsername = GetByPartnerName;
        service.Create = CreatePartner;
        service.Update = UpdatePartner;
        service.Delete = DeletePartner;

        return service;

        function GetAllPartners() {
            return $http.get('/api/getAllPartners').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetPartnerById(id) {
            return $http.get('/api/getPartnerById/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByPartnerName(username) {
            return $http.get('/api/getByPartnerName/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function CreatePartner(user) {
            return $http.post('/api/createPartner', user).then(handleSuccess, handleError('Error creating user'));
        }

        function UpdatePartner(user) {
            return $http.put('/api/updatePartner/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function DeletePartner(id) {
            return $http.delete('/api/deletePartner/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();