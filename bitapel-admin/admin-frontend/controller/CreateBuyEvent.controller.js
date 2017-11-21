sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/unified/DateRange',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter',
		'history/for/every/thing/ui/service/EventService',
	], function (BaseController, JSONModel, MessageToast, DateRange, Device, formatter, EventService) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.CreateBuyEvent", {
			
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

				this.getRouter().getRoute("createBuyEvent").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();

				this.thingId = oEvent.getParameters().arguments.id;

				oView.byId('recordedBy').setValue('');
				oView.byId('totalWorkingUnits').setValue('');
				oView.byId('totalWorkingUnitsType').setSelectedKey('');
				oView.byId('buyFrom').setValue('');
				oView.byId('buyPrice').setValue('');
				oView.byId('buyPriceCurrency').setValue('');
				oView.byId('buyDetails').setValue('');

				var oCalendar = oView.byId('buyDate');
				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
			},

			validateFormData: function(){

				var oView = this.getView();

				var errors = "";

				if(oView.byId('buyDate').getSelectedDates().length === 0){
					errors += "Missing Buy Date\r\n";
				}

				if(oView.byId('recordedBy').getValue().length === 0){
					errors += "Enter the name for recorder\r\n";
				}	
				
				if(oView.byId('totalWorkingUnits').getValue().length === 0){
					errors += "Missing used working info no\r\n";
				}

				if(oView.byId('totalWorkingUnitType').getSelectedKey().length === 0){
					errors += "Select units\r\n";
				}			

				if(errors.length > 0){
					MessageToast.show(errors);
					return false;
				}

				return true;
			},

			onCreateEventPress: function(oEvent){

				var oView = this.getView();

				var that = this;

				var bId = sessionStorage.getItem('bId');

				var uId = sessionStorage.getItem('uId');

				var newId = this.newId();

				if(this.validateFormData()){

					var now = new Date();

					var uId = sessionStorage.getItem("uId");
					var bId = sessionStorage.getItem("bId");					
	
					var buyDate = oView.byId('buyDate').getSelectedDates()[0].getStartDate();
					buyDate.setHours(buyDate.getHours() + 5); // timezone bugfix
	
					var newEvent = {
						"$class": "org.bitapel.model.BuyEvent",
						"id": newId,                
						"thing": "resource:org.bitapel.model.Thing#id:" + this.thingId,
						"owner": "resource:org.bitapel.model.User#id:" + bId,
						"recordedBy": oView.byId('recordedBy').getValue(),
						"totalWorkingUnits": oView.byId('totalWorkingUnits').getValue(),
						"totalWorkingUnitType": oView.byId('totalWorkingUnitType').getSelectedItem().getText(),
						"buyDate": buyDate.toISOString(),
						"buyFrom": oView.byId('buyFrom').getValue(),
						"buyPrice": oView.byId('buyPrice').getValue(),
						"buyPriceCurrency": oView.byId('buyPriceCurrency').getValue(),
						"buyDetails": oView.byId('buyDetails').getValue()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					var that = this;

					EventService.createBuyEvent(this.thingId, uId, bId, newEvent).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Buy Event Saved !");

						that.getRouter().navTo("thingHistory", { id : that.thingId});
					});
				}
			}
		});
});