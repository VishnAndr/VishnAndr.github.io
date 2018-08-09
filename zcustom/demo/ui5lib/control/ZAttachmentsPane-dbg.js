sap.ui.define([
	"sap/client/basecontrols/core/CustomPane",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/GenericTile",
	"sap/m/GenericTileScope"
], function(CustomPane, MessageToast, MessageBox, GenericTile, GenericTileScope) {
	"use strict";

	// Provides control zcustom.sandbox.ui5lib.control.ZCustomEmptyPane
	var ZAttachmentsPane = CustomPane.extend("zcustom.sandbox.ui5lib.control.ZAttachmentsPane", /** @lends zcustom.sandbox.ui5lib.control.ZCustomEmptyPane.prototype */ {
		metadata: {

			library: "zcustom.demo.ui5lib",
			properties: {
			},
			aggregations: {
				"browseButton" : { 
					type : "sap.m.GenericTile", 
					multiple : false
				},	
				"cameraButton" : {
					type : "sap.m.GenericTile", 
					multiple : false
				},
				"attachments" : { 
					type : "sap.m.GenericTile", 
					multiple : true,
					singularName : "attachment"
				}
			},
			events: {
			}
		},

		renderer: function(oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.addClass("zAttachments");
            oRM.writeClasses();
            oRM.write(">");
			
			oRM.renderControl(oControl.getBrowseButton());
			oRM.renderControl(oControl.getCameraButton());
			
			$.each(oControl.getAttachments(),function(key,value){
				oRM.renderControl(value);
			});
			
			oRM.write("</div>");
		},

		initializePane: function() {

			//var that = this;
			
			var oBrowseButton = new sap.m.GenericTile(this.getControlPrefixId() + "-browseButton", {
				backgroundImage : sap.ui.core.IconPool.getIconURI('open-folder'),
				press : function() {
					// use the file picker plugin
					window.FilePicker.pickOne(function(oFile) {
						var sDataUri = "data:" + oFile.mimeType + ";base64," + oFile.content;
						
						//this._uploadFile(sDataUri, oFile.name);
						MessageToast.show("File picked: \"" + oFile.name);		
						});
					}
				});
			this.setBrowseButton(oBrowseButton);
			
			var oCameraButton = new sap.m.GenericTile(this.getControlPrefixId() + "-cameraButton", {
				backgroundImage : "sap-icon://add-photo",
				press : function (evt) {
					this.onCameraButtonPress();
				}.bind(this)
			});
			this.setCameraButton(oCameraButton);
			
			var oAttachment = new sap.m.GenericTile(this.getControlPrefixId() + "-attachment1" , {
				backgroundImage : "sap-icon://pdf-attachment",
				scope : GenericTileScope.Actions,
				press : function (evt) {
					if (evt.getParameter("action") === "Remove") {
						MessageToast.show("Remove action of attachment");
					} else {
						MessageToast.show("Attachment has been pressed.");
					}
				}.bind(this)
			});
			this.addAttachment(oAttachment);

		},
		
		onBeforeRendering: function() {
			
			//var that = this;	
			
		},
		
		onAfterRendering: function() {
			
			//var that = this;	
			
		},
		
		onCameraButtonPress: function () {
			var destinationType = sap.ui.Device.camera.DestinationType.FILE_URI;
			var quality = 45;
			if (this._oApplication.isOfflineMode() && window.FilePicker) {
				quality = 10;
				destinationType = sap.ui.Device.camera.DestinationType.DATA_URL;
			}
			
			var options = {
				quality: quality,
				targetWidth: 1024,
				targetHeight: 768,
				saveToPhotoAlbum: false,
				destinationType: destinationType
			};
			sap.ui.Device.camera.getPicture(this.onTakePictureSuccess.bind(this), this.onTakePictureFail.bind(this), options);
			
		},
		
		onTakePictureSuccess: function(sImagePath) {
			sap.m.MessageToast.show("Picture taken");

/*			if (this.oImageResizer) {
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
			}*/
		},

		onTakePictureFail: function(error) {
			jQuery.sap.log.info("onTakePictureFail for error " + error);
		}
	});

	return ZAttachmentsPane;

}, true);