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
		return BaseController.extend("history.for.every.thing.ui.controller.ThingHistory", {
			
			formatter: formatter,

			thingId: null,

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

				this.getRouter().getRoute("thingHistory").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();

				this.thingId = oEvent.getParameters().arguments.id;

				var uId = sessionStorage.getItem("uId");
				var bId = sessionStorage.getItem("bId");

				oView.setBusy(true);

				var that = this;

				ThingService.getThingBuyAndSale(this.thingId, uId, bId).then(function(records){
					console.log(records);

					var oModel = that.getModel("selectedThingHistory");
					oModel.setProperty("/BuyAndSale", records);
					
					oView.setBusy(false);
				});
			}
		});
});