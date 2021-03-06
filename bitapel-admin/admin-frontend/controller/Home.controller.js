sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter'
	], function (BaseController, JSONModel, Device, formatter) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.Home", {
			
			formatter: formatter,

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

				this.getRouter().getRoute("home").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				console.log("home refresh ???");
			},

			onUserAccountPress: function(oEvent){
				this.getRouter().navTo("userAccount", {id : sessionStorage.getItem("uId")});
			}
		});
});