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