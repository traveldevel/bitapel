sap.ui.define([
], function () {
    "use strict";

    return {

        createBuyEvent: function (tId, uId, bId, newEvent) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/buy/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                           reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        },

        createInfoEvent: function (tId, uId, bId, newEvent) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/info/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        },
        
        createMaintenanceEvent: function (tId, uId, bId, newEvent) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/maintenance/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        },           

        createDamageEvent: function (tId, uId, bId, newEvent) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/damage/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        },        

        createRepairEvent: function (tId, uId, bId, newEvent) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/repair/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        },

        createSellEvent: function (tId, uId, bId, newEvent) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/event/sell/create/" + tId + "/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newEvent),
                        success: function(res){
                            resolve(res);
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            reject(errorThrown);
                        }
                    });
                }
            );

            return promise;
        } 

    };
});