jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.c4c.ui5lib.library-preload",
	"modules": {
		"zcustom/c4c/ui5lib/control/ZAutoOpenTab.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(t,e,n){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZAutoOpenTab\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{},aggregations:{},events:{}},renderer:function(t,e){},initializePane:function(){try{for(var t=[],e=this.getController().getParentController().getComponentModel().getThingType(),n=this.getParameter(\"iStart\")?parseInt(this.getParameter(\"iStart\")):1,r=this.getParameter(\"iFinish\")?parseInt(this.getParameter(\"iFinish\")):99,i=this.getParameters(),a=n;a<=r;a++){if(i[\"ThingType\"+a.toString()]===e){var o=\"BusinessRole\"+a.toString(),s=\"NavItem\"+a.toString();try{t[i[o]]||(t[i[o]]=i[s],t.length++)}catch(t){continue}}}if(t.length>0){var g=sap.client.getCurrentApplication().getSettings().getUserBusinessRoleIds(),l=g.find(function(e){return t[e]}),c=t[l];if(c){var u=this.getController().getParentController().getDataContainer(),h=this.getController().getParentController().getStartContext().selectedNavigationItemIdFieldPath;h||(h=\"/Root/UIState/ViewSwitchSelectedItem\");var m=u.getDataObject(h);c!==m.getValue()&&m.setValue(c)}}}catch(t){return}},onBeforeRendering:function(){},onAfterRendering:function(){}})},!0);",
		"zcustom/c4c/ui5lib/control/ZBarCodeScanner.js": "sap.ui.define([\"sap/ui/core/Control\",\"sap/m/MessageToast\"],function(e,t){\"use strict\";return e.extend(\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{provideFallback:{type:\"boolean\",defaultValue:!0},visible:{type:\"boolean\",defaultValue:!0}},aggregations:{_inpField:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_btnG:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn1:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn2:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"}},events:{}},autocomplete:\"\",CheckedIn:\"\",init:function(){this.that=this,jQuery.sap.includeScript(\"https://maps.googleapis.com/maps/api/js?key=AIzaSyC4AW-ryf58z7at7ZK15abTfiyGJ_VMMcM&libraries=places\",\"google.maps\",jQuery.proxy(this._initAutocomplete,this),function(){console.log(\"Error initializing Google Places API\")});var e=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0});e.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInput,this)},this),e.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpField\",e),this.setAggregation(\"_btnG\",new sap.m.Button({icon:\"sap-icon://locate-me\",width:\"100%\",text:\"Check-In\",press:jQuery.proxy(this._onLocateMe,this)}));var t;if(sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()){jQuery.sap.require(\"sap.client.cod.newui.shared.js.BarcodeScanner\");var s=new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Model No\",press:jQuery.proxy(this._onBtn1Pressed,this)});this.setAggregation(\"_btn1\",s);var n=new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Serial No\",press:jQuery.proxy(this._onBtn2Pressed,this)});this.setAggregation(\"_btn2\",n),t=sap.client.cod.newui.shared.BarcodeScanner.getStatusModel(),this.setModel(t,\"status\");try{var i=captuvoPlugin;i?(i.start(function(e){this._setResult(e)}.bind(this),function(e){jQuery.sap.log.error(\"Barcode Captuvo failed.\")}.bind(this)),jQuery.sap.log.debug(\"Cordova CaptuvoPlugin plugin is available!\")):jQuery.sap.log.error(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}catch(e){return void jQuery.sap.log.info(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}}},_onAfterRenderingInput:function(){var e=this.getAggregation(\"_inpField\"),t=e._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\"),this._initAutocomplete()},_onClearInput:function(){this.setValue(\"\")},_onBtn1Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess1,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onBtn2Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess2,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onScanSuccess1:function(e){this._setResult(e.text,\"/Root/ScannedValue\"),this._ProcessBarCodeResult(e.text)},_onScanSuccess2:function(e){this._setResult(e.text,\"/Root/Lead/SerialID\")},_onScanFail:function(e){},_onInputLiveUpdate:function(e){},setProvideFallback:function(e){var t,s=this.getProvideFallback();return e=!!e,s!==e&&(this.setProperty(\"provideFallback\",e),t=this.getAggregation(\"_btn1\"),e?(t.unbindProperty(\"visible\"),t.setVisible(!0)):t.bindProperty(\"visible\",\"status>/available\"),t=this.getAggregation(\"_btn2\"),e?(t.unbindProperty(\"visible\"),t.setVisible(!0)):t.bindProperty(\"visible\",\"status>/available\")),this},_setResult:function(e,t){if(e){this.getModel().getDataObject(t).setValue(e)}},_setResultIntoNearest:function(e,t){for(var s,n=this;n;){if((s=n.getModel())&&s.getDataObject(t)){s.getDataObject(t).setValue(e);break}n=n.getParent()}},_onLocateMe:function(){var e=this,t={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};navigator.geolocation&&(e.setBusy(!0),navigator.geolocation.getCurrentPosition(jQuery.proxy(this._onGeoCurrentPositionSuccess,this),jQuery.proxy(this._onGeoCurrentPositionError,this),t))},_onGeoCurrentPositionError:function(e){this.setBusy(!1),jQuery.sap.log.error(\"ERROR(\"+e.code+\"): \"+e.message)},_onGeoCurrentPositionSuccess:function(e){var t=this,s={};s.lat=e.coords.latitude,s.lng=e.coords.longitude;var n=this.getAggregation(\"_btnG\");if(this._setResult(this._getCurrentDate(),\"/Root/Lead/ReferenceDate\"),this.CheckedIn)this._setResult(s.lat.toFixed(13),\"/Root/Lead/ZEndLatitudeMeasure\"),this._setResult(s.lng.toFixed(13),\"/Root/Lead/ZEndLongitudeMeasure\"),this._setResult((new Date).toISOString(),\"/Root/Lead/ZEndTime\"),this.CheckedIn=!1,n.mProperties.text=\"Check-In\",t.setBusy(!1);else{this._setResult(s.lat.toFixed(13),\"/Root/Lead/ZStartLatitudeMeasure\"),this._setResult(s.lng.toFixed(13),\"/Root/Lead/ZStartLongitudeMeasure\"),this._setResult((new Date).toISOString(),\"/Root/Lead/ZStartTime\"),this.CheckedIn=!0,n.mProperties.text=\"Check-Out\";this.getAggregation(\"_inpField\").getValue()?t.setBusy(!1):(new google.maps.Geocoder).geocode({latLng:s},jQuery.proxy(this._onGeoResponses,this))}n.invalidate()},_getCurrentDate:function(){var e=new Date,t=e.getMonth()+1,s=e.getDate();return e.getFullYear()+\"-\"+((\"\"+t).length<2?\"0\":\"\")+t+\"-\"+((\"\"+s).length<2?\"0\":\"\")+s},_onGeoResponses:function(e){if(this.setBusy(!1),e&&e.length>0){this.getAggregation(\"_inpField\").setValue(e[0].formatted_address);var t=e[0];this._fillInAddressFromPlace(t)}else jQuery.sap.log.info(\"Cannot determine address at this location.\")},_initAutocomplete:function(){var e=this.getAggregation(\"_inpField\");if(e){var t=e.getId().toString()+\"-inner\",s=document.getElementById(t);if(s)try{this.autocomplete=new google.maps.places.Autocomplete(s,{types:[\"geocode\"]}),this.autocomplete.addListener(\"place_changed\",jQuery.proxy(this._fillInAddress,this))}catch(e){this.autocomplete=\"\"}}},_fillInAddressFromPlace:function(e){for(var t=\"\",s=\"\",n=\"\",i=\"\",o=0;o<e.address_components.length;o++)e.address_components[o].types.includes(\"street_number\")?t=e.address_components[o].short_name:e.address_components[o].types.includes(\"route\")?s=e.address_components[o].short_name:e.address_components[o].types.includes(\"locality\")?n=e.address_components[o].long_name:e.address_components[o].types.includes(\"administrative_area_level_1\")&&(i=e.address_components[o].short_name);this._setResultIntoNearest(t,\"/Root/RFL_CStreetNumber_f8d5c99d9d964b0b3c3f25b5458740c2\"),this._setResultIntoNearest(s,\"/Root/RFL_CStreetName_8a90ca3b0dc9216084126131c52991ad\"),this._setResultIntoNearest(n,\"/Root/RFL_CSuburb_e09b0c6b797cfe0e96dcb9e4642137ff\"),this._setResultIntoNearest(i,\"/Root/RFL_CState_0c757ce9e338b9da7867ee71990b089b\")},_fillInAddress:function(){var e=this.autocomplete.getPlace();this._fillInAddressFromPlace(e)},_ProcessBarCodeResult:function(e){var s,n=e,i=\"\",o=\"\",a=[],r=new RegExp(/^(10)/,\"\"),l=new RegExp(/^(240)/,\"\"),u=new RegExp(/^(90)/,\"\"),c=new RegExp(/^21/,\"\"),d=new RegExp(/^10000/,\"\");try{if(l.test(n))a=n.split(l),3===a.length()&&(n=a[2],d.test(n)&&(a.split(d),3===a.length()&&(n=a[2])));else{if(!r.test(n))throw s=\"First AI not recognized in Barcode value:\"+e,jQuery.sap.log.error(s),s;a=n.split(r),3===a.length()&&(n=a[2],n=n.substring(4))}if(u.test(n)&&(a=n.split(u),3===a.lengrh()&&(n=a[2])&&(i=n.substring(0,13),n=n.substring(13),c.test(n)&&(a=n.split(c),3===a.length()&&(o=a[2])))),!i||!o)throw s=\"vModel (\"+i+\") or vSerial (\"+o+\") not found in Barcode value: \"+e,jQuery.sap.log.error(s),s;this._setResult(i,\"/Root/Lead/ProductID\"),this._setResult(o,\"/Root/Lead/SerialID\")}catch(i){s=\"Barcode parsing failed.\\r\\nValue :\"+e,t.show(n)}},renderer:function(e,t){t.getVisible()&&(e.write(\"<span\"),e.writeControlData(t),e.write(\">\"),e.renderControl(t.getAggregation(\"_inpField\")),e.renderControl(t.getAggregation(\"_btnG\")),e.renderControl(t.getAggregation(\"_btn1\")),e.renderControl(t.getAggregation(\"_btn2\")),e.write(\"</span>\"))}})});",
		"zcustom/c4c/ui5lib/control/ZCustomEmptyPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(e,n,t){\"use strict\";return e.extend(\"zcustom.c4c.ui5lib.control.ZCustomEmptyPane\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{},aggregations:{},events:{}},renderer:function(e,n){},initializePane:function(){},onBeforeRendering:function(){},onAfterRendering:function(){}})},!0);",
		"zcustom/c4c/ui5lib/control/ZPlumberLeadPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(e,t,n){\"use strict\";return e.extend(\"zcustom.c4c.ui5lib.control.ZPlumberLeadPane\",{metadata:{library:\"zcustom.c4c.ui5lib\",properties:{provideFallback:{type:\"boolean\",defaultValue:!0},visible:{type:\"boolean\",defaultValue:!0}},aggregations:{_inpField:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_btnG:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn1:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"},_btn2:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(e,t){t.getVisible()&&(e.write(\"<span\"),e.writeControlData(t),e.write(\">\"),e.renderControl(t.getAggregation(\"_inpField\")),e.renderControl(t.getAggregation(\"_btnG\")),e.renderControl(t.getAggregation(\"_btn1\")),e.write(\"</span>\"))},initializePane:function(){var e=this;this.inpField=null,this.btnG=null,this.btn1=null,this.btn2=null,this.geoResponseResult=null;var t=\"https://maps.googleapis.com/maps/api/js?libraries=places&key=\",n=this.getParameter(\"API_KEY\");n?t+=n:jQuery.sap.log.error(\"API_KEY is missing\"),jQuery.sap.includeScript(t,\"google.maps\",jQuery.proxy(this._initAutocomplete,this),function(){jQuery.sap.log.error(\"Error initializing Google Places API\")}),this.inpField=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0}),this.inpField.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInput,this)},this),this.inpField.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpField\",this.inpField),this.btnG=new sap.m.Button({icon:\"sap-icon://locate-me\",width:\"100%\",text:\"Check-In\",press:jQuery.proxy(this._onLocateMe,this)}),this.setAggregation(\"_btnG\",this.btnG);var s;if(sap.client.getCurrentApplication().getRuntimeEnvironment().isRunningInContainer()){jQuery.sap.require(\"sap.client.cod.newui.shared.js.BarcodeScanner\"),this.Btn1=new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Model No\",press:jQuery.proxy(this._onBtn1Pressed,this)}),this.setAggregation(\"_btn1\",this.Btn1),this.Btn2=new sap.m.Button({icon:\"sap-icon://bar-code\",width:\"100%\",text:\"Scan Serial No\",press:jQuery.proxy(this._onBtn2Pressed,this)}),this.setAggregation(\"_btn2\",this.Btn2),s=sap.client.cod.newui.shared.BarcodeScanner.getStatusModel(),this.setModel(s,\"status\");try{var o=captuvoPlugin;o?(o.start(function(e){this._setResult(e)}.bind(this),function(e){jQuery.sap.log.error(\"Barcode Captuvo failed.\")}.bind(this)),jQuery.sap.log.debug(\"Cordova CaptuvoPlugin plugin is available!\")):jQuery.sap.log.error(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}catch(e){return void jQuery.sap.log.info(\"CaptuvoPlugin: CaptuvoPlugin is not available\")}}this.getModel().attachDataContainerUpdateFinished(function(){e._checkBtnState()})},onAfterRendering:function(){var e=this;try{var t=this.getController().getParentController().getDataContainer().getDataObject(\"/Root/ZL_CheckOut_Done_567360ce52f782bf520d25d5c099515b\");t.attachValueChanged(function(){e._checkBtnState()}),t=this.getController().getParentController().getDataContainer().getDataObject(\"/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc\"),t.attachValueChanged(function(){e._checkBtnState()})}catch(e){console.log(\"Cannot attach to data field: \"+e.message)}},_checkBtnState:function(){try{var e=this._getValueFromNearest(\"/Root/ZL_CheckOut_Done_567360ce52f782bf520d25d5c099515b\"),t=this._getValueFromNearest(\"/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc\"),n=this._getValueFromNearest(\"/Root/Lead/ZStartTime\");e?(this.btnG&&(this.btnG.setText(\"Checked-Out\"),this.btnG.setEnabled(!1)),this.btn1&&this.btn1.setEnabled(!1),this.inpField&&this.inpField.setEnabled(!1)):t||n?(this.CheckedIn=!0,this.btnG&&this.btnG.setText(\"Check-Out\")):(this.CheckedIn=!1,this.btnG&&(this.btnG.setText(\"Check-In\"),this.btnG.setEnabled(!0)),this.btn1&&this.btn1.setEnabled(!0),this.inpField&&this.inpField.setEnabled(!0))}catch(e){console.log(\"Error during _checkBtnState: \"+e.message)}},autocomplete:\"\",CheckedIn:\"\",_onAfterRenderingInput:function(){var e=this.getAggregation(\"_inpField\"),t=e._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\"),this._initAutocomplete()},_onClearInput:function(){this.setValue(\"\")},_onBtn1Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess1,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onBtn2Pressed:function(e){sap.client.cod.newui.shared.BarcodeScanner.scan(jQuery.proxy(this._onScanSuccess2,this),jQuery.proxy(this._onScanFail,this),jQuery.proxy(this._onInputLiveUpdate,this))},_onScanSuccess1:function(e){this._setResult(e.text,\"/Root/ScannedValue\");try{this._ProcessBarCodeResult(e),this._setResult(this._getCurrentDate(),\"/Root/Lead/ReferenceDate\"),this._setResultIntoNearest(\"102\",\"/Root/JobType1_3a41b900b57ea2e2555fca9888158af2\"),this._triggerLeadOnSave()}catch(e){jQuery.sap.log.error(\"Barcode has not been recognized\")}},_onScanSuccess2:function(e){this._setResult(e.text,\"/Root/Lead/SerialID\")},_onScanFail:function(e){t.show(\"Please try again\")},_onInputLiveUpdate:function(e){},_setResult:function(e,t){if(e){this.getModel().getDataObject(t).setValue(e)}},_setResultIntoNearest:function(e,t){for(var n,s=this;s;){if((n=s.getModel())&&n.getDataObject(t)){n.getDataObject(t).setValue(e);break}s=s.getParent()}},_getValueFromNearest:function(e){for(var t,n,s=this;s;){if((n=s.getModel())&&n.getDataObject(e)){t=n.getDataObject(e).getValue();break}s=s.getParent()}return t},_onLocateMe:function(){var e={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};navigator.geolocation&&(sap.ui.core.BusyIndicator.show(),navigator.geolocation.getCurrentPosition(jQuery.proxy(this._onGeoCurrentPositionSuccess,this),jQuery.proxy(this._onGeoCurrentPositionError,this),e))},_onGeoCurrentPositionError:function(e){sap.ui.core.BusyIndicator.hide(),jQuery.sap.log.error(\"ERROR(\"+e.code+\"): \"+e.message)},_onGeoCurrentPositionSuccess:function(e){var t={};t.lat=e.coords.latitude,t.lng=e.coords.longitude;var n=this.getAggregation(\"_btnG\");if(this.CheckedIn)this._setResult(t.lat.toFixed(13),\"/Root/Lead/ZEndLatitudeMeasure\"),this._setResult(t.lng.toFixed(13),\"/Root/Lead/ZEndLongitudeMeasure\"),this._setResult((new Date).toISOString(),\"/Root/Lead/ZEndTime\"),this._setResultIntoNearest(\"X\",\"/Root/ZL_CheckOut_InProgress_be3d0b36bc2a920210c6ac5c07a6ec42\"),this.CheckedIn=!1,sap.ui.core.BusyIndicator.hide(),this._triggerLeadOnSave();else{this._setResult(t.lat.toFixed(13),\"/Root/Lead/ZStartLatitudeMeasure\"),this._setResult(t.lng.toFixed(13),\"/Root/Lead/ZStartLongitudeMeasure\"),this._setResult((new Date).toISOString(),\"/Root/Lead/ZStartTime\"),this._setResultIntoNearest(\"X\",\"/Root/ZL_CheckIn_InProgress_d7b7d40d01365299258b51d7a39af7cc\"),this.CheckedIn=!0,n.mProperties.text=\"Check-Out\";this.getAggregation(\"_inpField\").getValue()?sap.ui.core.BusyIndicator.hide():(new google.maps.Geocoder).geocode({latLng:t},jQuery.proxy(this._onGeoResponses,this))}n.invalidate()},_getCurrentDate:function(){var e=new Date,t=e.getMonth()+1,n=e.getDate();return e.getFullYear()+\"-\"+((\"\"+t).length<2?\"0\":\"\")+t+\"-\"+((\"\"+n).length<2?\"0\":\"\")+n},_onGeoResponses:function(e){sap.ui.core.BusyIndicator.hide(),e&&e.length>0?(this.geoResponseResult=e[0],n.show(\"Are you at \\r\\n\"+this.geoResponseResult.formatted_address+\"?\",{icon:n.Icon.QUESTION,title:\"Confirm\",actions:[n.Action.YES,n.Action.NO],onClose:jQuery.proxy(this._onConfirm,this)})):jQuery.sap.log.info(\"Cannot determine address at this location.\")},_onConfirm:function(e){if(e===n.Action.YES){var t=this.getAggregation(\"_inpField\");t.setValue(this.geoResponseResult.formatted_address),this._fillInAddressFromPlace(this.geoResponseResult,!0)}else if(e===n.Action.NO){var t=this.getAggregation(\"_inpField\");t.setValue(this.geoResponseResult.formatted_address),this._fillInAddressFromPlace(this.geoResponseResult,!1)}this.geoResponseResult=null},_initAutocomplete:function(){var e=this.getAggregation(\"_inpField\");if(e){var t=e.getId().toString()+\"-inner\",n=document.getElementById(t);if(n)try{this.autocomplete=new google.maps.places.Autocomplete(n,{types:[\"geocode\"]}),this.autocomplete.addListener(\"place_changed\",jQuery.proxy(this._fillInAddress,this))}catch(e){this.autocomplete=\"\"}}},_fillInAddressFromPlace:function(e,t){for(var n=\"\",s=\"\",o=\"\",i=\"\",a=\"\",r=0;r<e.address_components.length;r++)e.address_components[r].types.includes(\"street_number\")?n=e.address_components[r].short_name:e.address_components[r].types.includes(\"route\")?s=e.address_components[r].short_name:e.address_components[r].types.includes(\"locality\")?o=e.address_components[r].long_name:e.address_components[r].types.includes(\"administrative_area_level_1\")?i=e.address_components[r].short_name:e.address_components[r].types.includes(\"postal_code\")&&(a=e.address_components[r].short_name);this._setResultIntoNearest(n,\"/Root/RFL_CStreetNumber_f8d5c99d9d964b0b3c3f25b5458740c2\"),this._setResultIntoNearest(s,\"/Root/RFL_CStreetName_8a90ca3b0dc9216084126131c52991ad\"),this._setResultIntoNearest(o,\"/Root/RFL_CSuburb_e09b0c6b797cfe0e96dcb9e4642137ff\"),this._setResultIntoNearest(i,\"/Root/RFL_CState_0c757ce9e338b9da7867ee71990b089b\"),this._setResultIntoNearest(a,\"/Root/ZRFL_PostCode_7834540e1c06fed78ba92204ff988027\"),t&&this._triggerLeadOnSave()},_fillInAddress:function(){var e=this.autocomplete.getPlace();this._fillInAddressFromPlace(e)},_removeSpecialChars:function(e){return e.replace(/(?!\\w)./g,\"\")},_ProcessBarCodeResult:function(e){var n,s=e.text,o=e.format,i=\"\",a=\"\",r=new RegExp(/^(10)\\d{4,4}/,\"\"),l=new RegExp(/^(240)\\d{5,5}/,\"\"),c=new RegExp(/^90/,\"\"),u=new RegExp(/21$/,\"\"),d=new RegExp(/^90\\w{1,13}21/);new RegExp(/\\W+/);try{if(s=this._removeSpecialChars(s),\"CODE_128\"!==o)throw n=\"Format has not been recognized\\r\\n Format = \"+o,jQuery.sap.log.error(n),n;if(l.test(s))s.match(l)[0].replace(\"240\",\"\"),s=s.replace(l,\"\");else{if(!r.test(s))throw n=\"First AI not recognized in Barcode value:\"+s,jQuery.sap.log.error(n),n;s.match(r)[0].replace(\"10\",\"\"),s=s.replace(r,\"\")}if(!d.test(s))throw n=\"(AI90)MATNR(AI21)SERNR pattern not recognized in Barcode value:\"+s,jQuery.sap.log.error(n),n;if(i=s.match(d)[0].replace(c,\"\"),i=i.replace(u,\"\"),s=s.replace(d,\"\"),a=s,!i||!a)throw n=\"vModel (\"+i+\") or vSerial (\"+a+\") not found in Barcode value: \"+s,jQuery.sap.log.error(n),n;this._setResult(i,\"/Root/Lead/ProductID\"),this._setResult(a,\"/Root/Lead/SerialID\"),n=\"Model Number: \"+i+\"\\r\\nand Serial Number: \"+a+\"\\r\\nread successfully\",t.show(n)}catch(s){throw n=s+\"\\r\\n\"+e.text,t.show(n),n}},_triggerLeadOnSave:function(){var e=new sap.client.evt.EventContext(this);this.getController().getParentController().getEventProcessor().handleEvent(\"OnSave\",e)}})},!0);",
		"zcustom/c4c/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(c,e){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.c4c.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.c4c.ui5lib.control.ZCustomEmptyPane\",\"zcustom.c4c.ui5lib.control.ZBarCodeScanner\",\"zcustom.c4c.ui5lib.contorl.ZPlumberLeadPane\",\"zcustom.c4c.ui5lib.contorl.ZAutoOpenTab\"],elements:[],version:\"0.1.0\"}),zcustom.c4c.ui5lib});",
		"zcustom/c4c/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});