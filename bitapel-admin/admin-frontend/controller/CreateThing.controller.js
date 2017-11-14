sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter',
		'history/for/every/thing/ui/service/ThingService',
	], function (BaseController, JSONModel, MessageToast, Device, formatter, ThingService) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.CreateThing", {
			
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
			},

			validateFormData: function(){

				var oView = this.getView();

				var errors = "";

				if(oView.byId('thingBuyDate').getSelectedDates().length === 0){
					errors += "Missing buy date\r\n";
				}

				if(oView.byId('thingName').getValue().length === 0){
					errors += "Enter the name\r\n";
				}	
				
				if(oView.byId('thingSerial').getValue().length === 0){
					errors += "Missing serial no\r\n";
				}

				if(oView.byId('thingManufacturer').getValue().length === 0){
					errors += "No manufacturer\r\n";
				}	

				if(errors.length > 0){
					MessageToast.show(errors);
					return false;
				}

				return true;
			},

			onCreateThingPress: function(oEvent){

				var oView = this.getView();

				var that = this;

				if(this.validateFormData()){

					var now = new Date();
	
					var buyDate = oView.byId('thingBuyDate').getSelectedDates()[0].getStartDate();
					buyDate.setHours(buyDate.getHours() + 5); // timezone bugfix
	
					var newThing = {
						"$class": "org.bitapel.model.Thing",
						"id": sessionStorage.getItem('uId') + '-' + now.getTime(),                
						"owner": "resource:org.bitapel.model.User#id:" + sessionStorage.getItem('bId'),
						"name": oView.byId('thingName').getValue(),
						"serial": oView.byId('thingSerial').getValue(),
						"category": oView.byId('thingCategory').getSelectedItem().getText(),
						"manufacturer": oView.byId('thingManufacturer').getValue(),
						"type": oView.byId('thingType').getSelectedItem().getText(),
						"buyDate": buyDate.toISOString()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					ThingService.createThing(newThing).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Thing Saved !");

						that.getRouter().navTo("home");
					});
				}
			}
		});
});