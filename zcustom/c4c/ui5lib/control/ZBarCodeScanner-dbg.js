sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	
	/* global google */
	/* global captuvoPlugin */

	return Control.extend("zcustom.c4c.ui5lib.control.ZBarCodeScanner",  { 
		metadata : {
		
			library : "zcustom.c4c.ui5lib",
			properties : {
		
				/**
				 * If set to true, the button remains visible if the scanner is not available and triggers a dialog to enter bar code.
				 */
				provideFallback : {type : "boolean", defaultValue : true},
		
				/**
				 * The invisible bar code scanner button is not rendered regardless of the availability of the native scan feature.
				 */
				visible : {type : "boolean", defaultValue : true}
			},
			aggregations : {
		
				/**
				 * Internal aggregation to hold the inner Elements.
				 */
				_inpField : {type : "sap.m.Input", multiple : false, visibility : "hidden"},
				_btnG : {type : "sap.m.Button", multiple : false, visibility : "hidden"},
				_btn1 : {type : "sap.m.Button", multiple : false, visibility : "hidden"},
				_btn2 : {type : "sap.m.Button", multiple : false, visibility : "hidden"}				
			},
			events : {
		
			}
		},
	
		autocomplete : '',
		CheckedIn : '',
	
		init : function () {
			
			this.that = this;
			
			jQuery.sap.includeScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC4AW-ryf58z7at7ZK15abTfiyGJ_VMMcM&libraries=places",
									"google.maps", jQuery.proxy(this._initAutocomplete,this), null);
									
			this.setAggregation("_inpField", new sap.m.Input({
				id : "googleautocomplete",
				width : "100%",
				placeholder : "Enter Address ..."
			}));
			this.setAggregation("_btnG", new sap.m.Button({
				icon: "sap-icon://locate-me",
				width: "100%",
				text: "Check-In",
				press: jQuery.proxy(this._onLocateMe, this)
			}));	
			
			var oBarcodeStatus;
			if (sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()) {
				jQuery.sap.require("sap.client.cod.newui.shared.js.BarcodeScanner");
			
				this.setAggregation("_btn1", new sap.m.Button({
					icon: "sap-icon://bar-code",
					width: "100%",
					text: "Scan Model No",
					press: jQuery.proxy(this._onBtn1Pressed, this)
				}));
				this.setAggregation("_btn2", new sap.m.Button({
					icon: "sap-icon://bar-code",
					width: "100%",
					text: "Scan Serial No",
					press: jQuery.proxy(this._onBtn2Pressed, this)
				}));
				
				oBarcodeStatus = sap.client.cod.newui.shared.BarcodeScanner.getStatusModel();
				this.setModel(oBarcodeStatus, "status");
				
				try {
					var oCaptuvoPlugin = captuvoPlugin;
					if (oCaptuvoPlugin) {
						oCaptuvoPlugin.start(
								function (oResult) {
									this._setResult(oResult);
								}.bind(this),
								function (oEvent) {
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
		},
		
		_setIcon : function (oBtn, sPath) {
			var oDataModel = this.getModel();
			var oField = oDataModel.getDataObject(sPath);
			
			var vIcon = ( oField.getValue() ? "sap-icon://complete" : "sap-icon://bar-code" );

			if (oBtn) {
				oBtn.icon = vIcon;
			}
		},

		_onBtn1Pressed : function (oEvent) {
			sap.client.cod.newui.shared.BarcodeScanner.scan(
				jQuery.proxy(this._onScanSuccess1, this),
				jQuery.proxy(this._onScanFail, this),
				jQuery.proxy(this._onInputLiveUpdate, this)
			);
		},
		
		_onBtn2Pressed : function (oEvent) {
			sap.client.cod.newui.shared.BarcodeScanner.scan(
				jQuery.proxy(this._onScanSuccess2, this),
				jQuery.proxy(this._onScanFail, this),
				jQuery.proxy(this._onInputLiveUpdate, this)
			);
		},		

		_onScanSuccess1 : function (mArguments) {

			this._setResult(mArguments.text,"/Root/Lead/ProductID");
		},
		
		_onScanSuccess2 : function (mArguments) {

			this._setResult(mArguments.text,"/Root/Lead/SerialID");
		},		

		_onScanFail : function (mArguments) {

		},

		_onInputLiveUpdate : function (mArguments) {

		},

		setProvideFallback : function (bFallback) {
			var bValue = this.getProvideFallback();
			var oBtn;
			
			bFallback = !!bFallback;
			
			if (bValue !== bFallback) {
				this.setProperty("provideFallback", bFallback);
				oBtn = this.getAggregation("_btn1");
				if (bFallback) {
					oBtn.unbindProperty("visible");
					oBtn.setVisible(true);
				} else {
					oBtn.bindProperty("visible", "status>/available");
				}
				oBtn = this.getAggregation("_btn2");
				if (bFallback) {
					oBtn.unbindProperty("visible");
					oBtn.setVisible(true);
				} else {
					oBtn.bindProperty("visible", "status>/available");
				}				
			}
		
			return this;
		},

		_setResult : function (sResult,sPath) {
			if (sResult) {
				var oDataModel = this.getModel();
				var oField = oDataModel.getDataObject(sPath);
				oField.setValue(sResult);

				//this._setIcon(this.getAggregation("_btn1"), "/Root/Lead/ProductID");
				//this._setIcon(this.getAggregation("_btn2"), "/Root/Lead/SerialID");				
			}
		},
		
		_onLocateMe : function () {
			var oControl = this; 
			var options = {
			    enableHighAccuracy: true,
			    timeout: 5000,
			    maximumAge: 0 
			};
				
			if (navigator.geolocation) {
				oControl.setBusy(true);
			    navigator.geolocation.getCurrentPosition( jQuery.proxy(this._onGeoCurrentPositionSuccess, this), 
			    										  jQuery.proxy(this._onGeoCurrentPositionError, this), 
			    										  options);
			}			
		},
		
		_onGeoCurrentPositionError : function (err) {
			var oControl = this;
			oControl.setBusy(false);	
			jQuery.sap.log.error("ERROR(" + err.code + "): " + err.message);
		},
		
		_onGeoCurrentPositionSuccess : function (oPosition) {
			var oControl = this;
			
			var position = {};
			position.lat = oPosition.coords.latitude;
			position.lng = oPosition.coords.longitude;
			
			if (!this.CheckedIn) {
			//Check-In
				this._setResult(position.lat, "/Root/Lead/ZStartLatitudeMeasure");
				this._setResult(position.lng, "/Root/Lead/ZStartLongitudeMeasure");
				this._setResult((new Date().toISOString()), "/Root/Lead/ZStartTime");
				this.CheckedIn = true;
				
				var oBtn = this.getAggregation("_btnG");
				oBtn.mProperties.text = "Check-Out";
				
				new google.maps.Geocoder().geocode({
					latLng: position
				}, jQuery.proxy(this._onGeoResponses,this));				
			} else {
			//Check-Out
				this._setResult(position.lat, "/Root/Lead/ZEndLatitudeMeasure");
				this._setResult(position.lng, "/Root/Lead/ZEndLongitudeMeasure");
				this._setResult((new Date().toISOString()), "/Root/Lead/ZEndTime");
				
				oControl.setBusy(false);
			}
			
			jQuery.sap.log.info("Geocoords: " + JSON.stringify(position,null,4));
			
		},
		
		_onGeoResponses : function (results) {
			var oControl = this;
			oControl.setBusy(false);
			if (results && results.length > 0) {
				results.forEach(function (item, index) { jQuery.sap.log.info("Google response " + index + " : " + JSON.stringify(item,null,4)); });
				var oInput = this.getAggregation("_inpField");
				oInput.setValue(results[0].formatted_address);
    	
			} else {
				jQuery.sap.log.info("Cannot determine address at this location.");
			}			
		},
		
		_initAutocomplete : function () {
			var eInput = document.getElementById('googleautocomplete-inner');
        	this.autocomplete = new google.maps.places.Autocomplete(
	        	(eInput),
	            {types: ["geocode"]});	
	            
	        this.autocomplete.addListener('place_changed', jQuery.proxy(this._fillInAddress,this));
			
		},
		
		_fillInAddress : function () {
        // Get the place details from the autocomplete object.
	        var place = this.autocomplete.getPlace();
			
			console.log( "Address Selected = " + JSON.stringify(place, null,4));
			
			var oControl = this.getController();
			oControl = oControl.getParentController();
			var oStreetNumber = oControl.getDataContainer().getDataObject("/Root/RFL_CStreetNumber_f8d5c99d9d964b0b3c3f25b5458740c2");
			var vStreetNumber = oStreetNumber.getValue();
			console.log( "current Street Number = " + vStreetNumber);
		},

		renderer: function (oRM, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			
			oRM.write("<span");
			oRM.writeControlData(oControl);
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_inpField"));
			oRM.renderControl(oControl.getAggregation("_btnG"));
			oRM.renderControl(oControl.getAggregation("_btn1"));
			oRM.renderControl(oControl.getAggregation("_btn2"));
			oRM.write("</span>");
		}
	});
});
