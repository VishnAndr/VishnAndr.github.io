sap.ui.define([
	"sap/client/basecontrols/core/CustomPane"
], function (CustomPane) {
	"use strict";

	// Provides control zcustom.frasers.ui5lib.control.ZCustomEmptyPaneV2
	var ZFeederEnhancementPaneV2 = CustomPane.extend("zcustom.frasers.ui5lib.control.ZFeederEnhancementPaneV2", /** @lends zcustom.frasers.ui5lib.control.ZFeederEnhancementPaneV2.prototype */ {
		metadata: {

			library: "zcustom.frasers.ui5lib",
			properties: {},
			aggregations: {},
			events: {}
		},

		renderer: function (oRM, oControl) {
			jQuery.sap.log.debug(">> renderer", "", "zCustomPane");

			if (!oControl.getVisible()) {
				return;
			}

			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("sapClientCodSeodFeeder");
			// oRM.renderControl(oControl.oLayout);
			oRM.write("</div>");
		},

		initializePane: function () {
			jQuery.sap.log.debug(">> initializePane", "", "zCustomPane");

			var that = this;

			this._initParameters();

			if (sap.client.getCurrentApplication().isNewUI()) {
				var _feederECController = this._fetchFeederECController(this._feederECName);
				if (_feederECController) {
					// standard EC already available
					this._onChildControllerAdded();
				}

				// listen to event ChildControllerAdded to get any feeder change
				this.getController().getParentController().attachEvent("ChildControllerAdded", this, this._onChildControllerAdded, this);
			} else {
				this._initializeControls();
			}

			this.getModel().attachDataContainerUpdateFinished(function () {
				that._onDataContainerUpdateFinished();
			});
		},

		_initParameters: function () {
			this._feederECName = "";

			this._sToPath = "";
			this._sToPathOutlook = "";
			this._sFromPath = "";

			if (sap.client.getCurrentApplication().isNewUI()) {
				this._feederECName = "COD_Interactions_EC";

				this._sToPath = "/Root/Feeder/Email/ToList";
				this._sToPathOutlook = "";
				this._sFromPath = "/Root/Feeder/Email/From";

				// for Fiori we're doing it here once, controls will stay
				this.fFromUser = true;
				this.fToAccount = false;
				this.fToVendor = true;
				this.fToAgent = false;

				this._bIsReply = false;

				this._loadFirstTime = true;
			} else {

				this._sToPath = "/Root/zFeederRelevant/ToList";
				this._sToPathOutlook = "/Root/zFeederRelevant/NewToEmail";
				this._sFromPath = "/Root/zFeederRelevant/SelectedSMAPEmail";
			}
		},

		_onChildControllerAdded: function (oEvent) {
			try {
				if (oEvent.oSource._aChildController.length > 0) {
					//					if (oEvent.oSource._aChildController[oEvent.oSource._aChildController.length - 1].getEmbeddingContext()._a.embedName === this._feederECName) {
					//					fix 18/04/2019 AV: commented above to cover copy-paste use case when this._feederECName copied to somewhere
					//					then it will have this._feederECName + something else as embedName => now we use indexOf to find substrting
					var embedName = oEvent.oSource._aChildController[oEvent.oSource._aChildController.length - 1].getEmbeddingContext()._a.embedName;
					if (embedName.indexOf(this._feederECName) !== -1) {
						// we're checking the latest added child controller above
						// and if it matches the required one, we will proceed
						this._fetchFeederECController(embedName);
					}
				}
			} catch (ex) {
				// it may happen, no issues
				return;
			}

		},

		_enhanceInlineResponse: function () {

			if (this._oInlineResponse && this._oInlineResponse._inlineResponseLayout) {
				this._oInlineResponse._inlineResponseLayout.addContent(this._getNewLayoutRUI());

				this._oInlineResponse.invalidate(); // trigger rerendering

				this._onRecipientChange();
				if (this.fFromUser) {
					this.sUserEmail = this._getUserEmail();

					this._setFromField(this.sUserEmail);
				}
			}
		},

		_onECInterActionFinished: function (oEvent) {
			if (sap.client.getCurrentApplication().isNewUI()) {
				try {
					// get the feeder from the event's source
					var feederName = oEvent.getSource().getEmbeddingContext()._a.embedName;
					var _feederECController = this.getController().getParentController().getChildController(feederName);

					var oNewInlineResponse = _feederECController.getBaseControl().getContent()[0].getContent();
				} catch (ex) {
					// inlineResponse is not found or some error - we're leaving
					return;
				}

				try {
					if (!this._oInlineResponse || // first call or ...
						(oNewInlineResponse && (oNewInlineResponse instanceof sap.client.cod.seod.RUIResponse.InlineResponse) && this._oInlineResponse.getId() !==
							oNewInlineResponse.getId())) { //... or if InlineResponse changed

						// if it's a new inlineResponse instance ->> we need to initialize data objects
						if (this._oInlineResponse && oNewInlineResponse && (oNewInlineResponse instanceof sap.client.cod.seod.RUIResponse.InlineResponse) &&
							this._oInlineResponse.getId() !==
							oNewInlineResponse.getId()) {
							this._loadFirstTime = true;
						}

						this._oInlineResponse = oNewInlineResponse;

						if (this._loadFirstTime) {
							this._loadFirstTime = false;

							//Attach event listner for UIDesigner events
							this._oInlineResponse.getController().getEventProcessor().attachEvent(sap.client.evt.EventProcessor.EVENTS.EVENT_FIRED, this._eventCallback,
								this);

							this._oToDataObject = _feederECController.getDataContainer().getDataObject(this._sToPath);
							this._oFromDataObject = _feederECController.getDataContainer().getDataObject(this._sFromPath);
							this._oURIDataObject = _feederECController.getDataContainer().getDataObject("/Root/Feeder/Email/EmailURI");

							//we don't need to subscribe to this._oToDataObject on valuechanged anymore
							//because we moved the logic to _eventCallback to prevent reseting To field if the user adds the entry manually
							//from + button (employee, contact, customer)

							if (this._oFromDataObject) {
								this._oFromDataObject.attachValueChanged(function (oEventValueChanged) {
									this.sUserEmail = this._getUserEmail();
									if (this.fFromUser && oEventValueChanged.getParameter("value") !== this.sUserEmail) {
										this._setFromField(this.sUserEmail);
									}
								}.bind(this));
							}

							if (this._oURIDataObject) {
								this._oURIDataObject.attachValueChanged(function (oEventValueChanged) {
									this._composeEmailURI();
								}.bind(this));
							}
						}
						// this is the required InlineResponse to add custom checkboxes to

						if (!this._oInlineResponse._inlineResponseLayout) {

							if (this._oInlineResponse._initializeInlineControl.getFormattedValue() == true) {
								// inlineResponse is scoped, but not yet rendered completely, we need to wait
								this.wait4InlineResponse = true;
							} else {
								// inlineResponse is not scoped, no layout will be there, we need to create a new one
								this._oInlineResponse._inlineResponseLayout = new sap.ui.layout.VerticalLayout();
								this._oInlineResponse._inlineResponseLayout.addStyleClass("ruiResponseInlineResponseLayout");
							}
						}

						if (this._oInlineResponse._inlineResponseLayout) {
							this._enhanceInlineResponse();
						}
					}
				} catch (ex) {
					jQuery.sap.log.debug("Error in _onECInterActionFinished: " + ex.message); // eslint-disable-line no-console
				}
			}
		},

		_fetchFeederECController: function (ecControllerName) {
			try {
				var _feederECController = this.getController().getParentController().getChildController(ecControllerName);

				if (_feederECController) {
					_feederECController.attachEvent("ECInterActionFinished", this, this._onECInterActionFinished, this);
				}
			} catch (ex) {
				_feederECController = undefined;
			}
			return _feederECController;
		},

		aControls: [],
		fFromUser: false,
		fToAccount: false,
		fToVendor: false,
		fToAgent: false,
		sUserEmail: "",
		oCurrentFeeder: null,
		newButtonPressed: false,
		wait4InlineResponse: false,

		_eventCallback: function (eventContext) {
			// it might be possible to move all determination and substitution here
			switch (eventContext.getParameter("event")) {
			case "InlineResponse_Initialize":
				//InlineResponse loaded, we need to recreate out UI controls
				if (this.wait4InlineResponse) {
					this._enhanceInlineResponse();
					this.wait4InlineResponse = false;
				}
				break;
				
				// New button
			case "CIP_New_Button":
				// New with Outlook button
			case "CIP_NewMail_Outlook":
				this.newButtonPressed = true;
				break;

				// Reply buttons
			case "Reply_To_Latest_Interaction":
			case "Reply_To_Selected_Interaction":
				this._bIsReply = true;
				break;

				// Reply with outlook buttons
			case "Reply_with_outlook":
			case "ReplyTo_Interaction_with_outlook":
				this._bIsReply = true;
				break;

				// Forward button
			case "Forward_Selected_Interaction":
				break;

				//Feeder_ValueChange
			case "Feeder_ValueChange":
				if (this.newButtonPressed) { //after newButtonPressed, call redetermination of recipients
					this._onRecipientChange();
					this._composeEmailURI();
					this.newButtonPressed = false;
				}
				break;
			}
		},

		_getControls: function (iIndex) {
			jQuery.sap.log.debug(">> _getControls", "", "zCustomPane");

			var that = this;

			if (!this.aControls[iIndex]) {
				var oControls = {};

				oControls.oFromUser = new sap.ui.commons.CheckBox({
					text: "Use user’s email as sender",
					tooltip: "Use user’s email as sender",
					checked: true,
					change: function (oObjectChanged) {
						that._onFromUserChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oFromUser.addStyleClass("outlookBox");

				oControls.oToAccount = new sap.ui.commons.CheckBox({
					text: "Use Account’s email as recipient",
					tooltip: "Use Account’s email as recipient",
					checked: false,
					change: function (oObjectChanged) {
						that._onToAccountChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oToAccount.addStyleClass("outlookBox");

				oControls.oToVendor = new sap.ui.commons.CheckBox({
					text: "Use Partner’s email as recipient",
					tooltip: "Use Partner’s email as recipient",
					checked: true,
					change: function (oObjectChanged) {
						that._onToVendorChange(oObjectChanged.mParameters.checked);
					}
				});
				oControls.oToVendor.addStyleClass("outlookBox");

				oControls.oToAgent = new sap.ui.commons.CheckBox({
					text: "Use Agent’s email as recipient",
					tooltip: "Use Agent’s email as recipient",
					checked: false,
					change: function (oObjectChanged) {
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

		_getControlsRUI: function () {
			jQuery.sap.log.debug(">> _getControlsRUI", "", "zCustomPane");

			var oControls = {};

			oControls.oFromUser = new sap.m.CheckBox({
				text: "Use user’s email as sender",
				tooltip: "Use user’s email as sender",
				selected: this.fFromUser,
				select: function (oControlEvent) {
					this._onFromUserChange(oControlEvent.getParameter("selected"));
				}.bind(this)
			});

			oControls.oToAccount = new sap.m.CheckBox({
				text: "Use Account’s email as recipient",
				tooltip: "Use Account’s email as recipient",
				selected: this.fToAccount,
				select: function (oControlEvent) {
					this._onToAccountChange(oControlEvent.getParameter("selected"));
				}.bind(this)
			});

			oControls.oToVendor = new sap.m.CheckBox({
				text: "Use Partner’s email as recipient",
				tooltip: "Use Partner’s email as recipient",
				selected: this.fToVendor,
				select: function (oControlEvent) {
					this._onToVendorChange(oControlEvent.getParameter("selected"));
				}.bind(this)
			});

			oControls.oToAgent = new sap.m.CheckBox({
				text: "Use Agent’s email as recipient",
				tooltip: "Use Agent’s email as recipient",
				selected: this.fToAgent,
				select: function (oControlEvent) {
					this._onToAgentChange(oControlEvent.getParameter("selected"));
				}.bind(this)
			});

			oControls.oRecipientLayout = new sap.ui.layout.HorizontalLayout({
				width: "100%",
				content: [oControls.oToAccount, oControls.oToVendor, oControls.oToAgent]
			});

			return oControls;
		},

		_initializeControls: function () {
			jQuery.sap.log.debug(">> _initializeControls", "", "zCustomPane");

			this.aControls = [];
			this.fFromUser = true;
			this.fToAccount = false;
			this.fToVendor = true;
			this.fToAgent = false;

			this._onRecipientChange();
			this._onFromUserChange(this.fFromUser);

		},

		onBeforeRendering: function () {
			jQuery.sap.log.debug(">> onBeforeRendering", "", "zCustomPane");

		},

		onAfterRendering: function () {
			jQuery.sap.log.debug(">> onAfterRendering", "", "zCustomPane");

			var that = this;

			//this._initializeControls();
			this.aControls = [];
			this._onDataContainerUpdateFinished();

			var fFeederExists = false;
			var iFeederId = 0;
			var oFeeder = null;
			var aCustomPanes = this.getController().getParentController()._oCurrentComponentModel._mNodeNames.CustomPane;

			for (var i = 0; i < aCustomPanes.length; i++) {
				var oCustomPane = aCustomPanes[i];
				if (oCustomPane._a && oCustomPane._a.jsTypeName && oCustomPane._a.jsTypeName.indexOf("Feeder") >= 0) {
					fFeederExists = true;
					break;
				}
			}

			if (fFeederExists) {
				// a bit of performance optimization
				var startI = 0;
				if (this.oCurrentFeeder) {
					try {
						startI = parseInt(this.oCurrentFeeder.sId.replace("__feeder", ""), 10);
					} catch (err) {
						startI = 0;
					}
				} else {
					startI = 0;
				}

				var lvMax = Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : Number.MAX_VALUE;

				var tmpFeeder = null;
				for (i = startI; i <= lvMax; i++) {
					var sFeederId = "__feeder" + i;
					tmpFeeder = sap.ui.getCore().byId(sFeederId);
					if (tmpFeeder) {
						if (tmpFeeder.oReplyLayout) {
							oFeeder = tmpFeeder;
						}
					} else {
						if (oFeeder) {
							//propper feeder has been found on the previous iteration
							break;
						} else {
							//we haven't found the propper feeder yet, keep searching
							continue;
						}
					}
				}

				if (oFeeder && oFeeder.oReplyLayout) {
					oFeeder.oReplyLayout.addContent(this._getNewLayout(iFeederId));
					oFeeder.addEventDelegate({
						onAfterRendering: function (oEvent) {
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

			if (this.oCurrentFeeder) {
				var oThatFeeder = this.oCurrentFeeder;
				var origcancelButtonPress = this.oCurrentFeeder.cancelButtonPress;
				this.oCurrentFeeder.cancelButtonPress = function () {
					oThatFeeder.bIsReply = false; // right place to reset this bloody flag
					origcancelButtonPress.apply(oThatFeeder);
				};

				if (oThatFeeder.oEmailSendButton) {
					// and another right place to reset this bloody flag
					oThatFeeder.oEmailSendButton.attachPress(function () {
						oThatFeeder.bIsReply = false;
					});
				}
			}

			if (!sap.client.getCurrentApplication().isNewUI()) {
				this._oToDataObject = this.getController().getParentController().getDataContainer().getDataObject(
					this._sToPath);

				if (this._oToDataObject) {
					this._oToDataObject.attachValueChanged(function () {
						var sReplyEmail = this._getValue("/Root/zFeederRelevant/ReplyEmail");
						var sToList = this._oToDataObject.getValue();
						if (sReplyEmail) {
							if (sReplyEmail !== sToList) {
								this._onRecipientChange();
							}
						} else if (sToList !== this.sTo) {
							this._onRecipientChange();
						}
					}.bind(this));
				}

				if (this._sToPathOutlook) {
					var oDataObject = this.getController().getParentController().getDataContainer().getDataObject(
						this._sToPathOutlook);
					if (oDataObject) {
						oDataObject.attachValueChanged(function () {
							var sReplyEmail = this._getValue("/Root/zFeederRelevant/ReplyEmail");
							var sNewToEmail = this._getValue(this._sToPathOutlook);
							if (sReplyEmail) {
								if (sReplyEmail !== sNewToEmail) {
									this._onRecipientChange();
								}
							} else if (sNewToEmail !== this.sTo) {
								this._onRecipientChange();
							}
						}.bind(this));
					}
				}
			}
		},

		_getNewLayout: function (iIndex) {
			jQuery.sap.log.debug(">> _getNewLayout", "", "zCustomPane");

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

		_getNewLayoutRUI: function () {
			jQuery.sap.log.debug(">> _getNewLayoutRUI", "", "zCustomPane");

			var oControls = this._getControlsRUI();
			var oLayout = null;
			if (oControls) {
				oLayout = new sap.ui.layout.VerticalLayout({
					width: "100%",
					content: [oControls.oFromUser, oControls.oRecipientLayout]
				});
			}

			return oLayout;
		},

		_onDataContainerUpdateFinished: function () {
			jQuery.sap.log.debug(">> _onDataContainerUpdateFinished", "", "zCustomPane");

			this._onRecipientChange();
			this._onFromUserChange(this.fFromUser);
		},

		_onFromUserChange: function (fNewValue) {
			jQuery.sap.log.debug(">> _onFromUserChange");

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
				jQuery.sap.log.debug("Error in _onFromUserChange: " + err.message); // eslint-disable-line no-console
			}
		},

		_onToAccountChange: function (fNewValue) {
			jQuery.sap.log.debug(">> _onToAccountChange", "", "zCustomPane");

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

		_onToVendorChange: function (fNewValue) {
			jQuery.sap.log.debug(">> _onToVendorChange", "", "zCustomPane");

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

		_onToAgentChange: function (fNewValue) {
			jQuery.sap.log.debug(">> _onToAgentChange", "", "zCustomPane");

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

		_set_sTo: function () {
			try {
				var cEMailAddressDelimiter = ", "; // used to be: "; ";
				var sAccountEmail = this._getValue("/Root/ZAccountEmail");
				var sVendorEmail = this._getValue("/Root/ZVendorEmail");
				var sAgentEmail = this._getValue("/Root/ZAgentEmail");

				if (this._oToDataObject) {
					this.sTo = this._oToDataObject.getValue();
					this.sTo = "";

					if (this.fToAccount && sAccountEmail) {
						this.sTo = this.sTo === "" ? sAccountEmail : this.sTo.concat(cEMailAddressDelimiter).concat(sAccountEmail);
					}

					if (this.fToVendor && sVendorEmail) {
						this.sTo = this.sTo === "" ? sVendorEmail : this.sTo.concat(cEMailAddressDelimiter).concat(sVendorEmail);
					}

					if (this.fToAgent && sAgentEmail) {
						this.sTo = this.sTo === "" ? sAgentEmail : this.sTo.concat(cEMailAddressDelimiter).concat(sAgentEmail);
					}
				}
			} catch (err) {
				jQuery.sap.log.debug("Error in _set_sTo: " + err.message); // eslint-disable-line no-console
			}
		},

		_onRecipientChange: function () {
			jQuery.sap.log.debug(">> _onRecipientChange", "", "zCustomPane");

			if (this.oCurrentFeeder) {
				if (this.oCurrentFeeder.bComposeNewEmail || this.oCurrentFeeder.bIsReply) {
					return;
				}
			}

			try {

				if (this._oToDataObject) {
					this._set_sTo();

					this._oToDataObject.setValue(this.sTo);
					if (this._sToPathOutlook) {
						this._setValue(this._sToPathOutlook, this.sTo);
					}
				}
			} catch (err) {
				jQuery.sap.log.debug("Error in _onRecipientChange: " + err.message); // eslint-disable-line no-console
			}
		},

		_composeEmailURI: function () {
			// Outlook workaround
			if (!this._bIsReply) {
				try {
					var sMailtoOutlook = this._oURIDataObject.getValue(); //oEventValueChanged.getParameter("value");
					if (sMailtoOutlook) {
						var sPrefixRemoved = sMailtoOutlook.split("mailto:")[1];
						var sMailtoPart = sPrefixRemoved.split("?Subject=")[0];
						var sSubjectPart = sPrefixRemoved.split("?Subject=")[1];

						this._set_sTo();
						if (sMailtoPart !== this.sTo) {
							sMailtoOutlook = "mailto:".concat(this.sTo.concat("?Subject=".concat(sSubjectPart)));

							this._oURIDataObject.setValue(sMailtoOutlook);
						}
					}
				} catch (ex) {

				}
			} else {
				this._bIsReply = false; // ok, we skipped the change in reply mode
			};
		},

		_setFromField: function (sValue) {
			jQuery.sap.log.debug(">> _setFromField", "", "zCustomPane");

			try {
				if (this._oFromDataObject) {
					this._oFromDataObject.setValue(sValue);
				} else {
					this._setValue(this._sFromPath, sValue);
				}
			} catch (err) {
				jQuery.sap.log.debug("Error in _setFromField: " + err.message); // eslint-disable-line no-console	
			}
		},

		_getUserEmail: function () {
			jQuery.sap.log.debug(">> _getUserEmail", "", "zCustomPane");

			var sEmail = "";
			try {
				sEmail = this._getValue("/Root/ZCurrentUserEmail");
			} catch (err) {
				jQuery.sap.log.debug("Error in _getUserEmail: " + err.message); // eslint-disable-line no-console	
			}

			return sEmail;
		},

		_setValue: function (sPath, sValue) {
			jQuery.sap.log.debug(">> _setValue", "", "zCustomPane");

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

		_getValue: function (sPath) {
			jQuery.sap.log.debug(">> _getValue", "", "zCustomPane");

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

	return ZFeederEnhancementPaneV2;

}, true);