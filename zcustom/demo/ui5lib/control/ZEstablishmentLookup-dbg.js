sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(CustomPane, MessageToast, MessageBox) {
	"use strict";

	/* global google */

	// Provides control zcustom.demo.ui5lib.control.ZEstablishmentLookup
	var zEstablishmentLookup = CustomPane.extend("zcustom.c4c.ui5lib.control.ZEstablishmentLookup", /** @lends zcustom.demo.ui5lib.control.ZEstablishmentLookup.prototype */ {
		metadata: {

			library: "zcustom.demo.ui5lib",
			properties: {},
			aggregations: {

				/**
				 * Internal aggregation to hold the inner Elements.
				 */
				_inpFieldE: {
					type: "sap.m.Input",
					multiple: false,
					visibility: "hidden"
				},
				_inpFieldA: {
					type: "sap.m.Input",
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
			oRM.renderControl(oControl.getAggregation("_inpFieldE"));
			oRM.renderControl(oControl.getAggregation("_inpFieldA"));
			oRM.write("</span>");
		},

		initializePane: function() {

			var that = this;
			this.inpFieldE = null;
			this.inpFieldA = null;

			this.geoResponseResult = null;
			this.estResponseResult = null;

			this.fEstaActive = this.getParameter("EstaActive");
			this.vAttachEsta2Field = this.getParameter("AttachEsta2Field");
			this.fAddrActive = this.getParameter("AddrActive");
			this.vAttachAddr2Field = this.getParameter("AttachAddr2Field");

			var aInputs = [];

			if (this.fEstaActive) {
				if (this.vAttachEsta2Field) {
					aInputs = [];
					aInputs = $("[data-sap-automation-id='" + this.vAttachEsta2Field + "']");

					if (aInputs.length > 0) {
						this.inpFieldE = sap.ui.getCore().byId(aInputs[0].id);
					}
				} else { // create standalone
					this.inpFieldE = new sap.m.Input({
						width: "100%",
						placeholder: "Enter Company name ...",
						showValueHelp: true
					});

					this.inpFieldE.attachValueHelpRequest(this._onClearInput);

					this.setAggregation("_inpFieldE", this.inpFieldE);
				}

				if (this.inpFieldE) {
					this.inpFieldE.addEventDelegate({
						onAfterRendering: jQuery.proxy(this._onAfterRenderingInputE, this)
					}, this);
				}
			}

			if (this.fAddrActive) {
				if (this.vAttachAddr2Field) {
					aInputs = [];
					aInputs = $("[data-sap-automation-id='" + this.vAttachAddr2Field + "']");

					if (aInputs.length > 0) {
						this.inpFieldA = sap.ui.getCore().byId(aInputs[0].id);
					}
				} else {
					this.inpFieldA = new sap.m.Input({
						width: "100%",
						placeholder: "Enter Address ...",
						showValueHelp: true
					});

					this.inpFieldA.attachValueHelpRequest(this._onClearInput);

					this.setAggregation("_inpFieldA", this.inpFieldA);
				}

				if (this.inpFieldA) {
					this.inpFieldA.addEventDelegate({
						onAfterRendering: jQuery.proxy(this._onAfterRenderingInputA, this)
					}, this);
				}
			}

/*			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					this.position = position;
				}.bind(this));
			}*/

			if (typeof google === "object" && typeof google.maps === "object") {
				//this._initAutocomplete();
			} else {

				var vGoogleURL = "https://maps.googleapis.com/maps/api/js?libraries=places&key=";
				var vAPIKey = this.getParameter("API_KEY"); //API Key is stored in Custom Pane Parameters under API_KEY parameter
				if (vAPIKey) {
					vGoogleURL += vAPIKey;
				} else {
					jQuery.sap.log.error("API_KEY is missing");
				}

				jQuery.sap.includeScript(vGoogleURL,
					"google.maps",
					this._initAutocomplete.bind(this),
					function() {
						jQuery.sap.log.error("Error initializing Google Places API");
					});
			}
		},

		destroy: function() {

			try {
				if (this.autocompleteAddr !== undefined && this.autocompleteAddr !== null) {
					google.maps.event.clearInstanceListeners(this.autocompleteAddr);
					google.maps.event.clearInstanceListeners(this.eInputA);
					this.autocompleteAddr = null;
				}

				if (this.autocompleteEsta !== undefined && this.autocompleteEsta !== null) {
					google.maps.event.clearInstanceListeners(this.autocompleteEsta);
					google.maps.event.clearInstanceListeners(this.eInputE);
					this.autocompleteEsta = null;
				}

				$(".pac-container").remove();
			} catch (e) {
				jQuery.sap.log.error("Destroy method failed");
			}
		},

		autocompleteAddr: '',
		autocompleteEsta: '',
		eInputA: null,
		eInputE: null,
		inpFieldA: null,
		inpFieldE: null,
		fEstaActive: null,
		vAttachEsta2Field: null,
		fAddrActive: null,
		vAttachAddr2Field: null,
		position: null,

		_onAfterRenderingInputA: function() {
			try {
				var icon = this.inpFieldA._getValueHelpIcon();
				icon.setSrc("sap-icon://sys-cancel");
				icon.setSize("1.25rem");
			} catch (e) {
				jQuery.sap.log.error("Valuehelp icon is missed");
			}

			this.autocompleteAddr = this._initAutocompleteInput(this.inpFieldA, "geocode", this._fillInAddress);
		},

		_onAfterRenderingInputE: function() {
			try {
				var icon = this.inpFieldE._getValueHelpIcon();
				icon.setSrc("sap-icon://sys-cancel");
				icon.setSize("1.25rem");
			} catch (e) {
				jQuery.sap.log.error("Valuehelp icon is missed");
			}

			this.autocompleteEsta = this._initAutocompleteInput(this.inpFieldE, "establishment", this._fillInEstablishment);
		},

		_onClearInput: function() {
			//var oInput = this.getAggregation("_inpField");
			//oInput.setValue("");
			this.setValue("");
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

		_initAutocompleteInput: function(oInpField, sType, fnPlaceChangedCallback) {
			var sInputId = "";
			var eInput = null;

			var oAutocomplete = null;

			if (oInpField) {
				sInputId = oInpField.getId().toString() + "-inner"; // Fiori - inner-input case
			
				eInput = document.getElementById(sInputId);
				if (!eInput) {
					// HTML5 case - there is inputs straight away, no inner-input
					eInput = document.getElementById(oInpField.getId().toString());
				}
			}
			if (eInput) {
				try {
					oAutocomplete = new google.maps.places.Autocomplete(
						(eInput), {
							types: [sType],
							componentRestrictions: { country : "AU"}
						});

					oAutocomplete.addListener("place_changed", jQuery.proxy(fnPlaceChangedCallback, this));

/*					if (this.position) {
						var circle = new google.maps.Circle({
							center: {
								lat: this.position.coords.latitude,
								lng: this.position.coords.longitude
							},
							radius: this.position.coords.accuracy
						});
						oAutocomplete.setBounds(circle.getBounds());
					}*/
				} catch (e) {
					oAutocomplete = '';
				}
			}

			return oAutocomplete;

		},

		_initAutocomplete: function() {
			
			if (this.vAttachAddr2Field && this.inpFieldA) {
				this.autocompleteAddr = this._initAutocompleteInput(this.inpFieldA, "geocode", this._fillInAddress);
			}
			
			if (this.vAttachEsta2Field && this.inpFieldE) {
				this.autocompleteEsta = this._initAutocompleteInput(this.inpFieldE, "establishment", this._fillInEstablishment);
			}

/*			var sInputIdA = "";
			var sInputIdE = "";
			var aInputs = [];

			var oInputA = this.inpFieldA;
			if (oInputA) {
				sInputIdA = oInputA.getId().toString() + "-inner";
			} else if (this.vAttachAddr2Field) {
				aInputs = $("[data-sap-automation-id='" + this.vAttachAddr2Field + "']");

				if (aInputs.length > 0) {
					switch (aInputs[0].nodeName) {
						case "DIV":
							oInputA = aInputs.children()[0];
							break;
						case "INPUT":
							oInputA = aInputs[0];
							break;
					}

					if (oInputA) {
						sInputIdA = oInputA.id;
					}
				}
			}

			this.eInputA = null;
			this.eInputA = document.getElementById(sInputIdA);
			if (this.eInputA) {
				try {
					this.autocompleteAddr = new google.maps.places.Autocomplete(
						(this.eInputA), {
							types: ["geocode"]
						});

					this.autocompleteAddr.addListener("place_changed", jQuery.proxy(this._fillInAddress, this));
				} catch (e) {
					this.autocompleteAddr = '';
				}
			}

			var oInputE = this.inpFieldE;
			if (oInputE) {
				sInputIdE = oInputE.getId().toString() + "-inner";
			} else if (this.vAttachEsta2Field) {
				aInputs = $("[data-sap-automation-id='" + this.vAttachEsta2Field + "']");

				if (aInputs.length > 0) {
					switch (aInputs[0].nodeName) {
						case "DIV":
							oInputE = aInputs.children()[0];
							break;
						case "INPUT":
							oInputE = aInputs[0];
							break;
					}

					if (oInputE) {
						sInputIdE = oInputE.id;
					}
				}
			}

			this.eInputE = null;
			this.eInputE = document.getElementById(sInputIdE);
			if (this.eInputE) {
				try {
					this.autocompleteEsta = new google.maps.places.Autocomplete(
						(this.eInputE), {
							types: ["establishment"]
						});

					this.autocompleteEsta.addListener("place_changed", jQuery.proxy(this._fillInEstablishment, this));
				} catch (e) {
					this.autocompleteEsta = '';
				}
			}

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					var geolocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					var circle = new google.maps.Circle({
						center: geolocation,
						radius: position.coords.accuracy
					});
					if (this.autocompleteAddr) {
						this.autocompleteAddr.setBounds(circle.getBounds());
					}
					if (this.autocompleteEsta) {
						this.autocompleteEsta.setBounds(circle.getBounds());
					}
				}.bind(this));
			}
*/
		},

		_fillInAddressFromPlace: function(oPlace) {

			if (!oPlace.name) {
				return;
			}

			var sStreetNumber = "";
			var sStreetName = "";
			var sSuburb = "";
			var sState = "";
			var sCountry = "";
			var sPostalCode = "";

			var lat = oPlace.geometry.location.lat().toFixed(13);
			var lng = oPlace.geometry.location.lng().toFixed(13);
			this._setResultIntoNearest(lat, "/Root/LatitudeMeasure/content");
			this._setResultIntoNearest(lng, "/Root/LongitudeMeasure/content");

			for (var i = 0; i < oPlace.address_components.length; i++) {
				if (oPlace.address_components[i].types.includes("street_number")) {
					sStreetNumber = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("route")) {
					sStreetName = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("locality")) {
					sSuburb = oPlace.address_components[i].long_name;

				} else if (oPlace.address_components[i].types.includes("administrative_area_level_1")) {
					sState = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("country")) {
					sCountry = oPlace.address_components[i].short_name;

				} else if (oPlace.address_components[i].types.includes("postal_code")) {
					sPostalCode = oPlace.address_components[i].short_name;
				}
			}

			this._setResultIntoNearest(sStreetNumber, "/Root/HouseID");
			this._setResultIntoNearest(sStreetName, "/Root/StreetName");
			this._setResultIntoNearest(sSuburb, "/Root/CityName");
			this._setResultIntoNearest(sPostalCode, "/Root/StreetPostalCode");
			this._setResultIntoNearest(sCountry, "/Root/CountryCode");
			this._setResultIntoNearest(sState + "$XDP$" + sCountry, "/Root/State");

		},

		_fillInAddress: function() {
			// Get the place details from the autocomplete object.
			var place = this.autocompleteAddr.getPlace();

			this._fillInAddressFromPlace(place);

		},

		_fillInEstablishment: function() {

			// Get the place details from the autocomplete object.
			var place = this.autocompleteEsta.getPlace();

			if (place.name) {

				// // there is max 40 characters issue for standard input field
				// // wip, trying to address it like this - still error message
				// if (this.vAttachEsta2Field) {
				// 	this.eInputE.value = place.name;
				// }

				this._setResultIntoNearest(place.name, "/Root/FirstLineName");

				this._fillInAddressFromPlace(place);
			}
		}
	});

	return zEstablishmentLookup;

}, true);