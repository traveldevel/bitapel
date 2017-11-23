sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/unified/DateRange',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter',
		'history/for/every/thing/ui/service/ThingService',
	], function (BaseController, JSONModel, MessageToast, DateRange, Device, formatter, ThingService) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.ThingCard", {
			
			formatter: formatter,

			thingId : null,

			onInit: function () {
				var oViewModel = new JSONModel({
					isPhone : Device.system.phone,
				});

				this.setModel(oViewModel, "view");

				Device.media.attachHandler(function (oDevice) {
					this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
				}.bind(this));

				if(sessionStorage.uId === undefined || sessionStorage.uId.length === 0){
					this.getRouter().navTo("login");
				}

				this.getRouter().getRoute("thingCard").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();
				
				this.thingId = oEvent.getParameters().arguments.id;				

				var uId = sessionStorage.getItem("uId");
				var bId = sessionStorage.getItem("bId");

				oView.setBusy(true);

				var that = this;

				ThingService.getThingById(this.thingId, bId, uId).then(function(thing){
					console.log(thing);

					that.selectedThing = thing;

					oView.byId('thingName').setText("Thing Name : " + thing.name);

					var root = location.protocol + '//' + location.host;
					var data = root + "/thingHistory.html?tId=" + thing.id + "&uId=" + uId + "&bId=" + encodeURIComponent(bId);
					var imageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=" + encodeURIComponent(data);
					console.log(imageUrl);

					oView.byId('thingUrl').setValue(data);

					oView.byId('cardImage').setSrc(imageUrl);
					
					oView.setBusy(false);
				});
			},

			onPrint: function(){
				window.print();
			}
		});
});