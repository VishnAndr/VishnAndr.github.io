jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.demo.ui5lib.library-preload",
	"modules": {
		"zcustom/demo/ui5lib/control/ZAttachmentsPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\",\"sap/m/GenericTile\",\"sap/m/GenericTileScope\"],function(e,t,i,n,a){\"use strict\";return e.extend(\"zcustom.sandbox.ui5lib.control.ZAttachmentsPane\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{BrowseButton:{type:\"sap.m.GenericTile\",multiple:!1,visibility:\"hidden\"},CameraButton:{type:\"sap.m.GenericTile\",multiple:!1,visibility:\"hidden\"},Attachments:{type:\"sap.m.GenericTile\",multiple:!0,singularName:\"Attachment\",visibility:\"hidden\"}},events:{}},renderer:function(e,t){e.write(\"<div\"),e.writeControlData(t),e.addClass(\"zAttachments\"),e.writeClasses(),e.write(\">\"),e.renderControl(t.getBrowseButton()),e.renderControl(t.getCameraButton()),$.each(t.getAttachments(),function(t,i){e.renderControl(i)}),e.write(\"</div>\")},initializePane:function(){var e=new sap.m.GenericTile(this.getControlID()+\"-browseButton\",{backgroundImage:sap.ui.core.IconPool.getIconURI(\"open-folder\"),press:function(){window.FilePicker.pickOne(function(e){e.mimeType,e.content;t.show('File picked: \"'+e.name)})}});this.setBrowseButton(e);var i=new sap.m.GenericTile(this.getControlID()+\"-cameraButton\",{backgroundImage:\"sap-icon://add-photo\",press:function(e){this.onPictureButtonPress()}.bind(this)});this.setCameraButton(i);var n=new sap.m.GenericTile(this.getControlID(),{backgroundImage:\"sap-icon://pdf-attachment\",scope:a.Actions,press:function(e){\"Remove\"===e.getParameter(\"action\")?t.show(\"Remove action of attachment\"):t.show(\"Attachment has been pressed.\")}.bind(this)});this.addAttachment(n)},onBeforeRendering:function(){},onAfterRendering:function(){},onCameraButtonPress:function(){var e=sap.ui.Device.camera.DestinationType.FILE_URI,t=45;this._oApplication.isOfflineMode()&&window.FilePicker&&(t=10,e=sap.ui.Device.camera.DestinationType.DATA_URL);var i={quality:t,targetWidth:1024,targetHeight:768,saveToPhotoAlbum:!1,destinationType:e};sap.ui.Device.camera.getPicture(this.onTakePictureSuccess.bind(this),this.onTakePictureFail.bind(this),i)}})},!0);",
		"zcustom/demo/ui5lib/control/ZEstablishmentLookup.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(t,e,s){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZEstablishmentLookup\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{_inpFieldE:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_inpFieldA:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(t,e){e.getVisible()&&(t.write(\"<span\"),t.writeControlData(e),t.write(\">\"),t.renderControl(e.getAggregation(\"_inpFieldE\")),t.renderControl(e.getAggregation(\"_inpFieldA\")),t.write(\"</span>\"))},initializePane:function(){this.inpFieldE=null,this.inpFieldA=null,this.geoResponseResult=null,this.estResponseResult=null,this.fEstaActive=this.getParameter(\"EstaActive\"),this.vAttachEsta2Field=this.getParameter(\"AttachEsta2Field\"),this.fAddrActive=this.getParameter(\"AddrActive\"),this.vAttachAddr2Field=this.getParameter(\"AttachAddr2Field\");var t=[];if(this.fEstaActive&&(this.vAttachEsta2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachEsta2Field+\"']\"),t.length>0&&(this.inpFieldE=sap.ui.getCore().byId(t[0].id))):(this.inpFieldE=new sap.m.Input({width:\"100%\",placeholder:\"Enter Company name ...\",showValueHelp:!0}),this.inpFieldE.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldE\",this.inpFieldE)),this.inpFieldE&&this.inpFieldE.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputE,this)},this)),this.fAddrActive&&(this.vAttachAddr2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachAddr2Field+\"']\"),t.length>0&&(this.inpFieldA=sap.ui.getCore().byId(t[0].id))):(this.inpFieldA=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0}),this.inpFieldA.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldA\",this.inpFieldA)),this.inpFieldA&&this.inpFieldA.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputA,this)},this)),\"object\"==typeof google&&\"object\"==typeof google.maps);else{var e=\"https://maps.googleapis.com/maps/api/js?libraries=places&key=\",s=this.getParameter(\"API_KEY\");s?e+=s:jQuery.sap.log.error(\"API_KEY is missing\"),jQuery.sap.includeScript(e,\"google.maps\",this._initAutocomplete.bind(this),function(){jQuery.sap.log.error(\"Error initializing Google Places API\")})}},destroy:function(){try{void 0!==this.autocompleteAddr&&null!==this.autocompleteAddr&&(google.maps.event.clearInstanceListeners(this.autocompleteAddr),google.maps.event.clearInstanceListeners(this.eInputA),this.autocompleteAddr=null),void 0!==this.autocompleteEsta&&null!==this.autocompleteEsta&&(google.maps.event.clearInstanceListeners(this.autocompleteEsta),google.maps.event.clearInstanceListeners(this.eInputE),this.autocompleteEsta=null),$(\".pac-container\").remove()}catch(t){jQuery.sap.log.error(\"Destroy method failed\")}},autocompleteAddr:\"\",autocompleteEsta:\"\",eInputA:null,eInputE:null,inpFieldA:null,inpFieldE:null,fEstaActive:null,vAttachEsta2Field:null,fAddrActive:null,vAttachAddr2Field:null,position:null,_onAfterRenderingInputA:function(){try{var t=this.inpFieldA._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)},_onAfterRenderingInputE:function(){try{var t=this.inpFieldE._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment)},_onClearInput:function(){this.setValue(\"\")},_setResult:function(t,e){if(t){this.getModel().getDataObject(e).setValue(t)}},_setResultIntoNearest:function(t,e){for(var s,i=this;i;){if((s=i.getModel())&&s.getDataObject(e)){s.getDataObject(e).setValue(t);break}i=i.getParent()}},_initAutocompleteInput:function(t,e,s){var i=\"\",n=null,o=null;if(t&&(i=t.getId().toString()+\"-inner\",(n=document.getElementById(i))||(n=document.getElementById(t.getId().toString()))),n)try{o=new google.maps.places.Autocomplete(n,{types:[e],componentRestrictions:{country:\"AU\"}}),o.addListener(\"place_changed\",jQuery.proxy(s,this))}catch(t){o=\"\"}return o},_initAutocomplete:function(){this.vAttachAddr2Field&&this.inpFieldA&&(this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)),this.vAttachEsta2Field&&this.inpFieldE&&(this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment))},_fillInAddressFromPlace:function(t){if(t.name){var e=\"\",s=\"\",i=\"\",n=\"\",o=\"\",a=\"\",l=t.geometry.location.lat().toFixed(13),r=t.geometry.location.lng().toFixed(13);this._setResultIntoNearest(l,\"/Root/LatitudeMeasure/content\"),this._setResultIntoNearest(r,\"/Root/LongitudeMeasure/content\");for(var d=0;d<t.address_components.length;d++)t.address_components[d].types.includes(\"street_number\")?e=t.address_components[d].short_name:t.address_components[d].types.includes(\"route\")?s=t.address_components[d].short_name:t.address_components[d].types.includes(\"locality\")?i=t.address_components[d].long_name:t.address_components[d].types.includes(\"administrative_area_level_1\")?n=t.address_components[d].short_name:t.address_components[d].types.includes(\"country\")?o=t.address_components[d].short_name:t.address_components[d].types.includes(\"postal_code\")&&(a=t.address_components[d].short_name);this._setResultIntoNearest(e,\"/Root/HouseID\"),this._setResultIntoNearest(s,\"/Root/StreetName\"),this._setResultIntoNearest(i,\"/Root/CityName\"),this._setResultIntoNearest(a,\"/Root/StreetPostalCode\"),this._setResultIntoNearest(o,\"/Root/CountryCode\"),this._setResultIntoNearest(n+\"$XDP$\"+o,\"/Root/State\")}},_fillInAddress:function(){var t=this.autocompleteAddr.getPlace();this._fillInAddressFromPlace(t)},_fillInEstablishment:function(){var t=this.autocompleteEsta.getPlace();t.name&&(this._setResultIntoNearest(t.name,\"/Root/FirstLineName\"),this._fillInAddressFromPlace(t))}})},!0);",
		"zcustom/demo/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.demo.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.demo.ui5lib.control.ZEstablishmentLookup\",\"zcustom.demo.ui5lib.control.ZAttachmentsPane\"],elements:[],version:\"0.1.0\"}),zcustom.demo.ui5lib});",
		"zcustom/demo/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});