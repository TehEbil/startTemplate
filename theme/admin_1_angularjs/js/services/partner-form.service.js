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
        service.GetByPartnername = GetByPartnerName;
        service.Create = CreatePartner;
        service.Update = UpdatePartner;
        service.Delete = DeletePartner;

        return service;

        function GetAllPartners() {
            return $http.get('/api/getAllPartners').then(handleSuccess, handleError('Error getting all partners'));
        }

        function GetPartnerById(id) {
            return $http.get('/api/getPartnerById/' + id).then(handleSuccess, handleError('Error getting partner by id'));
        }

        function GetByPartnerName(partnername) {
            return $http.get('/api/getByPartnerName/' + partnername).then(handleSuccess, handleError('Error getting partner by partnername'));
        }

        function CreatePartner(partner) {
            return $http.post('/api/createPartner', partner).then(handleSuccess, handleError('Error creating partner'));
        }

        function UpdatePartner(partner) {
            return $http.put('/api/updatePartner/' + partner.id, partner).then(handleSuccess, handleError('Error updating partner'));
        }

        function DeletePartner(id) {
            return $http.delete('/api/deletePartner/' + id).then(handleSuccess, handleError('Error deleting partner'));
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