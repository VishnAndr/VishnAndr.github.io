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
	 * A library containing mobile controls
	 *
	 * @namespace
	 * @name zcustom.frasers.ui5lib
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "zcustom.frasers.ui5lib",
		dependencies : [], //["sap.ui.core", "sap.m" , "sap.ui.unified"],
		types: [],
		interfaces: [],
		controls: [
			"zcustom.frasers.ui5lib.control.ZPoCCustomPane",
			"zcustom.frasers.ui5lib.control.ZFeederEnhancementPane"
		],
		elements: [],
		version: "0.1.0",
		noLibraryCSS: true
	});

	return zcustom.frasers.ui5lib;

});
