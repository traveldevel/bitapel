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
		return BaseController.extend("history.for.every.thing.ui.controller.CreateMaintenanceEvent", {
			
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

				this.getRouter().getRoute("createMaintenanceEvent").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();

				this.thingId = oEvent.getParameters().arguments.id;

				oView.byId('recordedBy').setValue('');
				oView.byId('totalWorkingUnits').setValue('');
				oView.byId('totalWorkingUnitType').setSelectedKey('');
				oView.byId('maintenanceEntity').setValue('');
				oView.byId('maintenancePrice').setValue('');
				oView.byId('maintenancePriceCurrency').setValue('');
				oView.byId('maintenanceDetails').setValue('');

				var oCalendar = oView.byId('maintenanceDate');
				oCalendar.removeAllSelectedDates();
				oCalendar.addSelectedDate(new DateRange({startDate: new Date()}));
			},

			validateFormData: function(){

				var oView = this.getView();

				var errors = "";

				if(oView.byId('maintenanceDate').getSelectedDates().length === 0){
					errors += "Missing Maintenance Date\r\n";
				}

				if(oView.byId('recordedBy').getValue().length === 0){
					errors += "Enter the name for recorder\r\n";
				}	
				
				if(oView.byId('totalWorkingUnits').getValue().length === 0){
					errors += "Missing used working Maintenance no\r\n";
				}

				if(oView.byId('totalWorkingUnitType').getSelectedKey().length === 0){
					errors += "Select units\r\n";
				}

				if(oView.byId('maintenanceEntity').getValue().length === 0){
					errors += "Enter the name of Maintenance ntity\r\n";
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
	
					var MaintenanceDate = oView.byId('maintenanceDate').getSelectedDates()[0].getStartDate();
					MaintenanceDate.setHours(MaintenanceDate.getHours() + 5); // timezone bugfix
	
					var newEvent = {
						"$class": "org.bitapel.model.MaintenanceEvent",
						"id": newId,                
						"thing": "resource:org.bitapel.model.Thing#id:" + this.thingId,
						"owner": "resource:org.bitapel.model.User#id:" + bId,
						"recordedBy": oView.byId('recordedBy').getValue(),
						"totalWorkingUnits": oView.byId('totalWorkingUnits').getValue(),
						"totalWorkingUnitType": oView.byId('totalWorkingUnitType').getSelectedItem().getText(),
						"maintenanceDate": MaintenanceDate.toISOString(),
						"maintenanceEntity": oView.byId('maintenanceEntity').getValue(),
						"maintenancePrice": oView.byId('maintenancePrice').getValue(),
						"maintenancePriceCurrency": oView.byId('maintenancePriceCurrency').getValue(),						
						"maintenanceDetails": oView.byId('maintenanceDetails').getValue()
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 
	
					var that = this;

					EventService.createMaintenanceEvent(this.thingId, uId, bId, newEvent).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Maintenance Event Saved !");

						that.getRouter().navTo("thingHistory", { id : that.thingId});
					});
				}
			}
		});
});