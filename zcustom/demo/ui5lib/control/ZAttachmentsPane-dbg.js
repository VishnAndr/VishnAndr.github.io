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
				"BrowseButton" : { 
					type : "sap.m.GenericTile", 
					multiple : false,
					visibility : "hidden"
				},	
				"CameraButton" : {
					type : "sap.m.GenericTile", 
					multiple : false,
					visibility : "hidden"
				},
				"Attachments" : { 
					type : "sap.m.GenericTile", 
					multiple : true,
					singularName : "Attachment",
					visibility : "hidden"
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
			
			var oBrowseButton = new sap.m.GenericTile(this.getControlID() + "-browseButton", {
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
			
			var oCameraButton = new sap.m.GenericTile(this.getControlID() + "-cameraButton", {
				backgroundImage : "sap-icon://add-photo",
				press : function (evt) {
					this.onPictureButtonPress();
				}.bind(this)
			});
			this.setCameraButton(oCameraButton);
			
			var oAttachment = new sap.m.GenericTile(this.getControlID() , {
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
			
		}
	});

	return ZAttachmentsPane;

}, true);