sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/GenericTile",
	"sap/m/GenericTileScope",
	"sap/ui/unified/FileUploader",
	"sap/client/m/util/ImageResizer",
	"sap/client/m/create/QuickCreateTile",
	"sap/m/ScrollContainer",
	"sap/m/LightBox",
	"sap/m/LightBoxItem"
], function (CustomPane, MessageToast, MessageBox, GenericTile, GenericTileScope, FileUploader, ImageResizer, QuickCreateTile,
	ScrollContainer, LightBox) {
	"use strict";

	// Provides control zcustom.sandbox.ui5lib.control.ZCustomEmptyPane
	var ZAttachmentsPane = CustomPane.extend("zcustom.sandbox.ui5lib.control.ZAttachmentsPane", /** @lends zcustom.sandbox.ui5lib.control.ZCustomEmptyPane.prototype */ {
		metadata: {

			library: "zcustom.demo.ui5lib",
			properties: {},
			aggregations: {
				"browseTile": {
					type: "sap.client.m.create.QuickCreateTile",
					multiple: false
				},
				"cameraTile": {
					type: "sap.client.m.create.QuickCreateTile",
					multiple: false
				},
				"attachments": {
					type: "sap.m.GenericTile",
					multiple: true,
					singularName: "attachment"
				},
				"tileContainer": {
					type: "sap.m.ScrollContainer",
					multiple: false
				}
			},
			events: {}
		},

		renderer: function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("zAttachments");
			oRM.writeClasses();
			oRM.write(">");

			oRM.write("<div style='display : none'>");
			oRM.renderControl(oControl._stdFUoControl);
			oRM.write("</div>");

			oRM.renderControl(oControl.getTileContainer());

			if (oControl._showCameraDesktop) {
				oRM.write("<p>");
				oRM.renderControl(oControl._oBtnGrabVideo);
				oRM.write("</p>");
				oRM.write("<p><video autoplay style='height: 180px; width: 240px;'></video></p>");
				oRM.write("<p>");
				oRM.renderControl(oControl._oBtnTakePhoto);
				oRM.write("</p>");
				oRM.write("<p><img id='imageTag' width='240' height='180'></p>");
			};

			oRM.write("</div>");
		},

		_getCustomParameters: function () {
			this._primaryPath = this.getParameter("primaryPath") ? this.getParameter("primaryPath") : "/Root/AttachmentFolder/AddParams";
			this._attach2EC = this.getParameter("attach2EC") ? this.getParameter("attach2EC") : "COD_Documentlist";
			this._enableImageProcessor = this.getParameter("enableImageProcessor") ? this.getParameter("enableImageProcessor") : "None";
			this._onFileSelected = this.getParameter("onFileSelected");

			this._bHideBrowse = (this.getParameter("hideBrowse") == "true");
			this._bHideCamera = (this.getParameter("hideCamera") == "true");
			this._bHideImages = (this.getParameter("hideImages") == "true");
			this._bHideNonImages = (this.getParameter("hideNonImages") == "true");
			
			this._bMultipleFiles  = !(this.getParameter("singleFile") == "true");
		},

		initializePane: function () {
			// Preparation
			this.oController = this.getController();
			this._oApplication = this._oApplication ||
				(this.oController && this.oController.getApplication && this.oController.getApplication()) ||
				(sap.client.getCurrentApplication && sap.client.getCurrentApplication()); //the logic taken from sap.client.basecontrols.core.BaseControlWrapper

			// We're working only in NewUI (aka Fiori UI aka RUI)
			if (!this._oApplication.isNewUI()) {
				return;
			}

			this._oRuntimeEnviroment = (this.oController && this.oController.getRuntimeEnvironment && this.oController.getRuntimeEnvironment()) ||
				(this._oApplication.getRuntimeEnvironment());

			this._getCustomParameters();

			this._attachedECController = this._getAttachedECController();

			// Now here we're doing pretty much the same as in standard FileUploadWrapper
			var primaryPath = this._primaryPath;
			var mControlBindings = null;
			var oRuntimeEnviroment = this._oRuntimeEnviroment;
			var isContainer = oRuntimeEnviroment.isRunningInContainer();
			var isIOS = sap.ui.Device.os.ios;
			var imageSize;
			var oSettings = this._oApplication.getSettings();
			if (this._oApplication.isOfflineMode()) {
				imageSize = oSettings.getDefaultImageUploadResolutionClassificationForOffline();
			} else {
				imageSize = oSettings.getDefaultImageUploadResolutionClassificationForOnline();
			}
			this._setupImageResize(imageSize);

			var sEnableImageProcessor = this._enableImageProcessor;
			if (sEnableImageProcessor === "Crop" && this.oController) {
				var isRunningOnWindowsContainer = oRuntimeEnviroment.isRunningOnWindowsContainer();
				if (!isRunningOnWindowsContainer) {
					//Instantiating Image Processor
					jQuery.sap.require("sap.client.basecontrols.core.ImageProcessor");
					var oImageProcessor = new sap.client.basecontrols.core.ImageProcessor(this, primaryPath);
					this.oController.setImageProcessor(oImageProcessor);
				}
			}

			var bEnableImageResize = this._iCompressedWidthHeight && !this.oController.getImageProcessor();

			if (bEnableImageResize) {
				this.oImageResizer = new ImageResizer(this._iCompressedWidthHeight, this._iCompressedWidthHeight);
			}

			if ((this.oImageResizer || this._oApplication.isOfflineMode()) && window.FilePicker) {
				this.oFileUploader = new sap.m.Button(this.getControlPrefixId() + "-browseButton", {
					icon: sap.ui.core.IconPool.getIconURI("open-folder"),
					press: function () {
						// use the file picker plugin
						window.FilePicker.pickOne(function (oFile) {
							var sDataUri = "data:" + oFile.mimeType + ";base64," + oFile.content;
							if (this.isImageFile(oFile) && this.oImageResizer) {
								this.oImageResizer.resizeImage(sDataUri).then(function (sResizedImageDataUri) {
									this._onImageResized(null, sResizedImageDataUri, oFile.name);
								}.bind(this), function (error) {
									this._uploadFile(sDataUri, oFile.name);
								}.bind(this));
							} else {
								if (this._oApplication.isOfflineMode()) {
									var fileUploader = this._oApplication.getFileTransfer();
									this._showUploadingDialog();

									var options = {
										fileKey: "file",
										fileName: oFile.name,
										mimeType: oFile.type,
										content: oFile.content,
										size: oFile.size
									};

									var success = this.onFileUploadSuccess.bind(this);
									var fail = this.onFileUploadFail.bind(this);
									fileUploader.upload(oFile.name, null, success, fail, options);
								} else {
									this._uploadFile(sDataUri, oFile.name);
								}
							}
						}.bind(this));
					}.bind(this)
				});

				this.oFileUploader.addStyleClass("sapClientMButtonFileUploader");

				mControlBindings = {
					Visible: "visible",
					Enabled: "enabled"
				};

			} else {
				this.oFileUploader = new FileUploader(this.getControlPrefixId(), {
					//shallPicturesBeOnlyTakenByCamera: oSettings.shallPicturesBeOnlyTakenByCamera(),
					uploadOnChange: false, // we have to wait for the change event
					sameFilenameAllowed: true,
					buttonOnly: true,
					// sendXHR: bRunningOnWindows81,
					sendXHR: true,
					multiple: this._bMultipleFiles,
					change: [this._fnFileUploader_Change, this],
					uploadAborted: function () {
						this._closeUploadingDialog();
					}.bind(this),
					uploadComplete: [this._fnFileUploader_UploadComplete, this],
					fileSizeExceed: function (oControlEvent) {
						sap.m.MessageToast.show(sap.client.m.Util.getLocaleText("FileUploadExceedLimitMsg", "Exceeds maximum file size of 2MB"));
					}
				});

				this.oFileUploader.setTooltip(sap.client.m.Util.getLocaleText("FileUploader_ToolTip", "No file chosen"));

				mControlBindings = {
					Visible: "visible",
					Enabled: "enabled",
					Text: "buttonText"
				};

				// running in container mode changes the buttons
				// to be icons only to accommodate smaller screen sizes except for ios
				// since the icon-only mode doesn't work with ios. Probably
				// a bug in UI5 :(
				if (isContainer && !isIOS) {
					this.oFileUploader.setIcon(sap.ui.core.IconPool.getIconURI('open-folder'));
					this.oFileUploader.setIconOnly(true);
				}
			}

			//this.createControlBindings(this.oFileUploader, mControlBindings); // << doesn't exist in the pane

			this._stdFUoControl = this.oFileUploader;

			this._stdFUoControl.addStyleClass("sapClientMFileUpload");
			// <<< finish standard logic from FileUploadWrapper

			// for testing
			this._showCameraDesktop = false;
			this._theStream = null;

			// Tile container
			this.oTileContainer = new sap.m.ScrollContainer().addStyleClass("sapUiTinyMargin");
			this.setTileContainer(this.oTileContainer);

			// Browse tile
			if (!this._bHideBrowse) {
				var oBrowseTile = new sap.client.m.create.QuickCreateTile(this.getControlPrefixId() + "-browseTile", {
					text: "Browse",
					icon: "sap-icon://open-folder",
					press: function () {
						document.getElementById(this.getControlPrefixId() + "-fu").click()
					}.bind(this)
				}).addStyleClass("sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd");
				this.setBrowseTile(oBrowseTile);
				this.oTileContainer.addContent(oBrowseTile);
			}

			// Camera tile
			if (!this._bHideCamera) {
				var oCameraTile = new sap.client.m.create.QuickCreateTile(this.getControlPrefixId() + "-cameraTile", {
					text: "Camera",
					icon: "sap-icon://add-photo",
					press: [this.onPictureButtonPress, this]
				}).addStyleClass("sapClientMQCTile sapMGT OneByOne sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd");
				this.setCameraTile(oCameraTile);
				this.oTileContainer.addContent(oCameraTile);
			}

			// File attachment tile
			if (!this._bHideNonImages) {
				var oImageAttachmentTile = new sap.m.ImageContent({
					src: "sap-icon://pdf-attachment"
				});
				var oTileContentAttachmentTile = new sap.m.TileContent();
				oTileContentAttachmentTile.setContent(oImageAttachmentTile);

				var oAttachment = new sap.m.GenericTile(this.getControlPrefixId() + "-attachment1", {
					header: "File",
					scope: GenericTileScope.Actions,
					press: function (evt) {
						if (evt.getParameter("action") === "Remove") {
							MessageToast.show("Remove action of attachment");
						} else {
							MessageToast.show("Attachment has been pressed.");
						}
					}.bind(this)
				}).addStyleClass("sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd");
				oAttachment.addTileContent(oTileContentAttachmentTile);
				this.addAttachment(oAttachment);
				this.oTileContainer.addContent(oAttachment);
			}

			// Image attachment tile
			if (!this._bHideImages) {

				var sPictureURL =
					"https://www.frasersproperty.com.au/-/media/frasers-property/retail/landing-site/our-difference/retail_our-difference-1_frasers-property--optimized.jpg";
				var sPictureFilename = "Image.jpg";

				var oLightBox = new sap.m.LightBox();
				var oLightBoxItem = new sap.m.LightBoxItem({
					imageSrc: sPictureURL,
					title: sPictureFilename
				});
				oLightBox.addImageContent(oLightBoxItem);

				var oThumbnailImage = new sap.m.Image({
					src: sPictureURL
				});
				oThumbnailImage.setDetailBox(oLightBox);
				//oThumbnailImage.addStyleClass("sapMGT OneByOne sapUiTinyMarginBottom sapUiTinyMarginEnd");

				var oTCAttachmentImageTile = new sap.m.TileContent();
				oTCAttachmentImageTile.setContent(oThumbnailImage);

				var oAttachmentImageTile = new sap.m.GenericTile(this.getControlPrefixId() + "-attachmentImage", {
					scope: GenericTileScope.Actions,
					header: sPictureFilename,
					//backgroundImage: sPictureURL,
					//press: [this._tilePressed, this]
				}).addStyleClass("sapUshellTile sapUiTinyMarginBottom sapUiTinyMarginEnd");
				oAttachmentImageTile.addTileContent(oTCAttachmentImageTile);
				this.addAttachment(oAttachmentImageTile);
				this.oTileContainer.addContent(oAttachmentImageTile);
			}

			// Test!!!
			this._oBtnGrabVideo = new sap.m.Button({
				text: "Grab Video",
				press: [this._grabVideo, this]
			});

			this._oBtnTakePhoto = new sap.m.Button({
				text: "Take photo",
				press: [this._takePhoto, this]
			});
		},

		_fnFileUploader_Change: function (oControlEvent) {
			var mParameters = oControlEvent.mParameters;
			if (mParameters && !mParameters.newValue) {
				// workaround for IE uploading duplicate files
				return;
			}

			if (this.isImageFileUploader(oControlEvent.oSource) && this.oImageResizer) {
				var oControlEventCopy = {
					mParameters: oControlEvent.mParameters,
					oSource: oControlEvent.oSource
				};

				var oFile = oControlEvent.mParameters.files[0];

				this.oImageResizer.resizeImageFile(oFile)
					.then(function (sResizedImageDataUri) {
						this._onImageResized(oControlEventCopy, sResizedImageDataUri);
					}.bind(this), function (oReason) {
						this._onFileChange(oControlEventCopy);
					}.bind(this));
			} else {
				this._onFileChange(oControlEvent);
			}

		},

		_fnFileUploader_UploadComplete: function (oControlEvent) {
			var primaryPath = this._primaryPath;
			
			this._closeUploadingDialog();

			if (!this._attachedECController) {
				this._attachedECController = this._getAttachedECController();
				if (!this._attachedECController) {
					return;
				}
			}

			var response = oControlEvent.mParameters.response || oControlEvent.mParameters.responseRaw;
			if (!response) {
				// Even cancel was uploading an empty file; so return if no response
				return;
			}

			response = unescape(decodeURI(response));
			response = response.replace(/[\r]/g, "");
			var items = response.split("\n");
			if (items.length === 3) {
				var id = items[0].split("=")[1];
				var fileName = items[1].split("=")[1];
				var fileSize = items[2].split("=")[1];

				var oDataContainer = this._attachedECController.getDataContainer();
				if (sap.ui.Device.os.ios) {
					var sGUID = sap.client.util.Util.createGuid();
					var aFileParts = fileName.split('.');
					if (aFileParts.length < 2) { // not '.', not extension found
						fileName = fileName + "-" + sGUID;
					} else {
						var sFileExt = aFileParts.pop(); //extension without the dot
						var sFileName = aFileParts.pop(); //name without the dot
						fileName = sFileName + "-" + sGUID + "." + sFileExt;
					}
				}
				// TODO binding in list is not supported
				oDataContainer.setProperty(primaryPath + "/content", "id=" + id, this.getBindingContext());

				// The fileName and fileSize can be bound only if on the same BO instance we have a fileName and fileSize property.
				oDataContainer.setProperty(primaryPath + "/fileName", fileName, this.getBindingContext());
				oDataContainer.setProperty(primaryPath + "/fileSize", fileSize, this.getBindingContext());

				oDataContainer.checkUpdate(primaryPath + "/fileName.FormattedValue");
			}

			// Handle the onFileSelected Event if exist
			var oEventContext;

			if (oControlEvent && oControlEvent.getSource) {
				oEventContext = new sap.client.evt.EventContext(oControlEvent.getSource());
			}

			this._onFileSelected = this.___checkAndCreateEH(this._onFileSelected);
			var sEvent = this._onFileSelected;
			if (sEvent) {
				this._attachedECController.getEventProcessor().handleEvent(sEvent, oEventContext);
			}

		},

		_getAttachedECController: function () {
			if (this.oController && this.oController.getParentController() && this.oController.getParentController().getChildController(this._attach2EC)) {
				return this.oController.getParentController().getChildController(this._attach2EC);
			}
		},

		_isDebugMode: function () {
			var sSapUiDebug = window["sap-ui-debug"];
			return sap.client.getCurrentApplication().isDebugMode() || sSapUiDebug;
		},

		_getUserMedia: function (options, successCallback, failureCallback) {
			var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia;
			if (api) {
				return api.bind(navigator)(options, successCallback, failureCallback);
			}
		},

		_grabVideo: function () {
			if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
				!navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
				MessageToast.show("User Media API not supported.");
				return;
			}

			var constraints = {
				video: true
			};

			this._getUserMedia(constraints,
				function (stream) {
					var mediaControl = document.querySelector("video");
					if ("srcObject" in mediaControl) {
						mediaControl.srcObject = stream;
						mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
					} else if (navigator.mozGetUserMedia) {
						mediaControl.mozSrcObject = stream;
					}
					this._theStream = stream;
				}.bind(this),
				function (err) {
					MessageToast.show("Error: " + err);
				}.bind(this)
			).bind(this);
		},

		_takePhoto: function () {
			if (!("ImageCapture" in window)) {
				MessageToast.show("ImageCapture is not available");
				return;
			}

			if (!this._theStream) {
				MessageToast.show("Grab the video stream first!");
				return;
			}

			var theImageCapturer = new ImageCapture(this._theStream.getVideoTracks()[0]);

			var that = this;
			theImageCapturer.takePhoto()
				.then(function (blob) {
					var theImageTag = document.getElementById("imageTag");
					theImageTag.src = URL.createObjectURL(blob);

					var sFinalFileName = "test";
					that._uploadFile(blob, sFinalFileName).bind(that);
				})
				.catch(function (err) {
					MessageToast.show('Error: ' + err)
				});
		},

		_tilePressed: function (evt) {
			if (evt.getParameter("action") === "Remove") {
				MessageToast.show("Remove action of attachment");
			} else {
				MessageToast.show("Attachment has been pressed.");
			}
		},

		onBeforeRendering: function () {

			//var that = this;	

		},

		onAfterRendering: function () {

			//var that = this;	

		},

		_setupImageResize: function (sImageUploadSize) {
			if (sImageUploadSize && this._oRuntimeEnviroment.isRunningInContainer()) {
				switch (sImageUploadSize) {
				case "L":
					this._iCompressedWidthHeight = this.LARGE_WIDTH_HEIGHT;
					break;
				case "M":
					this._iCompressedWidthHeight = this.MEDIUM_WIDTH_HEIGHT;
					break;
				case "S":
					this._iCompressedWidthHeight = this.SMALL_WIDTH_HEIGHT;
					break;
				default:
					this._iCompressedWidthHeight = null;
				}
			}
		},

		_showUploadingDialog: function () {
			if (!this._oDialog) {
				this._oDialog = new sap.m.Dialog(this.getControlPrefixId() + "-dialog", {
					title: sap.client.m.Util.getLocaleText("UploadInProgress", "Uploading..."),
					// type: sap.m.DialogType.Message,
					content: new sap.m.Text(this.getControlPrefixId() + "-text", {
						text: sap.client.m.Util.getLocaleText("FileUploadingMsg", "Uploading file to server, please wait ...")
					})
				});
			}

			this._oDialog.open();
		},

		_closeUploadingDialog: function () {
			if (this._oDialog) {
				this._oDialog.close();
			}
		},

		_onImageResized: function (oControlEvent, sResizedImageDataUri, sFileName) {
			var sFinalFileName = sFileName;

			if (oControlEvent) {
				var oOriginalFile = oControlEvent.mParameters.files[0];

				if (oOriginalFile) {
					sFinalFileName = oOriginalFile.name;
				}
			}

			if (this._oApplication.isOfflineMode()) {
				var oImageBlob = this._dataUriToBlob(sResizedImageDataUri);
				this._uploadFile(oImageBlob, sFinalFileName);
			} else {
				this._uploadFile(sResizedImageDataUri, sFinalFileName);
			}

		},

		_dataUriToBlob: function (sDataUri) {
			var arr = sDataUri.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {
				type: mime
			});
		},

		_uploadFile: function (oFile, sFileName) {
			var oFileTransfer = new window.FileTransfer();
			if (this._oApplication.isOfflineMode()) {
				oFileTransfer = this.getOfflineFileTransfer();
			}

			var oRuntimeEnviroment = this._oRuntimeEnviroment;
			var isContainer = oRuntimeEnviroment.isRunningInContainer();

			var options = new window.FileUploadOptions();

			var sFinalFileName;

			if (sFileName) {
				sFinalFileName = sFileName;
			} else if (oFile.name) {
				sFinalFileName = oFile.name;
			} else {
				sFinalFileName = "file";
			}

			options.fileName = sFinalFileName;
			options.fileKey = "file";
			options.chunkedMode = false;

			if (typeof oFile === 'string' && oFile.match('image.*')) {
				options.mimeType = "image/png";
			} else if (typeof oFile === 'string' && oFile.match('data:.*')) {
				options.mimeType = oFile.split(";")[0].split(":")[1];
			} else {
				options.mimeType = oFile.type;
			}

			options.headers = {
				'Referer': window.location.href
			};

			this._showUploadingDialog();
			var url = this.getUploadURL();
			var success = this.onFileUploadSuccess.bind(this);
			var fail = this.onFileUploadFail.bind(this);
			oFileTransfer.upload(oFile, url, success, fail, options);
		},

		_onFileChange: function (oControlEvent) {
			var fileUploader;
			if (this._oApplication.isOfflineMode()) {
				fileUploader = this._oApplication.getFileTransfer();
				this._showUploadingDialog();

				var oFile = oControlEvent.mParameters.files[0];
				var options = {
					fileKey: "file",
					fileName: oFile.name,
					mimeType: oFile.type
				};

				var success = this.onFileUploadSuccess.bind(this);
				var fail = this.onFileUploadFail.bind(this);
				fileUploader.upload(oFile, null, success, fail, options);
			} else {
				fileUploader = oControlEvent.oSource;

				var url = this.getUploadURL();
				// now we set the Action URL and trigger the post
				fileUploader.setUploadUrl(url);

				var oImageProcessor = this.oController.getImageProcessor();
				if (oImageProcessor) {
					if (this.isImageFileUploader(fileUploader)) {
						oImageProcessor.openPreview(url, oControlEvent);
					} else {
						fileUploader.upload();
						oImageProcessor.closePreview(url, oControlEvent);
					}

				} else {
					this._showUploadingDialog();
					fileUploader.upload();
				}
			}
		},

		isImageFileUploader: function (fileUploader) {
			if (fileUploader && fileUploader.oFileUpload) {
				var oFile = fileUploader.oFileUpload.files[0];
				return this.isImageFile(oFile);
			}
			return false;
		},

		isImageFile: function (oFile) {
			if (oFile && oFile.type && oFile.type.match('image.*') ||
				(oFile && oFile.mimeType && oFile.mimeType.match('image.*'))) {
				return true;
			}
			return false;
		},

		getOfflineFileTransfer: function () {
			if (!this.oOfflineFileTransfer) {
				var FileTransfer = sap.ui.requireSync('sap/client/setup/offline/FileTransfer');
				var oOfflineAPI = this._oApplication.getOfflineAPI();
				this.oOfflineFileTransfer = new FileTransfer(oOfflineAPI);
			}

			return this.oOfflineFileTransfer;
		},

		setControlWidth: function (sWidth) {
			if (this.oControl.setWidth) {
				this.oControl.setWidth("100%"); // not needed in for responsive parent dialog box
			}
		},

		getUploadURL: function () {
			// first test to calculate the post action Url
			var n;
			var url = this._oApplication.getRepositoryUrl();
			if (url) {
				// insert the sessionID into the url
				n = url.indexOf("/sap/") + 4;
				if (n >= 0) {
					var sessionID = this.oController.getSession().getSessionID();
					url = url.substr(0, n) + "(" + sessionID + ")" + url.substr(n);
				}
			}
			if (url) {
				// append "/fileupload"
				n = url.lastIndexOf("/");
				if (n >= 0) {
					url = url.substr(0, n) + "/fileupload";
				}
			}
			return url;
		},

		uploadComplete: function (sFileId, sFileName, sFileSize) {
			//MessageToast.show("Upload complete : " + sFileName);
			if (!this._attachedECController) {
				this._attachedECController = this._getAttachedECController();
				if (!this._attachedECController) {
					return;
				}
			}

			var primaryPath = this._primaryPath;
			if (sFileId !== null && sFileName !== null && sFileSize !== null) {
				var oDataContainer = this._attachedECController.getDataContainer();
				oDataContainer.setProperty(primaryPath + "/content", "id=" + sFileId, this.getBindingContext());
				// The fileName and fileSize can be bound only if on the same BO instance we have a fileName and fileSize property.
				oDataContainer.setProperty(primaryPath + "/fileName", sFileName, this.getBindingContext());
				oDataContainer.setProperty(primaryPath + "/fileSize", sFileSize, this.getBindingContext());
				oDataContainer.checkUpdate(primaryPath + "/fileName.FormattedValue");

				// oFilePath is empty in Windows
				if (this.oFileUploader.oFilePath) {
					this.oFileUploader.oFilePath.setValue(sFileName);
				}

				//oDataContainer.setProperty('/Root/$System/EditMode', true);
				//oDataContainer.setProperty("/Root/$System/IsThingDirty", true);
			}

			// Handle the onFileSelected Event if exist
			var oEventContext;

			if (this.oFileUploader) {
				oEventContext = new sap.client.evt.EventContext(this.oFileUploader);
			}

			this._onFileSelected = this.___checkAndCreateEH(this._onFileSelected);
			var sEvent = this._onFileSelected;
			if (sEvent) {
				this._attachedECController.getEventProcessor().handleEvent(sEvent, oEventContext);
			}

			this.oFileUploader.setTooltip(sFileName);
		},

		onFileUploadSuccess: function (fileUploadResult) {
			var fileId = null;
			var fileName = null;
			var fileSize = null;
			var response = unescape(decodeURI(fileUploadResult.response));
			response = response.replace(/[\r]/g, "");
			var items = response.split("\n");
			if (items.length === 3) {
				fileId = items[0].split("=")[1];
				fileName = items[1].split("=")[1];
				fileSize = items[2].split("=")[1];
			}
			this._closeUploadingDialog();
			this.uploadComplete(fileId, fileName, fileSize);
		},

		onFileUploadFail: function (fileTransferError) {
			this._closeUploadingDialog();
			var message;
			if (fileTransferError.exception) {
				message = fileTransferError.exception;
			} else {
				message = fileTransferError.message;
			}

			this._resetUploader();

			sap.m.MessageToast.show(sap.client.m.Util.getLocaleText("FileUploadFailMsg", "Unable to upload file. ") + " " + message);
			jQuery.sap.log.info("onFileUploadFail exception " + message);
		},

		onTakePictureSuccess: function (sImagePath) {
			if (this.oImageResizer) {
				var fOnImageResized = function (sResizedImageDataUri) {
					var sFileName;
					if (sImagePath.startsWith("/")) {
						sFileName = "image-" + new Date().getTime() + ".jpg";
					} else {
						sFileName = sImagePath.replace(/^.*[\\\/]/, '');
					}
					this._onImageResized(null, sResizedImageDataUri, sFileName);
				};

				var fOnImageResizedError = function (oError) {
					sap.m.MessageToast.show(sap.client.m.Util.getLocaleText("FileUploadFailMsg", "Unable to upload file. ") + " " + sap.client.m.Util
						.getLocaleText("FileUploadImageResizeFailMsg", "Failed to resize image"));
				};
				if (this._oApplication.isOfflineMode() && window.FilePicker) {
					var sImageDataUri = "data:image/jpeg;base64," + sImagePath;
					this.oImageResizer.resizeImage(sImageDataUri).then(fOnImageResized.bind(this), fOnImageResizedError);
				} else {
					this.oImageResizer.resizeImagePath(sImagePath).then(fOnImageResized.bind(this), fOnImageResizedError);
				}

			} else {
				var ft = this._oApplication.getFileTransfer();

				var options = new window.FileUploadOptions();
				var filePath;
				if (sImagePath.startsWith("/")) {
					options.content = sImagePath;
					options.fileName = new Date().getTime() + ".jpg";
					filePath = options.fileName;
				} else {
					options.fileName = sImagePath.replace(/^.*[\\\/]/, ''); // We will use the name auto-generated by Node at the server side.
					filePath = sImagePath;
				}

				options.fileKey = "file";
				options.mimeType = "image/jpeg";
				options.chunkedMode = false;
				options.headers = {
					'Referer': window.location.href
				};

				this._showUploadingDialog();
				var url = this.getUploadURL();
				var success = this.onFileUploadSuccess.bind(this);
				var fail = this.onFileUploadFail.bind(this);
				ft.upload(filePath, url, success, fail, options);
			}
		},

		onTakePictureFail: function (error) {
			jQuery.sap.log.info("onTakePictureFail for error " + error);
		},

		onPictureButtonPress: function (oControlEvent) {
			if (navigator.camera) {
				var destinationType = navigator.camera.DestinationType.FILE_URI;
				var quality = 45;
				if (this._oApplication.isOfflineMode() && window.FilePicker) {
					quality = 10;
					destinationType = navigator.camera.DestinationType.DATA_URL;
				}

				var options = {
					quality: quality,
					targetWidth: 1024,
					targetHeight: 768,
					saveToPhotoAlbum: false,
					destinationType: destinationType
				};
				navigator.camera.getPicture(this.onTakePictureSuccess.bind(this), this.onTakePictureFail.bind(this), options);
			} else if (this._isDebugMode()) {
				//workaround for desktop for testing
				this._showCameraDesktop = true;
				this.invalidate();
			}
		},

		_resetUploader: function () {
			if (!this._attachedECController) {
				this._attachedECController = this._getAttachedECController();
				if (!this._attachedECController) {
					return;
				}
			}

			var primaryPath = this._primaryPath;
			var oDataContainer = this._attachedECController.getDataContainer();
			oDataContainer.setProperty(primaryPath + "/content", null, this.getBindingContext());
			oDataContainer.setProperty(primaryPath + "/fileName", null, this.getBindingContext());
			oDataContainer.setProperty(primaryPath + "/fileSize", null, this.getBindingContext());

			// oFilePath is empty in Windows
			if (this.oFileUploader.oFilePath) {
				this.oFileUploader.oFilePath.setValue("");
			}

			oDataContainer.setProperty('/Root/$System/EditMode', false);
			oDataContainer.setProperty("/Root/$System/IsThingDirty", false);
		},

		___checkAndCreateEH: function (sEvent) {
			// I solemnly swear that I am up to no good
			//
			// Here we're doing a very-very dirty thing:
			// We're hooking up into Standard Component and creating Event Handler there on the fly
			//
			// The purpose is: standard event handler AddFileMDSubmit in COD_Documentlist tries to close a window as a second step
			// once the attachment is created. It's fine in COD_Documentlist, because there is a separate ModalDialog with Add and
			// Camera buttons. However, it's bad for this pane, because this "Close" window event tries to close actual QC or whatever
			// we have this component embedded into.
			//
			// Approach: 
			// 1. Find the corresponding requested standard event handler sEvent in the attached standard EC.
			// 2. Take its operations and check if WindowAction-Close exists there
			// 3. If such operation exists, create a copy of the event handler (prefixed with "ZCEH_" - stands for Z-Custom-Event-Handler)
			// and remove this unwanted operation from its operations
			// 4. If such opearion doesn't exst, use the standard requested event handler
			//

			var sPrefixEH = "ZCEH";
			var sNewEvent = sEvent;

			if (sEvent.length == 0 || sEvent.lastIndexOf(sPrefixEH, 0) == 0) {
				// empty or already done (e.g. begins with sPrefixEH constant)
				return sNewEvent;
			}

			if (!this._attachedECController) {
				this._attachedECController = this._getAttachedECController();
				if (!this._attachedECController) {
					return sNewEvent;
				}
			}

			this._attachedECController.getComponentModel().getEventHandlers(); // just in case event handlers have not been read yet (it will populate _mEventHandlers during this call)
			var evtHandler = this._attachedECController.getComponentModel().getEventHandler(sEvent);
			if (evtHandler) {
				var indClose = evtHandler._c.findIndex(function (element) {
					return element._n == "WindowAction" && element._a.action == "Close";
				});

				if (indClose == -1) {
					// no WindowAction-Close opeartion in the standard event handler
				} else {
					// there is WindowAction-Close operation; let's dive

					var evtHandlerNew = JSON.parse(JSON.stringify(evtHandler)); // making a copy

					evtHandlerNew._a.id = evtHandler._a.id.substring(0, evtHandler._a.id.length - 4) + sPrefixEH; // "generate" new id
					evtHandlerNew._c.splice(indClose, 1); //removing WindowAction-Close

					// add new event handler
					sNewEvent = sPrefixEH + "_" + sEvent;
					this._attachedECController.getComponentModel()._mEventHandlers[sNewEvent] = evtHandlerNew;
				}
			}

			return sNewEvent;
		}
	});

	return ZAttachmentsPane;

}, true);