sap.ui.define([
], function () {
    "use strict";

    return {

        createThing : function (newThing) {
            
            var promise = new Promise(
                function(resolve, reject){
                    resolve("ok from promise");
                }
            );

            return promise;
        }
    };
});