sap.ui.define([
], function () {
    "use strict";

    return {

        createThing : function (uId, newThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: "/api/thing/create/" + uId,
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

        saveThing : function (uId, editedThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "PUT",
                        url: "/api/thing/update/" + uId,
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
                            
                            for(var i = 0; i < n; i++){
                                res[i].buyDate = Date.parse(res[i].buyDate);
                            }
 
                            res.sort(function compare(a, b) {

                                if (a.buyDate < b.buyDate){
                                    return 1;  
                                }
                                  
                                if (a.buyDate > b.buyDate){
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
        }
         
    };
});