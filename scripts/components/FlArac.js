/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const Image = require('sf-core/ui/image');
const Http = require("sf-core/net/http");
const FlAracDesign = require('library/FlArac');

const FlArac = extend(FlAracDesign)(
	//constructor
	function(_super, props, pageName) {
		// initalizes super class for this scope
		_super(this, props || FlAracDesign.defaults);
		const flArac = this;
		this.pageName = pageName;
		Object.defineProperties(this, {
			plaka: {
				get: function() {
					return this.lblPlaka.text;
				},
				set: function(value) {
					return this.lblPlaka.text = value;
				},
				configurable: true,
				enumerable: true
			},
			model: {
				get: function() {
					return this.lblModel.text;
				},
				set: function(value) {
					return this.lblModel.text = value;
				},
				configurable: true,
				enumerable: true
			},
			resim: {
				get: function() {
					return this.imgAraba.image;
				},
				set: function(value) {
					if (typeof value === "string") {
						Http.request({
								'url': value,
								'method': 'GET',
							},
							function(response) {
								//console.log("image loaded");
								flArac.imgAraba.image = Image.createFromBlob(response.body);
							},
							function(e) {
								// Handle error like:
								if (e.statusCode === 500) {
									console.log("Internal Server Error Occurred.");
								}
								else {
									console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
								}
							}
						);
					}
				},
				configurable: true,
				enumerable: true
			}
		});
	}

);

module && (module.exports = FlArac);
