/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgBelgelerDesign = require('ui/ui_pgBelgeler');
const Http = require("sf-core/net/http");
const http = new Http();
const Image = require('sf-core/ui/image');

const PgBelgeler = extend(PgBelgelerDesign)(
	// Constructor
	function(_super) {
		// Initalizes super class for this page scope
		_super(this);
		// overrides super.onShow method
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		// overrides super.onLoad method
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

	});

// Page.onShow -> This event is called when a page appears on the screen (everytime).
function onShow(superOnShow) {
	superOnShow();

}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;
	global.imgRuhsatChanged = loadImage.bind(page);
	global.imgRuhsatChanged();
}

function loadImage() {
	if (!global.imgRuhsat)
		return;
	const page = this;
	var imgRuhsat = page.imgRuhsat;

	http.request({
		'url': global.imgRuhsat,
		'method': 'GET',
		onLoad: function(response) {
			//console.log("image loaded");
			imgRuhsat.image = Image.createFromBlob(response.body);
		},
		onError: function(e) {
			// Handle error like:
			if (e.statusCode === 500) {
				console.log("Internal Server Error Occurred.");
			}
			else {
				console.log("Server responsed with: " + e.statusCode + ". Message is: " + e.message);
			}
		}
	});
}

module && (module.exports = PgBelgeler);
