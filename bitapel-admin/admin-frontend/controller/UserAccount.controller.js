sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast',
		'sap/ui/Device',
		'history/for/every/thing/ui/model/formatter',
		'history/for/every/thing/ui/service/AccountService',
	], function (BaseController, JSONModel, MessageToast, Device, formatter, AccountService) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.UserAccount", {
			
			formatter: formatter,

			accountId: null,
			selectedAccount: null,

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

				this.getRouter().getRoute("userAccount").attachMatched(this.handleRouteMatched, this);
			},

			handleRouteMatched: function(oEvent){
				
				var oView = this.getView();

				this.accountId = oEvent.getParameters().arguments.id;

				var uId = sessionStorage.getItem("uId");
				var bId = sessionStorage.getItem("bId");

				oView.setBusy(true);

				var that = this;

				AccountService.getAccountById(this.accountId, bId, uId).then(function(account){
					console.log(account);

					that.selectedAccount = account;

					oView.byId("email").setValue(account.email);
					oView.byId("firstName").setValue(account.firstName);
					oView.byId("lastName").setValue(account.lastName);

					account.createdAt = new Date(account.createdAt);

					oView.setBusy(false);
				});
			},
			
			validateFormData: function(){
				
				var oView = this.getView();

				var errors = "";

				if(oView.byId('firstName').getValue().length === 0){
					errors += "Missing first name\r\n";
				}

				if(oView.byId('lastName').getValue().length === 0){
					errors += "Enter the last name\r\n";
				}	
				
				if(oView.byId('password').getValue().length > 0 && 
					oView.byId('confirmPassword').getValue().length > 0 && 
					oView.byId('password').getValue() !== oView.byId('confirmPassword').getValue()
				){
					errors += "Passwords do not match\r\n";
				}	

				if(errors.length > 0){
					MessageToast.show(errors);
					return false;
				}

				return true;
			},

			onSaveAccountPress: function(oEvent){

				var oView = this.getView();
				
				var that = this;

				var bId = sessionStorage.getItem('bId');
				var uId = sessionStorage.getItem('uId');

				if(this.validateFormData()){

					var editedAccount = {
						"id": sessionStorage.getItem("uId"),
						"firstName": oView.byId('firstName').getValue(),
						"lastName": oView.byId('lastName').getValue()
					}

					if(oView.byId('password').getValue().length > 0 &&
						oView.byId('password').getValue() === oView.byId('confirmPassword').getValue()){
						editedAccount.password = oView.byId('password').getValue()
					}
					else
					{
						editedAccount.password = null;
					}
	
					var oBusyDialog = this.getView().byId("busyDialog").open(); 

					AccountService.saveAccount(uId, bId, editedAccount).then(function(res){
						console.log(res);
	
						oBusyDialog.close();

						MessageToast.show("Account Changes Saved !");

						that.getRouter().navTo("home");
					});					
				}
			}
		});
});