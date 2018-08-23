jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "zcustom.demo.ui5lib.library-preload",
	"modules": {
		"zcustom/demo/ui5lib/control/ZAttachmentsPane.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/GenericTile\",\"sap/m/GenericTileScope\",\"sap/ui/unified/FileUploader\",\"sap/client/m/util/ImageResizer\",\"sap/client/m/create/QuickCreateTile\",\"sap/m/ScrollContainer\",\"sap/m/LightBox\",\"sap/m/LightBoxItem\",\"zcustom/demo/ui5lib/ext/ZThumbnailTile\",\"zcustom/demo/ui5lib/ext/ZThumbnailTileContent\",\"zcustom/demo/ui5lib/ext/ZImage\"],function(e,t,i,o,a,n,s,r,l,h,d,c,p){\"use strict\";return e.extend(\"zcustom.demo.ui5lib.control.ZAttachmentsPane\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{browseTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},cameraTile:{type:\"sap.client.m.create.QuickCreateTile\",multiple:!1},attachments:{type:\"sap.m.GenericTile\",multiple:!0,singularName:\"attachment\"},tileContainer:{type:\"sap.m.ScrollContainer\",multiple:!1}},events:{}},renderer:function(e,t){e.write(\"<div\"),e.writeControlData(t),e.addClass(\"zAttachments\"),e.writeClasses(),e.write(\">\"),e.write(\"<div style='display : none'>\"),e.renderControl(t._stdFUoControl),e.write(\"</div>\"),e.renderControl(t.getTileContainer()),e.write(\"</div>\")},_getCustomParameters:function(){this._primaryPath=this.getParameter(\"primaryPath\")?this.getParameter(\"primaryPath\"):\"/Root/AttachmentFolder/AddParams\",this._attach2EC=this.getParameter(\"attach2EC\")?this.getParameter(\"attach2EC\"):\"COD_Documentlist\",this._enableImageProcessor=this.getParameter(\"enableImageProcessor\")?this.getParameter(\"enableImageProcessor\"):\"None\",this._onFileSelected=this.getParameter(\"onFileSelected\"),this._bHideBrowse=\"true\"===this.getParameter(\"hideBrowse\"),this._bHideCamera=\"true\"===this.getParameter(\"hideCamera\"),this._bHideImages=\"true\"===this.getParameter(\"hideImages\"),this._bHideNonImages=\"true\"===this.getParameter(\"hideNonImages\"),this._bMultipleFiles=!(\"true\"===this.getParameter(\"singleFile\")),this._bMultipleFiles=!1,this._bAlwaysResize=\"true\"===this.getParameter(\"alwaysResize\")},initializePane:function(){if(this.oController=this.getController(),this._oApplication=this._oApplication||this.oController&&this.oController.getApplication&&this.oController.getApplication()||sap.client.getCurrentApplication&&sap.client.getCurrentApplication(),this._oApplication.isNewUI()){this._oRuntimeEnviroment=this.oController&&this.oController.getRuntimeEnvironment&&this.oController.getRuntimeEnvironment()||this._oApplication.getRuntimeEnvironment(),this._getCustomParameters(),this._attachedECController=this._getAttachedECController(),this.oController.getParentController().attachEvent(\"ChildControllerAdded\",this,this._onChildControllerAdded,this),this.Documents=[],this.Thumbnails=[];var e,i=this._primaryPath,o=this._oRuntimeEnviroment,s=o.isRunningInContainer(),r=sap.ui.Device.os.ios,l=this._oApplication.getSettings();e=this._oApplication.isOfflineMode()?l.getDefaultImageUploadResolutionClassificationForOffline():l.getDefaultImageUploadResolutionClassificationForOnline(),this._setupImageResize(e);if(\"Crop\"===this._enableImageProcessor&&this.oController){if(!o.isRunningOnWindowsContainer()){jQuery.sap.require(\"sap.client.basecontrols.core.ImageProcessor\");var h=new sap.client.basecontrols.core.ImageProcessor(this,i);this.oController.setImageProcessor(h)}}this._iCompressedWidthHeight&&!this.oController.getImageProcessor()&&(this.oImageResizer=new n(this._iCompressedWidthHeight,this._iCompressedWidthHeight)),(this.oImageResizer||this._oApplication.isOfflineMode())&&window.FilePicker?(t.show(\"new sap.m.Button\"),this.oFileUploader=new sap.m.Button(this.getControlPrefixId()+\"-browseButton\",{icon:sap.ui.core.IconPool.getIconURI(\"open-folder\"),press:function(){window.FilePicker.pickOne(function(e){var t=\"data:\"+e.mimeType+\";base64,\"+e.content;if(this.isImageFile(e)&&this.oImageResizer)this.oImageResizer.resizeImage(t).then(function(t){this._onImageResized(null,t,e.name)}.bind(this),function(i){this._uploadFile(t,e.name)}.bind(this));else if(this._oApplication.isOfflineMode()){var i=this._oApplication.getFileTransfer();this._showUploadingDialog();var o={fileKey:\"file\",fileName:e.name,mimeType:e.type,content:e.content,size:e.size},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);i.upload(e.name,null,a,n,o)}else this._uploadFile(t,e.name)}.bind(this))}.bind(this)}),this.oFileUploader.addStyleClass(\"sapClientMButtonFileUploader\"),{Visible:\"visible\",Enabled:\"enabled\"}):(t.show(\"new FileUploader\"),this.oFileUploader=new a(this.getControlPrefixId(),{uploadOnChange:!1,sameFilenameAllowed:!0,buttonOnly:!0,sendXHR:!0,multiple:this._bMultipleFiles,change:[this._fnFileUploader_Change,this],uploadAborted:function(){this._closeUploadingDialog()}.bind(this),uploadComplete:[this._fnFileUploader_UploadComplete,this],fileSizeExceed:function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadExceedLimitMsg\",\"Exceeds maximum file size of 2MB\"))}}),this.oFileUploader.setTooltip(sap.client.m.Util.getLocaleText(\"FileUploader_ToolTip\",\"No file chosen\")),{Visible:\"visible\",Enabled:\"enabled\",Text:\"buttonText\"},s&&!r&&(this.oFileUploader.setIcon(sap.ui.core.IconPool.getIconURI(\"open-folder\")),this.oFileUploader.setIconOnly(!0))),this._stdFUoControl=this.oFileUploader,this._stdFUoControl.addStyleClass(\"sapClientMFileUpload\"),this.oTileContainer=(new sap.m.ScrollContainer).addStyleClass(\"sapUiTinyMargin\"),this.setTileContainer(this.oTileContainer),this._buildTiles()}},_onChildControllerAdded:function(e){if(this._getAttachedECController()){var t=this._attachedECController.getDataContainer();this.fUpdateFinished=$.proxy(this._DataContainerUpdateFinished,this),t.attachDataContainerUpdateFinished(this.fUpdateFinished)}},destroy:function(){if(this._getAttachedECController()){var e=this._attachedECController.getDataContainer();this.fUpdateFinished&&(e.detachDataContainerUpdateFinished(this.fUpdateFinished),this.fUpdateFinished=null)}},_fnFileUploader_Change:function(e){var t=e.mParameters;if(!t||t.newValue)if(this.isImageFileUploader(e.oSource)&&this.oImageResizer){var i={mParameters:e.mParameters,oSource:e.oSource},o=e.mParameters.files[0];this.oImageResizer.resizeImageFile(o).then(function(e){this._onImageResized(i,e)}.bind(this),function(e){this._onFileChange(i)}.bind(this))}else this._onFileChange(e)},_fnFileUploader_UploadComplete:function(e){var t=this._primaryPath;if(this._closeUploadingDialog(),this._getAttachedECController()){var i=e.mParameters.response||e.mParameters.responseRaw;if(i){i=unescape(decodeURI(i)),i=i.replace(/[\\r]/g,\"\");var o=i.split(\"\\n\");if(3===o.length){var a=o[0].split(\"=\")[1],n=o[1].split(\"=\")[1],s=o[2].split(\"=\")[1],r=this._attachedECController.getDataContainer();if(sap.ui.Device.os.ios){var l=sap.client.util.Util.createGuid(),h=n.split(\".\");if(h.length<2)n=n+\"-\"+l;else{var d=h.pop();n=h.pop()+\"-\"+l+\".\"+d}}r.setProperty(t+\"/content\",\"id=\"+a,this.getBindingContext()),r.setProperty(t+\"/fileName\",n,this.getBindingContext()),r.setProperty(t+\"/fileSize\",s,this.getBindingContext()),r.checkUpdate(t+\"/fileName.FormattedValue\")}var c;e&&e.getSource&&(c=new sap.client.evt.EventContext(e.getSource())),this._onFileSelected=this.___checkAndCreateEH(this._onFileSelected);var p=this._onFileSelected;p&&this._attachedECController.getEventProcessor().handleEvent(p,c)}}},_getAttachedECController:function(){return this._attachedECController||this.oController&&this.oController.getParentController()&&this.oController.getParentController().getChildController(this._attach2EC)&&(this._attachedECController=this.oController.getParentController().getChildController(this._attach2EC)),this._attachedECController},_DataContainerUpdateFinished:function(){if(this._getAttachedECController()){var e=this._attachedECController.getDataContainer(),t=e.getDataObject(\"/Root/AttachmentFolder/DocumentList\"),i=t.getCount();if(i!==this.Documents.length){this.Documents=[];var o={};if(i>0){var a;for(a=0;a<i;a++){var n=t.getRow(a);n&&(o={},o.RowIndex=n.getMember(\"@RowIndex\").getValue(),o.NodeID=n.getMember(\"NodeID\").getValue(),o.FileName=n.getMember(\"FileName\").getValue(),o.MimeCode=n.getMember(\"MimeCode\").getValue(),o.FileContentURI=n.getMember(\"FileContentURI\").getValue(),o.ThumbnailURL=n.getMember(\"ThumbnailURL\").getValue(),o.CreatedOn=n.getMember(\"CreatedOn\").getValue(),o.ChangedOn=n.getMember(\"ChangedOn\").getValue(),o.DocumentListPath=\"/Root/AttachmentFolder/DocumentList/\"+o.RowIndex,this.Documents.push(o))}this.Documents.sort(function(e,t){return t.ChangedOn-e.ChangedOn})}this._buildTiles()}}},_buildTiles:function(){if(this.oTileContainer){if(this.oTileContainer.destroyContent(),this.getBrowseTile())this.oTileContainer.addContent(this.getBrowseTile());else if(!this._bHideBrowse){var e=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-browseTile\",{text:\"Browse\",icon:\"sap-icon://open-folder\",press:function(){document.getElementById(this.getControlPrefixId()+\"-fu\").click()}.bind(this)}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd\");this.setBrowseTile(e),this.oTileContainer.addContent(e)}if(navigator.camera)if(this.getCameraTile())this.oTileContainer.addContent(this.getCameraTile());else if(!this._bHideCamera){var t=new sap.client.m.create.QuickCreateTile(this.getControlPrefixId()+\"-cameraTile\",{text:\"Camera\",icon:\"sap-icon://add-photo\",press:[this.onPictureButtonPress,this]}).addStyleClass(\"sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd\");this.setCameraTile(t),this.oTileContainer.addContent(t)}for(var i=this.Documents.length,a=0;a<i;a++){var n=this.Documents[a];if(this.isImageMimeCode(n.MimeCode)){if(!this._bHideImages){var s=new sap.m.LightBox,r=new sap.m.LightBoxItem({imageSrc:n.FileContentURI,title:n.FileName});s.addImageContent(r);var l=!!this.Thumbnails[n.NodeID],h=l||n.FileContentURI,m=new p({densityAware:!1,src:h});m.setDetailBox(s),m.addCustomData(new sap.ui.core.CustomData({key:\"_Document\",value:n})),l||m.attachLoad(this._imageOnLoad,this);var g=new c;g.setContent(m);var u=new d(this.getControlPrefixId()+\"-attaimg-\"+n.NodeID,{scope:o.Actions,press:[this._imagePressed,this]}).addStyleClass(\"sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd\");u.addTileContent(g),u._oDocument=n,this.addAttachment(u),this.oTileContainer.addContent(u)}}else if(!this._bHideNonImages){var C=this._getIconFromFilename(n.FileName),f=new sap.m.ImageContent({src:C}),_=new sap.m.TileContent;_.setContent(f);var U=new sap.m.GenericTile(this.getControlPrefixId()+\"-atta-\"+n.NodeID,{header:n.FileName,scope:o.Actions,press:[this._tilePressed,this]}).addStyleClass(\"sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd\");U.addTileContent(_),U._oDocument=n,this.addAttachment(U),this.oTileContainer.addContent(U)}}}},_imageOnLoad:function(e){var t,i,o,a=e.getSource().getDomRef().children[1],n=a.naturalWidth,s=a.naturalHeight,r=n>176||s>176,l={};if(l=a,r){var h=document.createElement(\"canvas\");h.id=\"canvasResize\",h.width=n,h.height=s,n>s?(t=n*(176/s),i=176):(t=176,i=s*(176/n)),h.width=t,h.height=i;h.getContext(\"2d\").drawImage(l,0,0,h.width,h.height),n=t,s=i,l=h,o=h.toDataURL(\"image/jpg\",.5)}if(176!==n||176!==s){var d=document.createElement(\"canvas\");h.id=\"canvasCrop\",d.width=n,d.height=s;var c,p;n>s?(c=(n-176)/2,p=0):(c=0,p=(s-176)/2),d.width=176,d.height=176,d.getContext(\"2d\").drawImage(l,c,p,176,176,0,0,176,176),o=d.toDataURL(\"image/jpg\",.5)}o!==a.src&&(a.src=o,this.Thumbnails[e.getSource().data(\"_Document\").NodeID]=o)},_isDebugMode:function(){var e=window[\"sap-ui-debug\"];return sap.client.getCurrentApplication().isDebugMode()||e},_getUserMedia:function(e,t,i){var o=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;if(o)return o.bind(navigator)(e,t,i)},_grabVideo:function(){if(!(navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia))return void t.show(\"User Media API not supported.\");var e={video:!0};this._getUserMedia(e,function(e){var t=document.querySelector(\"video\");\"srcObject\"in t?(t.srcObject=e,t.src=(window.URL||window.webkitURL).createObjectURL(e)):navigator.mozGetUserMedia&&(t.mozSrcObject=e),this._theStream=e}.bind(this),function(e){t.show(\"Error: \"+e)}.bind(this)).bind(this)},_takePhoto:function(){if(!(\"ImageCapture\"in window))return void t.show(\"ImageCapture is not available\");if(!this._theStream)return void t.show(\"Grab the video stream first!\");var e=new ImageCapture(this._theStream.getVideoTracks()[0]),i=this;e.takePhoto().then(function(e){document.getElementById(\"imageTag\").src=URL.createObjectURL(e);i._uploadFile(e,\"test\").bind(i)}).catch(function(e){t.show(\"Error: \"+e)})},_tilePressed:function(e){if(e.oSource&&e.oSource._oDocument&&e.oSource._oDocument.DocumentListPath){var t=e.getParameter(\"action\"),o=t===i._Action.Remove?\"DeleteConfirmation\":\"\";o=t===i._Action.Press?\"OpenDocument\":o;var a=new sap.client.evt.EventContext(e.oSource);a&&(a._sImplicitLeadSelectionPath=e.oSource._oDocument.DocumentListPath,o&&this._attachedECController.getEventProcessor().handleEvent(o,a))}},_imagePressed:function(e){if(e.oSource&&e.oSource._oDocument&&e.oSource._oDocument.DocumentListPath){var t=e.getParameter(\"action\"),o=t===i._Action.Remove?\"DeleteConfirmation\":\"\",a=new sap.client.evt.EventContext(e.oSource);a&&(a._sImplicitLeadSelectionPath=e.oSource._oDocument.DocumentListPath,o&&this._attachedECController.getEventProcessor().handleEvent(o,a))}},onBeforeRendering:function(){},onAfterRendering:function(){},_setupImageResize:function(e){if(e&&(this._oRuntimeEnviroment.isRunningInContainer()||this._bAlwaysResize))switch(e){case\"L\":this._iCompressedWidthHeight=this.LARGE_WIDTH_HEIGHT;break;case\"M\":this._iCompressedWidthHeight=this.MEDIUM_WIDTH_HEIGHT;break;case\"S\":this._iCompressedWidthHeight=this.SMALL_WIDTH_HEIGHT;break;default:this._iCompressedWidthHeight=null}},_showUploadingDialog:function(){this._oDialog||(this._oDialog=new sap.m.Dialog(this.getControlPrefixId()+\"-dialog\",{title:sap.client.m.Util.getLocaleText(\"UploadInProgress\",\"Uploading...\"),content:new sap.m.Text(this.getControlPrefixId()+\"-text\",{text:sap.client.m.Util.getLocaleText(\"FileUploadingMsg\",\"Uploading file to server, please wait ...\")})})),this._oDialog.open()},_closeUploadingDialog:function(){this._oDialog&&this._oDialog.close()},_onImageResized:function(e,t,i){var o=i;if(e){var a=e.mParameters.files[0];a&&(o=a.name)}if(this._oApplication.isOfflineMode()){var n=this._dataUriToBlob(t);this._uploadFile(n,o)}else this._uploadFile(t,o)},_dataUriToBlob:function(e){for(var t=e.split(\",\"),i=t[0].match(/:(.*?);/)[1],o=atob(t[1]),a=o.length,n=new Uint8Array(a);a--;)n[a]=o.charCodeAt(a);return new Blob([n],{type:i})},_uploadFile:function(e,t){var i=new window.FileTransfer;this._oApplication.isOfflineMode()&&(i=this.getOfflineFileTransfer());var o,a=this._oRuntimeEnviroment,n=(a.isRunningInContainer(),new window.FileUploadOptions);o=t||(e.name?e.name:\"file\"),n.fileName=o,n.fileKey=\"file\",n.chunkedMode=!1,\"string\"==typeof e&&e.match(\"image.*\")?n.mimeType=\"image/png\":\"string\"==typeof e&&e.match(\"data:.*\")?n.mimeType=e.split(\";\")[0].split(\":\")[1]:n.mimeType=e.type,n.headers={Referer:window.location.href},this._showUploadingDialog();var s=this.getUploadURL(),r=this.onFileUploadSuccess.bind(this),l=this.onFileUploadFail.bind(this);i.upload(e,s,r,l,n)},_onFileChange:function(e){var t;if(this._oApplication.isOfflineMode()){t=this._oApplication.getFileTransfer(),this._showUploadingDialog();var i=e.mParameters.files[0],o={fileKey:\"file\",fileName:i.name,mimeType:i.type},a=this.onFileUploadSuccess.bind(this),n=this.onFileUploadFail.bind(this);t.upload(i,null,a,n,o)}else{t=e.oSource;var s=this.getUploadURL();t.setUploadUrl(s);var r=this.oController.getImageProcessor();r?this.isImageFileUploader(t)?r.openPreview(s,e):(t.upload(),r.closePreview(s,e)):(this._showUploadingDialog(),t.upload())}},isImageFileUploader:function(e){if(e&&e.oFileUpload){var t=e.oFileUpload.files[0];return this.isImageFile(t)}return!1},isImageFile:function(e){return!!(e&&e.type&&e.type.match(\"image.*\")||e&&e.mimeType&&e.mimeType.match(\"image.*\"))},isImageMimeCode:function(e){return!!e.match(\"image.*\")},_getIconFromFilename:function(e){var t=this._splitFilename(e).extension;switch(\"string\"===jQuery.type(t)&&(t=t.toLowerCase()),t){case\".bmp\":case\".jpg\":case\".jpeg\":case\".png\":return\"sap-icon://card\";case\".csv\":case\".xls\":case\".xlsx\":return\"sap-icon://excel-attachment\";case\".doc\":case\".docx\":case\".odt\":return\"sap-icon://doc-attachment\";case\".pdf\":return\"sap-icon://pdf-attachment\";case\".ppt\":case\".pptx\":return\"sap-icon://ppt-attachment\";case\".txt\":return\"sap-icon://document-text\";default:return\"sap-icon://document\"}},_splitFilename:function(e){var t={},i=e.split(\".\");return 1===i.length?(t.extension=\"\",t.name=i.pop(),t):(t.extension=\".\"+i.pop(),t.name=i.join(\".\"),t)},getOfflineFileTransfer:function(){if(!this.oOfflineFileTransfer){var e=sap.ui.requireSync(\"sap/client/setup/offline/FileTransfer\"),t=this._oApplication.getOfflineAPI();this.oOfflineFileTransfer=new e(t)}return this.oOfflineFileTransfer},setControlWidth:function(e){this.oControl.setWidth&&this.oControl.setWidth(\"100%\")},getUploadURL:function(){var e,t=this._oApplication.getRepositoryUrl();if(t&&(e=t.indexOf(\"/sap/\")+4)>=0){var i=this.oController.getSession().getSessionID();t=t.substr(0,e)+\"(\"+i+\")\"+t.substr(e)}return t&&(e=t.lastIndexOf(\"/\"))>=0&&(t=t.substr(0,e)+\"/fileupload\"),t},uploadComplete:function(e,t,i){if(this._getAttachedECController()){var o=this._primaryPath;if(null!==e&&null!==t&&null!==i){var a=this._attachedECController.getDataContainer();a.setProperty(o+\"/content\",\"id=\"+e,this.getBindingContext()),a.setProperty(o+\"/fileName\",t,this.getBindingContext()),a.setProperty(o+\"/fileSize\",i,this.getBindingContext()),a.checkUpdate(o+\"/fileName.FormattedValue\"),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(t)}var n;this.oFileUploader&&(n=new sap.client.evt.EventContext(this.oFileUploader)),this._onFileSelected=this.___checkAndCreateEH(this._onFileSelected);var s=this._onFileSelected;s&&this._attachedECController.getEventProcessor().handleEvent(s,n),this.oFileUploader.setTooltip(t)}},onFileUploadSuccess:function(e){var t=null,i=null,o=null,a=unescape(decodeURI(e.response));a=a.replace(/[\\r]/g,\"\");var n=a.split(\"\\n\");3===n.length&&(t=n[0].split(\"=\")[1],i=n[1].split(\"=\")[1],o=n[2].split(\"=\")[1]),this._closeUploadingDialog(),this.uploadComplete(t,i,o)},onFileUploadFail:function(e){this._closeUploadingDialog();var t;t=e.exception?e.exception:e.message,this._resetUploader(),sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+t),jQuery.sap.log.info(\"onFileUploadFail exception \"+t)},onTakePictureSuccess:function(e){if(this.oImageResizer){var t=function(t){var i;i=e.startsWith(\"/\")?\"image-\"+(new Date).getTime()+\".jpg\":e.replace(/^.*[\\\\\\/]/,\"\"),this._onImageResized(null,t,i)},i=function(e){sap.m.MessageToast.show(sap.client.m.Util.getLocaleText(\"FileUploadFailMsg\",\"Unable to upload file. \")+\" \"+sap.client.m.Util.getLocaleText(\"FileUploadImageResizeFailMsg\",\"Failed to resize image\"))};if(this._oApplication.isOfflineMode()&&window.FilePicker){var o=\"data:image/jpeg;base64,\"+e;this.oImageResizer.resizeImage(o).then(t.bind(this),i)}else this.oImageResizer.resizeImagePath(e).then(t.bind(this),i)}else{var a,n=this._oApplication.getFileTransfer(),s=new window.FileUploadOptions;e.startsWith(\"/\")?(s.content=e,s.fileName=(new Date).getTime()+\".jpg\",a=s.fileName):(s.fileName=e.replace(/^.*[\\\\\\/]/,\"\"),a=e),s.fileKey=\"file\",s.mimeType=\"image/jpeg\",s.chunkedMode=!1,s.headers={Referer:window.location.href},this._showUploadingDialog();var r=this.getUploadURL(),l=this.onFileUploadSuccess.bind(this),h=this.onFileUploadFail.bind(this);n.upload(a,r,l,h,s)}},onTakePictureFail:function(e){jQuery.sap.log.info(\"onTakePictureFail for error \"+e)},onPictureButtonPress:function(e){if(navigator.camera){var t=navigator.camera.DestinationType.FILE_URI,i=45;this._oApplication.isOfflineMode()&&window.FilePicker&&(i=10,t=navigator.camera.DestinationType.DATA_URL);var o={quality:i,targetWidth:1024,targetHeight:768,saveToPhotoAlbum:!1,destinationType:t};navigator.camera.getPicture(this.onTakePictureSuccess.bind(this),this.onTakePictureFail.bind(this),o)}},_resetUploader:function(){if(this._getAttachedECController()){var e=this._primaryPath,t=this._attachedECController.getDataContainer();t.setProperty(e+\"/content\",null,this.getBindingContext()),t.setProperty(e+\"/fileName\",null,this.getBindingContext()),t.setProperty(e+\"/fileSize\",null,this.getBindingContext()),this.oFileUploader.oFilePath&&this.oFileUploader.oFilePath.setValue(\"\"),t.setProperty(\"/Root/$System/EditMode\",!1),t.setProperty(\"/Root/$System/IsThingDirty\",!1)}},___checkAndCreateEH:function(e){var t=e;if(0==e.length||0==e.lastIndexOf(\"ZCEH\",0))return t;if(!this._getAttachedECController())return t;this._attachedECController.getComponentModel().getEventHandlers();var i=this._attachedECController.getComponentModel().getEventHandler(e);if(i){var o=i._c.findIndex(function(e){return\"WindowAction\"==e._n&&\"Close\"==e._a.action});if(-1==o);else{var a=JSON.parse(JSON.stringify(i));a._a.id=i._a.id.substring(0,i._a.id.length-4)+\"ZCEH\",a._c.splice(o,1),t=\"ZCEH_\"+e,this._attachedECController.getComponentModel()._mEventHandlers[t]=a}}return t}})},!0);",
		"zcustom/demo/ui5lib/control/ZEstablishmentLookup.js": "sap.ui.define([\"sap/client/basecontrols/core/CustomPane\",\"sap/m/MessageToast\",\"sap/m/MessageBox\"],function(t,e,s){\"use strict\";return t.extend(\"zcustom.c4c.ui5lib.control.ZEstablishmentLookup\",{metadata:{library:\"zcustom.demo.ui5lib\",properties:{},aggregations:{_inpFieldE:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"},_inpFieldA:{type:\"sap.m.Input\",multiple:!1,visibility:\"hidden\"}},events:{}},renderer:function(t,e){e.getVisible()&&(t.write(\"<span\"),t.writeControlData(e),t.write(\">\"),t.renderControl(e.getAggregation(\"_inpFieldE\")),t.renderControl(e.getAggregation(\"_inpFieldA\")),t.write(\"</span>\"))},initializePane:function(){this.inpFieldE=null,this.inpFieldA=null,this.geoResponseResult=null,this.estResponseResult=null,this.fEstaActive=this.getParameter(\"EstaActive\"),this.vAttachEsta2Field=this.getParameter(\"AttachEsta2Field\"),this.fAddrActive=this.getParameter(\"AddrActive\"),this.vAttachAddr2Field=this.getParameter(\"AttachAddr2Field\");var t=[];if(this.fEstaActive&&(this.vAttachEsta2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachEsta2Field+\"']\"),t.length>0&&(this.inpFieldE=sap.ui.getCore().byId(t[0].id))):(this.inpFieldE=new sap.m.Input({width:\"100%\",placeholder:\"Enter Company name ...\",showValueHelp:!0}),this.inpFieldE.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldE\",this.inpFieldE)),this.inpFieldE&&this.inpFieldE.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputE,this)},this)),this.fAddrActive&&(this.vAttachAddr2Field?(t=[],t=$(\"[data-sap-automation-id='\"+this.vAttachAddr2Field+\"']\"),t.length>0&&(this.inpFieldA=sap.ui.getCore().byId(t[0].id))):(this.inpFieldA=new sap.m.Input({width:\"100%\",placeholder:\"Enter Address ...\",showValueHelp:!0}),this.inpFieldA.attachValueHelpRequest(this._onClearInput),this.setAggregation(\"_inpFieldA\",this.inpFieldA)),this.inpFieldA&&this.inpFieldA.addEventDelegate({onAfterRendering:jQuery.proxy(this._onAfterRenderingInputA,this)},this)),\"object\"==typeof google&&\"object\"==typeof google.maps);else{var e=\"https://maps.googleapis.com/maps/api/js?libraries=places&key=\",s=this.getParameter(\"API_KEY\");s?e+=s:jQuery.sap.log.error(\"API_KEY is missing\"),jQuery.sap.includeScript(e,\"google.maps\",this._initAutocomplete.bind(this),function(){jQuery.sap.log.error(\"Error initializing Google Places API\")})}},destroy:function(){try{void 0!==this.autocompleteAddr&&null!==this.autocompleteAddr&&(google.maps.event.clearInstanceListeners(this.autocompleteAddr),google.maps.event.clearInstanceListeners(this.eInputA),this.autocompleteAddr=null),void 0!==this.autocompleteEsta&&null!==this.autocompleteEsta&&(google.maps.event.clearInstanceListeners(this.autocompleteEsta),google.maps.event.clearInstanceListeners(this.eInputE),this.autocompleteEsta=null),$(\".pac-container\").remove()}catch(t){jQuery.sap.log.error(\"Destroy method failed\")}},autocompleteAddr:\"\",autocompleteEsta:\"\",eInputA:null,eInputE:null,inpFieldA:null,inpFieldE:null,fEstaActive:null,vAttachEsta2Field:null,fAddrActive:null,vAttachAddr2Field:null,position:null,_onAfterRenderingInputA:function(){try{var t=this.inpFieldA._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)},_onAfterRenderingInputE:function(){try{var t=this.inpFieldE._getValueHelpIcon();t.setSrc(\"sap-icon://sys-cancel\"),t.setSize(\"1.25rem\")}catch(t){jQuery.sap.log.error(\"Valuehelp icon is missed\")}this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment)},_onClearInput:function(){this.setValue(\"\")},_setResult:function(t,e){if(t){this.getModel().getDataObject(e).setValue(t)}},_setResultIntoNearest:function(t,e){for(var s,i=this;i;){if((s=i.getModel())&&s.getDataObject(e)){s.getDataObject(e).setValue(t);break}i=i.getParent()}},_initAutocompleteInput:function(t,e,s){var i=\"\",n=null,o=null;if(t&&(i=t.getId().toString()+\"-inner\",(n=document.getElementById(i))||(n=document.getElementById(t.getId().toString()))),n)try{o=new google.maps.places.Autocomplete(n,{types:[e],componentRestrictions:{country:\"AU\"}}),o.addListener(\"place_changed\",jQuery.proxy(s,this))}catch(t){o=\"\"}return o},_initAutocomplete:function(){this.vAttachAddr2Field&&this.inpFieldA&&(this.autocompleteAddr=this._initAutocompleteInput(this.inpFieldA,\"geocode\",this._fillInAddress)),this.vAttachEsta2Field&&this.inpFieldE&&(this.autocompleteEsta=this._initAutocompleteInput(this.inpFieldE,\"establishment\",this._fillInEstablishment))},_fillInAddressFromPlace:function(t){if(t.name){var e=\"\",s=\"\",i=\"\",n=\"\",o=\"\",a=\"\",l=t.geometry.location.lat().toFixed(13),r=t.geometry.location.lng().toFixed(13);this._setResultIntoNearest(l,\"/Root/LatitudeMeasure/content\"),this._setResultIntoNearest(r,\"/Root/LongitudeMeasure/content\");for(var d=0;d<t.address_components.length;d++)t.address_components[d].types.includes(\"street_number\")?e=t.address_components[d].short_name:t.address_components[d].types.includes(\"route\")?s=t.address_components[d].short_name:t.address_components[d].types.includes(\"locality\")?i=t.address_components[d].long_name:t.address_components[d].types.includes(\"administrative_area_level_1\")?n=t.address_components[d].short_name:t.address_components[d].types.includes(\"country\")?o=t.address_components[d].short_name:t.address_components[d].types.includes(\"postal_code\")&&(a=t.address_components[d].short_name);this._setResultIntoNearest(e,\"/Root/HouseID\"),this._setResultIntoNearest(s,\"/Root/StreetName\"),this._setResultIntoNearest(i,\"/Root/CityName\"),this._setResultIntoNearest(a,\"/Root/StreetPostalCode\"),this._setResultIntoNearest(o,\"/Root/CountryCode\"),this._setResultIntoNearest(n+\"$XDP$\"+o,\"/Root/State\")}},_fillInAddress:function(){var t=this.autocompleteAddr.getPlace();this._fillInAddressFromPlace(t)},_fillInEstablishment:function(){var t=this.autocompleteEsta.getPlace();t.name&&(this._setResultIntoNearest(t.name,\"/Root/FirstLineName\"),this._fillInAddressFromPlace(t))}})},!0);",
		"zcustom/demo/ui5lib/ext/ZImage.js": "sap.ui.define([\"sap/m/library\",\"sap/m/Image\",\"sap/m/ImageRenderer\"],function(e,r,t){\"use strict\";var i=e.ImageMode,o=r.extend(\"zcustom.demo.ui5lib.ext.ZImage\",{metadata:{library:\"zcustom.demo.ui5lib\"},renderer:function(e,r){t.render(e,r)}});return o.prototype.onAfterRendering=function(){var e,r=this.$(),t=this.getMode();this.getDetailBox()&&(r=this.$().children(\"img\").first()),t===i.Image&&(r.on(\"load\",jQuery.proxy(this.onload,this)),r.on(\"error\",jQuery.proxy(this.onerror,this)),e=r[0]),t===i.Background&&(e=this._oImage),e&&e.complete&&!this._defaultEventTriggered&&(e.naturalWidth>0?this.onload({}):this.onerror({}))},o});",
		"zcustom/demo/ui5lib/ext/ZThumbnailTile.js": "sap.ui.define([\"sap/m/GenericTile\",\"zcustom/demo/ui5lib/ext/ZThumbnailTileRenderer\",\"sap/m/library\"],function(e,t,i){\"use strict\";var r=e.extend(\"zcustom.demo.ui5lib.ext.ZThumbnailTile\",{metadata:{library:\"zcustom.demo.ui5lib\"},renderer:function(e,i){t.render(e,i)}});return r.prototype._isHeaderTextTruncated=function(){var e,t,r;return this.getMode()===i.GenericTileMode.LineMode?(t=this.$(\"hdr-text\"),t.length>0&&(r=Math.ceil(t[0].getBoundingClientRect().width),t[0]&&r<t[0].scrollWidth)):!!(e=this.getAggregation(\"_titleText\").getDomRef(\"inner\"))&&this.getAggregation(\"_titleText\").getClampHeight(e)<e.scrollHeight},r});",
		"zcustom/demo/ui5lib/ext/ZThumbnailTileContent.js": "sap.ui.define([\"sap/m/TileContent\",\"zcustom/demo/ui5lib/ext/ZThumbnailTileContentRenderer\"],function(e,t){\"use strict\";return e.extend(\"zcustom.demo.ui5lib.ext.ZThumbnailTileContent\",{metadata:{library:\"zcustom.demo.ui5lib\"},renderer:function(e,n){t.render(e,n)}})});",
		"zcustom/demo/ui5lib/ext/ZThumbnailTileContentRenderer.js": "sap.ui.define([\"sap/m/library\",\"jquery.sap.global\",\"sap/m/TileContentRenderer\",\"sap/ui/core/Renderer\"],function(e,t,r,n){\"use strict\";var a=n.extend(r);return a.render=function(e,r){var n=r.getTooltip_AsString(),a=r._getContentType();a&&(a=t.sap.encodeCSS(a));var i=t.sap.encodeCSS(\"sapMFrameType\"+r.getFrameType());e.write(\"<div\"),e.writeControlData(r),e.addClass(\"ZsapMTileCnt\"),e.addClass(a),e.addClass(i),n.trim()&&e.writeAttributeEscaped(\"title\",n),e.writeClasses(),e.write(\">\"),this._renderContent(e,r),r.getFooter()&&this._super._renderFooter(e,r),e.write(\"</div>\")},a._renderContent=function(e,t){if(t._bRenderContent){var r=t.getContent();r&&(e.write(\"<div\"),e.writeClasses(),e.writeAttribute(\"id\",t.getId()+\"-content\"),e.write(\">\"),r.hasStyleClass(\"sapMTcInnerMarker\")||r.addStyleClass(\"sapMTcInnerMarker\"),e.renderControl(r),e.write(\"</div>\"))}},a},!0);",
		"zcustom/demo/ui5lib/ext/ZThumbnailTileRenderer.js": "sap.ui.define([\"sap/m/library\",\"jquery.sap.global\",\"sap/m/GenericTileRenderer\",\"sap/ui/core/Renderer\"],function(e,t,r,a){\"use strict\";var s=e.GenericTileMode,i=e.GenericTileScope,d=e.LoadState,n=a.extend(r);return n.render=function(e,r){var a=r._getTooltipText(),n=r._getAriaText(),o=r.getHeaderImage(),l=r.hasListeners(\"press\"),p=r.getState(),c=r.getScope(),u=t.sap.encodeCSS(\"sapMGTState\"+p),g=t.sap.encodeCSS(\"sapMGTScope\"+c);e.write(\"<div\"),e.writeControlData(r),a&&e.writeAttributeEscaped(\"title\",a),e.addClass(\"sapMGT\"),e.addClass(u),e.addClass(g),c!==i.Actions&&r._bShowActionsView&&e.addClass(\"sapMGTScopeActions\"),e.addClass(r.getFrameType()),l?e.writeAttribute(\"role\",\"button\"):e.writeAttribute(\"role\",\"presentation\"),e.writeAttributeEscaped(\"aria-label\",n),p!==d.Disabled&&(e.addClass(\"sapMPointer\"),e.writeAttribute(\"tabindex\",\"0\")),r.getBackgroundImage()&&(e.write(\" style='background-image:url(\"),e.writeEscaped(r.getBackgroundImage()),e.write(\");'\"),e.addClass(\"sapMGTBackgroundImage\")),r.getMode()===s.HeaderMode&&e.addClass(\"sapMGTHeaderMode\"),e.writeClasses(),e.write(\">\"),r.getHeader()&&(e.write(\"<div\"),e.addClass(\"sapMGTHdrContent\"),e.addClass(r.getFrameType()),a&&e.writeAttributeEscaped(\"title\",a),e.writeClasses(),e.write(\">\"),o&&e.renderControl(r._oImage),this._super._renderHeader(e,r),r.getSubheader()&&this._super._renderSubheader(e,r),e.write(\"</div>\")),e.write(\"<div\"),r.getHeader()?e.addClass(\"sapMGTContent\"):e.addClass(\"ZsapMGTContent\"),e.writeClasses(),e.writeAttribute(\"id\",r.getId()+\"-content\"),e.write(\">\");for(var w=r.getTileContent(),C=w.length,b=0;b<C;b++)r._checkFooter(w[b],r),e.renderControl(w[b]);e.write(\"</div>\"),p!==d.Loaded&&this._super._renderStateOverlay(e,r,a),p!==d.Disabled&&(this._super._renderHoverOverlay(e,r),this._super._renderFocusDiv(e,r)),c===i.Actions&&this._renderActionsScope(e,r),e.write(\"</div>\")},n._renderActionsScope=function(e,t){t.getState()!==d.Disabled&&e.renderControl(t._oRemoveButton)},n},!0);",
		"zcustom/demo/ui5lib/library.js": "/*!\n * ${copyright}\n */\nsap.ui.define([\"jquery.sap.global\",\"sap/ui/core/library\"],function(e,i){\"use strict\";return sap.ui.getCore().initLibrary({name:\"zcustom.demo.ui5lib\",dependencies:[\"sap.ui.core\",\"sap.m\",\"sap.ui.unified\"],types:[],interfaces:[],controls:[\"zcustom.demo.ui5lib.control.ZEstablishmentLookup\",\"zcustom.demo.ui5lib.control.ZAttachmentsPane\",\"zcustom.demo.ui5lib.ext.ZThumbnailTile\",\"zcustom.demo.ui5lib.ext.ZThumbnailTileRenderer\",\"zcustom.demo.ui5lib.ext.ZThumbnailTileContent\",\"zcustom.demo.ui5lib.ext.ZThumbnailTileContentRenderer\",\"zcustom.demo.ui5lib.ext.ZImage\"],elements:[],version:\"0.1.0\"}),zcustom.demo.ui5lib});",
		"zcustom/demo/ui5lib/messagebundle.properties": "lib.title=ZCustom UI5 Library for C4C\nlib.descr=ZCustom UI5 Library for C4C\n\n"
	}
});