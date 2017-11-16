sap.ui.define([
], function () {
    "use strict";

    return {

        createThing : function (newThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "POST",
                        url: fabricUrl + "/api/Thing",
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

        saveThing : function (editedThing) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "PUT",
                        url: fabricUrl + "/api/Thing/" + editedThing.id,
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

        getThingById : function(thingId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: fabricUrl + "/api/Thing/" + thingId,
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

        getThings : function(bId) {
    
            var filter = {
                where: {
                    owner: "resource:org.bitapel.model.User#id:" + bId
                }
            };

            var filterQuery = encodeURIComponent(JSON.stringify(filter));

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: fabricUrl + "/api/Thing?filter=" + filterQuery,
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