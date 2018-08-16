jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.frasers.ui5lib.library-preload",
	"modules": {
		"zcustom/frasers/ui5lib/control/ZAttachmentsPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\",\"sap/m/GenericTile\",\"sap/m/GenericTileScope\",\"sap/ui/unified/FileUploader\",\"sap/client/m/util/ImageResizer\",\"sap/client/m/create/QuickCreateTile\",\"sap/m/ScrollContainer\"],function(e,t,i,o,a,n,s,r,l){\"use strict\";return e.extend(\"zcustom.frasers.ui5lib.control.ZAttachmentsPane\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{browseTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},cameraTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},attachments:{type:\"sap.m.GenericTile\",multiple:!0,singularName:\"attachment\"},tileContainer:{type:\"sap.m.ScrollContainer\",multiple:!1}},events:{}},renderer:function(e,t){e.write(\"<div\"),e.writeControlData(t),e.addClass(\"zAttachments\"),e.writeClasses(),e.write(\">\"),t._isDebugMode()&&t._stdFUoControl&&e.renderControl(t._stdFUoControl),e.renderControl(t.getTileContainer()),t._showCameraDesktop&&(e.write(\"<p>\"),e.renderControl(t._oBtnGrabVideo),e.write(\"</p>\"),e.write(\"<p><video autoplay style='height: 180px; width: 240px;'></video></p>\"),e.write(\"<p>\"),e.renderControl(t._oBtnTakePhoto),e.write(\"</p>\"),e.write(\"<p><img id='imageTag' width='240' height='180'></p>\")),e.write(\"</div>\")},_getCustomParameters:function(){this._primaryPath=this.getParameter(\"primaryPath\")?this.getParameter(\"primaryPath\"):\"/Root/AttachmentFolder/AddParams\",this._attach2EC=this.getParameter(\"attach2EC\")?this.getParameter(\"attach2EC\"):\"COD_Documentlist\",this._enableImageProcessor=this.getParameter(\"enableImageProcessor\")?this.getParameter(\"enableImageProcessor\"):\"None\",this._onFileSelected=this.getParameter(\"onFileSelected\"),this._bHideBrowse=\"true\"==this.getParameter(\"hideBrowse\"),this._bHideCamera=\"true\"==this.getParameter(\"hideCamera\"),this._bHideImages=\"true\"==this.getParameter(\"hideImages\"),this._bHideNonImages=\"true\"==this.getParameter(\"hideNonImages\")},initializePane:function(){if(this.oController=this.getController(),this._oApplication=this._oApplication||this.oController&&this.oController.getApplication&&this.oController.getApplication()||sap.client.getCurrentApplication&&sap.client.getCurrentApplication(),this._oApplication.isNewUI()){this._oRuntimeEnviroment=this.oController&&this.oController.getRuntimeEnvironment&&this.oController.getRuntimeEnvironment()||this._oApplication.getRuntimeEnvironment(),this._getCustomParameters(),this._attachedECController=this._getAttachedECController();var e,i=this._primaryPath,o=this._oRuntimeEnviroment,r=o.isRunningInContainer(),l=sap.ui.Device.os.ios,h=this._oApplication.getSettings();e=this._oApplication.isOfflineMode()?h.getDefaultImageUploadResolutionClassificationForOffline():h.getDefaultImageUploadResolutionClassificationForOnline(),this._setupImageResize(e);if(\"Crop\"===this._enableImageProcessor&&this.oController){if(!o.isRunningOnWindowsContainer()){jQuery.sap.require(\"sap.client.basecontrols.core.ImageProcessor\");var d=new sap.client.basecontrols.core.ImageProcessor(this,i);this.oController.setImageProcessor(d)}}if(this._iCompressedWidthHeight&&!this.oController.getImageProcessor()&&(this.oImageResizer=new s(this._iCompressedWidthHeight,this._iCompressedWidthHeight)),(this.oImageResizer||this._oApplication.isOfflineMode())&&window.FilePicker?(this.oFileUploader=new sap.m.Button(this.getControlPrefixId()+\"-browseButton\",{icon:sap.ui.core.IconPool.getIconURI(\"open-folder\"),press:function(){window.FilePicker.pickOne(function(e){var t=\"data:\"+e.mimeType+\";base64,\"+e.content;if(this.isImageFile(e)&&this.oImageResizer)this.oImageResizer.resizeImage(t).then(function(t){this._onImageResized(null,t,e.name)}.bind(this),function(i){this._uploadFile(t,e.name)}.bind(this));else if(this._oApplication.isOfflineMode()){var i=this._oApplication.getFileTransfer();this._showUploadingDialog();var o={fileKey:\"file\",fileName:e.name,mimeType:e.type,content:e.content,size:e.size},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);i.upload(e.name,null,a,n,o)}else this._uploadFile(t,e.name)}.bind(this))}.bind(this)}),this.oFileUploader.addStyleClass(\"sapClientMButtonFileUploader\"),{Visible:\"visible\",Enabled:\"enabled\"}):(this.oFileUploader=new n(this.getControlPrefixId(),{uploadOnChange:!1,sameFilenameAllowed:!0,buttonOnly:!0,sendXHR:!0,change:function(e){var t=e.mParameters;if(!t||t.newValue)if(this.isImageFileUploader(e.oSource)&&this.oImageResizer){var i={mParameters:e.mParameters,oSource:e.oSource},o=e.mParameters.files[0];this.oImageResizer.resizeImageFile(o).then(function(e){this._onImageResized(i,e)}.bind(this),function(e){this._onFileChange(i)}.bind(this))}else this._onFileChange(e)}.bind(this),uploadAborted:function(){this._closeUploadingDialog()}.bind(this),uploadComplete:function(e){if(this._closeUploadingDialog(),this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var t=e.mParameters.response||e.mParameters.responseRaw;if(t){t=unescape(decodeURI(t)),t=t.replace(/[\\r]/g,\"\");var o=t.split(\"\\n\");if(3===o.length){var a=o[0].split(\"=\")[1],n=o[1].split(\"=\")[1],s=o[2].split(\"=\")[1],r=this._attachedECController.getDataContainer();if(sap.ui.Device.os.ios){var l=sap.client.util.Util.createGuid(),h=n.split(\".\");if(h.length<2)n=n+\"-\"+l;else{var d=h.pop();n=h.pop()+\"-\"+l+\".\"+d}}r.setProperty(i+\"/content\",\"id=\"+a,this.getBindingContext()),r.setProperty(i+\"/fileName\",n,this.getBindingContext()),r.setProperty(i+\"/fileSize\",s,this.getBindingContext()),r.checkUpdate(i+\"/fileName.FormattedValue\")}var p;e&&e.getSource&&(p=new sap.client.evt.EventContext(e.getSource())),this._onFileSelected=this.___checkAndCreateEH(this._onFileSelected);var c=this._onFileSelected;c&&this._attachedECController.getEventProcessor().handleEvent(c,p)}}}.bind(this),fileSizeExceed:function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadExceedLimitMsg\",\"Exceeds maximum file size of 2MB\"))}}),this.oFileUploader.setTooltip(sap.client.m.Util.getLocaleText(\"FileUploader_ToolTip\",\"No file chosen\")),{Visible:\"visible\",Enabled:\"enabled\",Text:\"buttonText\"},r&&!l&&(this.oFileUploader.setIcon(sap.ui.core.IconPool.getIconURI(\"open-folder\")),this.oFileUploader.setIconOnly(!0))),this._stdFUoControl=this.oFileUploader,this._stdFUoControl.addStyleClass(\"sapClientMFileUpload\"),this._showCameraDesktop=!1,this._theStream=null,this.oTileContainer=(new sap.m.ScrollContainer).addStyleClass(\"sapUiTinyMargin\"),this.setTileContainer(this.oTileContainer),!this._bHideBrowse){var p=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-browseTile\",{text:\"Browse\",icon:\"sap-icon://open-folder\"}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMargin\");this.setBrowseTile(p),this.oTileContainer.addContent(p)}if(!this._bHideCamera){var c=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-cameraTile\",{text:\"Camera\",icon:\"sap-icon://add-photo\",press:[this.onPictureButtonPress,this]}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMargin\");this.setCameraTile(c),this.oTileContainer.addContent(c)}if(!this._bHideNonImages){var g=new sap.m.ImageContent({src:\"sap-icon://pdf-attachment\"}),m=new sap.m.TileContent;m.setContent(g);var u=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment1\",{header:\"File\",scope:a.Actions,press:function(e){\"Remove\"===e.getParameter(\"action\")?t.show(\"Remove action of attachment\"):t.show(\"Attachment has been pressed.\")}.bind(this)}).addStyleClass(\"sapUshellTile sapUiTinyMargin\");u.addTileContent(m),this.addAttachment(u),this.oTileContainer.addContent(u)}if(!this._bHideImages){var f=\"https://www.frasersproperty.com.au/-/media/frasers-property/retail/landing-site/our-difference/retail_our-difference-1_frasers-property--optimized.jpg\",C=new Image;C.src=f;var _=new sap.m.Image({src:f});if(0!==C.height){C.height<C.width?_.setWidth(\"100%\"):_.setHeight(\"100%\");var U=new sap.m.TileContent;U.setContent(_);var v=new sap.m.GenericTile(this.getControlPrefixId()+\"-attachment2\",{scope:a.Actions,press:[this._tilePressed,this]}).addStyleClass(\"sapUshellTile sapUiTinyMargin\");v.addTileContent(U),this.addAttachment(v),this.oTileContainer.addContent(v)}}this._oBtnGrabVideo=new sap.m.Button({text:\"Grab Video\",press:[this._grabVideo,this]}),this._oBtnTakePhoto=new sap.m.Button({text:\"Take photo\",press:[this._takePhoto,this]})}},_getAttachedECController:function(){if(this.oController&&this.oController.getParentController()&&this.oController.getParentController().getChildController(this._attach2EC))return this.oController.getParentController().getChildController(this._attach2EC)},_isDebugMode:function(){var e=window[\"sap-ui-debug\"];return sap.client.getCurrentApplication().isDebugMode()||e},_getUserMedia:function(e,t,i){var o=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;if(o)return o.bind(navigator)(e,t,i)},_grabVideo:function(){if(!(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia))return void t.show(\"User Media API not supported.\");var e={video:!0};this._getUserMedia(e,function(e){var t=document.querySelector(\"video\");\"srcObject\"in t?(t.srcObject=e,t.src=(window.URL||window.webkitURL).createObjectURL(e)):navigator.mozGetUserMedia&&(t.mozSrcObject=e),this._theStream=e}.bind(this),function(e){t.show(\"Error: \"+e)}.bind(this)).bind(this)},_takePhoto:function(){if(!(\"ImageCapture\"in window))return void t.show(\"ImageCapture is not available\");if(!this._theStream)return void t.show(\"Grab the video stream first!\");var e=new ImageCapture(this._theStream.getVideoTracks()[0]),i=this;e.takePhoto().then(function(e){document.getElementById(\"imageTag\").src=URL.createObjectURL(e);i._uploadFile(e,\"test\").bind(i)}).catch(function(e){t.show(\"Error: \"+e)})},_tilePressed:function(e){\"Remove\"===e.getParameter(\"action\")?t.show(\"Remove action of attachment\"):t.show(\"Attachment has been pressed.\")},onBeforeRendering:function(){},onAfterRendering:function(){},_setupImageResize:function(e){if(e&&this._oRuntimeEnviroment.isRunningInContainer())switch(e){case\"L\":this._iCompressedWidthHeight=this.LARGE_WIDTH_HEIGHT;break;case\"M\":this._iCompressedWidthHeight=this.MEDIUM_WIDTH_HEIGHT;break;case\"S\":this._iCompressedWidthHeight=this.SMALL_WIDTH_HEIGHT;break;default:this._iCompressedWidthHeight=null}},_showUploadingDialog:function(){this._oDialog||(this._oDialog=new sap.m.Dialog(this.getControlPrefixId()+\"-dialog\",{title:sap.client.m.Util.getLocaleText(\"UploadInProgress\",\"Uploading...\"),content:new sap.m.Text(this.getControlPrefixId()+\"-text\",{text:sap.client.m.Util.getLocaleText(\"FileUploadingMsg\",\"Uploading file to server, please wait ...\")})})),this._oDialog.open()},_closeUploadingDialog:function(){this._oDialog&&this._oDialog.close()},_onImageResized:function(e,t,i){var o=i;if(e){var a=e.mParameters.files[0];a&&(o=a.name)}if(this._oApplication.isOfflineMode()){var n=this._dataUriToBlob(t);this._uploadFile(n,o)}else this._uploadFile(t,o)},_dataUriToBlob:function(e){for(var t=e.split(\",\"),i=t[0].match(/:(.*?);/)[1],o=atob(t[1]),a=o.length,n=new Uint8Array(a);a--;)n[a]=o.charCodeAt(a);return new Blob([n],{type:i})},_uploadFile:function(e,t){var i=new window.FileTransfer;this._oApplication.isOfflineMode()&&(i=this.getOfflineFileTransfer());var o,a=this._oRuntimeEnviroment,n=(a.isRunningInContainer(),new window.FileUploadOptions);o=t||(e.name?e.name:\"file\"),n.fileName=o,n.fileKey=\"file\",n.chunkedMode=!1,\"string\"==typeof e&&e.match(\"image.*\")?n.mimeType=\"image/png\":\"string\"==typeof e&&e.match(\"data:.*\")?n.mimeType=e.split(\";\")[0].split(\":\")[1]:n.mimeType=e.type,n.headers={Referer:window.location.href},this._showUploadingDialog();var s=this.getUploadURL(),r=this.onFileUploadSuccess.bind(this),l=this.onFileUploadFail.bind(this);i.upload(e,s,r,l,n)},_onFileChange:function(e){var t;if(this._oApplication.isOfflineMode()){t=this._oApplication.getFileTransfer(),this._showUploadingDialog();var i=e.mParameters.files[0],o={fileKey:\"file\",fileName:i.name,mimeType:i.type},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);t.upload(i,null,a,n,o)}else{t=e.oSource;var s=this.getUploadURL();t.setUploadUrl(s);var r=this.oController.getImageProcessor();r?this.isImageFileUploader(t)?r.openPreview(s,e):(t.upload(),r.closePreview(s,e)):(this._showUploadingDialog(),t.upload())}},isImageFileUploader:function(e){if(e&&e.oFileUpload){var t=e.oFileUpload.files[0];return this.isImageFile(t)}return!1},isImageFile:function(e){return!!(e&&e.type&&e.type.match(\"image.*\")||e&&e.mimeType&&e.mimeType.match(\"image.*\"))},getOfflineFileTransfer:function(){if(!this.oOfflineFileTransfer){var e=sap.ui.requireSync(\"sap/client/setup/offline/FileTransfer\"),t=this._oApplication.getOfflineAPI();this.oOfflineFileTransfer=new e(t)}return this.oOfflineFileTransfer},setControlWidth:function(e){this.oControl.setWidth&&this.oControl.setWidth(\"100%\")},getUploadURL:function(){var e,t=this._oApplication.getRepositoryUrl();if(t&&(e=t.indexOf(\"/sap/\")+4)>=0){var i=this.oController.getSession().getSessionID();t=t.substr(0,e)+\"(\"+i+\")\"+t.substr(e)}return t&&(e=t.lastIndexOf(\"/\"))>=0&&(t=t.substr(0,e)+\"/fileupload\"),t},uploadComplete:function(e,t,i){if(this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var o=this._primaryPath;if(null!==e&&null!==t&&null!==i){var a=this._attachedECController.getDataContainer();a.setProperty(o+\"/content\",\"id=\"+e,this.getBindingContext()),a.setProperty(o+\"/fileName\",t,this.getBindingContext()),a.setProperty(o+\"/fileSize\",i,this.getBindingContext()),a.checkUpdate(o+\"/fileName.FormattedValue\"),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(t)}var n;this.oFileUploader&&(n=new sap.client.evt.EventContext(this.oFileUploader)),this._onFileSelected=this.___checkAndCreateEH(this._onFileSelected);var s=this._onFileSelected;s&&this._attachedECController.getEventProcessor().handleEvent(s,n),this.oFileUploader.setTooltip(t)}},onFileUploadSuccess:function(e){var t=null,i=null,o=null,a=unescape(decodeURI(e.response));a=a.replace(/[\\r]/g,\"\");var n=a.split(\"\\n\");3===n.length&&(t=n[0].split(\"=\")[1],i=n[1].split(\"=\")[1],o=n[2].split(\"=\")[1]),this._closeUploadingDialog(),this.uploadComplete(t,i,o)},onFileUploadFail:function(e){this._closeUploadingDialog();var t;t=e.exception?e.exception:e.message,this._resetUploader(),sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+t),jQuery.sap.log.info(\"onFileUploadFail exception \"+t)},onTakePictureSuccess:function(e){if(this.oImageResizer){var t=function(t){var i;i=e.startsWith(\"/\")?\"image-\"+(new Date).getTime()+\".jpg\":e.replace(/^.*[\\\\\\/]/,\"\"),this._onImageResized(null,t,i)},i=function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+sap.client.m.Util.getLocaleText(\"FileUploadImageResizeFailMsg\",\"Failed to resize image\"))};if(this._oApplication.isOfflineMode()&&window.FilePicker){var o=\"data:image/jpeg;base64,\"+e;this.oImageResizer.resizeImage(o).then(t.bind(this),i)}else this.oImageResizer.resizeImagePath(e).then(t.bind(this),i)}else{var a,n=this._oApplication.getFileTransfer(),s=new window.FileUploadOptions;e.startsWith(\"/\")?(s.content=e,s.fileName=(new Date).getTime()+\".jpg\",a=s.fileName):(s.fileName=e.replace(/^.*[\\\\\\/]/,\"\"),a=e),s.fileKey=\"file\",s.mimeType=\"image/jpeg\",s.chunkedMode=!1,s.headers={Referer:window.location.href},this._showUploadingDialog();var r=this.getUploadURL(),l=this.onFileUploadSuccess.bind(this),h=this.onFileUploadFail.bind(this);n.upload(a,r,l,h,s)}},onTakePictureFail:function(e){jQuery.sap.log.info(\"onTakePictureFail for error \"+e)},onPictureButtonPress:function(e){if(navigator.camera){var t=navigator.camera.DestinationType.FILE_URI,i=45;this._oApplication.isOfflineMode()&&window.FilePicker&&(i=10,t=navigator.camera.DestinationType.DATA_URL);var o={quality:i,targetWidth:1024,targetHeight:768,saveToPhotoAlbum:!1,destinationType:t};navigator.camera.getPicture(this.onTakePictureSuccess.bind(this),this.onTakePictureFail.bind(this),o)}else this._isDebugMode()&&(this._showCameraDesktop=!0,this.invalidate())},_resetUploader:function(){if(this._attachedECController||(this._attachedECController=this._getAttachedECController(),this._attachedECController)){var e=this._primaryPath,t=this._attachedECController.getDataContainer();t.setProperty(e+\"/content\",null,this.getBindingContext()),t.setProperty(e+\"/fileName\",null,this.getBindingContext()),t.setProperty(e+\"/fileSize\",null,this.getBindingContext()),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(\"\"),t.setProperty(\"/Root/$System/EditMode\",!1),t.setProperty(\"/Root/$System/IsThingDirty\",!1)}},___checkAndCreateEH:function(e){var t=e;if(0==e.length||0==e.lastIndexOf(\"ZCEH\",0))return t;if(!this._attachedECController&&(this._attachedECController=this._getAttachedECController(),!this._attachedECController))return t;this._attachedECController.getComponentModel().getEventHandlers();var i=this._attachedECController.getComponentModel().getEventHandler(e);if(i){var o=i._c.findIndex(function(e){return\"WindowAction\"==e._n&&\"Close\"==e._a.action});if(-1==o);else{var a=JSON.parse(JSON.stringify(i));a._a.id=i._a.id.substring(0,i._a.id.length-4)+\"ZCEH\",a._c.splice(o,1),t=\"ZCEH_\"+e,this._attachedECController.getComponentModel()._mEventHandlers[t]=a}}return t}})},!0);",
		"zcustom/frasers/ui5lib/control/ZFeederEnhancementPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\"],function(e){\"use strict\";return e.extend(\"zcustom.frasers.ui5lib.control.ZFeederEnhancementPane\",{metadata:{library:\"zcustom.frasers.ui5lib\",properties:{},aggregations:{},events:{}},renderer:function(e,t){jQuery.sap.log.debug(\">> renderer\",\"\",\"zCustomPane\"),t.getVisible()&&(e.write(\"<div\"),e.writeControlData(t),e.addClass(\"sapClientCodSeodFeeder\"),e.write(\"</div>\"))},initializePane:function(){jQuery.sap.log.debug(\">> initializePane\",\"\",\"zCustomPane\");var e=this;this._initializeControls(),this.getModel().attachDataContainerUpdateFinished(function(){e._onDataContainerUpdateFinished()})},aControls:[],fFromUser:!1,fToAccount:!1,fToVendor:!1,fToAgent:!1,sUserEmail:\"\",oCurrentFeeder:null,_getControls:function(e){jQuery.sap.log.debug(\">> _getControls\",\"\",\"zCustomPane\");var t=this;if(!this.aControls[e]){var o={};o.oFromUser=new sap.ui.commons.CheckBox({text:\"Use user’s email as sender\",tooltip:\"Use user’s email as sender\",checked:!0,change:function(e){t._onFromUserChange(e.mParameters.checked)}}),o.oFromUser.addStyleClass(\"outlookBox\"),o.oToAccount=new sap.ui.commons.CheckBox({text:\"Use Account’s email as recipient\",tooltip:\"Use Account’s email as recipient\",checked:!1,change:function(e){t._onToAccountChange(e.mParameters.checked)}}),o.oToAccount.addStyleClass(\"outlookBox\"),o.oToVendor=new sap.ui.commons.CheckBox({text:\"Use Partner’s email as recipient\",tooltip:\"Use Partner’s email as recipient\",checked:!0,change:function(e){t._onToVendorChange(e.mParameters.checked)}}),o.oToVendor.addStyleClass(\"outlookBox\"),o.oToAgent=new sap.ui.commons.CheckBox({text:\"Use Agent’s email as recipient\",tooltip:\"Use Agent’s email as recipient\",checked:!1,change:function(e){t._onToAgentChange(e.mParameters.checked)}}),o.oToAgent.addStyleClass(\"outlookBox\"),o.oRecipientLayout=new sap.ui.commons.layout.VerticalLayout({width:\"100%\",content:[o.oToAccount,o.oToVendor,o.oToAgent]}),this.aControls.splice(e,0,o)}return this.aControls[e]},_initializeControls:function(){jQuery.sap.log.debug(\">> _initializeControls\",\"\",\"zCustomPane\");this.aControls=[],this.fFromUser=!0,this.fToAccount=!1,this.fToVendor=!0,this.fToAgent=!1,this._onRecipientChange(),this._onFromUserChange(this.fFromUser)},onBeforeRendering:function(){jQuery.sap.log.debug(\">> onBeforeRendering\",\"\",\"zCustomPane\")},onAfterRendering:function(){jQuery.sap.log.debug(\">> onAfterRendering\",\"\",\"zCustomPane\");var e=this;this.aControls=[],this._onDataContainerUpdateFinished();for(var t=!1,o=0,n=null,r=this.getController().getParentController()._oCurrentComponentModel._mNodeNames.CustomPane,a=0;a<r.length;a++){var s=r[a];if(s._a&&s._a.jsTypeName&&s._a.jsTypeName.indexOf(\"Feeder\")>=0){t=!0;break}}if(t){var i=0;if(this.oCurrentFeeder)try{i=parseInt(this.oCurrentFeeder.sId.replace(\"__feeder\",\"\"),10)}catch(e){i=0}else i=0;var l=Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:Number.MAX_VALUE,u=null;for(a=i;a<=l;a++){var c=\"__feeder\"+a;if(u=sap.ui.getCore().byId(c))u.oReplyLayout&&(n=u);else if(n)break}n&&n.oReplyLayout&&(n.oReplyLayout.addContent(this._getNewLayout(o)),n.addEventDelegate({onAfterRendering:function(t){e.oCurrentFeeder=t.srcControl}}),o++,this.oCurrentFeeder=n,this.oCurrentFeeder.oOutlookScoped&&this.oCurrentFeeder.oOutlookScoped.setChecked(!1))}if(this.oCurrentFeeder){var h=this.oCurrentFeeder,g=this.oCurrentFeeder.cancelButtonPress;this.oCurrentFeeder.cancelButtonPress=function(){h.bIsReply=!1,g.apply(h)},h.oEmailSendButton&&h.oEmailSendButton.attachPress(function(){h.bIsReply=!1})}var d=this.getController().getParentController().getDataContainer().getDataObject(\"/Root/zFeederRelevant/ToList\");d.attachValueChanged(function(){var t=e._getValue(\"Root/zFeederRelevant/ReplyEmail\"),o=e._getValue(\"/Root/zFeederRelevant/ToList\");t?t!==o&&e._onRecipientChange():o!==e.sTo&&e._onRecipientChange()}),d=this.getController().getParentController().getDataContainer().getDataObject(\"/Root/zFeederRelevant/NewToEmail\"),d.attachValueChanged(function(){var t=e._getValue(\"Root/zFeederRelevant/ReplyEmail\"),o=e._getValue(\"/Root/zFeederRelevant/NewToEmail\");t?t!==o&&e._onRecipientChange():o!==e.sTo&&e._onRecipientChange()})},_getNewLayout:function(e){jQuery.sap.log.debug(\">> _getNewLayout\",\"\",\"zCustomPane\");var t=this._getControls(e),o=null;return t&&(o=new sap.ui.commons.layout.VerticalLayout({width:\"100%\",content:[t.oFromUser,t.oRecipientLayout]})),o},_onDataContainerUpdateFinished:function(){jQuery.sap.log.debug(\">> _onDataContainerUpdateFinished\",\"\",\"zCustomPane\"),this._onRecipientChange(),this._onFromUserChange(this.fFromUser)},_onFromUserChange:function(e){jQuery.sap.log.debug(\">> _onFromUserChange\");try{if(this.fFromUser!==e||!this.sUserEmail){this.fFromUser=e;for(var t=0;t<this.aControls.length;t++)this.aControls[t]&&this.aControls[t].oFromUser.getChecked()!==e&&this.aControls[t].oFromUser.setChecked(e);this.fFromUser?(this.sUserEmail=this._getUserEmail(),this._setFromField(this.sUserEmail)):this._setFromField(\"\")}}catch(e){jQuery.sap.log.debug(\"Error in _onFromUserChange: \"+e.message)}},_onToAccountChange:function(e){if(jQuery.sap.log.debug(\">> _onToAccountChange\",\"\",\"zCustomPane\"),this.fToAccount!==e){this.fToAccount=e;for(var t=0;t<this.aControls.length;t++)this.aControls[t]&&this.aControls[t].oToAccount.getChecked()!==e&&this.aControls[t].oToAccount.setChecked(e);this._onRecipientChange()}},_onToVendorChange:function(e){if(jQuery.sap.log.debug(\">> _onToVendorChange\",\"\",\"zCustomPane\"),this.fToVendor!==e){this.fToVendor=e;for(var t=0;t<this.aControls.length;t++)this.aControls[t]&&this.aControls[t].oToVendor.getChecked()!==e&&this.aControls[t].oToVendor.setChecked(e);this._onRecipientChange()}},_onToAgentChange:function(e){if(jQuery.sap.log.debug(\">> _onToAgentChange\",\"\",\"zCustomPane\"),this.fToAgent!==e){this.fToAgent=e;for(var t=0;t<this.aControls.length;t++)this.aControls[t]&&this.aControls[t].oToAgent.getChecked()!==e&&this.aControls[t].oToAgent.setChecked(e);this._onRecipientChange()}},_onRecipientChange:function(){if(jQuery.sap.log.debug(\">> _onRecipientChange\",\"\",\"zCustomPane\"),!this.oCurrentFeeder||!this.oCurrentFeeder.bComposeNewEmail&&!this.oCurrentFeeder.bIsReply)try{var e=this._getValue(\"/Root/ZAccountEmail\"),t=this._getValue(\"/Root/ZVendorEmail\"),o=this._getValue(\"/Root/ZAgentEmail\");this.sTo=this._getValue(\"/Root/zFeederRelevant/ToList\"),this.sTo=\"\",this.fToAccount&&e&&(this.sTo=this.sTo.concat(e).concat(\"; \")),this.fToVendor&&t&&(this.sTo=this.sTo.concat(t).concat(\"; \")),this.fToAgent&&o&&(this.sTo=this.sTo.concat(o).concat(\"; \")),this._setValue(\"/Root/zFeederRelevant/ToList\",this.sTo),this._setValue(\"/Root/zFeederRelevant/NewToEmail\",this.sTo)}catch(e){jQuery.sap.log.debug(\"Error in _onFromUserChange: \"+e.message)}},_setFromField:function(e){jQuery.sap.log.debug(\">> _setFromField\",\"\",\"zCustomPane\");try{this._setValue(\"/Root/zFeederRelevant/SelectedSMAPEmail\",e)}catch(e){jQuery.sap.log.debug(\"Error in _setFromField: \"+e.message)}},_getUserEmail:function(){jQuery.sap.log.debug(\">> _getUserEmail\",\"\",\"zCustomPane\");var e=\"\";try{e=this._getValue(\"/Root/ZCurrentUserEmail\")}catch(e){jQuery.sap.log.debug(\"Error in _getUserEmail: \"+e.message)}return e},_setValue:function(e,t){jQuery.sap.log.debug(\">> _setValue\",\"\",\"zCustomPane\");for(var o=this.getController();o;){var n=o.getDataContainer();if(n&&n.getDataObject(e)){n.getDataObject(e).setValue(t);break}o=o.getParentController()}},_getValue:function(e){jQuery.sap.log.debug(\">> _getValue\",\"\",\"zCustomPane\");for(var t=\"\",o=this.getController();o;){var n=o.getDataContainer();if(n&&n.getDataObject(e)){t=n.getDataObject(e).getValue();break}o=o.getParentController()}return t}})},!0);",
		"zcustom/frasers/ui5lib/control/ZPoCCustomPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(e,t,n){\"use strict\";return e.extend(\"zcustom.frasers.ui5lib.control.ZPoCCustomPane\",{metadata:{library:\"zcustom.frasers.ui5lib\",properties:{},aggregations:{_btn:{type:\"sap.m.Button\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(e,t){jQuery.sap.log.debug(\">> renderer\"),t.getVisible()&&(e.write(\"<span\"),e.writeControlData(t),e.write(\">\"),e.renderControl(t.getAggregation(\"_btn\")),e.write(\"</span>\"))},initializePane:function(){jQuery.sap.log.debug(\">> initializePane\");this.btn=new sap.m.Button({width:\"100%\",text:\"Test\",press:jQuery.proxy(this._onButtonPressed,this)}),this.setAggregation(\"_btn\",this.btn)},onBeforeRendering:function(){jQuery.sap.log.debug(\">> onBeforeRendering\")},onAfterRendering:function(){jQuery.sap.log.debug(\">> onAfterRendering\")},_onButtonPressed:function(){jQuery.sap.log.debug(\">> _onButtonPressed\");try{this.getController().getParentController().getDataContainer().getDataObject(\"/Root/zFeederRelevant/SelectedSMAPEmail\").setValue(\"vishneuski@gmail.com\")}catch(e){jQuery.sap.log.error(\"Error in _onButtonPressed: \",e.message,\"zcustom\")}}})},!0);",
		"zcustom/frasers/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,r){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.frasers.ui5lib\",dependencies:[],types:[],interfaces:[],controls:[\"zcustom.frasers.ui5lib.control.ZPoCCustomPane\",\"zcustom.frasers.ui5lib.control.ZFeederEnhancementPane\",\"zcustom.frasers.ui5lib.control.ZAttachmentsPane\"],elements:[],noLibraryCSS:!0,version:\"0.1.0\"}),zcustom.frasers.ui5lib});",
		"zcustom/frasers/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});