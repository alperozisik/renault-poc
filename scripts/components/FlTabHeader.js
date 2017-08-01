const Animator = require('sf-core/ui/animator');
const extend = require('js-base/core/extend');
const FlTabHeaderDesign = require('library/FlTabHeader');
const animationDuration = 250;
const Page = require("sf-core/ui/page");
const System = require('sf-core/device/system');


const FlTabHeader = extend(FlTabHeaderDesign)(
	//constructor
	function(_super, props, pageName) {
		// initalizes super class for this scope
		_super(this, props || FlTabHeaderDesign.defaults);
		const flTabHeader = this;
		var animationRootView;
		flTabHeader.pageName = pageName;

		var flTabBottomPlaceholderRight = flTabHeader.flTabBottomPlaceholderRight,
			flTabBottomIndicator = flTabHeader.flTabBottomIndicator,
			flTabBottomPlaceholderLeft = flTabHeader.flTabBottomPlaceholderLeft,
			btnBelgeler = flTabHeader.btnBelgeler,
			btnDetaylar = flTabHeader.btnDetaylar,
			btnIslemler = flTabHeader.btnIslemler;


		flTabHeader.moveTo = function moveTo(index) {
			if (index === flTabHeader.currentIndex)
				return;
			switch (index) {
				case 0:
					flTabBottomPlaceholderRight.flexGrow = 2;
					flTabBottomPlaceholderLeft.flexGrow = 0;
					break;
				case 1:
					flTabBottomPlaceholderRight.flexGrow = 1;
					flTabBottomPlaceholderLeft.flexGrow = 1;
					break;
				case 2:
					flTabBottomPlaceholderRight.flexGrow = 0;
					flTabBottomPlaceholderLeft.flexGrow = 2;
					break;
			}
			flTabHeader.currentIndex = index;
		};

		function findPage(component) {
			if (!component)
				component = flTabHeader;
			var parent = component.getParent();
			if (!parent)
				return component;
			if (parent instanceof Page)
				return parent.layout;
			else
				return findPage(parent);
		}

		flTabHeader.animateTo = function animateTo(index, callback) {
			if (index === flTabHeader.currentIndex)
				return;
			animationRootView = animationRootView || (System.OS === "iOS" ? findPage() : flTabHeader);
			Animator.animate(animationRootView, animationDuration, function() {
				flTabHeader.moveTo(index);
			}).complete(function() {
				callback && callback();
			});
		};

		flTabHeader.onChange = null;
		flTabHeader.currentIndex = 0;

		function changed(index) {
			if (index === flTabHeader.currentIndex)
				return;
			flTabHeader.onChange && flTabHeader.onChange(index);
			flTabHeader.animateTo(index, function() {

			});
		}
		btnBelgeler.onPress = changed.bind(btnBelgeler, 2);
		btnDetaylar.onPress = changed.bind(btnDetaylar, 1);
		btnIslemler.onPress = changed.bind(btnIslemler, 0);
	}

);

module && (module.exports = FlTabHeader);
