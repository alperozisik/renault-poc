const extend = require('js-base/core/extend');
const PgIslemlerDesign = require('ui/ui_pgIslemler');
const Color = require('sf-core/ui/color');
const View = require('sf-core/ui/view');
const gradient = Color.createGradient({
	direction: Color.GradientDirection.VERTICAL,
	startColor: Color.create(32, 0, 0, 0),
	endColor: Color.create(0, 0, 0, 0)
});

const PgIslemler = extend(PgIslemlerDesign)(
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
	const page = this;
	superOnLoad();
	var flexLayout7 = page.flexLayout7;

	//insertShadow(flexLayout7);
}

function insertShadow(target) {
	var shadowView = new View({
		height: 7,
		backgroundColor: gradient
	});
	target.addChild(shadowView);
}

module && (module.exports = PgIslemler);
