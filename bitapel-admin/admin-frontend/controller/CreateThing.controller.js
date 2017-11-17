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

				this.getRouter().getRoute("createThing").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(){
				
				var oView = this.getView();

				oView.byId('thingName').setValue('');
				oView.byId('thingSerial').setValue('');
				oView.byId('thingManufacturer').setValue('');
				oView.byId('thingType').setSelectedKey('');
				oView.byId('thingCategory').setSelectedKey('');

				var oCalendar = oView.byId('thingBuyDate');
				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
			},

			onSelectCategoryChange: function(oEvent){

				var oItem = oEvent.getSource().getSelectedItem();
				var selKey = oItem.getKey();
				//console.log(selKey, oItem);

				var oView = this.getView();
				var oTypeSelect = oView.byId("thingType");
				
				var oCategoryFilter = new sap.ui.model.Filter({
					path: "Category",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: selKey
				 });
				 
				 var oBinding = oTypeSelect.getBinding("items");

				 if(selKey !== undefined && selKey.length > 0){
					oBinding.filter([ oCategoryFilter ]);
				 }
				 else{
					oBinding.filter([]);
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

				var bId = sessionStorage.getItem('bId');
				var newId = this.newId();

				if(this.validateFormData()){

					var now = new Date();
	
					var buyDate = oView.byId('thingBuyDate').getSelectedDates()[0].getStartDate();
					buyDate.setHours(buyDate.getHours() + 5); // timezone bugfix
	
					var newThing = {
						"$class": "org.bitapel.model.Thing",
						"id": newId,                
						"owner": "resource:org.bitapel.model.User#id:" + bId,
						"name": oView.byId('thingName').getValue(),
						"serial": oView.byId('thingSerial').getValue(),
						"category": oView.byId('thingCategory').getSelectedItem().getText(),
						"manufacturer": oView.byId('thingManufacturer').getValue(),
						"type": oView.byId('thingType').getSelectedItem().getText(),
						"buyDate": buyDate.toISOString(),
						"creationTimestamp": now.getTime()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					ThingService.createThing(newThing).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Thing Saved !");

						that.getRouter().navTo("things");
					});
				}
			}
		});
});