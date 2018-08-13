sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/GenericTile",
	"sap/m/GenericTileScope",
	"sap/ui/unified/FileUploader",
	"sap/client/m/util/ImageResizer",
	"sap/client/m/create/QuickCreateTile",
	"sap/m/ScrollContainer"
], function (CustomPane, MessageToast, MessageBox, GenericTile, GenericTileScope, FileUploader, ImageResizer, QuickCreateTile, ScrollContainer) {
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
			/*
			oRM.renderControl(oControl.getBrowseTile());
			oRM.renderControl(oControl.getCameraTile());

			$.each(oControl.getAttachments(), function (key, value) {
				oRM.renderControl(value);
			});
*/
			oRM.renderControl(oControl.getTileContainer());
			oRM.write("</div>");
		},

		initializePane: function () {
			
			this.oTileContainer = new sap.m.ScrollContainer({
				class : "sapUiTinyMarginTop sapUiTinyMarginBegin"
			});
			this.setTileContainer(this.oTileContainer);

			var oBrowseTile = new sap.client.m.create.QuickCreateTile( this.getControlPrefixId() + "-browseTile", {
				text : "Browse",
				icon : "sap-icon://open-folder"
			}).addStyleClass("sapClientMQCTile sapMGT OneByOne");
			this.setBrowseTile(oBrowseTile);

			var oCameraTile = new sap.client.m.create.QuickCreateTile( this.getControlPrefixId() + "-cameraTile", {
				text : "Camer",
				icon : "sap-icon://add-photo",
				press : [this.onPictureButtonPress, this]
			}).addStyleClass("sapClientMQCTile sapMGT OneByOne");
			this.setCameraTile(oCameraTile);

			var oImageAttachmentTile = new sap.m.ImageContent({
						class: "sapUiMediumMarginBeginEnd sapUiMediumMarginTopBottom",
						src: "sap-icon://pdf-attachment"
					});
			var oTileContentAttachmentTile = new sap.m.TileContent();
			oTileContentAttachmentTile.setContent(oImageAttachmentTile);
			
			var oAttachment = new sap.m.GenericTile(this.getControlPrefixId() + "-attachment1", {
				header: "File",
				class: "sapUiTinyMarginBegin sapUiTinyMarginTop",
				scope: GenericTileScope.Actions,
				press: function (evt) {
					if (evt.getParameter("action") === "Remove") {
						MessageToast.show("Remove action of attachment");
					} else {
						MessageToast.show("Attachment has been pressed.");
					}
				}.bind(this)				
			});
			oAttachment.addTileContent(oTileContentAttachmentTile);
			this.addAttachment(oAttachment);
			
			var oImageAttachment2Tile = new sap.m.ImageContent({
						class: "sapUiTinyMarginBeginEnd sapUiTinyMarginTopBottom",
						src: "https://www.frasersproperty.com.au/-/media/frasers-property/retail/landing-site/our-difference/retail_our-difference-1_frasers-property--optimized.jpg"
					});
			var oTileContentAttachment2Tile = new sap.m.TileContent();
			oTileContentAttachment2Tile.setContent(oImageAttachment2Tile);
			
			var oAttachment2 = new sap.m.GenericTile(this.getControlPrefixId() + "-attachment2", {
				header: "File",
				class: "sapUiTinyMarginBegin sapUiTinyMarginTop",
				scope: GenericTileScope.Actions,
				press: function (evt) {
					if (evt.getParameter("action") === "Remove") {
						MessageToast.show("Remove action of attachment");
					} else {
						MessageToast.show("Attachment has been pressed.");
					}
				}.bind(this)				
			});
			oAttachment2.addTileContent(oTileContentAttachment2Tile);
			this.addAttachment(oAttachment2);
			
			this.oTileContainer.addContent(oBrowseTile);
			this.oTileContainer.addContent(oCameraTile);
			this.oTileContainer.addContent(oAttachment);
			this.oTileContainer.addContent(oAttachment2);

		},

		onBeforeRendering: function () {

			//var that = this;	

		},

		onAfterRendering: function () {

			//var that = this;	

		},


		_setupImageResize: function(sImageUploadSize) {
			if (sImageUploadSize && this.oController.getRuntimeEnvironment().isRunningInContainer()) {
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

		_showUploadingDialog: function() {
			if (!this._oDialog) {
				this._oDialog = new sap.m.Dialog(this.getControlID() + "-dialog", {
					title: sap.client.m.Util.getLocaleText("UploadInProgress", "Uploading..."),
					// type: sap.m.DialogType.Message,
					content: new sap.m.Text(this.getControlID() + "-text", {
						text: sap.client.m.Util.getLocaleText("FileUploadingMsg", "Uploading file to server, please wait ...")
					})
				});
			}

			this._oDialog.open();

		},

		_closeUploadingDialog: function() {
			if (this._oDialog) {
				this._oDialog.close();
			}
		},

		_onImageResized: function(oControlEvent, sResizedImageDataUri, sFileName) {
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

		_dataUriToBlob: function(sDataUri) {
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

		_uploadFile: function(oFile, sFileName) {
			var oFileTransfer = new window.FileTransfer();
			if (this._oApplication.isOfflineMode()) {
				oFileTransfer = this.getOfflineFileTransfer();
			}

			var oRuntimeEnviroment = this.oController.getRuntimeEnvironment();
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

		_onFileChange: function(oControlEvent) {
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

		isImageFileUploader: function(fileUploader) {
			if (fileUploader && fileUploader.oFileUpload) {
				var oFile = fileUploader.oFileUpload.files[0];
				return this.isImageFile(oFile);
			}
			return false;
		},

		isImageFile: function(oFile) {
			if (oFile && oFile.type && oFile.type.match('image.*') ||
				(oFile && oFile.mimeType && oFile.mimeType.match('image.*'))) {
				return true;
			}
			return false;
		},

		getOfflineFileTransfer: function() {
			if (!this.oOfflineFileTransfer) {
				var FileTransfer = sap.ui.requireSync('sap/client/setup/offline/FileTransfer');
				var oOfflineAPI = this._oApplication.getOfflineAPI();
				this.oOfflineFileTransfer = new FileTransfer(oOfflineAPI);
			}

			return this.oOfflineFileTransfer;
		},

		setControlWidth: function(sWidth) {
			if (this.oControl.setWidth) {
				this.oControl.setWidth("100%"); // not needed in for responsive parent dialog box
			}
		},

		getUploadURL: function() {
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

		uploadComplete: function(sFileId, sFileName, sFileSize) {
/*			var primaryPath = sap.client.util.BindingUtil.getBindingInfo("Value", this.oNode, null, this.sParentBinding).path;
			if (sFileId !== null && sFileName !== null && sFileSize !== null) {
				var oDataContainer = this.oController.getDataContainer();
				oDataContainer.setProperty(primaryPath + "/content", "id=" + sFileId, this.getBindingContext());
				// The fileName and fileSize can be bound only if on the same BO instance we have a fileName and fileSize property.
				oDataContainer.setProperty(primaryPath + "/fileName", sFileName, this.getBindingContext());
				oDataContainer.setProperty(primaryPath + "/fileSize", sFileSize, this.getBindingContext());
				oDataContainer.checkUpdate(primaryPath + "/fileName.FormattedValue");

				// oFilePath is empty in Windows
				if (this.oFileUploader.oFilePath) {
					this.oFileUploader.oFilePath.setValue(sFileName);
				}

				oDataContainer.setProperty('/Root/$System/EditMode', true);
				oDataContainer.setProperty("/Root/$System/IsThingDirty", true);
			}

			// Handle the onFileSelected Event if exist
			var oEventContext;

			if (this.oFileUploader) {
				oEventContext = new sap.client.evt.EventContext(this.oFileUploader);
			}

			var sEvent = this.oNode._a.onFileSelected;
			if (sEvent) {
				this.oController.getEventProcessor().handleEvent(sEvent, oEventContext);
			}

			this.oFileUploader.setTooltip(sFileName);*/
		},

		onFileUploadSuccess: function(fileUploadResult) {
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

		onFileUploadFail: function(fileTransferError) {
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

		onTakePictureSuccess: function(sImagePath) {
			if (this.oImageResizer) {
				var fOnImageResized = function(sResizedImageDataUri) {
					var sFileName;
					if (sImagePath.startsWith("/")) {
						sFileName = "image-" + new Date().getTime() + ".jpg";
					} else {
						sFileName = sImagePath.replace(/^.*[\\\/]/, '');
					}
					this._onImageResized(null, sResizedImageDataUri, sFileName);
				};

				var fOnImageResizedError = function(oError) {
					sap.m.MessageToast.show(sap.client.m.Util.getLocaleText("FileUploadFailMsg", "Unable to upload file. ") + " " + sap.client.m.Util.getLocaleText("FileUploadImageResizeFailMsg", "Failed to resize image"));
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

		onTakePictureFail: function(error) {
			jQuery.sap.log.info("onTakePictureFail for error " + error);
		},

		onPictureButtonPress: function(oControlEvent) {
			var destinationType = sap.ui.Device.camera.DestinationType.FILE_URI;
			var quality = 45;
/*			if (this._oApplication.isOfflineMode() && window.FilePicker) {
				quality = 10;
				destinationType = sap.ui.Device.camera.DestinationType.DATA_URL;
			}*/

			var options = {
				quality: quality,
				targetWidth: 1024,
				targetHeight: 768,
				saveToPhotoAlbum: false,
				destinationType: destinationType
			};
			sap.ui.Device.camera.getPicture(this.onTakePictureSuccess.bind(this), this.onTakePictureFail.bind(this), options);
		},

		_resetUploader: function() {
/*			var primaryPath = sap.client.util.BindingUtil.getBindingInfo("Value", this.oNode, null, this.sParentBinding).path;
			var oDataContainer = this.oController.getDataContainer();
			oDataContainer.setProperty(primaryPath + "/content", null, this.getBindingContext());
			oDataContainer.setProperty(primaryPath + "/fileName", null, this.getBindingContext());
			oDataContainer.setProperty(primaryPath + "/fileSize", null, this.getBindingContext());

			// oFilePath is empty in Windows
			if (this.oFileUploader.oFilePath) {
				this.oFileUploader.oFilePath.setValue("");
			}

			oDataContainer.setProperty('/Root/$System/EditMode', false);
			oDataContainer.setProperty("/Root/$System/IsThingDirty", false);*/
		}
	});

	return ZAttachmentsPane;

}, true);