sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter'
	], function (BaseController, JSONModel, Device, formatter) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.Links", {
			
			formatter: formatter,

			onInit: function () {
				var oViewModel = new JSONModel({
					isPhone : Device.system.phone,
				});

				this.setModel(oViewModel, "view");

				Device.media.attachHandler(function (oDevice) {
					this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
				}.bind(this));
			}
		});
});