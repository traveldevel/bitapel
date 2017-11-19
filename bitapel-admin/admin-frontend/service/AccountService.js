sap.ui.define([
], function () {
    "use strict";

    return {

        saveAccount : function (uId, editedAccount) {

            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "PUT",
                        url: "/api/user/update/" + uId,
                        dataType   : 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(editedAccount),
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

        getAccountById : function(accountId, bId, uId) {
            
            var promise = new Promise(
                function(resolve, reject){

                    $.ajax({
                        type: "GET",
                        url: "/api/user/" + uId + "?bId=" + encodeURIComponent(bId),
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