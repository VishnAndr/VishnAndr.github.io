jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.demo.ui5lib.library-preload",
	"modules": {
		"zcustom/demo/ui5lib/control/ZAttachmentsPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\",\"sap/m/GenericTile\",\"sap/m/GenericTileScope\",\"sap/ui/unified/FileUploader\",\"sap/client/m/util/ImageResizer\",\"sap/client/m/create/QuickCreateTile\",\"sap/m/ScrollContainer\"],function(e,t,i,o,a,n,s,r,l){\"use strict\";return e.extend(\"zcustom.sandbox.ui5lib.control.ZAttachmentsPane\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{browseTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},cameraTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},attachments:{type:\"sap.m.GenericTile\",multiple:!0,singularName:\"attachment\"},tileContainer:{type:\"sap.m.ScrollContainer\",multiple:!1}},events:{}},renderer:function(e,t){e.write(\"<div\"),e.writeControlData(t),e.addClass(\"zAttachments\"),e.writeClasses(),e.write(\">\"),t._isDebugMode()&&t._stdFUoControl&&e.renderControl(t._stdFUoControl),e.renderControl(t.getTileContainer()),t._showCameraDesktop&&(e.write(\"<p>\"),e.renderControl(t._oBtnGrabVideo),e.write(\"</p>\"),e.write(\"<p><video autoplay style='height: 180px; width: 240px;'></video></p>\"),e.write(\"<p>\"),e.renderControl(t._oBtnTakePhoto),e.write(\"</p>\"),e.write(\"<p><img id='imageTag' width='240' height='180'></p>\")),e.write(\"</div>\")},initializePane:function(){this.oController=this.getController(),this._oApplication=this._oApplication||this.oController&&this.oController.getApplication&&this.oController.getApplication()||sap.client.getCurrentApplication&&sap.client.getCurrentApplication(),this._oRuntimeEnviroment=this.oController&&this.oController.getRuntimeEnvironment&&this.oController.getRuntimeEnvironment()||this._oApplication.getRuntimeEnvironment(),this._primaryPath=this.getParameter(\"primaryPath\")?this.getParameter(\"primaryPath\"):\"/Root/AttachmentFolder/AddParams\",this._attach2EC=this.getParameter(\"attach2EC\")?this.getParameter(\"attach2EC\"):\"COD_Documentlist\",this._enableImageProcessor=this.getParameter(\"enableImageProcessor\")?this.getParameter(\"enableImageProcessor\"):\"None\",this._onFileSelected=this.getParameter(\"onFileSelected\"),this._attachedECController=this._getAttachedECController();var e,i=this._primaryPath,o=this._oRuntimeEnviroment,r=o.isRunningInContainer(),l=sap.ui.Device.os.ios,h=this._oApplication.getSettings();if((e=this._oApplication.isOfflineMode()?h.getDefaultImageUploadResolutionClassificationForOffline():h.getDefaultImageUploadResolutionClassificationForOnline(),this._setupImageResize(e),\"Crop\"===this._enableImageProcessor&&this.oController)&&!o.isRunningOnWindowsContainer()){jQuery.sap.require(\"sap.client.basecontrols.core.ImageProcessor\");var p=new sap.client.basecontrols.core.ImageProcessor(this,i);this.oController.setImageProcessor(p)}this._iCompressedWidthHeight&&!this.oController.getImageProcessor()&&(this.oImageResizer=new s(this._iCompressedWidthHeight,this._iCompressedWidthHeight)),(this.oImageResizer||this._oApplication.isOfflineMode())&&window.FilePicker?(this.oFileUploader=new sap.m.Button(this.getControlPrefixId()+\"-browseButton\",{icon:sap.ui.core.IconPool.getIconURI(\"open-folder\"),press:function(){window.FilePicker.pickOne(function(e){var t=\"data:\"+e.mimeType+\";base64,\"+e.content;if(this.isImageFile(e)&&this.oImageResizer)this.oImageResizer.resizeImage(t).then(function(t){this._onImageResized(null,t,e.name)}.bind(this),function(i){this._uploadFile(t,e.name)}.bind(this));else if(this._oApplication.isOfflineMode()){var i=this._oApplication.getFileTransfer();this._showUploadingDialog();var o={fileKey:\"file\",fileName:e.name,mimeType:e.type,content:e.content,size:e.size},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);i.upload(e.name,null,a,n,o)}else this._uploadFile(t,e.name)}.bind(this))}.bind(this)}),this.oFileUploader.addStyleClass(\"sapClientMButtonFileUploader\")):(this.oFileUploader=new n(this.getControlPrefixId(),{uploadOnChange:!1,sameFilenameAllowed:!0,buttonOnly:!0,sendXHR:!0,change:function(e){var t=e.mParameters;if(!t||t.newValue)if(this.isImageFileUploader(e.oSource)&&this.oImageResizer){var i={mParameters:e.mParameters,oSource:e.oSource},o=e.mParameters.files[0];this.oImageResizer.resizeImageFile(o).then(function(e){this._onImageResized(i,e)}.bind(this),function(e){this._onFileChange(i)}.bind(this))}else this._onFileChange(e)}.bind(this),uploadAborted:function(){this._closeUploadingDialog()}.bind(this),uploadComplete:function(e){if(this._closeUploadingDialog(),this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var t=e.mParameters.response||e.mParameters.responseRaw;if(t){t=unescape(decodeURI(t)),t=t.replace(/[\\r]/g,\"\");var o=t.split(\"\\n\");if(3===o.length){var a=o[0].split(\"=\")[1],n=o[1].split(\"=\")[1],s=o[2].split(\"=\")[1],r=this._attachedECController.getDataContainer();if(sap.ui.Device.os.ios){var l=sap.client.util.Util.createGuid(),h=n.split(\".\");if(h.length<2)n=n+\"-\"+l;else{var p=h.pop();n=h.pop()+\"-\"+l+\".\"+p}}r.setProperty(i+\"/content\",\"id=\"+a,this.getBindingContext()),r.setProperty(i+\"/fileName\",n,this.getBindingContext()),r.setProperty(i+\"/fileSize\",s,this.getBindingContext()),r.checkUpdate(i+\"/fileName.FormattedValue\")}var d;e&&e.getSource&&(d=new sap.client.evt.EventContext(e.getSource()));var c=this._onFileSelected;c&&this._attachedECController.getEventProcessor().handleEvent(c,d)}}}.bind(this),fileSizeExceed:function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadExceedLimitMsg\",\"Exceeds maximum file size of 2MB\"))}}),this.oFileUploader.setTooltip(sap.client.m.Util.getLocaleText(\"FileUploader_ToolTip\",\"No file chosen\")),r&&!l&&(this.oFileUploader.setIcon(sap.ui.core.IconPool.getIconURI(\"open-folder\")),this.oFileUploader.setIconOnly(!0))),this._stdFUoControl=this.oFileUploader,this._stdFUoControl.addStyleClass(\"sapClientMFileUpload\"),this._showCameraDesktop=!1,this._theStream=null,this.oTileContainer=(new sap.m.ScrollContainer).addStyleClass(\"sapUiTinyMargin\"),this.setTileContainer(this.oTileContainer);var d=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-browseTile\",{text:\"Browse\",icon:\"sap-icon://open-folder\"}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMargin\");this.setBrowseTile(d),this.oTileContainer.addContent(d);var c=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-cameraTile\",{text:\"Camera\",icon:\"sap-icon://add-photo\",press:[this.onPictureButtonPress,this]}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMargin\");this.setCameraTile(c),this.oTileContainer.addContent(c);var g=new sap.m.ImageContent({src:\"sap-icon://pdf-attachment\"}),m=new sap.m.TileContent;m.setContent(g);var u=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment1\",{header:\"File\",scope:a.Actions,press:function(e){\"Remove\"===e.getParameter(\"action\")?t.show(\"Remove action of attachment\"):t.show(\"Attachment has been pressed.\")}.bind(this)}).addStyleClass(\"sapUshellTile sapUiTinyMargin\");u.addTileContent(m),this.addAttachment(u),this.oTileContainer.addContent(u);var f=\"https://www.frasersproperty.com.au/-/media/frasers-property/retail/landing-site/our-difference/retail_our-difference-1_frasers-property--optimized.jpg\",C=new Image;C.src=f;var _=new sap.m.Image({src:f});if(0!==C.height){C.height<C.width?_.setWidth(\"100%\"):_.setHeight(\"100%\");var U=new sap.m.TileContent;U.setContent(_);var v=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment2\",{scope:a.Actions,press:[this._tilePressed,this]}).addStyleClass(\"sapUshellTile sapUiTinyMargin\");v.addTileContent(U),this.addAttachment(v),this.oTileContainer.addContent(v)}this._oBtnGrabVideo=new sap.m.Button({text:\"Grab Video\",press:[this._grabVideo,this]}),this._oBtnTakePhoto=new sap.m.Button({text:\"Take photo\",press:[this._takePhoto,this]})},_getAttachedECController:function(){if(this.oController&&this.oController.getParentController()&&this.oController.getParentController().getChildController(this._attach2EC))return this.oController.getParentController().getChildController(this._attach2EC)},_isDebugMode:function(){var e=window[\"sap-ui-debug\"];return sap.client.getCurrentApplication().isDebugMode()||e},_getUserMedia:function(e,t,i){var o=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;if(o)return o.bind(navigator)(e,t,i)},_grabVideo:function(){if(!(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia))return void t.show(\"User Media API not supported.\");var e={video:!0};this._getUserMedia(e,function(e){var t=document.querySelector(\"video\");\"srcObject\"in t?(t.srcObject=e,t.src=(window.URL||window.webkitURL).createObjectURL(e)):navigator.mozGetUserMedia&&(t.mozSrcObject=e),this._theStream=e}.bind(this),function(e){t.show(\"Error: \"+e)}.bind(this)).bind(this)},_takePhoto:function(){if(!(\"ImageCapture\"in window))return void t.show(\"ImageCapture is not available\");if(!this._theStream)return void t.show(\"Grab the video stream first!\");var e=new ImageCapture(this._theStream.getVideoTracks()[0]),i=this;e.takePhoto().then(function(e){document.getElementById(\"imageTag\").src=URL.createObjectURL(e);i._uploadFile(e,\"test\").bind(i)}).catch(function(e){t.show(\"Error: \"+e)})},_tilePressed:function(e){\"Remove\"===e.getParameter(\"action\")?t.show(\"Remove action of attachment\"):t.show(\"Attachment has been pressed.\")},onBeforeRendering:function(){},onAfterRendering:function(){},_setupImageResize:function(e){if(e&&this._oRuntimeEnviroment.isRunningInContainer())switch(e){case\"L\":this._iCompressedWidthHeight=this.LARGE_WIDTH_HEIGHT;break;case\"M\":this._iCompressedWidthHeight=this.MEDIUM_WIDTH_HEIGHT;break;case\"S\":this._iCompressedWidthHeight=this.SMALL_WIDTH_HEIGHT;break;default:this._iCompressedWidthHeight=null}},_showUploadingDialog:function(){this._oDialog||(this._oDialog=new sap.m.Dialog(this.getControlPrefixId()+\"-dialog\",{title:sap.client.m.Util.getLocaleText(\"UploadInProgress\",\"Uploading...\"),content:new sap.m.Text(this.getControlPrefixId()+\"-text\",{text:sap.client.m.Util.getLocaleText(\"FileUploadingMsg\",\"Uploading file to server, please wait ...\")})})),this._oDialog.open()},_closeUploadingDialog:function(){this._oDialog&&this._oDialog.close()},_onImageResized:function(e,t,i){var o=i;if(e){var a=e.mParameters.files[0];a&&(o=a.name)}if(this._oApplication.isOfflineMode()){var n=this._dataUriToBlob(t);this._uploadFile(n,o)}else this._uploadFile(t,o)},_dataUriToBlob:function(e){for(var t=e.split(\",\"),i=t[0].match(/:(.*?);/)[1],o=atob(t[1]),a=o.length,n=new Uint8Array(a);a--;)n[a]=o.charCodeAt(a);return new Blob([n],{type:i})},_uploadFile:function(e,t){var i=new window.FileTransfer;this._oApplication.isOfflineMode()&&(i=this.getOfflineFileTransfer());var o,a=this._oRuntimeEnviroment,n=(a.isRunningInContainer(),new window.FileUploadOptions);o=t||(e.name?e.name:\"file\"),n.fileName=o,n.fileKey=\"file\",n.chunkedMode=!1,\"string\"==typeof e&&e.match(\"image.*\")?n.mimeType=\"image/png\":\"string\"==typeof e&&e.match(\"data:.*\")?n.mimeType=e.split(\";\")[0].split(\":\")[1]:n.mimeType=e.type,n.headers={Referer:window.location.href},this._showUploadingDialog();var s=this.getUploadURL(),r=this.onFileUploadSuccess.bind(this),l=this.onFileUploadFail.bind(this);i.upload(e,s,r,l,n)},_onFileChange:function(e){var t;if(this._oApplication.isOfflineMode()){t=this._oApplication.getFileTransfer(),this._showUploadingDialog();var i=e.mParameters.files[0],o={fileKey:\"file\",fileName:i.name,mimeType:i.type},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);t.upload(i,null,a,n,o)}else{t=e.oSource;var s=this.getUploadURL();t.setUploadUrl(s);var r=this.oController.getImageProcessor();r?this.isImageFileUploader(t)?r.openPreview(s,e):(t.upload(),r.closePreview(s,e)):(this._showUploadingDialog(),t.upload())}},isImageFileUploader:function(e){if(e&&e.oFileUpload){var t=e.oFileUpload.files[0];return this.isImageFile(t)}return!1},isImageFile:function(e){return!!(e&&e.type&&e.type.match(\"image.*\")||e&&e.mimeType&&e.mimeType.match(\"image.*\"))},getOfflineFileTransfer:function(){if(!this.oOfflineFileTransfer){var e=sap.ui.requireSync(\"sap/client/setup/offline/FileTransfer\"),t=this._oApplication.getOfflineAPI();this.oOfflineFileTransfer=new e(t)}return this.oOfflineFileTransfer},setControlWidth:function(e){this.oControl.setWidth&&this.oControl.setWidth(\"100%\")},getUploadURL:function(){var e,t=this._oApplication.getRepositoryUrl();if(t&&(e=t.indexOf(\"/sap/\")+4)>=0){var i=this.oController.getSession().getSessionID();t=t.substr(0,e)+\"(\"+i+\")\"+t.substr(e)}return t&&(e=t.lastIndexOf(\"/\"))>=0&&(t=t.substr(0,e)+\"/fileupload\"),t},uploadComplete:function(e,t,i){if(this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var o=this._primaryPath;if(null!==e&&null!==t&&null!==i){var a=this._attachedECController.getDataContainer();a.setProperty(o+\"/content\",\"id=\"+e,this.getBindingContext()),a.setProperty(o+\"/fileName\",t,this.getBindingContext()),a.setProperty(o+\"/fileSize\",i,this.getBindingContext()),a.checkUpdate(o+\"/fileName.FormattedValue\"),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(t)}var n;this.oFileUploader&&(n=new sap.client.evt.EventContext(this.oFileUploader));var s=this._onFileSelected;s&&this._attachedECController.getEventProcessor().handleEvent(s,n),this.oFileUploader.setTooltip(t)}},onFileUploadSuccess:function(e){var t=null,i=null,o=null,a=unescape(decodeURI(e.response));a=a.replace(/[\\r]/g,\"\");var n=a.split(\"\\n\");3===n.length&&(t=n[0].split(\"=\")[1],i=n[1].split(\"=\")[1],o=n[2].split(\"=\")[1]),this._closeUploadingDialog(),this.uploadComplete(t,i,o)},onFileUploadFail:function(e){this._closeUploadingDialog();var t;t=e.exception?e.exception:e.message,this._resetUploader(),sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+t),jQuery.sap.log.info(\"onFileUploadFail exception \"+t)},onTakePictureSuccess:function(e){if(this.oImageResizer){var t=function(t){var i;i=e.startsWith(\"/\")?\"image-\"+(new Date).getTime()+\".jpg\":e.replace(/^.*[\\\\\\/]/,\"\"),this._onImageResized(null,t,i)},i=function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+sap.client.m.Util.getLocaleText(\"FileUploadImageResizeFailMsg\",\"Failed to resize image\"))};if(this._oApplication.isOfflineMode()&&window.FilePicker){var o=\"data:image/jpeg;base64,\"+e;this.oImageResizer.resizeImage(o).then(t.bind(this),i)}else this.oImageResizer.resizeImagePath(e).then(t.bind(this),i)}else{var a,n=this._oApplication.getFileTransfer(),s=new window.FileUploadOptions;e.startsWith(\"/\")?(s.content=e,s.fileName=(new Date).getTime()+\".jpg\",a=s.fileName):(s.fileName=e.replace(/^.*[\\\\\\/]/,\"\"),a=e),s.fileKey=\"file\",s.mimeType=\"image/jpeg\",s.chunkedMode=!1,s.headers={Referer:window.location.href},this._showUploadingDialog();var r=this.getUploadURL(),l=this.onFileUploadSuccess.bind(this),h=this.onFileUploadFail.bind(this);n.upload(a,r,l,h,s)}},onTakePictureFail:function(e){jQuery.sap.log.info(\"onTakePictureFail for error \"+e)},onPictureButtonPress:function(e){if(navigator.camera){var t=navigator.camera.DestinationType.FILE_URI,i=45;this._oApplication.isOfflineMode()&&window.FilePicker&&(i=10,t=navigator.camera.DestinationType.DATA_URL);var o={quality:i,targetWidth:1024,targetHeight:768,saveToPhotoAlbum:!1,destinationType:t};navigator.camera.getPicture(this.onTakePictureSuccess.bind(this),this.onTakePictureFail.bind(this),o)}else this._isDebugMode()&&(this._showCameraDesktop=!0,this.invalidate())},_resetUploader:function(){if(this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var e=this._primaryPath,t=this._attachedECController.getDataContainer();t.setProperty(e+\"/content\",null,this.getBindingContext()),t.setProperty(e+\"/fileName\",null,this.getBindingContext()),t.setProperty(e+\"/fileSize\",null,this.getBindingContext()),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(\"\"),t.setProperty(\"/Root/$System/EditMode\",!1),t.setProperty(\"/Root/$System/IsThingDirty\",!1)}}})},!0);",
		"zcustom/demo/ui5lib/control/ZEstablishmentLookup.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(t,e,s){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZEstablishmentLookup\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{_inpFieldE:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_inpFieldA:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(t,e){e.getVisible()&&(t.write(\"<span\"),t.writeControlData(e),t.write(\">\"),t.renderControl(e.getAggregation(\"_inpFieldE\")),t.renderControl(e.getAggregation(\"_inpFieldA\")),t.write(\"</span>\"))},initializePane:function(){this.inpFieldE=null,this.inpFieldA=null,this.geoResponseResult=null,this.estResponseResult=null,this.fEstaActive=this.getParameter(\"EstaActive\"),this.vAttachEsta2Field=this.getParameter(\"AttachEsta2Field\"),this.fAddrActive=this.getParameter(\"AddrActive\"),this.vAttachAddr2Field=this.getParameter(\"AttachAddr2Field\");var t=[];if(this.fEstaActive&&(this.vAttachEsta2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachEsta2Field+\"']\"),t.length>0&&(this.inpFieldE=sap.ui.getCore().byId(t[0].id))):(this.inpFieldE=new sap.m.Input({width:\"100%\",placeholder:\"Enter Company name ...\",showValueHelp:!0}),this.inpFieldE.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldE\",this.inpFieldE)),this.inpFieldE&&this.inpFieldE.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputE,this)},this)),this.fAddrActive&&(this.vAttachAddr2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachAddr2Field+\"']\"),t.length>0&&(this.inpFieldA=sap.ui.getCore().byId(t[0].id))):(this.inpFieldA=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0}),this.inpFieldA.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldA\",this.inpFieldA)),this.inpFieldA&&this.inpFieldA.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputA,this)},this)),\"object\"==typeof google&&\"object\"==typeof google.maps);else{var e=\"https://maps.googleapis.com/maps/api/js?libraries=places&key=\",s=this.getParameter(\"API_KEY\");s?e+=s:jQuery.sap.log.error(\"API_KEY is missing\"),jQuery.sap.includeScript(e,\"google.maps\",this._initAutocomplete.bind(this),function(){jQuery.sap.log.error(\"Error initializing Google Places API\")})}},destroy:function(){try{void 0!==this.autocompleteAddr&&null!==this.autocompleteAddr&&(google.maps.event.clearInstanceListeners(this.autocompleteAddr),google.maps.event.clearInstanceListeners(this.eInputA),this.autocompleteAddr=null),void 0!==this.autocompleteEsta&&null!==this.autocompleteEsta&&(google.maps.event.clearInstanceListeners(this.autocompleteEsta),google.maps.event.clearInstanceListeners(this.eInputE),this.autocompleteEsta=null),$(\".pac-container\").remove()}catch(t){jQuery.sap.log.error(\"Destroy method failed\")}},autocompleteAddr:\"\",autocompleteEsta:\"\",eInputA:null,eInputE:null,inpFieldA:null,inpFieldE:null,fEstaActive:null,vAttachEsta2Field:null,fAddrActive:null,vAttachAddr2Field:null,position:null,_onAfterRenderingInputA:function(){try{var t=this.inpFieldA._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)},_onAfterRenderingInputE:function(){try{var t=this.inpFieldE._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment)},_onClearInput:function(){this.setValue(\"\")},_setResult:function(t,e){if(t){this.getModel().getDataObject(e).setValue(t)}},_setResultIntoNearest:function(t,e){for(var s,i=this;i;){if((s=i.getModel())&&s.getDataObject(e)){s.getDataObject(e).setValue(t);break}i=i.getParent()}},_initAutocompleteInput:function(t,e,s){var i=\"\",n=null,o=null;if(t&&(i=t.getId().toString()+\"-inner\",(n=document.getElementById(i))||(n=document.getElementById(t.getId().toString()))),n)try{o=new google.maps.places.Autocomplete(n,{types:[e],componentRestrictions:{country:\"AU\"}}),o.addListener(\"place_changed\",jQuery.proxy(s,this))}catch(t){o=\"\"}return o},_initAutocomplete:function(){this.vAttachAddr2Field&&this.inpFieldA&&(this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)),this.vAttachEsta2Field&&this.inpFieldE&&(this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment))},_fillInAddressFromPlace:function(t){if(t.name){var e=\"\",s=\"\",i=\"\",n=\"\",o=\"\",a=\"\",l=t.geometry.location.lat().toFixed(13),r=t.geometry.location.lng().toFixed(13);this._setResultIntoNearest(l,\"/Root/LatitudeMeasure/content\"),this._setResultIntoNearest(r,\"/Root/LongitudeMeasure/content\");for(var d=0;d<t.address_components.length;d++)t.address_components[d].types.includes(\"street_number\")?e=t.address_components[d].short_name:t.address_components[d].types.includes(\"route\")?s=t.address_components[d].short_name:t.address_components[d].types.includes(\"locality\")?i=t.address_components[d].long_name:t.address_components[d].types.includes(\"administrative_area_level_1\")?n=t.address_components[d].short_name:t.address_components[d].types.includes(\"country\")?o=t.address_components[d].short_name:t.address_components[d].types.includes(\"postal_code\")&&(a=t.address_components[d].short_name);this._setResultIntoNearest(e,\"/Root/HouseID\"),this._setResultIntoNearest(s,\"/Root/StreetName\"),this._setResultIntoNearest(i,\"/Root/CityName\"),this._setResultIntoNearest(a,\"/Root/StreetPostalCode\"),this._setResultIntoNearest(o,\"/Root/CountryCode\"),this._setResultIntoNearest(n+\"$XDP$\"+o,\"/Root/State\")}},_fillInAddress:function(){var t=this.autocompleteAddr.getPlace();this._fillInAddressFromPlace(t)},_fillInEstablishment:function(){var t=this.autocompleteEsta.getPlace();t.name&&(this._setResultIntoNearest(t.name,\"/Root/FirstLineName\"),this._fillInAddressFromPlace(t))}})},!0);",
		"zcustom/demo/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.demo.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.demo.ui5lib.control.ZEstablishmentLookup\",\"zcustom.demo.ui5lib.control.ZAttachmentsPane\"],elements:[],version:\"0.1.0\"}),zcustom.demo.ui5lib});",
		"zcustom/demo/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});