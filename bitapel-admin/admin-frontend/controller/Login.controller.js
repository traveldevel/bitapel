sap.ui.define([
		'history/for/every/thing/ui/controller/BaseController',
		'sap/ui/model/json/JSONModel',
		'sap/ui/Device',
		'sap/m/MessageToast',
		'history/for/every/thing/ui/model/formatter'
	], function (BaseController, JSONModel, Device, MessageToast, formatter) {
		"use strict";
		return BaseController.extend("history.for.every.thing.ui.controller.Login", {
			formatter: formatter,

			onInit: function () {
				var oViewModel = new JSONModel({
					isPhone : Device.system.phone,
				});

				this.setModel(oViewModel, "view");

				Device.media.attachHandler(function (oDevice) {
					this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
				}.bind(this));

				if(sessionStorage.sessionID !== undefined){
					this.getRouter().navTo("home");
				}
			},

			onLoginPress: function(){

				var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				var oView = this.getView();

				var email = oView.byId("userEmail").getValue();
				var password = oView.byId("userPassword").getValue();

				if(email.length < 1){
					MessageToast.show(i18n.getText("loginNoEmailMessage"));
					return;
				}

				if(password.length < 1){
					MessageToast.show(i18n.getI18nText("loginNoPasswordMessage"));
					return;
				}

				oView.setBusy(true);
				
				var postData = {
					"email" : email,
					"password" : password
				}

				var that = this;

				$.ajax({
                    type : "POST",
                    contentType : "application/json",
                    url : "/api/user/login",
					dataType : "json",
					data: JSON.stringify(postData),
                    async: true, 
                    success : function(data, textStatus, jqXHR) {
						
						console.log("login response :", data);

						if(data._id !== undefined && data._id.length > 0){
							sessionStorage.uId = data._id;
							sessionStorage.email = data.email;
							sessionStorage.firstName = data.firstName;
							sessionStorage.lastName = data.lastName;

							var userModel = that.getModel("loggedUser");
							userModel.setData(data);
							that.setModel(userModel, "loggedUser");					

							oView.setBusy(false);
							that.getRouter().navTo('home');		

							$.getJSON("/api/user/which/" + data._id, function(data){

								if(data.id !== undefined){
									sessionStorage.bId = data.id;	

									var sideMenuModel = that.getModel("side");
									sideMenuModel.loadData("/api/user/menu/" + sessionStorage.uId + "?bId=" + encodeURIComponent(sessionStorage.bId));								

									var alertsModel = that.getModel("alerts");
									alertsModel.loadData("/api/user/alerts/" + sessionStorage.uId + "?bId=" + encodeURIComponent(sessionStorage.bId));										
								}
								else{
									sessionStorage.clear();
								}
							});
						}
						else
						{
							MessageToast.show("Login Error");
							oView.setBusy(false);
						}
                    },
                    error : function(data, textStatus, jqXHR) {

						MessageToast.show(i18n.getI18nText("loginErrorMessage"));
						oView.setBusy(false);

						sessionStorage.clear();
					}
				});
			}
		});
});