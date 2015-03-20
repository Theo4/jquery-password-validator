/*
 *  jquery-password-validator - v0.0.1
 *  Plugin for live validation of password requirements
 *  http://github.com/IoraHealth/jquery-password-validator
 *
 *  Made by Myke Cameron
 *  Under MIT License
 */
this["JST"] = this["JST"] || {};

this["JST"]["container"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jq-password-validation">\n\t<div class="jq-password-validation__heading">Your password must:</div>\n</div>\n';

}
return __p
};

this["JST"]["input_wrapper"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jq-password-validation__outer-wrapper"><div class="jq-password-validation__input-wrapper">\n';

}
return __p
};

this["JST"]["length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jq-password-validation__rule--valid length">\n\tBe at least <span class="jq-password-validation__rule__emphasis">' +
((__t = ( length )) == null ? '' : __t) +
' characters</span>\n</div>\n\n';

}
return __p
};

this["JST"]["row"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="jq-password-validation__rule--invalid ' +
((__t = ( ruleName )) == null ? '' : __t) +
'">\n\t' +
((__t = ( preface )) == null ? '' : __t) +
' <span class="jq-password-validation__rule__emphasis"> ' +
((__t = ( message )) == null ? '' : __t) +
'</span>\n</div>\n';

}
return __p
};
;(function ( $, window, document, undefined ) {

	"use strict";

		// Plugin setup
		var pluginName = "passwordValidator",
				defaults = {
				length: 12,
				require: ["length", "lower", "upper", "digit"]
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		// Actual plugin code follows:

		// Regular expressions used for validation
		var validators = {
				upper: {
						validate: function ( password ) {
								return password.match(/[A-Z]/) != null;
						},
						message: "capital letter"
				},
				lower: {
						validate: function ( password ) {
								return password.match(/[a-z]/) != null;
						},
						message: "lower case letter"
				},
				digit: {
						validate: function ( password ) {
								return password.match(/\d/) != null;
						},
						message: "number"
				},
				length: {
						validate: function ( password, settings ) {
								return password.length >= settings.length;
						},
						message: function ( settings ) {
								return settings.length + " characters";
						},
						preface: "Be at least"
				}
		};

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {
				init: function () {
						this.wrapInput( this.element );
						this.inputWrapper.append( this.buildUi() );
						this.bindBehavior();
				},

				wrapInput: function ( input ) {
						$(input).wrap( JST.input_wrapper() );
						this.inputWrapper = $( ".jq-password-validation__outer-wrapper" );
						return this.inputWrapper;
				},

				buildUi: function () {
						var ui = $( JST.container() );
						var _this = this;

						_.each(this.settings.require, function ( requirement ) {
								var message;
								if ( validators[requirement].message instanceof Function ) {
										message = validators[requirement].message( _this.settings );
								} else {
										message = validators[requirement].message;
								}

								var preface = validators[requirement].preface || "Contain a";

								var ruleMarkup = JST.row({
									ruleName: requirement,
									message: message,
									preface: preface
								});

								ui.append( $( ruleMarkup ) );
						});

						this.ui = ui;
						ui.hide();
						return ui;
				},

				bindBehavior: function () {
						var _this = this;
						$( this.element ).on( "focus", function () {
								_this.validate();
								_this.showUi();
						} );
						$( this.element ).on( "blur", function () {
								_this.hideUi();
						} );
						$( this.element ).on( "keyup", function () {
							_this.validate();
						} );
				},

				showUi: function () {
						this.ui.show();
						$( this.element ).parent().addClass("jq-password-validation__input-wrapper--active");
				},

				hideUi: function () {
						this.ui.hide();
						$( this.element ).parent().removeClass("jq-password-validation__input-wrapper--active");
				},

				validate: function () {
						var currentPassword = $(this.element).val();
						var _this = this;
						_.each( this.settings.require, function ( requirement) {
								if ( validators[requirement].validate(currentPassword, _this.settings ) ) {
									_this.markRuleValid(requirement);
								} else {
									_this.markRuleInvalid(requirement);
								}
						});
				},

				markRuleValid: function (ruleName) {
					var row = this.ui.find("." + ruleName);
					row.addClass( "jq-password-validation__rule--valid" );
					row.removeClass( "jq-password-validation__rule--invalid" );
				},

				markRuleInvalid: function (ruleName) {
					var row = this.ui.find("." + ruleName);
					row.removeClass( "jq-password-validation__rule--valid" );
					row.addClass( "jq-password-validation__rule--invalid" );
				}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
