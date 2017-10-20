'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Constants = require('./Constants');

var _Constants2 = _interopRequireDefault(_Constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSlider = function (_Component) {
  _inherits(ReactSlider, _Component);

  function ReactSlider(props) {
    _classCallCheck(this, ReactSlider);

    var _this = _possibleConstructorReturn(this, (ReactSlider.__proto__ || Object.getPrototypeOf(ReactSlider)).call(this, props));

    _this.getClasses = function (styles) {
      return {
        sliderBoxContainer: (0, _classnames2.default)(styles.sliderBoxContainer, !!_this.props.sliderBoxClass && _this.props.sliderBoxClass),
        slideItem: (0, _classnames2.default)(styles.slideItem, !!_this.props.slideItemClass && _this.props.slideItemClass),
        slidesTrack: (0, _classnames2.default)(styles.slidesTrack, !!_this.props.slidesTrackClass && _this.props.slidesTrackClass),
        leftArrow: (0, _classnames2.default)(styles.leftArrow, !!_this.props.leftArrowClass && _this.props.leftArrowClass, _this.state.currentSlide === 0 && (0, _classnames2.default)(styles.disableArrow, _this.props.disableStateArrowClass)),
        rightArrow: (0, _classnames2.default)(styles.rightArrow, !!_this.props.rightArrowClass && _this.props.rightArrowClass, (_this.state.currentSlide === _this.state.totalSlides - _this.state.slidesToShow || _this.state.totalSlides < _this.state.slidesToShow) && (0, _classnames2.default)(styles.disableArrow, _this.props.disableStateArrowClass)),
        slidesTrackContainer: (0, _classnames2.default)(styles.slidesTrackContainer, !!_this.props.slidesTrackContainer && _this.props.slidesTrackContainer)
      };
    };

    _this.initialProcessing = function () {
      if (_this.props.children.length > 0) {
        var totalWidth = (_this.state.slideWidth + _this.GUTTER_SPACE) * _this.props.children.length - _this.GUTTER_SPACE;
        _this._slidesContainerRef.style.width = totalWidth + 'px';
        if (!_this.props.isMobile) _this._slidesTrackContainerRef.style.width = _this.state.slidesToShow * (_this.state.slideWidth + _this.GUTTER_SPACE) - _this.GUTTER_SPACE + 'px';
        _this.updateSliderPosition();
      }
    };

    _this.slideLeft = function (event) {
      if (typeof event !== 'undefined') {
        event.stopPropagation();
        event.preventDefault();
      }
      if (_this.state.currentSlide > 0) {
        _this.setState({
          currentSlide: _this.state.currentSlide - _this.state.slidesToScroll
        }, _this.updateSliderPosition);
      }
      if (!!_this.props.onLeftArrowClick) {
        _this.props.onLeftArrowClick(_this.state.currentSlide);
      }
    };

    _this.slideRight = function (event) {
      if (typeof event !== 'undefined') {
        event.stopPropagation();
        event.preventDefault();
      }
      if (_this.state.currentSlide < _this.state.totalSlides - _this.state.slidesToShow) {
        _this.setState({
          currentSlide: _this.state.currentSlide + _this.state.slidesToScroll
        }, _this.updateSliderPosition);
      }
      if (!!_this.props.onRightArrowClick) {
        _this.props.onRightArrowClick(_this.state.currentSlide);
      }
    };

    _this.updateSliderPosition = function () {
      var slideWidth = 0;
      var translateDirection = _Constants2.default.RIGHT_SLIDE_SIGN;
      if (_this.state.currentSlide === _this.state.totalSlides - _this.state.slidesToScroll + 1) {
        slideWidth = _this.state.slideWidth + _this.GUTTER_SPACE / 2;
      } else {
        slideWidth = _this.state.slideWidth + _this.GUTTER_SPACE;
      }
      var scrollableVal = _this.state.currentSlide * slideWidth;

      // Display side slides
      if (!!_this.props.sideDisplayWidth) {
        if (scrollableVal === 0) {
          scrollableVal = _this.GUTTER_SPACE + _this.props.sideDisplayWidth;
          translateDirection = _Constants2.default.LEFT_SLIDE_SIGN;
        } else {
          scrollableVal -= _this.GUTTER_SPACE + _this.props.sideDisplayWidth;
        }
      }
      _this._slidesContainerRef.style.transform = 'translateX(' + translateDirection + scrollableVal + 'px)';
    };

    _this.startDragCapture = function (event) {
      _this.setState({
        dragStartPosition: event.pageX || event.nativeEvent.touches[0].pageX,
        dragStart: true,
        slideDirection: _Constants2.default.NONE
      });
    };

    _this.updateDrag = function (event) {
      if (_this.state.dragStart) {
        var xPos = event.pageX || event.nativeEvent.touches[0].pageX;
        var scrollDiff = xPos - _this.state.dragStartPosition;
        if (scrollDiff > _Constants2.default.SLIDE_THRESHOLD) {
          _this.setState({
            slideDirection: _Constants2.default.LEFT
          });
        } else if (scrollDiff < -_Constants2.default.SLIDE_THRESHOLD) {
          _this.setState({
            slideDirection: _Constants2.default.RIGHT
          });
        } else {
          _this.setState({
            slideDirection: _Constants2.default.NONE
          });
        }
      }
    };

    _this.completeDragSlide = function () {
      if (_this.state.dragStart) {
        switch (_this.state.slideDirection) {
          case _Constants2.default.LEFT:
            _this.slideLeft();break;
          case _Constants2.default.RIGHT:
            _this.slideRight();break;
          default:
            return;
        }
      }
      _this.setState({
        dragStart: false,
        slideDirection: _Constants2.default.NONE
      });
    };

    _this.GUTTER_SPACE = _this.props.gutterSpace !== 'undefined' ? _this.props.gutterSpace : _Constants2.default.GUTTER_SPACE;
    _this.state = {
      slidesToShow: _this.props.slidesToShow || _Constants2.default.SLIDES_TO_SHOW,
      gutterSpace: _this.props.gutterSpace || _Constants2.default.GUTTER_SPACE,
      currentSlide: _this.props.currentSlide || _Constants2.default.CURRENT_SLIDE,
      slideWidth: _this.props.slideWidth || _Constants2.default.SLIDE_WIDTH,
      totalSlides: _this.props.children.length || _Constants2.default.TOTAL_SLIDES,
      slidesToScroll: _this.props.slidesToScroll || _Constants2.default.SLIDES_TO_SCROLL,
      hideArrows: _this.props.hideArrows || _Constants2.default.HIDE_ARROWS
    };
    return _this;
  }

  _createClass(ReactSlider, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      document.addEventListener('onmouseup', function () {
        _this2.setState({
          dragStart: false,
          slideDirection: _Constants2.default.NONE
        });
      });
      if (!this.props.boolRenderLater) {
        this.initialProcessing();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var currentSlide = typeof nextProps.currentSlide !== 'undefined' ? nextProps.currentSlide : this.state.currentSlide;
      if (typeof nextProps.currentSlide !== 'undefined' && nextProps.currentSlide !== this.props.currentSlide && this.state.totalSlides - this.state.slidesToShow + 1 < nextProps.currentSlide) {
        currentSlide = this.state.totalSlides - this.state.slidesToShow;
      }
      if (nextProps.currentSlide !== this.props.currentSlide || nextProps.children.length !== this.props.children.length || nextProps.slideWidth !== this.props.slideWidth || nextProps.slidesToShow !== this.props.slidesToShow) {
        this.setState(_extends({}, nextProps, {
          currentSlide: currentSlide
        }), this.initialProcessing);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.currentSlide !== this.state.currentSlide && typeof this.props.onCurrentIndexChange === 'function') {
        this.props.onCurrentIndexChange(this.state.currentSlide);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      // Remove null or undefined slides
      var styles = require('./ReactSlider.scss');
      var slides = this.props.children.filter(function (slide) {
        return !!slide;
      });

      // If no slides return null
      if (slides.length === 0 || typeof slides === 'undefined' || !slides) {
        return null;
      }

      // Get and combine all css classes at one place
      var cssNameObj = this.getClasses(styles);

      var slideStyles = {
        width: this.state.slideWidth + 'px',
        margin: '0 ' + this.GUTTER_SPACE / 2 + 'px'
      };
      return _react2.default.createElement(
        'div',
        { ref: function ref(r) {
            return _this3._slideBoxContainer = r;
          },
          className: cssNameObj.sliderBoxContainer,
          onMouseDown: this.startDragCapture,
          onMouseMove: this.updateDrag,
          onMouseUp: this.completeDragSlide,
          onTouchStart: this.startDragCapture,
          onTouchMove: this.updateDrag,
          onTouchEnd: this.completeDragSlide },
        !this.state.hideArrows && _react2.default.createElement('span', {
          className: cssNameObj.leftArrow,
          onClick: this.slideLeft }),
        !this.state.hideArrows && _react2.default.createElement('span', {
          className: cssNameObj.rightArrow,
          onClick: this.slideRight }),
        _react2.default.createElement(
          'div',
          { ref: function ref(r) {
              return _this3._slidesTrackContainerRef = r;
            },
            className: cssNameObj.slidesTrackContainer },
          _react2.default.createElement(
            'ul',
            { ref: function ref(r) {
                return _this3._slidesContainerRef = r;
              },
              className: cssNameObj.slidesTrack },
            slides.map(function (slide, index) {
              return _react2.default.createElement(
                'li',
                {
                  key: index,
                  style: slideStyles,
                  className: (0, _classnames2.default)(cssNameObj.slideItem, index === _this3.state.currentSlide && !!_this3.props.currentSlideClass && _this3.props.currentSlideClass) },
                slide
              );
            })
          )
        )
      );
    }
  }]);

  return ReactSlider;
}(_react.Component);

exports.default = ReactSlider;