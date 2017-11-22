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
		return BaseController.extend("history.for.every.thing.ui.controller.CreateDamageEvent", {
			
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

				this.getRouter().getRoute("createDamageEvent").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();

				this.thingId = oEvent.getParameters().arguments.id;

				oView.byId('recordedBy').setValue('');
				oView.byId('totalWorkingUnits').setValue('');
				oView.byId('totalWorkingUnitType').setSelectedKey('');
				oView.byId('damageDetails').setValue('');

				var oCalendar = oView.byId('damageDate');
				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
			},

			validateFormData: function(){

				var oView = this.getView();

				var errors = "";

				if(oView.byId('damageDate').getSelectedDates().length === 0){
					errors += "Missing Damage Date\r\n";
				}

				if(oView.byId('recordedBy').getValue().length === 0){
					errors += "Enter the name for recorder\r\n";
				}	
				
				if(oView.byId('totalWorkingUnits').getValue().length === 0){
					errors += "Missing used working Damage no\r\n";
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
	
					var DamageDate = oView.byId('damageDate').getSelectedDates()[0].getStartDate();
					DamageDate.setHours(DamageDate.getHours() + 5); // timezone bugfix
	
					var newEvent = {
						"$class": "org.bitapel.model.DamageEvent",
						"id": newId,                
						"thing": "resource:org.bitapel.model.Thing#id:" + this.thingId,
						"owner": "resource:org.bitapel.model.User#id:" + bId,
						"recordedBy": oView.byId('recordedBy').getValue(),
						"totalWorkingUnits": oView.byId('totalWorkingUnits').getValue(),
						"totalWorkingUnitType": oView.byId('totalWorkingUnitType').getSelectedItem().getText(),
						"damageDate": DamageDate.toISOString(),
						"damageDetails": oView.byId('damageDetails').getValue()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					var that = this;

					EventService.createDamageEvent(this.thingId, uId, bId, newEvent).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Damage Event Saved !");

						that.getRouter().navTo("thingHistory", { id : that.thingId});
					});
				}
			}
		});
});