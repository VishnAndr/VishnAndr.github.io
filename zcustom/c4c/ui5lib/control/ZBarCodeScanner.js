sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

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
	
	
		init : function () {
			jQuery.sap.includeScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC4AW-ryf58z7at7ZK15abTfiyGJ_VMMcM&libraries=places",
									"google.maps", null, null);
									
			this.setAggregation("_inpField", new sap.m.Input({
				width : "100%",
				placeholder : "Enter Address ..."
			}));
			this.setAggregation("_btnG", new sap.m.Button({
				icon: "sap-icon://locate-me",
				width: "100%",
				text: "Check-In",
				press: jQuery.proxy(this._onCheckIn, this)
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
				
				this._setIcon(this.getAggregation("_btn1"), "/Root/Lead/ProductID");
				this._setIcon(this.getAggregation("_btn2"), "/Root/Lead/SerialID");
				
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
			}
		},
		
		_onCheckIn : function () {
			var options = {
			    enableHighAccuracy: true,
			    timeout: 5000,
			    maximumAge: 0 
			};
				
			var success = function(oPosition) {
			    var position = {};
			    position.lat = oPosition.coords.latitude;
			    position.lng = oPosition.coords.longitude;
			    
			    jQuery.sap.log.info("Geocoords: " + position);
			    
				var responses = function(results) {
				    if (results && results.length > 0) {
				        //sap.ui.getCore().byId("MainView1").byId("addressValue").setValue(results[0].formatted_address);
				        results.forEach(function (item, index) { jQuery.sap.log.info("Google response " + index + " : " + item.toString()); });
				    	var oInput = this.getAggregation("_inpField");
				    	oInput.setValue(results[0].formatted_address);
				    	
				    } else {
				        jQuery.sap.log.info("Cannot determine address at this location.");
				    }
				};
				new google.maps.Geocoder().geocode({
				    latLng: position
				}, responses);
			    
			    //sap.ui.getCore().byId("MainView1").byId("addressValue").setValue(position.lat + ", " + position.lng);
			};
				
			var error = function(err) {
			    jQuery.sap.log.info("ERROR(" + err.code + "): " + err.message);
			};
				
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(success, error, options);
			}			
		},

		renderer: function (oRM, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			
			oRM.write("<span");
			oRM.writeControlData(oControl);
			oRM.write(">");
			if (oControl.getAggregation("_btn1").getVisible()) {
			oRM.renderControl(oControl.getAggregation("_btn1"));
			}
			if (oControl.getAggregation("_btn2").getVisible()) {
			oRM.renderControl(oControl.getAggregation("_btn2"));
			}
			oRM.write("</span>");
		}
	});
});
