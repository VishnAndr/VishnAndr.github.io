sap.ui.define([
	"sap/client/basecontrols/core/CustomPane"
], function(CustomPane) {
	"use strict";

	// Provides control zcustom.frasers.ui5lib.control.ZCustomEmptyPane
	var ZFeederEnhancementPane = CustomPane.extend("zcustom.frasers.ui5lib.control.ZFeederEnhancementPane", /** @lends zcustom.frasers.ui5lib.control.ZFeederEnhancementPane.prototype */ {
		metadata: {

			library: "zcustom.frasers.ui5lib",
			properties: {},
			aggregations: {},
			events: {}
		},

		renderer: function(oRM, oControl) {
			jQuery.sap.log.info(">> renderer");

			if (!oControl.getVisible()) {
				return;
			}

			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("sapClientCodSeodFeeder");
			// oRM.renderControl(oControl.oLayout);
			oRM.write("</div>");
		},

		initializePane: function() {
			debugger;
			jQuery.sap.log.info(">> initializePane");

			var that = this;

			this._initializeControls();

			this.getModel().attachDataContainerUpdateFinished(function() {
				that._onDataContainerUpdateFinished();
			});
		},

		aControls: [],
		fFromUser: false,
		fToAccount: false,
		fToVendor: false,
		fToAgent: false,
		sUserEmail: "",
		oCurrentFeeder: null,

		_getControls: function(iIndex) {
			jQuery.sap.log.info(">> _getControls");

			var that = this;

			if (!this.aControls[iIndex]) {
				var oControls = {};

				oControls.oFromUser = new sap.ui.commons.CheckBox({
					text: "Use user’s email as sender",
					tooltip: "Use user’s email as sender",
					checked: true,
					change: function(oObjectChanged) {
						that._onFromUserChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oFromUser.addStyleClass("outlookBox");

				oControls.oToAccount = new sap.ui.commons.CheckBox({
					text: "Use Account’s email as recipient",
					tooltip: "Use Account’s email as recipient",
					checked: false,
					change: function(oObjectChanged) {
						that._onToAccountChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oToAccount.addStyleClass("outlookBox");

				oControls.oToVendor = new sap.ui.commons.CheckBox({
					text: "Use Partner’s email as recipient",
					tooltip: "Use Partner’s email as recipient",
					checked: true,
					change: function(oObjectChanged) {
						that._onToVendorChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oToVendor.addStyleClass("outlookBox");

				oControls.oToAgent = new sap.ui.commons.CheckBox({
					text: "Use Agent’s email as recipient",
					tooltip: "Use Agent’s email as recipient",
					checked: false,
					change: function(oObjectChanged) {
						that._onToAgentChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oToAgent.addStyleClass("outlookBox");

				oControls.oRecipientLayout = new sap.ui.commons.layout.VerticalLayout({
					width: "100%",
					content: [oControls.oToAccount, oControls.oToVendor, oControls.oToAgent]
				});

				this.aControls.splice(iIndex, 0, oControls);
			}

			return this.aControls[iIndex];
		},

		_initializeControls: function() {
			jQuery.sap.log.info(">> _initializeControls");

			var that = this;

			this.aControls = [];
			this.fFromUser = true;
			this.fToAccount = false;
			this.fToVendor = true;
			this.fToAgent = false;

			this._onRecipientChange();
			this._onFromUserChange(this.fFromUser);

			/*			this.oRecipientLayout = null;
						this.oFromUser = null;
						this.oToAccount = null;
						this.oToVendor = null;
						this.oToAgent = null;

						this.oFromUser = new sap.ui.commons.CheckBox({
							text: "Use user’s email as sender",
							tooltip: "Use user’s email as sender",
							checked: true,
							change: function() {
								that._onFromUserChange();
							}
						});
						this.oFromUser.addStyleClass("outlookBox");

						this.oToAccount = new sap.ui.commons.CheckBox({
							text: "Use Account’s email as recipient",
							tooltip: "Use Account’s email as recipient",
							checked: false,
							change: function() {
								that._onToAccountChange();
							}
						});
						this.oToAccount.addStyleClass("outlookBox");

						this.oToVendor = new sap.ui.commons.CheckBox({
							text: "Use Partner’s email as recipient",
							tooltip: "Use Partner’s email as recipient",
							checked: true,
							change: function() {
								that._onToVendorChange();
							}
						});
						this.oToVendor.addStyleClass("outlookBox");

						this.oToAgent = new sap.ui.commons.CheckBox({
							text: "Use Agent’s email as recipient",
							tooltip: "Use Agent’s email as recipient",
							checked: false,
							change: function() {
								that._onToAgentChange();
							}
						});
						this.oToAgent.addStyleClass("outlookBox");

						this.oRecipientLayout = new sap.ui.commons.layout.VerticalLayout({
							width: "100%",
							content: [this.oToAccount, this.oToVendor, this.oToAgent]
						});*/
		},

		onBeforeRendering: function() {
			jQuery.sap.log.info(">> onBeforeRendering");

		},

		onAfterRendering: function() {
			jQuery.sap.log.info(">> onAfterRendering");

			var that = this;

			//this._initializeControls();
			this.aControls = [];
			this._onDataContainerUpdateFinished();

			var iFeederId = 0;
			var oFeeder = null;
			var aCustomPanes = this.getController().getParentController()._oCurrentComponentModel._mNodeNames.CustomPane;

			for (var i = 0; i < aCustomPanes.length; i++) {
				var oCustomPane = aCustomPanes[i];
				//if (oCustomPane._cid && oCustomPane._cid.indexOf("feeder") >= 0) {
				//	oFeeder = sap.ui.getCore().byId(oCustomPane._cid);
				// !!!
				//_cid is not available anymore since 1802 for feeder
				//so let's search the latest one				
				if (oCustomPane._a && oCustomPane._a.jsTypeName && oCustomPane._a.jsTypeName.indexOf("Feeder") >= 0) {
					var tmpFeeder = null;
					for (var j = 0; j <= 9999; j++) {
						var sFeederId = "__feeder" + j;
						tmpFeeder = sap.ui.getCore().byId(sFeederId);
						if (tmpFeeder && tmpFeeder.oReplyLayout) {
							oFeeder = tmpFeeder;
						} else {
							break;
						}
					}
					if (oFeeder && oFeeder.oReplyLayout) {
						oFeeder.oReplyLayout.addContent(this._getNewLayout(iFeederId));
						oFeeder.addEventDelegate({
							onAfterRendering: function(oEvent) {
								that.oCurrentFeeder = oEvent.srcControl;
							}
						});
						iFeederId++;
						this.oCurrentFeeder = oFeeder;

						//set Use Microsoft Outlook® to false by default
						if (this.oCurrentFeeder.oOutlookScoped) {
							this.oCurrentFeeder.oOutlookScoped.setChecked(false);
						}
					}
				}
			}

			if (this.oCurrentFeeder) {
				var oThatFeeder = this.oCurrentFeeder;
				var origcancelButtonPress = this.oCurrentFeeder.cancelButtonPress;
				this.oCurrentFeeder.cancelButtonPress = function() {
					oThatFeeder.bIsReply = false; // right place to reset this bloody flag
					origcancelButtonPress.apply(oThatFeeder);
				};

				if (oThatFeeder.oEmailSendButton) {
					// and another right place to reset this bloody flag
					oThatFeeder.oEmailSendButton.attachPress(function() {
						oThatFeeder.bIsReply = false;
					});
				}
			}

			var oDataObject = this.getController().getParentController().getDataContainer().getDataObject(
				"/Root/zFeederRelevant/ToList");
			oDataObject.attachValueChanged(function() {
				var sReplyEmail = that._getValue("Root/zFeederRelevant/ReplyEmail");
				var sToList = that._getValue("/Root/zFeederRelevant/ToList");
				if (sReplyEmail) {
					if (sReplyEmail !== sToList) {
						that._onRecipientChange();
					}
				} else if (sToList !== that.sTo) {
					that._onRecipientChange();
				}
			});

			oDataObject = this.getController().getParentController().getDataContainer().getDataObject(
				"/Root/zFeederRelevant/NewToEmail");
			oDataObject.attachValueChanged(function() {
				var sReplyEmail = that._getValue("Root/zFeederRelevant/ReplyEmail");
				var sNewToEmail = that._getValue("/Root/zFeederRelevant/NewToEmail");
				if (sReplyEmail) {
					if (sReplyEmail !== sNewToEmail) {
						that._onRecipientChange();
					}
				} else if (sNewToEmail !== that.sTo) {
					that._onRecipientChange();
				}
			});
		},

		_getNewLayout: function(iIndex) {
			jQuery.sap.log.info(">> _getNewLayout");

			var oControls = this._getControls(iIndex);
			var oLayout = null;
			if (oControls) {
				oLayout = new sap.ui.commons.layout.VerticalLayout({
					width: "100%",
					content: [oControls.oFromUser, oControls.oRecipientLayout]
				});
			}

			return oLayout;
		},

		_onDataContainerUpdateFinished: function() {
			jQuery.sap.log.info(">> _onDataContainerUpdateFinished");

			this._onRecipientChange();
			this._onFromUserChange(this.fFromUser);
		},

		_onFromUserChange: function(fNewValue) {
			jQuery.sap.log.info(">> _onFromUserChange");

			try {
				if (this.fFromUser !== fNewValue || !this.sUserEmail) {
					this.fFromUser = fNewValue;

					for (var i = 0; i < this.aControls.length; i++) {
						if (this.aControls[i] && this.aControls[i].oFromUser.getChecked() !== fNewValue) {
							this.aControls[i].oFromUser.setChecked(fNewValue);
						}
					}

					if (this.fFromUser) {
						this.sUserEmail = this._getUserEmail();

						this._setFromField(this.sUserEmail);

					} else {
						this._setFromField("");
					}
				}
			} catch (err) {
				jQuery.sap.log.info("Error in _onFromUserChange: " + err.message); // eslint-disable-line no-console
			}
		},

		_onToAccountChange: function(fNewValue) {
			jQuery.sap.log.info(">> _onToAccountChange");

			if (this.fToAccount !== fNewValue) {
				this.fToAccount = fNewValue;

				for (var i = 0; i < this.aControls.length; i++) {
					if (this.aControls[i] && this.aControls[i].oToAccount.getChecked() !== fNewValue) {
						this.aControls[i].oToAccount.setChecked(fNewValue);
					}
				}

				this._onRecipientChange();
			}
		},

		_onToVendorChange: function(fNewValue) {
			jQuery.sap.log.info(">> _onToVendorChange");

			if (this.fToVendor !== fNewValue) {
				this.fToVendor = fNewValue;

				for (var i = 0; i < this.aControls.length; i++) {
					if (this.aControls[i] && this.aControls[i].oToVendor.getChecked() !== fNewValue) {
						this.aControls[i].oToVendor.setChecked(fNewValue);
					}
				}

				this._onRecipientChange();
			}
		},

		_onToAgentChange: function(fNewValue) {
			jQuery.sap.log.info(">> _onToAgentChange");

			if (this.fToAgent !== fNewValue) {
				this.fToAgent = fNewValue;

				for (var i = 0; i < this.aControls.length; i++) {
					if (this.aControls[i] && this.aControls[i].oToAgent.getChecked() !== fNewValue) {
						this.aControls[i].oToAgent.setChecked(fNewValue);
					}
				}

				this._onRecipientChange();
			}
		},

		_onRecipientChange: function() {
			jQuery.sap.log.info(">> _onRecipientChange");

			if (this.oCurrentFeeder) {
				if (this.oCurrentFeeder.bComposeNewEmail || this.oCurrentFeeder.bIsReply) {
					return;
				}
			}

			try {
				var cEMailAddressDelimiter = "; ";
				var sAccountEmail = this._getValue("/Root/ZAccountEmail");
				var sVendorEmail = this._getValue("/Root/ZVendorEmail");
				var sAgentEmail = this._getValue("/Root/ZAgentEmail");

				this.sTo = this._getValue("/Root/zFeederRelevant/ToList");
				this.sTo = "";

				if (this.fToAccount && sAccountEmail) {
					this.sTo = this.sTo.concat(sAccountEmail).concat(cEMailAddressDelimiter);
				}

				if (this.fToVendor && sVendorEmail) {
					this.sTo = this.sTo.concat(sVendorEmail).concat(cEMailAddressDelimiter);
				}

				if (this.fToAgent && sAgentEmail) {
					this.sTo = this.sTo.concat(sAgentEmail).concat(cEMailAddressDelimiter);
				}

				this._setValue("/Root/zFeederRelevant/ToList", this.sTo);
				this._setValue("/Root/zFeederRelevant/NewToEmail", this.sTo);
			} catch (err) {
				jQuery.sap.log.info("Error in _onFromUserChange: " + err.message); // eslint-disable-line no-console
			}
		},

		_setFromField: function(sValue) {
			jQuery.sap.log.info(">> _setFromField");

			try {
				this._setValue("/Root/zFeederRelevant/SelectedSMAPEmail", sValue);
			} catch (err) {
				jQuery.sap.log.info("Error in _setFromField: " + err.message); // eslint-disable-line no-console	
			}
		},

		_getUserEmail: function() {
			jQuery.sap.log.info(">> _getUserEmail");

			var sEmail = "";
			try {
				sEmail = this._getValue("/Root/ZCurrentUserEmail");
			} catch (err) {
				jQuery.sap.log.info("Error in _getUserEmail: " + err.message); // eslint-disable-line no-console	
			}

			return sEmail;
		},

		_setValue: function(sPath, sValue) {
			jQuery.sap.log.info(">> _setValue");

			var oController = this.getController();
			while (oController) {
				var oDataContainer = oController.getDataContainer();
				if (oDataContainer && oDataContainer.getDataObject(sPath)) {
					oDataContainer.getDataObject(sPath).setValue(sValue);
					break;
				}
				oController = oController.getParentController();
			}

		},

		_getValue: function(sPath) {
			jQuery.sap.log.info(">> _getValue");

			var sValue = "";

			var oController = this.getController();
			while (oController) {
				var oDataContainer = oController.getDataContainer();
				if (oDataContainer && oDataContainer.getDataObject(sPath)) {
					sValue = oDataContainer.getDataObject(sPath).getValue();
					break;
				}
				oController = oController.getParentController();
			}

			return sValue;
		}

	});

	return ZFeederEnhancementPane;

}, true);