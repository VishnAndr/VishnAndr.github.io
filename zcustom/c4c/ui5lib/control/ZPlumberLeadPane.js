sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(CustomPane, MessageToast, MessageBox) {
	"use strict";

	/* global google */
	/* global captuvoPlugin */

	// Provides control zcustom.c4c.ui5lib.control.ZPlumberLeadPane
	var PlumberLeadPane = CustomPane.extend("zcustom.c4c.ui5lib.control.ZPlumberLeadPane", /** @lends zcustom.c4c.ui5lib.control.ZPlumberLeadPane.prototype */ {
		metadata: {

			library: "zcustom.c4c.ui5lib",
			properties: {

				/**
				 * If set to true, the button remains visible if the scanner is not available and triggers a dialog to enter bar code.
				 */
				provideFallback: {
					type: "boolean",
					defaultValue: true
				},

				/**
				 * The invisible bar code scanner button is not rendered regardless of the availability of the native scan feature.
				 */
				visible: {
					type: "boolean",
					defaultValue: true
				}
			},
			aggregations: {

				/**
				 * Internal aggregation to hold the inner Elements.
				 */
				_inpField: {
					type: "sap.m.Input",
					multiple: false,
					visibility: "hidden"
				},
				_btnG: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				},
				_btn1: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				},
				_btn2: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {

			}
		},

		renderer: function(oRM, oControl) {
			if (!oControl.getVisible()) {
				return;
			}

			oRM.write("<span");
			oRM.writeControlData(oControl);
			oRM.write(">");
			// oRM.renderControl(oControl.oGrid);
			oRM.renderControl(oControl.getAggregation("_inpField"));
			oRM.renderControl(oControl.getAggregation("_btnG"));
			oRM.renderControl(oControl.getAggregation("_btn1"));
			//oRM.renderControl(oControl.getAggregation("_btn2"));
			oRM.write("</span>");
		},

		initializePane: function() {

			var that = this;
			this.inpField = null;
			this.btnG = null;
			this.btn1 = null;
			this.btn2 = null;

			this.geoResponseResult = null;

			var vGoogleURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=";
			var vAPIKey = this.getParameter("API_KEY"); //API Key is stored in Custom Pane Parameters under API_KEY parameter
			if (vAPIKey) {
				vGoogleURL += vAPIKey;
			} else {
				jQuery.sap.log.error("API_KEY is missing");
			}

			jQuery.sap.includeScript(vGoogleURL,
				"google.maps", jQuery.proxy(this._initAutocomplete, this),
				function() {
					jQuery.sap.log.error("Error initializing Google Places API");
				});

			// input field for Address and Autocomplete
			this.inpField = new sap.m.Input({
				width: "100%",
				placeholder: "Enter Address ...",
				showValueHelp: true
			});
			// to make "clear" button available
			this.inpField.addEventDelegate({
				onAfterRendering: jQuery.proxy(this._onAfterRenderingInput, this)
			}, this);
			this.inpField.attachValueHelpRequest(this._onClearInput);

			this.setAggregation("_inpField", this.inpField);

			// button for Check-in/Chekc-out
			this.btnG = new sap.m.Button({
				icon: "sap-icon://locate-me",
				width: "100%",
				text: "Check-In",
				press: jQuery.proxy(this._onLocateMe, this)
			});

			this.setAggregation("_btnG", this.btnG);

			// Barcodes buttons
			var oBarcodeStatus;
			if (sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()) {
				jQuery.sap.require("sap.client.cod.newui.shared.js.BarcodeScanner");

				this.Btn1 = new sap.m.Button({
					icon: "sap-icon://bar-code",
					width: "100%",
					text: "Scan Model No",
					press: jQuery.proxy(this._onBtn1Pressed, this)
				});

				this.setAggregation("_btn1", this.Btn1);

				this.Btn2 = new sap.m.Button({
					icon: "sap-icon://bar-code",
					width: "100%",
					text: "Scan Serial No",
					press: jQuery.proxy(this._onBtn2Pressed, this)
				});

				this.setAggregation("_btn2", this.Btn2);

				oBarcodeStatus = sap.client.cod.newui.shared.BarcodeScanner.getStatusModel();
				this.setModel(oBarcodeStatus, "status");

				try {
					var oCaptuvoPlugin = captuvoPlugin;
					if (oCaptuvoPlugin) {
						oCaptuvoPlugin.start(
							function(oResult) {
								this._setResult(oResult);
							}.bind(this),
							function(oEvent) {
								jQuery.sap.log.error("Barcode Captuvo failed.");
							}.bind(this)
						);
						jQuery.sap.log.debug("Cordova CaptuvoPlugin plugin is available!");
					} else {
						jQuery.sap.log.error("CaptuvoPlugin: CaptuvoPlugin is not available");
					}
				} catch (e) {
					jQuery.sap.log.info("CaptuvoPlugin: CaptuvoPlugin is not available");
					return;
				}

			}

			this.getModel().attachDataContainerUpdateFinished(function() {
				that._checkBtnState();
			});

			/*			// Make a layout
						this.oVerticalLayout = new sap.ui.layout.VerticalLayout();
						this.oVerticalLayout.addContent(this.inpField);
						this.oVerticalLayout.addContent(this.btnG);
						this.oVerticalLayout.addContent(this.btn1);
						this.oGrid = new sap.ui.layout.Grid();
						this.oGrid.addContent(this.oVerticalLayout);
						this.addContent(this.oGrid);*/
		},

		onAfterRendering: function() {
			var that = this;
			try {
				var oDataObject = this.getController().getParentController().getDataContainer().getDataObject(
					"/Root/ZL_CheckOut_Done_567360ce52f782bf520d25d5c099515b");
				oDataObject.attachValueChanged(function() {
					that._checkBtnState();
				});

				oDataObject = this.getController().getParentController().getDataContainer().getDataObject(
					"/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc");
				oDataObject.attachValueChanged(function() {
					that._checkBtnState();
				});
			} catch (err) {
				console.log("Cannot attach to data field: " + err.message);
			}
		},

		_checkBtnState: function() {
			try {
				var fCheckOutState = this._getValueFromNearest("/Root/ZL_CheckOut_Done_567360ce52f782bf520d25d5c099515b");
				var fCheckInState = this._getValueFromNearest("/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc");
				var sCheckedIn = this._getValueFromNearest("/Root/Lead/ZStartTime");

				if (fCheckOutState) { // already checked-out
					if (this.btnG) {
						this.btnG.setText("Checked-Out");
						this.btnG.setEnabled(false);
					}

					if (this.btn1) {
						this.btn1.setEnabled(false);
					}

					if (this.inpField) {
						this.inpField.setEnabled(false);
					}
				} else if (fCheckInState || sCheckedIn) { // already checked-in

					this.CheckedIn = true;
					
					if (this.btnG) {
						this.btnG.setText("Check-Out");
					}
				} else { //Initial state
				
					this.CheckedIn = false;
					
					if (this.btnG) {
						this.btnG.setText("Check-In");
						this.btnG.setEnabled(true);
					}
					
					if (this.btn1) {
						this.btn1.setEnabled(true);
					}

					if (this.inpField) {
						this.inpField.setEnabled(true);
					}					
				}
			} catch (err) {
				console.log("Error during _checkBtnState: " + err.message);
			}
		},

		autocomplete: '',
		CheckedIn: '',

		_onAfterRenderingInput: function() {
			var oInput = this.getAggregation("_inpField");
			var icon = oInput._getValueHelpIcon();
			icon.setSrc("sap-icon://sys-cancel");
			icon.setSize("1.25rem");

			this._initAutocomplete();
		},

		_onClearInput: function() {
			//var oInput = this.getAggregation("_inpField");
			//oInput.setValue("");
			this.setValue("");
		},

		_onBtn1Pressed: function(oEvent) {
			sap.client.cod.newui.shared.BarcodeScanner.scan(
				jQuery.proxy(this._onScanSuccess1, this),
				jQuery.proxy(this._onScanFail, this),
				jQuery.proxy(this._onInputLiveUpdate, this)
			);
		},

		_onBtn2Pressed: function(oEvent) {
			sap.client.cod.newui.shared.BarcodeScanner.scan(
				jQuery.proxy(this._onScanSuccess2, this),
				jQuery.proxy(this._onScanFail, this),
				jQuery.proxy(this._onInputLiveUpdate, this)
			);
		},

		_onScanSuccess1: function(mArguments) {

			//this._setResult(mArguments.text,"/Root/Lead/ProductID");

			this._setResult(mArguments.text, "/Root/ScannedValue");
			try {
				this._ProcessBarCodeResult(mArguments);
				this._setResult(this._getCurrentDate(), "/Root/Lead/ReferenceDate");
				this._triggerLeadOnSave();
			} catch (e) {
				jQuery.sap.log.error("Barcode has not been recognized");
			}
		},

		_onScanSuccess2: function(mArguments) {

			this._setResult(mArguments.text, "/Root/Lead/SerialID");
		},

		_onScanFail: function(mArguments) {
			MessageToast.show("Please try again");
		},

		_onInputLiveUpdate: function(mArguments) {

		},

		_setResult: function(sResult, sPath) {
			if (sResult) {
				var oDataModel = this.getModel();
				var oField = oDataModel.getDataObject(sPath);
				oField.setValue(sResult);
			}
		},

		_setResultIntoNearest: function(sResult, sPath) {
			var oObject = this;
			var olModel;
			while (oObject) {
				olModel = oObject.getModel();
				if (olModel && olModel.getDataObject(sPath)) {
					olModel.getDataObject(sPath).setValue(sResult);
					break;
				}
				oObject = oObject.getParent();
			}
		},

		_getValueFromNearest: function(sPath) {
			var rValue;
			var oObject = this;
			var olModel;
			while (oObject) {
				olModel = oObject.getModel();
				if (olModel && olModel.getDataObject(sPath)) {
					rValue = olModel.getDataObject(sPath).getValue();
					break;
				}
				oObject = oObject.getParent();
			}

			return rValue;
		},

		_onLocateMe: function() {
			var oControl = this;
			var options = {
				enableHighAccuracy: true,
				timeout: 5000,
				maximumAge: 0
			};

			if (navigator.geolocation) {
				sap.ui.core.BusyIndicator.show(); //oControl.setBusy(true);
				navigator.geolocation.getCurrentPosition(jQuery.proxy(this._onGeoCurrentPositionSuccess, this),
					jQuery.proxy(this._onGeoCurrentPositionError, this),
					options);
			}
		},

		_onGeoCurrentPositionError: function(err) {
			var oControl = this;
			sap.ui.core.BusyIndicator.hide(); //oControl.setBusy(false);
			jQuery.sap.log.error("ERROR(" + err.code + "): " + err.message);
		},

		_onGeoCurrentPositionSuccess: function(oPosition) {
			var oControl = this;

			var position = {};
			position.lat = oPosition.coords.latitude;
			position.lng = oPosition.coords.longitude;

			var oBtn = this.getAggregation("_btnG");

			// if we're triggering OnSave - all data required for model at once
			//this._setResult(this._getCurrentDate(), "/Root/Lead/ReferenceDate");
			if (!this.CheckedIn) {
				//Check-In
				this._setResult(position.lat.toFixed(13), "/Root/Lead/ZStartLatitudeMeasure");
				this._setResult(position.lng.toFixed(13), "/Root/Lead/ZStartLongitudeMeasure");
				this._setResult((new Date().toISOString()), "/Root/Lead/ZStartTime");
				this._setResultIntoNearest("X", "/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc");
				this.CheckedIn = true;

				oBtn.mProperties.text = "Check-Out";

				//geocode coords only if there is no address selected yet
				var oInput = this.getAggregation("_inpField");
				if (!oInput.getValue()) {
					new google.maps.Geocoder().geocode({
						latLng: position
					}, jQuery.proxy(this._onGeoResponses, this));
				} else {
					sap.ui.core.BusyIndicator.hide(); //oControl.setBusy(false);
				}
			} else {
				//Check-Out
				this._setResult(position.lat.toFixed(13), "/Root/Lead/ZEndLatitudeMeasure");
				this._setResult(position.lng.toFixed(13), "/Root/Lead/ZEndLongitudeMeasure");
				this._setResult((new Date().toISOString()), "/Root/Lead/ZEndTime");
				this._setResultIntoNearest("X", "/Root/ZL_CheckOut_InProgress_be3d0b36bc2a920210c6ac5c07a6ec42");
				this.CheckedIn = false;

				//oBtn.mProperties.text = "Check-In";

				sap.ui.core.BusyIndicator.hide(); //oControl.setBusy(false);
				this._triggerLeadOnSave();
			}

			oBtn.invalidate();

		},

		_getCurrentDate: function() {
			var d = new Date();

			var month = d.getMonth() + 1;
			var day = d.getDate();

			var output = d.getFullYear() + "-" +
				(("" + month).length < 2 ? "0" : "") + month + "-" +
				(("" + day).length < 2 ? "0" : "") + day;

			return output;
		},

		_onGeoResponses: function(results) {
			var oControl = this;
			sap.ui.core.BusyIndicator.hide(); //oControl.setBusy(false);
			if (results && results.length > 0) {
				//results.forEach(function (item, index) { jQuery.sap.log.info("Google response " + index + " : " + JSON.stringify(item,null,4)); });
				this.geoResponseResult = results[0];

				MessageBox.show(
					"Are you at \r\n" + this.geoResponseResult.formatted_address + "?", {
						icon: MessageBox.Icon.QUESTION,
						title: "Confirm",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: jQuery.proxy(this._onConfirm, this)
					}
				);

			} else {
				jQuery.sap.log.info("Cannot determine address at this location.");
			}
		},

		_onConfirm: function(oAction) {
			if (oAction === MessageBox.Action.YES) {
				var oInput = this.getAggregation("_inpField");
				oInput.setValue(this.geoResponseResult.formatted_address);

				this._fillInAddressFromPlace(this.geoResponseResult);
			}

			this.geoResponseResult = null;
		},

		_initAutocomplete: function() {
			var oInput = this.getAggregation("_inpField");
			if (oInput) {
				var sInputId = oInput.getId().toString() + "-inner";
				var eInput = document.getElementById(sInputId);
				if (eInput) {
					try {
						this.autocomplete = new google.maps.places.Autocomplete(
							(eInput), {
								types: ["geocode"]
							});

						this.autocomplete.addListener("place_changed", jQuery.proxy(this._fillInAddress, this));
					} catch (e) {
						this.autocomplete = '';
					}
				}
			}
		},

		_fillInAddressFromPlace: function(oPlace) {
			var sStreetNumber = "";
			var sStreetName = "";
			var sSuburb = "";
			var sState = "";
			var sPostalCode = "";

			for (var i = 0; i < oPlace.address_components.length; i++) {
				if (oPlace.address_components[i].types.includes("street_number")) {
					sStreetNumber = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("route")) {
					sStreetName = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("locality")) {
					sSuburb = oPlace.address_components[i].long_name;

				} else if (oPlace.address_components[i].types.includes("administrative_area_level_1")) {
					sState = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("postal_code")) {
					sPostalCode = oPlace.address_components[i].short_name;
				}
			}

			this._setResultIntoNearest(sStreetNumber, "/Root/RFL_CStreetNumber_f8d5c99d9d964b0b3c3f25b5458740c2");
			this._setResultIntoNearest(sStreetName, "/Root/RFL_CStreetName_8a90ca3b0dc9216084126131c52991ad");
			this._setResultIntoNearest(sSuburb, "/Root/RFL_CSuburb_e09b0c6b797cfe0e96dcb9e4642137ff");
			this._setResultIntoNearest(sState, "/Root/RFL_CState_0c757ce9e338b9da7867ee71990b089b");
			this._setResultIntoNearest(sPostalCode, "/Root/ZRFL_PostCode_7834540e1c06fed78ba92204ff988027");

			this._triggerLeadOnSave();
		},

		_fillInAddress: function() {
			// Get the place details from the autocomplete object.
			var place = this.autocomplete.getPlace();

			this._fillInAddressFromPlace(place);

		},
		
		_removeSpecialChars: function(str) {
		/*
		//	1st regex /(?!\w|\s)./g remove any character that is not a word or whitespace. \w is equivalent to [A-Za-z0-9_]
		//	2nd regex /\s+/g find any appearance of 1 or more whitespaces and replace it with one single white space
		//	3rd regex /^(\s*)([\W\w]*)(\b\s*$)/g trim the string to remove any whitespace at the beginning or the end.
		
		  return str.replace(/(?!\w|\s)./g, '')
		    .replace(/\s+/g, ' ')
		    .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
		*/
		
		// just leave [A-Za-z0-9_]
		  return str.replace(/(?!\w)./g, '');
		
		},

		_ProcessBarCodeResult: function(sResult) {
			var vResult = sResult.text;
			var vFormat = sResult.format;
			var vModel = "";
			var vSerial = "";
			var vOwner = "";
			var vMMYY = "";
			var vMsg;

			var reRating = new RegExp(/^(10)\d{4,4}/, "");
			var reCarton = new RegExp(/^(240)\d{5,5}/, "");
			var reMatnr = new RegExp(/^90/, "");
			var reSerial = new RegExp(/21$/, "");
			var reMatnrSerial = new RegExp(/^90\w{1,13}21/);
			var reNotWords = new RegExp(/\W+/);

			try {
				
				vResult = this._removeSpecialChars(vResult);
				
				// old check, let's remove special characters
				/*
				if (reNotWords.test(vResult)) {
					vMsg = "There are special characters:";
					var arNotWords = vResult.match(reNotWords);
					for (var i=0; i<arNotWords.length;i++) {
						vMsg += "\r\n" + arNotWords[i];
					}
					vMsg += "\r\nPosition = " + arNotWords.index;
					throw vMsg;
				}
				*/
				
				// carton 
				// (AI240)OWNER(AI90)MATNR(AI21)SERNR 
				//
				// rating
				// (AI10)MMYY(AI90)MATNR(AI21)SERNR
				if (vFormat !== "CODE_128") {
					vMsg = "Format has not been recognized\r\n Format = " + vFormat;
					jQuery.sap.log.error(vMsg);
					throw vMsg;
				}
				if (reCarton.test(vResult)) {
					vOwner = vResult.match(reCarton)[0].replace("240", "");
					vResult = vResult.replace(reCarton, "");
				} else if (reRating.test(vResult)) {
					vMMYY = vResult.match(reRating)[0].replace("10", "");
					vResult = vResult.replace(reRating, "");
				} else {
					vMsg = "First AI not recognized in Barcode value:" + vResult;
					jQuery.sap.log.error(vMsg);
					throw vMsg;
				}

				// common part
				if (reMatnrSerial.test(vResult)) {
					vModel = vResult.match(reMatnrSerial)[0].replace(reMatnr, ""); // AI90 removed
					vModel = vModel.replace(reSerial, ""); //AI21 removed
					vResult = vResult.replace(reMatnrSerial, "");
					vSerial = vResult;
				} else {
					vMsg = "(AI90)MATNR(AI21)SERNR pattern not recognized in Barcode value:" + vResult;
					jQuery.sap.log.error(vMsg);
					throw vMsg;
				}

				if (!vModel || !vSerial) {
					vMsg = "vModel (" + vModel + ") or vSerial (" + vSerial + ") not found in Barcode value: " + vResult;
					jQuery.sap.log.error(vMsg);
					throw vMsg;
				}

				this._setResult(vModel, "/Root/Lead/ProductID");
				this._setResult(vSerial, "/Root/Lead/SerialID");

				//vMsg = "Barcode parsed.\r\nModel = " + vModel + "\r\nSerial = " + vSerial + "\r\nFormat = " + vFormat;
				vMsg = "Model Number: " + vModel + "\r\nand Serial Number: " + vSerial + "\r\nread successfully";
				MessageToast.show(vMsg);

			} catch (err) {
				//vMsg = "Barcode could not be read, please try re-scanning or enter manually";
				vMsg = err + "\r\n" + sResult.text;
				MessageToast.show(vMsg);
				throw vMsg;
				//MessageBox.alert(vMsg);
			}
		},

		_triggerLeadOnSave: function() {
			var oEventContext = new sap.client.evt.EventContext(this);
			this.getController().getParentController().getEventProcessor().handleEvent("OnSave", oEventContext);
		}
	});

	return PlumberLeadPane;

}, true);