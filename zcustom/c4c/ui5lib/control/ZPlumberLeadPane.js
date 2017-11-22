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

/*			// Make a layout
			this.oVerticalLayout = new sap.ui.layout.VerticalLayout();
			this.oVerticalLayout.addContent(this.inpField);
			this.oVerticalLayout.addContent(this.btnG);
			this.oVerticalLayout.addContent(this.btn1);
			this.oGrid = new sap.ui.layout.Grid();
			this.oGrid.addContent(this.oVerticalLayout);
			this.addContent(this.oGrid);*/
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
			this._ProcessBarCodeResult(mArguments.text);
			this._setResult(this._getCurrentDate(), "/Root/Lead/ReferenceDate");
			this._triggerLeadOnSave();
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
				this.CheckedIn = false;

				oBtn.mProperties.text = "Check-In";

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
		
		_onConfirm : function(oAction) {
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

			for (var i = 0; i < oPlace.address_components.length; i++) {
				if (oPlace.address_components[i].types.includes("street_number")) {
					sStreetNumber = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("route")) {
					sStreetName = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("locality")) {
					sSuburb = oPlace.address_components[i].long_name;

				} else if (oPlace.address_components[i].types.includes("administrative_area_level_1")) {
					sState = oPlace.address_components[i].short_name;

				}
			}

			this._setResultIntoNearest(sStreetNumber, "/Root/RFL_CStreetNumber_f8d5c99d9d964b0b3c3f25b5458740c2");
			this._setResultIntoNearest(sStreetName, "/Root/RFL_CStreetName_8a90ca3b0dc9216084126131c52991ad");
			this._setResultIntoNearest(sSuburb, "/Root/RFL_CSuburb_e09b0c6b797cfe0e96dcb9e4642137ff");
			this._setResultIntoNearest(sState, "/Root/RFL_CState_0c757ce9e338b9da7867ee71990b089b");

			this._triggerLeadOnSave();
		},

		_fillInAddress: function() {
			// Get the place details from the autocomplete object.
			var place = this.autocomplete.getPlace();

			this._fillInAddressFromPlace(place);

		},

		_ProcessBarCodeResult: function(sResult) {
			var vResult = sResult;
			var vModel = "";
			var vSerial = "";
			var aParts = [];
			var vError;

			var reRating = new RegExp(/^(10)/, "");
			var reCarton = new RegExp(/^(240)/, "");
			var reMatnr = new RegExp(/^(90)/, "");
			var reSerial = new RegExp(/^21/, "");
			var reOwner = new RegExp(/^10000/, "");

			try {
				// carton 
				// (AI240)OWNER(AI90)MATNR(AI21)SERNR 
				//
				// rating
				// (AI10)MMYY(AI90)MATNR(AI21)SERNR
				if (reCarton.test(vResult)) {
					aParts = vResult.split(reCarton); // AI240 removed
					if (aParts.length() === 3) {
						vResult = aParts[2];
						if (reOwner.test(vResult)) {
							aParts.split(reOwner); // Owner removed
							if (aParts.length() === 3) {
								vResult = aParts[2];
							}
						}
					}
				} else if (reRating.test(vResult)) {
					aParts = vResult.split(reRating); // AI10 removed
					if (aParts.length() === 3) {
						vResult = aParts[2];
						vResult = vResult.substring(4); // MMYY removed
					}
				} else {
					vError = "First AI not recognized in Barcode value:" + sResult;
					jQuery.sap.log.error(vError);
					throw vError;
				}

				// common part
				if (reMatnr.test(vResult)) {
					aParts = vResult.split(reMatnr); // AI90 removed
					if (aParts.lengrh() === 3) {
						vResult = aParts[2];
						if (vResult) {
							vModel = vResult.substring(0, 13); // Model No

							vResult = vResult.substring(13);
							if (reSerial.test(vResult)) {
								aParts = vResult.split(reSerial); // AI21 removed
								if (aParts.length() === 3) {
									vSerial = aParts[2];
								}
							}
						}
					}
				}

				if (!vModel || !vSerial) {
					vError = "vModel (" + vModel + ") or vSerial (" + vSerial + ") not found in Barcode value: " + sResult;
					jQuery.sap.log.error(vError);
					throw vError;
				}

				this._setResult(vModel, "/Root/Lead/ProductID");
				this._setResult(vSerial, "/Root/Lead/SerialID");

			} catch (err) {
				vError = "Barcode parsing failed.\r\nValue =\r\n" + sResult;
				MessageToast.show(vError);
			}
		},

		_triggerLeadOnSave: function() {
			var oEventContext = new sap.client.evt.EventContext(this);
			this.getController().getParentController().getEventProcessor().handleEvent("OnSave", oEventContext);
		}
	});

	return PlumberLeadPane;

}, true);