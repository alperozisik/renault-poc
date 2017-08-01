/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgDetaylarDesign = require('ui/ui_pgDetaylar');

const PgDetaylar = extend(PgDetaylarDesign)(
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
	global.aracVerisiChanged();
}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;

	global.aracVerisiChanged = loadAracVerisi.bind(page);
	
}


function loadAracVerisi() {
	if (!global.aracVerisi)
		return;
	const page = this;
	page.lblPlaka.text  = global.aracVerisi.fields.PlateNo;
	page.lblAracModeli.text =  global.aracVerisi.fields.Detail;
	page.lblVites.text = global.aracVerisi.fields.Gear;
	page.lblMotor.text = [global.aracVerisi.fields.Engine, global.aracVerisi.fields.FuelType].join(", ");
	page.lblTrafikTescilTarihi.text = global.aracVerisi.fields.RegDate;
}

module && (module.exports = PgDetaylar);
