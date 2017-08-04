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
const Animator = require('sf-core/ui/animator');
const Screen = require('sf-core/device/screen');

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
	page.tbCode.requestFocus();
}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;
	const flNumaraDegistir = page.flNumaraDegistir;
	const btnOnayla = page.btnOnayla;

	page.android.onBackButtonPressed = back;
	page.flBack.onTouchEnded = back;
	flNumaraDegistir.onTouchEnded = back;
	page.lblTelefon.width = System.OS === "iOS" ? 87 : 100;
	page.lblNumara.htmlText = '<p><u>Numaran&#305;z&#305; de&#287;i&#351;tirin</u></p>';
	page.lblNumara.ios.scrollEnabled = false;
	const tbCode = page.tbCode;

	function focusTbCode() {
		tbCode.requestFocus();
		if (System.OS === "Android" && tbCode.text.length > 0) {
			var pos = tbCode.text.length;
			tbCode.nativeObject.setSelection(pos);
		}
	}

	page.flDigit1.onTouchEnded = focusTbCode;
	page.flDigit2.onTouchEnded = focusTbCode;
	page.flDigit3.onTouchEnded = focusTbCode;
	page.flDigit4.onTouchEnded = focusTbCode;


	tbCode.onTextChanged = function(e) {
		if (page.animating)
			return;
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
		if (text.length === 4)
			onayla.call(page);
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
	const flPin = page.flPin;
	const btnOnayla = page.btnOnayla;

	var code = tbCode.text;

	if (code.length !== 4)
		return;

	var validCodes = ["1234", "0000"];

	if (validCodes.indexOf(code) === -1) { // invalid
		page.animating = true;
		lblHata.visible = true;
		lblTitle.text = "SMS kodu hatalı!";
		System.vibrate();
		var bounces = 6;
		var totalDuration = 400;
		var counter = 5;
		var delay = totalDuration / (((bounces + 1) * bounces) / 2);
		var originalMarginLeft = flPin.marginLeft;
		var originalMarginRight = flPin.marginRight;
		btnOnayla.touchEnabled = false;
		Animator.animate(page.layout, delay, function() {
			flPin.marginLeft = (Screen.width) / counter++;
			flPin.marginRight = 0;
		}).then(delay * 2, function() {
			flPin.marginLeft = 0;
			flPin.marginRight = (Screen.width) / counter++;
		}).then(delay * 3, function() {
			flPin.marginLeft = (Screen.width) / counter++;
			flPin.marginRight = 0;
		}).then(delay * 4, function() {
			flPin.marginLeft = 0;
			flPin.marginRight = (Screen.width) / counter++;
		}).then(delay * 5, function() {
			flPin.marginLeft = (Screen.width) / counter++;
			flPin.marginRight = 0;
		}).then(delay * 6, function() {
			flPin.marginLeft = originalMarginLeft;
			flPin.marginRight = originalMarginRight;
		}).complete(function() {
			btnOnayla.touchEnabled = true;
			tbCode.text = "";
			tbCode.onTextChanged();
			page.animating = false;
		});
	}
	else {
		tbCode.removeFocus();
		Router.go("pgDashboard");
	}
}


module && (module.exports = PgSMS);
