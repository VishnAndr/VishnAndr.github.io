sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	return Control.extend("zcustom.C4C.ui5lib.control.ZBarCodeScanner",  { 
		metadata : {
		
			library : "zcustom.C4C.ui5lib",
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
				 * Internal aggregation to hold the inner Button.
				 */
				_btn : {type : "sap.m.Button", multiple : false, visibility : "hidden"}
			},
			events : {
		
			}
		},
	
	
		init : function () {
			var oBarcodeStatus;
			if (sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()) {
				jQuery.sap.require("sap.client.cod.newui.shared.js.BarcodeScanner");
				this.setAggregation("_btn", new sap.m.Button({
					icon: "sap-icon://bar-code",
					press: jQuery.proxy(this._onBtnPressed, this)
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

		_onBtnPressed : function (oEvent) {
			sap.client.cod.newui.shared.BarcodeScanner.scan(
				jQuery.proxy(this._onScanSuccess, this),
				jQuery.proxy(this._onScanFail, this),
				jQuery.proxy(this._onInputLiveUpdate, this)
			);
		},

		_onScanSuccess : function (mArguments) {

			this._setResult(mArguments.text);
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
				oBtn = this.getAggregation("_btn");
				if (bFallback) {
					oBtn.unbindProperty("visible");
					oBtn.setVisible(true);
				} else {
					oBtn.bindProperty("visible", "status>/available");
				}
			}
		
			return this;
		},

		_setResult : function (sResult) {
			if (sResult) {
				var oDataModel = this.getModel();
				var oGTIN = oDataModel.getDataObject("/Root/Lead/ProductID");
				oGTIN.setValue(sResult);
			}
		},

		renderer: function (oRM, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			
			oRM.write("<span");
			oRM.writeControlData(oControl);
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_btn"));
			oRM.write("</span>");
		}
	});
});
