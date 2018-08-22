/*!
 * ${copyright}
 */
/* globals zcustom */
/**
 * Initialization code and shared classes of library zcustom.c4c.ui5lib
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/library"
], function(jQuery, library) {
	"use strict";


	/**
	 * A library containing mobile controls
	 *
	 * @namespace
	 * @name zcustom.demo.ui5lib
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "zcustom.demo.ui5lib",
		dependencies : ["sap.ui.core", "sap.m" , "sap.ui.unified"],
		types: [],
		interfaces: [],
		controls: [
			// own custom controls and panes:
			"zcustom.demo.ui5lib.control.ZEstablishmentLookup",
			"zcustom.demo.ui5lib.control.ZAttachmentsPane",
			// extensions of standard controls:
			"zcustom.demo.ui5lib.ext.ZThumbnailTile",
			"zcustom.demo.ui5lib.ext.ZThumbnailTileRenderer",
			"zcustom.demo.ui5lib.ext.ZThumbnailTileContent",
			"zcustom.demo.ui5lib.ext.ZThumbnailTileContentRenderer"
		],
		elements: [],
		version: "0.1.0"
	});

	return zcustom.demo.ui5lib;

});
