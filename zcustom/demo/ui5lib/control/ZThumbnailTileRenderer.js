sap.ui.define([
	"sap/m/library",
	"jquery.sap.global",
	"sap/m/GenericTileRenderer",
	"sap/ui/core/Renderer"
], function (library, jQuery, GenericTileRenderer, Renderer) {
	"use strict";

	// shortcut for sap.m.GenericTileMode
	var GenericTileMode = library.GenericTileMode;

	// shortcut for sap.m.GenericTileScope
	var GenericTileScope = library.GenericTileScope;

	// shortcut for sap.m.LoadState
	var LoadState = library.LoadState;

	var ZThumbnailTileRenderer = Renderer.extend(GenericTileRenderer);

	ZThumbnailTileRenderer.render = function (oRm, oControl) {
		// Write the HTML into the render manager.
		var sTooltipText = oControl._getTooltipText();
		var sAriaText = oControl._getAriaText();
		var sHeaderImage = oControl.getHeaderImage();
		var bHasPress = oControl.hasListeners("press");
		var sState = oControl.getState();
		var sScope = oControl.getScope();
		var sStateClass = jQuery.sap.encodeCSS("sapMGTState" + sState);
		var sScopeClass = jQuery.sap.encodeCSS("sapMGTScope" + sScope);

		oRm.write("<div");
		oRm.writeControlData(oControl);
		if (sTooltipText) {
			oRm.writeAttributeEscaped("title", sTooltipText);
		}
		oRm.addClass("sapMGT");
		oRm.addClass(sStateClass);
		oRm.addClass(sScopeClass);
		// render actions view for SlideTile actions scope
		if (sScope !== GenericTileScope.Actions && oControl._bShowActionsView) {
			oRm.addClass("sapMGTScopeActions");
		}
		oRm.addClass(oControl.getFrameType());
		if (bHasPress) {
			oRm.writeAttribute("role", "button");
		} else {
			oRm.writeAttribute("role", "presentation");
		}
		oRm.writeAttributeEscaped("aria-label", sAriaText);
		if (sState !== LoadState.Disabled) {
			oRm.addClass("sapMPointer");
			oRm.writeAttribute("tabindex", "0");
		}
		if (oControl.getBackgroundImage()) {
			oRm.write(" style='background-image:url(");
			oRm.writeEscaped(oControl.getBackgroundImage());
			oRm.write(");'");
			oRm.addClass("sapMGTBackgroundImage");
		}
		if (oControl.getMode() === GenericTileMode.HeaderMode) {
			oRm.addClass("sapMGTHeaderMode");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (oControl.getHeader()) { // chg: rendering header if it's given only
			oRm.write("<div");
			oRm.addClass("sapMGTHdrContent");
			oRm.addClass(oControl.getFrameType());
			if (sTooltipText) {
				oRm.writeAttributeEscaped("title", sTooltipText);
			}
			oRm.writeClasses();
			oRm.write(">");
			if (sHeaderImage) {
				oRm.renderControl(oControl._oImage);
			}

			this._super._renderHeader(oRm, oControl);

			if (oControl.getSubheader()) {
				this._super._renderSubheader(oRm, oControl);
			}
			oRm.write("</div>");
		} // end chg

		oRm.write("<div");
		oRm.addClass("sapMGTContent");
		oRm.writeClasses();
		oRm.writeAttribute("id", oControl.getId() + "-content");
		oRm.write(">");
		var aTileContent = oControl.getTileContent();
		var iLength = aTileContent.length;
		for (var i = 0; i < iLength; i++) {
			if (typeof aTileContent[i] === "sap.m.TileContent") { // chg: fotter is only for TileContent
				oControl._checkFooter(aTileContent[i], oControl);
			}
			oRm.renderControl(aTileContent[i]);
		}
		oRm.write("</div>");

		if (sState !== LoadState.Loaded) {
			this._super._renderStateOverlay(oRm, oControl, sTooltipText);
		}

		if (sState !== LoadState.Disabled) {
			this._super._renderHoverOverlay(oRm, oControl);
			this._super._renderFocusDiv(oRm, oControl);
		}

		if (sScope === GenericTileScope.Actions) {
			this._renderActionsScope(oRm, oControl); // chg: use own _renderActionsScope
		}
		oRm.write("</div>");
	};

	ZThumbnailTileRenderer._renderActionsScope = function (oRm, oControl) {
		if (oControl.getState() !== LoadState.Disabled) {
			oRm.renderControl(oControl._oRemoveButton);
			//oRm.renderControl(oControl._oMoreIcon); // chg: we don't need 3 dots
		}
	};

	return ZThumbnailTileRenderer;

}, /* bExport= */ true);