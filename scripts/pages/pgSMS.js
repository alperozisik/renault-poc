/* globals SF */
const Image = require('sf-core/ui/image');
const extend = require('js-base/core/extend');
const PgSMSDesign = require('ui/ui_pgSMS');
const Router = require("sf-core/ui/router");
const KeyboardType = require('sf-core/ui/keyboardtype');
const ActionKeyType = require('sf-core/ui/actionkeytype');
const System = require('sf-core/device/system');
const Color = require('sf-core/ui/color');
const inactiveColor = Color.create("#ECF0F1");
const activeColor = Color.create("#FFCC33");

const PgSMS = extend(PgSMSDesign)(
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
function onShow(superOnShow, data) {
	superOnShow();
	const page = this;
	const lblTelefon = page.lblTelefon;

	if (data) {
		if (data.telefon)
			lblTelefon.text = data.telefon;
	}

}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;
	const btnBack = page.btnBack;
	const flNumaraDegistir = page.flNumaraDegistir;
	const btnOnayla = page.btnOnayla;

	btnBack.backgroundImage = Image.createFromFile("images://geri.png");
	btnBack.android && (btnBack.android.elevation = 0);
	page.android.onBackButtonPressed = back;
	btnBack.onPress = back;
	flNumaraDegistir.onTouchEnded = back;
	const tbCode = page.tbCode;

	function focusTbCode() {
		tbCode.requestFocus();
	}

	page.flDigit1.onTouchEnded = focusTbCode;
	page.flDigit2.onTouchEnded = focusTbCode;
	page.flDigit3.onTouchEnded = focusTbCode;
	page.flDigit4.onTouchEnded = focusTbCode;


	tbCode.onTextChanged = function(e) {


		// console.log("e =" + JSON.stringify(e));
		// console.log("text = " + tbCode.text);
		var text = tbCode.text;

		if (typeof e === "string") {
			if (tbCode.text.length > 4)
				tbCode.text = tbCode.text.substr(0, 4);
			text = text.substr(0, 4) + e;
			if (e === "")
				text = text.substr(0, text.length - 1);

		}

		if (text.length > 4) {
			tbCode.text = text = text.substr(0, 4);
			if (System.OS === "Android") {

				tbCode.nativeObject.setSelection(4);
			}
			else {
				//var NSRange = __SF_NSRange;// SF.requireClass("NSRange");
				//var NSMakeRange = SF.requireClass("NSMakeRange");
				// var NSMakeRange = NSRange.NSMakeRange;
				//console.log(typeof NSRange);
				// console.log(typeof NSMakeRange);
				// tbCode.nativeObject.selectedRange = NSMakeRange(4, 0);
			}
		}


		setCodeContent(text, 1);
		setCodeContent(text, 2);
		setCodeContent(text, 3);
		setCodeContent(text, 4);

		btnOnayla.enabled = text.length === 4;
	};

	function setCodeContent(text, index) {
		var targetLabel = page["lblDigit" + index];
		var targetDot = page["flDigit" + index + "Dot"];
		if (text.length >= index) {
			targetLabel.visible = true;
			targetLabel.text = text[index - 1];
			targetDot.visible = false;
		}
		else {
			targetLabel.visible = false;
			targetDot.visible = true;
		}
	}

	tbCode.keyboardType = KeyboardType.NUMBER;
	tbCode.actionKeyType = ActionKeyType.GO;
	tbCode.onActionButtonPress = onayla.bind(page);

	for (var i = 1; i <= 4; i++) {
		page["lblDigit" + i].touchEnabled = false;
		page["flDigit" + i + "Dot"].touchEnabled = false;
	}

	btnOnayla.backgroundColor = {
		normal: activeColor,
		disabled: inactiveColor
	};
	btnOnayla.enabled = false;
	btnOnayla.onPress = onayla.bind(page);
}

function back() {
	Router.goBack();
}

function onayla() {
	const page = this;
	const tbCode = page.tbCode;
	const lblTitle = page.lblTitle;
	const lblHata = page.lblHata;

	var code = tbCode.text;

	if (code.length !== 4)
		return;

	var validCodes = ["1234", "0000"];

	if (validCodes.indexOf(code) === -1) { // invalid
		lblHata.visible = true;
		lblTitle.text = "SMS kodu hatalı!";
	}
	else {
		tbCode.removeFocus();
		Router.go("pgDashboard");
	}
}


module && (module.exports = PgSMS);
