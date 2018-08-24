/*!
 * ${copyright}
 */
/* globals zcustom */
/**
 * Initialization code and shared classes of library zcustom.frasers.ui5lib
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/library"
], function(jQuery, library) {
	"use strict";


	/**
	 * A library containing C4C extenstion controls and panes
	 *
	 * @namespace
	 * @name zcustom.frasers.ui5lib
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "zcustom.frasers.ui5lib",
		dependencies : [],
		types: [],
		interfaces: [],
		controls: [
			"zcustom.frasers.ui5lib.control.ZPoCCustomPane",
			"zcustom.frasers.ui5lib.control.ZFeederEnhancementPane",
			"zcustom.frasers.ui5lib.control.ZAttachmentsPane",
			// extensions of standard controls:
			"zcustom.frasers.ui5lib.ext.ZThumbnailTile",
			"zcustom.frasers.ui5lib.ext.ZThumbnailTileRenderer",
			"zcustom.frasers.ui5lib.ext.ZThumbnailTileContent",
			"zcustom.frasers.ui5lib.ext.ZThumbnailTileContentRenderer",
			"zcustom.frasers.ui5lib.ext.ZImage"			
		],
		elements: [],
		noLibraryCSS: true,
		version: "1.1.0"
	});

	return zcustom.frasers.ui5lib;

});
