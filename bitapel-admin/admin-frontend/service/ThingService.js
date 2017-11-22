sap.ui.define([
], function () {
    "use strict";

    return {

        createThing : function (uId, bId, newThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/thing/create/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(newThing),
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

        saveThing : function (uId, bId, editedThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "PUT",
                        url: "/api/thing/update/" + uId + "?bId=" + encodeURIComponent(bId),
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(editedThing),
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

        getThingById : function(thingId, bId, uId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/thing/" + uId + "/" + thingId + "?bId=" + encodeURIComponent(bId),
                        contentType: 'application/json; charset=UTF-8',
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

        getThings : function(bId, uId) {
    
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/things/" + uId + "?bId=" + encodeURIComponent(bId),
                        contentType: 'application/json; charset=UTF-8',
                        success: function(res){
                            var n = res.length;
 
                            res.sort(function compare(a, b) {

                                if (parseInt(a.creationTimestamp) < parseInt(b.creationTimestamp)){
                                    return 1;  
                                }
                                  
                                if (parseInt(a.creationTimestamp) > parseInt(b.creationTimestamp)){
                                    return -1;  
                                }

                                return 0;
                            });
                                                        
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

        getThingBuyAndSale : function(tId, uId, bId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/events/buyandsale/" + tId+ "/" + uId + "?bId=" + encodeURIComponent(bId),
                        contentType: 'application/json; charset=UTF-8',
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

        getThingInfo : function(tId, uId, bId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/events/info/" + tId+ "/" + uId + "?bId=" + encodeURIComponent(bId),
                        contentType: 'application/json; charset=UTF-8',
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
         
        getThingDamage : function(tId, uId, bId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/events/damage/" + tId+ "/" + uId + "?bId=" + encodeURIComponent(bId),
                        contentType: 'application/json; charset=UTF-8',
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