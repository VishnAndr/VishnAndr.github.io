jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.c4c.ui5lib.library-preload",
	"modules": {
		"zcustom/c4c/ui5lib/control/ZBarCodeScanner.js": "sap.ui.define([\"sap/ui/core/Control\"],function(e){\"use strict\";return e.extend(\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{provideFallback:{type:\"boolean\",defaultValue:!0},visible:{type:\"boolean\",defaultValue:!0}},aggregations:{_inpField:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_btnG:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn1:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn2:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"}},events:{}},autocomplete:\"\",init:function(){this.that=this,jQuery.sap.includeScript(\"https://maps.googleapis.com/maps/api/js?key=AIzaSyC4AW-ryf58z7at7ZK15abTfiyGJ_VMMcM&libraries=places\",\"google.maps\",jQuery.proxy(this._initAutocomplete,this),null),this.setAggregation(\"_inpField\",new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\"})),this.setAggregation(\"_btnG\",new sap.m.Button({icon:\"sap-icon://locate-me\",width:\"100%\",text:\"Check-In\",press:jQuery.proxy(this._onCheckIn,this)}));var e;if(sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()){jQuery.sap.require(\"sap.client.cod.newui.shared.js.BarcodeScanner\"),this.setAggregation(\"_btn1\",new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Model No\",press:jQuery.proxy(this._onBtn1Pressed,this)})),this.setAggregation(\"_btn2\",new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Serial No\",press:jQuery.proxy(this._onBtn2Pressed,this)})),e=sap.client.cod.newui.shared.BarcodeScanner.getStatusModel(),this.setModel(e,\"status\");try{var t=captuvoPlugin;t?(t.start(function(e){this._setResult(e)}.bind(this),function(e){jQuery.sap.log.error(\"Barcode Captuvo failed.\")}.bind(this)),jQuery.sap.log.debug(\"Cordova CaptuvoPlugin plugin is available!\")):jQuery.sap.log.error(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}catch(e){return void jQuery.sap.log.info(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}}},_setIcon:function(e,t){var i=this.getModel(),n=i.getDataObject(t),o=n.getValue()?\"sap-icon://complete\":\"sap-icon://bar-code\";e&&(e.icon=o)},_onBtn1Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess1,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onBtn2Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess2,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onScanSuccess1:function(e){this._setResult(e.text,\"/Root/Lead/ProductID\")},_onScanSuccess2:function(e){this._setResult(e.text,\"/Root/Lead/SerialID\")},_onScanFail:function(e){},_onInputLiveUpdate:function(e){},setProvideFallback:function(e){var t,i=this.getProvideFallback();return e=!!e,i!==e&&(this.setProperty(\"provideFallback\",e),t=this.getAggregation(\"_btn1\"),e?(t.unbindProperty(\"visible\"),t.setVisible(!0)):t.bindProperty(\"visible\",\"status>/available\"),t=this.getAggregation(\"_btn2\"),e?(t.unbindProperty(\"visible\"),t.setVisible(!0)):t.bindProperty(\"visible\",\"status>/available\")),this},_setResult:function(e,t){if(e){this.getModel().getDataObject(t).setValue(e),this._setIcon(this.getAggregation(\"_btn1\"),\"/Root/Lead/ProductID\"),this._setIcon(this.getAggregation(\"_btn2\"),\"/Root/Lead/SerialID\")}},_onCheckIn:function(){var e={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};navigator.geolocation&&navigator.geolocation.getCurrentPosition(jQuery.proxy(this._onGeoCurrentPositionSuccess,this),function(e){jQuery.sap.log.info(\"ERROR(\"+e.code+\"): \"+e.message)},e)},_onGeoCurrentPositionSuccess:function(e){var t={};t.lat=e.coords.latitude,t.lng=e.coords.longitude,jQuery.sap.log.info(\"Geocoords: \"+JSON.stringify(t,null,4)),(new google.maps.Geocoder).geocode({latLng:t},jQuery.proxy(this._onGeoResponses,this))},_onGeoResponses:function(e){if(e&&e.length>0){e.forEach(function(e,t){jQuery.sap.log.info(\"Google response \"+t+\" : \"+JSON.stringify(e,null,4))});this.getAggregation(\"_inpField\").setValue(e[0].formatted_address)}else jQuery.sap.log.info(\"Cannot determine address at this location.\")},_initAutocomplete:function(){this.autocomplete=new google.maps.places.Autocomplete(this.getAggregation(\"_inpField\"),{types:[\"geocode\"]}),this.autocomplete.addListener(\"place_changed\",jQuery.proxy(this._fillInAddress,this))},_fillInAddress:function(){var e=this.autocomplete.getPlace();console.log(\"Address Selected = \"+JSON.stringify(e,null,4))},renderer:function(e,t){t.getVisible()&&(e.write(\"<span\"),e.writeControlData(t),e.write(\">\"),e.renderControl(t.getAggregation(\"_inpField\")),e.renderControl(t.getAggregation(\"_btnG\")),e.renderControl(t.getAggregation(\"_btn1\")),e.renderControl(t.getAggregation(\"_btn2\")),e.write(\"</span>\"))}})});",
		"zcustom/c4c/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.c4c.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\"],elements:[],version:\"0.1.0\"}),zcustom.c4c.ui5lib});",
		"zcustom/c4c/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});