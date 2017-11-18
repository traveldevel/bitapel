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
		return BaseController.extend("history.for.every.thing.ui.controller.ThingList", {
			
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

				this.getRouter().getRoute("things").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(){
				
				var oView = this.getView();

				var bId = sessionStorage.getItem('bId');
				var uId = sessionStorage.getItem('uId');

				var that = this;

				var oBusyDialog = this.getView().byId("busyDialog").open(); 

				ThingService.getThings(bId, uId).then(function(res){
					
					//console.log(res);
					
					var oThingsModel = that.getModel("userThings");
					oThingsModel.setData(res);
					that.setModel(oThingsModel, "userThings");

					oBusyDialog.close();
				});

				var sideMenuModel = that.getModel("side");
				sideMenuModel.loadData("/api/user/menu/" + sessionStorage.uId + "?bId=" + encodeURIComponent(sessionStorage.bId));
			},

			onThingSelected: function(oEvent){
				console.log(oEvent);

				var listItem = oEvent.getParameter("listItem"); 
				var sPath = listItem.getBindingContextPath();

				var oModel = oEvent.getSource().getModel("userThings");
				var itemValue = oModel.getProperty(sPath);

				console.log(itemValue);

				this.getRouter().navTo("editThing", { id : itemValue.id });
			}
		});
});