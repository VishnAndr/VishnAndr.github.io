jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.demo.ui5lib.library-preload",
	"modules": {
		"zcustom/demo/ui5lib/control/ZAttachmentsPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\",\"sap/m/GenericTile\",\"sap/m/GenericTileScope\",\"sap/ui/unified/FileUploader\",\"sap/client/m/util/ImageResizer\",\"sap/client/m/create/QuickCreateTile\",\"sap/m/ScrollContainer\"],function(e,i,t,a,n,o,s,l,r){\"use strict\";return e.extend(\"zcustom.sandbox.ui5lib.control.ZAttachmentsPane\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{browseTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},cameraTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},attachments:{type:\"sap.m.GenericTile\",multiple:!0,singularName:\"attachment\"},tileContainer:{type:\"sap.m.ScrollContainer\",multiple:!1}},events:{}},renderer:function(e,i){e.write(\"<div\"),e.writeControlData(i),e.addClass(\"zAttachments\"),e.writeClasses(),e.write(\">\"),e.renderControl(i.getTileContainer()),e.write(\"</div>\")},initializePane:function(){this.oTileContainer=new sap.m.ScrollContainer({class:\"sapUiTinyMarginTop sapUiTinyMarginBegin\"}),this.setTileContainer(this.oTileContainer);var e=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-browseTile\",{text:\"Browse\",icon:\"sap-icon://open-folder\"}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne\");this.setBrowseTile(e);var t=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-cameraTile\",{text:\"Camer\",icon:\"sap-icon://add-photo\",press:[this.onPictureButtonPress,this]}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne\");this.setCameraTile(t);var a=new sap.m.ImageContent({class:\"sapUiMediumMarginBeginEnd sapUiMediumMarginTopBottom\",src:\"sap-icon://pdf-attachment\"}),o=new sap.m.TileContent;o.setContent(a);var s=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment1\",{header:\"File\",class:\"sapUiTinyMarginBegin sapUiTinyMarginTop\",scope:n.Actions,press:function(e){\"Remove\"===e.getParameter(\"action\")?i.show(\"Remove action of attachment\"):i.show(\"Attachment has been pressed.\")}.bind(this)});s.addTileContent(o),this.addAttachment(s);var l=new sap.m.ImageContent({class:\"sapUiTinyMarginBeginEnd sapUiTinyMarginTopBottom\",src:\"https://www.frasersproperty.com.au/-/media/frasers-property/retail/landing-site/our-difference/retail_our-difference-1_frasers-property--optimized.jpg\"}),r=new sap.m.TileContent;r.setContent(l);var p=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment2\",{header:\"File\",class:\"sapUiTinyMarginBegin sapUiTinyMarginTop\",scope:n.Actions,press:function(e){\"Remove\"===e.getParameter(\"action\")?i.show(\"Remove action of attachment\"):i.show(\"Attachment has been pressed.\")}.bind(this)});p.addTileContent(r),this.addAttachment(p),this.oTileContainer.addContent(e),this.oTileContainer.addContent(t),this.oTileContainer.addContent(s),this.oTileContainer.addContent(p)},onBeforeRendering:function(){},onAfterRendering:function(){},_setupImageResize:function(e){if(e&&this.oController.getRuntimeEnvironment().isRunningInContainer())switch(e){case\"L\":this._iCompressedWidthHeight=this.LARGE_WIDTH_HEIGHT;break;case\"M\":this._iCompressedWidthHeight=this.MEDIUM_WIDTH_HEIGHT;break;case\"S\":this._iCompressedWidthHeight=this.SMALL_WIDTH_HEIGHT;break;default:this._iCompressedWidthHeight=null}},_showUploadingDialog:function(){this._oDialog||(this._oDialog=new sap.m.Dialog(this.getControlID()+\"-dialog\",{title:sap.client.m.Util.getLocaleText(\"UploadInProgress\",\"Uploading...\"),content:new sap.m.Text(this.getControlID()+\"-text\",{text:sap.client.m.Util.getLocaleText(\"FileUploadingMsg\",\"Uploading file to server, please wait ...\")})})),this._oDialog.open()},_closeUploadingDialog:function(){this._oDialog&&this._oDialog.close()},_onImageResized:function(e,i,t){var a=t;if(e){var n=e.mParameters.files[0];n&&(a=n.name)}if(this._oApplication.isOfflineMode()){var o=this._dataUriToBlob(i);this._uploadFile(o,a)}else this._uploadFile(i,a)},_dataUriToBlob:function(e){for(var i=e.split(\",\"),t=i[0].match(/:(.*?);/)[1],a=atob(i[1]),n=a.length,o=new Uint8Array(n);n--;)o[n]=a.charCodeAt(n);return new Blob([o],{type:t})},_uploadFile:function(e,i){var t=new window.FileTransfer;this._oApplication.isOfflineMode()&&(t=this.getOfflineFileTransfer());var a,n=this.oController.getRuntimeEnvironment(),o=(n.isRunningInContainer(),new window.FileUploadOptions);a=i||(e.name?e.name:\"file\"),o.fileName=a,o.fileKey=\"file\",o.chunkedMode=!1,\"string\"==typeof e&&e.match(\"image.*\")?o.mimeType=\"image/png\":\"string\"==typeof e&&e.match(\"data:.*\")?o.mimeType=e.split(\";\")[0].split(\":\")[1]:o.mimeType=e.type,o.headers={Referer:window.location.href},this._showUploadingDialog();var s=this.getUploadURL(),l=this.onFileUploadSuccess.bind(this),r=this.onFileUploadFail.bind(this);t.upload(e,s,l,r,o)},_onFileChange:function(e){var i;if(this._oApplication.isOfflineMode()){i=this._oApplication.getFileTransfer(),this._showUploadingDialog();var t=e.mParameters.files[0],a={fileKey:\"file\",fileName:t.name,mimeType:t.type},n=this.onFileUploadSuccess.bind(this),o=this.onFileUploadFail.bind(this);i.upload(t,null,n,o,a)}else{i=e.oSource;var s=this.getUploadURL();i.setUploadUrl(s);var l=this.oController.getImageProcessor();l?this.isImageFileUploader(i)?l.openPreview(s,e):(i.upload(),l.closePreview(s,e)):(this._showUploadingDialog(),i.upload())}},isImageFileUploader:function(e){if(e&&e.oFileUpload){var i=e.oFileUpload.files[0];return this.isImageFile(i)}return!1},isImageFile:function(e){return!!(e&&e.type&&e.type.match(\"image.*\")||e&&e.mimeType&&e.mimeType.match(\"image.*\"))},getOfflineFileTransfer:function(){if(!this.oOfflineFileTransfer){var e=sap.ui.requireSync(\"sap/client/setup/offline/FileTransfer\"),i=this._oApplication.getOfflineAPI();this.oOfflineFileTransfer=new e(i)}return this.oOfflineFileTransfer},setControlWidth:function(e){this.oControl.setWidth&&this.oControl.setWidth(\"100%\")},getUploadURL:function(){var e,i=this._oApplication.getRepositoryUrl();if(i&&(e=i.indexOf(\"/sap/\")+4)>=0){var t=this.oController.getSession().getSessionID();i=i.substr(0,e)+\"(\"+t+\")\"+i.substr(e)}return i&&(e=i.lastIndexOf(\"/\"))>=0&&(i=i.substr(0,e)+\"/fileupload\"),i},uploadComplete:function(e,i,t){},onFileUploadSuccess:function(e){var i=null,t=null,a=null,n=unescape(decodeURI(e.response));n=n.replace(/[\\r]/g,\"\");var o=n.split(\"\\n\");3===o.length&&(i=o[0].split(\"=\")[1],t=o[1].split(\"=\")[1],a=o[2].split(\"=\")[1]),this._closeUploadingDialog(),this.uploadComplete(i,t,a)},onFileUploadFail:function(e){this._closeUploadingDialog();var i;i=e.exception?e.exception:e.message,this._resetUploader(),sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+i),jQuery.sap.log.info(\"onFileUploadFail exception \"+i)},onTakePictureSuccess:function(e){if(this.oImageResizer){var i=function(i){var t;t=e.startsWith(\"/\")?\"image-\"+(new Date).getTime()+\".jpg\":e.replace(/^.*[\\\\\\/]/,\"\"),this._onImageResized(null,i,t)},t=function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+sap.client.m.Util.getLocaleText(\"FileUploadImageResizeFailMsg\",\"Failed to resize image\"))};if(this._oApplication.isOfflineMode()&&window.FilePicker){var a=\"data:image/jpeg;base64,\"+e;this.oImageResizer.resizeImage(a).then(i.bind(this),t)}else this.oImageResizer.resizeImagePath(e).then(i.bind(this),t)}else{var n,o=this._oApplication.getFileTransfer(),s=new window.FileUploadOptions;e.startsWith(\"/\")?(s.content=e,s.fileName=(new Date).getTime()+\".jpg\",n=s.fileName):(s.fileName=e.replace(/^.*[\\\\\\/]/,\"\"),n=e),s.fileKey=\"file\",s.mimeType=\"image/jpeg\",s.chunkedMode=!1,s.headers={Referer:window.location.href},this._showUploadingDialog();var l=this.getUploadURL(),r=this.onFileUploadSuccess.bind(this),p=this.onFileUploadFail.bind(this);o.upload(n,l,r,p,s)}},onTakePictureFail:function(e){jQuery.sap.log.info(\"onTakePictureFail for error \"+e)},onPictureButtonPress:function(e){var i=sap.ui.Device.camera.DestinationType.FILE_URI,t={quality:45,targetWidth:1024,targetHeight:768,saveToPhotoAlbum:!1,destinationType:i};sap.ui.Device.camera.getPicture(this.onTakePictureSuccess.bind(this),this.onTakePictureFail.bind(this),t)},_resetUploader:function(){}})},!0);",
		"zcustom/demo/ui5lib/control/ZEstablishmentLookup.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(t,e,s){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZEstablishmentLookup\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{_inpFieldE:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_inpFieldA:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(t,e){e.getVisible()&&(t.write(\"<span\"),t.writeControlData(e),t.write(\">\"),t.renderControl(e.getAggregation(\"_inpFieldE\")),t.renderControl(e.getAggregation(\"_inpFieldA\")),t.write(\"</span>\"))},initializePane:function(){this.inpFieldE=null,this.inpFieldA=null,this.geoResponseResult=null,this.estResponseResult=null,this.fEstaActive=this.getParameter(\"EstaActive\"),this.vAttachEsta2Field=this.getParameter(\"AttachEsta2Field\"),this.fAddrActive=this.getParameter(\"AddrActive\"),this.vAttachAddr2Field=this.getParameter(\"AttachAddr2Field\");var t=[];if(this.fEstaActive&&(this.vAttachEsta2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachEsta2Field+\"']\"),t.length>0&&(this.inpFieldE=sap.ui.getCore().byId(t[0].id))):(this.inpFieldE=new sap.m.Input({width:\"100%\",placeholder:\"Enter Company name ...\",showValueHelp:!0}),this.inpFieldE.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldE\",this.inpFieldE)),this.inpFieldE&&this.inpFieldE.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputE,this)},this)),this.fAddrActive&&(this.vAttachAddr2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachAddr2Field+\"']\"),t.length>0&&(this.inpFieldA=sap.ui.getCore().byId(t[0].id))):(this.inpFieldA=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0}),this.inpFieldA.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldA\",this.inpFieldA)),this.inpFieldA&&this.inpFieldA.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputA,this)},this)),\"object\"==typeof google&&\"object\"==typeof google.maps);else{var e=\"https://maps.googleapis.com/maps/api/js?libraries=places&key=\",s=this.getParameter(\"API_KEY\");s?e+=s:jQuery.sap.log.error(\"API_KEY is missing\"),jQuery.sap.includeScript(e,\"google.maps\",this._initAutocomplete.bind(this),function(){jQuery.sap.log.error(\"Error initializing Google Places API\")})}},destroy:function(){try{void 0!==this.autocompleteAddr&&null!==this.autocompleteAddr&&(google.maps.event.clearInstanceListeners(this.autocompleteAddr),google.maps.event.clearInstanceListeners(this.eInputA),this.autocompleteAddr=null),void 0!==this.autocompleteEsta&&null!==this.autocompleteEsta&&(google.maps.event.clearInstanceListeners(this.autocompleteEsta),google.maps.event.clearInstanceListeners(this.eInputE),this.autocompleteEsta=null),$(\".pac-container\").remove()}catch(t){jQuery.sap.log.error(\"Destroy method failed\")}},autocompleteAddr:\"\",autocompleteEsta:\"\",eInputA:null,eInputE:null,inpFieldA:null,inpFieldE:null,fEstaActive:null,vAttachEsta2Field:null,fAddrActive:null,vAttachAddr2Field:null,position:null,_onAfterRenderingInputA:function(){try{var t=this.inpFieldA._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)},_onAfterRenderingInputE:function(){try{var t=this.inpFieldE._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment)},_onClearInput:function(){this.setValue(\"\")},_setResult:function(t,e){if(t){this.getModel().getDataObject(e).setValue(t)}},_setResultIntoNearest:function(t,e){for(var s,i=this;i;){if((s=i.getModel())&&s.getDataObject(e)){s.getDataObject(e).setValue(t);break}i=i.getParent()}},_initAutocompleteInput:function(t,e,s){var i=\"\",n=null,o=null;if(t&&(i=t.getId().toString()+\"-inner\",(n=document.getElementById(i))||(n=document.getElementById(t.getId().toString()))),n)try{o=new google.maps.places.Autocomplete(n,{types:[e],componentRestrictions:{country:\"AU\"}}),o.addListener(\"place_changed\",jQuery.proxy(s,this))}catch(t){o=\"\"}return o},_initAutocomplete:function(){this.vAttachAddr2Field&&this.inpFieldA&&(this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)),this.vAttachEsta2Field&&this.inpFieldE&&(this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment))},_fillInAddressFromPlace:function(t){if(t.name){var e=\"\",s=\"\",i=\"\",n=\"\",o=\"\",a=\"\",l=t.geometry.location.lat().toFixed(13),r=t.geometry.location.lng().toFixed(13);this._setResultIntoNearest(l,\"/Root/LatitudeMeasure/content\"),this._setResultIntoNearest(r,\"/Root/LongitudeMeasure/content\");for(var d=0;d<t.address_components.length;d++)t.address_components[d].types.includes(\"street_number\")?e=t.address_components[d].short_name:t.address_components[d].types.includes(\"route\")?s=t.address_components[d].short_name:t.address_components[d].types.includes(\"locality\")?i=t.address_components[d].long_name:t.address_components[d].types.includes(\"administrative_area_level_1\")?n=t.address_components[d].short_name:t.address_components[d].types.includes(\"country\")?o=t.address_components[d].short_name:t.address_components[d].types.includes(\"postal_code\")&&(a=t.address_components[d].short_name);this._setResultIntoNearest(e,\"/Root/HouseID\"),this._setResultIntoNearest(s,\"/Root/StreetName\"),this._setResultIntoNearest(i,\"/Root/CityName\"),this._setResultIntoNearest(a,\"/Root/StreetPostalCode\"),this._setResultIntoNearest(o,\"/Root/CountryCode\"),this._setResultIntoNearest(n+\"$XDP$\"+o,\"/Root/State\")}},_fillInAddress:function(){var t=this.autocompleteAddr.getPlace();this._fillInAddressFromPlace(t)},_fillInEstablishment:function(){var t=this.autocompleteEsta.getPlace();t.name&&(this._setResultIntoNearest(t.name,\"/Root/FirstLineName\"),this._fillInAddressFromPlace(t))}})},!0);",
		"zcustom/demo/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.demo.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.demo.ui5lib.control.ZEstablishmentLookup\",\"zcustom.demo.ui5lib.control.ZAttachmentsPane\"],elements:[],version:\"0.1.0\"}),zcustom.demo.ui5lib});",
		"zcustom/demo/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});