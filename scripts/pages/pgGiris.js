/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgGirisDesign = require('ui/ui_pgGiris');
const KeyboardType = require('sf-core/ui/keyboardtype');
const ActionKeyType = require('sf-core/ui/actionkeytype');
const Color = require('sf-core/ui/color');
const inactiveColor = Color.create("#ECF0F1");
const activeColor = Color.create("#FFCC33");
const Application = require("sf-core/application");
const Router = require("sf-core/ui/router");

const PgGiris = extend(PgGirisDesign)(
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

	const page = this;

	const tbTelefon = page.tbTelefon;
	tbTelefon.requestFocus();

}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;

	const tbTelefon = page.tbTelefon;
	const btnGiris = page.btnGiris;

	tbTelefon.keyboardType = KeyboardType.PHONE;
	tbTelefon.actionKeyType = ActionKeyType.SEND;
	tbTelefon.onActionButtonPress = nextPage.bind(page);
	tbTelefon.android.elevation = 0;
	tbTelefon.onTextChanged = function(e) {
		var text = tbTelefon.text;
		if (typeof e === "string") {
			text += e;
			if (e === "")
				text = text.substr(0, text.length - 1);
		}
		btnGiris.enabled = text.length >= 10;
	};
	btnGiris.onPress = nextPage.bind(page);
	btnGiris.backgroundColor = {
		normal: activeColor,
		disabled: inactiveColor
	};
	btnGiris.enabled = tbTelefon.text.length >= 10;

	page.android.onBackButtonPressed = function() {
		Application.exit();
	};

}

function nextPage() {
	const page = this;
	const tbTelefon = page.tbTelefon;
	const btnGiris = page.btnGiris;

	if (!btnGiris.enabled)
		return;

	tbTelefon.removeFocus();
	Router.go("pgSMS", {
		telefon: tbTelefon.text
	});

}


module && (module.exports = PgGiris);
