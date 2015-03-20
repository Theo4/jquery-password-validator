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
