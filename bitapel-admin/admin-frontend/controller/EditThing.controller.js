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
		return BaseController.extend("history.for.every.thing.ui.controller.EditThing", {
			
			formatter: formatter,

			thingId: null,
			selectedThing: null,

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

				this.getRouter().getRoute("editThing").attachMatched(this.handleRouteMatched, this);
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

					oView.byId('thingName').setValue(thing.name);
					oView.byId('thingSerial').setValue(thing.serial);
					oView.byId('thingManufacturer').setValue(thing.manufacturer);

					var thingProperties = that.getModel('thingProperties').getData();

					var selType = "";
					for(var i = 0; i < thingProperties.thingTypes.length; i++){
						if(thingProperties.thingTypes[i].Text === thing.type){
							selType = thingProperties.thingTypes[i].Key;
						}
					}
					oView.byId('thingType').setSelectedKey(thing.selType);

					var selCategory = "";
					for(var i = 0; i < thingProperties.thingCategories.length; i++){
						if(thingProperties.thingCategories[i].Text === thing.category){
							selCategory = thingProperties.thingCategories[i].Key;
						}
					}					
					oView.byId('thingCategory').setSelectedKey(selCategory);

					thing.buyDate = new Date(thing.buyDate);
					thing.creationTimestamp = new Date(thing.creationTimestamp);

					var oCalendar = oView.byId('thingBuyDate');
					oCalendar.removeAllSelectedDates();
					oCalendar.addSelectedDate(new DateRange({startDate: thing.buyDate}));

					oView.setBusy(false);
				});
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

			onSaveThingPress: function(oEvent){

				var oView = this.getView();
				
				var that = this;

				var bId = sessionStorage.getItem('bId');
				var uId = sessionStorage.getItem('uId');

				if(this.validateFormData()){

					var now = new Date();
	
					var buyDate = oView.byId('thingBuyDate').getSelectedDates()[0].getStartDate();
					buyDate.setHours(buyDate.getHours() + 5); // timezone bugfix
	
					var editedThing = {
						"$class": "org.bitapel.model.Thing",
						"id": this.thingId,
						"owner": "resource:org.bitapel.model.User#id:" + bId,                
						"name": oView.byId('thingName').getValue(),
						"serial": oView.byId('thingSerial').getValue(),
						"category": oView.byId('thingCategory').getSelectedItem().getText(),
						"manufacturer": oView.byId('thingManufacturer').getValue(),
						"type": oView.byId('thingType').getSelectedItem().getText(),
						"buyDate": buyDate.toISOString(),
						"creationTimestamp": this.selectedThing.creationTimestamp.getTime()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					ThingService.saveThing(uId, editedThing).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Thing Saved !");

						that.getRouter().navTo("things");
					});
				}
			}
		});
});