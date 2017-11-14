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
        }
    };
});