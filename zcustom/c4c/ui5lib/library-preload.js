jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.c4c.ui5lib.library-preload",
	"modules": {
		"zcustom/c4c/ui5lib/control/ZBarCodeScanner.js": "sap.ui.define([\"sap/ui/core/Control\"],function(t){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{provideFallback:{type:\"boolean\",defaultValue:!0},visible:{type:\"boolean\",defaultValue:!0}},aggregations:{_btn:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"}},events:{}},init:function(){var t;if(sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()){jQuery.sap.require(\"sap.client.cod.newui.shared.js.BarcodeScanner\"),this.setAggregation(\"_btn\",new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Model No\",press:jQuery.proxy(this._onBtnPressed,this)})),t=sap.client.cod.newui.shared.BarcodeScanner.getStatusModel(),this.setModel(t,\"status\");try{var e=captuvoPlugin;e?(e.start(function(t){this._setResult(t)}.bind(this),function(t){jQuery.sap.log.error(\"Barcode Captuvo failed.\")}.bind(this)),jQuery.sap.log.debug(\"Cordova CaptuvoPlugin plugin is available!\")):jQuery.sap.log.error(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}catch(t){return void jQuery.sap.log.info(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}}},_onBtnPressed:function(t){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onScanSuccess:function(t){this._setResult(t.text)},_onScanFail:function(t){},_onInputLiveUpdate:function(t){},setProvideFallback:function(t){var e,i=this.getProvideFallback();return t=!!t,i!==t&&(this.setProperty(\"provideFallback\",t),e=this.getAggregation(\"_btn\"),t?(e.unbindProperty(\"visible\"),e.setVisible(!0)):e.bindProperty(\"visible\",\"status>/available\")),this},_setResult:function(t){if(t){this.getModel().getDataObject(\"/Root/Lead/ProductID\").setValue(t)}},renderer:function(t,e){e.getVisible()&&(t.write(\"<span\"),t.writeControlData(e),t.write(\">\"),t.renderControl(e.getAggregation(\"_btn\")),t.write(\"</span>\"))}})});",
		"zcustom/c4c/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.c4c.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\"],elements:[],version:\"0.1.0\"}),zcustom.c4c.ui5lib});",
		"zcustom/c4c/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});