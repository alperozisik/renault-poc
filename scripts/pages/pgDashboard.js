/* 
		You can modify its contents.
*/
const FlexLayout = require('sf-core/ui/flexlayout');
const extend = require('js-base/core/extend');
const PgDashboardDesign = require('ui/ui_pgDashboard');
const ScrollView = require('sf-core/ui/scrollview');
const Color = require('sf-core/ui/color');
const FlArac = require("../components/FlArac");
const mcs = require("../lib/mcs");
const Http = require("sf-core/net/http");
const getCombinedStyle = require("library/styler-builder").getCombinedStyle;
const Screen = require('sf-core/device/screen');
const SwipeView = require('sf-core/ui/swipeview');
const pgBelgeler = require("./pgBelgeler");
const pgDetaylar = require("./pgDetaylar");
const pgIslemler = require("./pgIslemler");



const PgDashboard = extend(PgDashboardDesign)(
	// Constructor
	function(_super) {
		// Initalizes super class for this page scope
		_super(this);
		// overrides super.onShow method
		this.onShow = onShow.bind(this, this.onShow.bind(this));
		// overrides super.onLoad method
		this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
		this.width = NaN;

	});

// Page.onShow -> This event is called when a page appears on the screen (everytime).
function onShow(superOnShow) {
	superOnShow();
	const page = this;
	const flArac = page.flArac;
	setTimeout(function() {
		mcs.login({
				'username': 'selfservice',
				'password': '123qweASD'
			},

			function(err, result) {
				if (err) {
					return alert("LOGIN FAILED.  " + err);
				}

				callService();
			});
	}, 300);

	function callService() {
		var requestOptions = Object.assign({},
			/*mcs.createRequestOptions({
						apiName: "1",
						endpointName: "2"
					}),/**/
			{
				method: "GET",
				url: "https://api.airtable.com/v0/app9AXkuAXfshc9ky/Ownership/recxS3DwjNQyfBHqp",
				/**/
				//url: "https://mobileportal555672622-mobilebel.mobileenv.em2.oraclecloud.com/mobile/connector/Renault_API/Models",
				headers: {
					Authorization: "Bearer key3NgimFX2rFVr8k"
				} /**/
			});
		//console.log(JSON.stringify(requestOptions))
		Http.request(requestOptions,
			function(response) {
				var responseBody = response.body.toString();
				var result = JSON.parse(responseBody);
				flArac.plaka = result.fields.PlateNo;
				flArac.model = result.fields.Detail;
				flArac.resim = result.fields.Image[0].url;
				global.imgRuhsat = result.fields.RegPhoto[0].url;
				global.imgRuhsatChanged && global.imgRuhsatChanged();
				global.aracVerisi = result;
				global.aracVerisiChanged && global.aracVerisiChanged();
				page.flWait.visible = false;
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

}

// Page.onLoad -> This event is called once when page is created.
function onLoad(superOnLoad) {
	superOnLoad();
	const page = this;

	var swipeView = new SwipeView({
		page: page,
		flexGrow: 1,
		pages: [pgIslemler, pgDetaylar, pgBelgeler],
		onStateChanged: function(state) {
			if (SwipeView.State.IDLE === state) {
				//	labelState.text = "State: IDLE";
			}
			else {
				//		labelState.text = "State: DRAGGING";
			}
		},
		onPageSelected: function(index) {
			page.flTabHeader.animateTo(index);
		}
	});
	page.flSwipeContent.addChild(swipeView);
	page.flTabHeader.onChange = function(index) {
		swipeView.swipeToIndex(index, true);
	};





}

module && (module.exports = PgDashboard);
