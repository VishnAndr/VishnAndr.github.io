/*!
 * ${copyright}
 */
/* globals zcustom */
/**
 * Initialization code and shared classes of library zcustom.sandbox.ui5lib
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
	 * @name zcustom.frasers.docuplace
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "zcustom.frasers.docuplace",
		dependencies : ["sap.ui.core", "sap.m" , "sap.ui.unified"],
		types: [],
		interfaces: [],
		controls: [
			"zcustom.frasers.docuplace.control.PlaceLocator"
		],
		elements: [],
		version: "0.1.0"
	});

	return zcustom.frasers.docuplace;

});
