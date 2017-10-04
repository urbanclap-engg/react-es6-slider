import React, {Component, PropTypes} from 'react';
import cx from 'classnames';
import Constants from './Constants';

class ReactSlider extends Component {
  static propTypes = {
    /* Slider Props*/
    slidesToShow: PropTypes.number,
    slidesToScroll: PropTypes.number,
    slideWidth: PropTypes.number,
    currentSlide: PropTypes.number,
    gutterSpace: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    isMobile: PropTypes.bool,
    sideDisplayWidth: PropTypes.number,
    // If true will render the slider after receiving props in componentWillReceiveProps
    boolRenderLater: PropTypes.bool,

    /* Arrow Props */
    hideArrows: PropTypes.bool,

    /* Slider CSS Classes */
    sliderBoxClass: PropTypes.string,
    slideItemClass: PropTypes.string,
    slidesTrackContainer: PropTypes.string,
    slidesTrackClass: PropTypes.string,
    leftArrowClass: PropTypes.string,
    rightArrowClass: PropTypes.string,
    disableStateArrowClass: PropTypes.string,
    currentSlideClass: PropTypes.string,
    onLeftArrowClick: PropTypes.func,
    onRightArrowClick: PropTypes.func,
    onCurrentIndexChange: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.GUTTER_SPACE = this.props.gutterSpace !== 'undefined' ? this.props.gutterSpace : Constants.GUTTER_SPACE;
    this.state = {
      slidesToShow: this.props.slidesToShow || Constants.SLIDES_TO_SHOW,
      gutterSpace: this.props.gutterSpace || Constants.GUTTER_SPACE,
      currentSlide: this.props.currentSlide || Constants.CURRENT_SLIDE,
      slideWidth: this.props.slideWidth || Constants.SLIDE_WIDTH,
      totalSlides: this.props.children.length || Constants.TOTAL_SLIDES,
      slidesToScroll: this.props.slidesToScroll || Constants.SLIDES_TO_SCROLL,
      hideArrows: this.props.hideArrows || Constants.HIDE_ARROWS
    };
  }
  componentDidMount() {
    document.addEventListener('onmouseup', () => {
      this.setState({
        dragStart: false,
        slideDirection: Constants.NONE
      });
    });
    if (!this.props.boolRenderLater) {
      this.initialProcessing();
    }
  }

  componentWillReceiveProps(nextProps) {
    let currentSlide = typeof nextProps.currentSlide !== 'undefined' ? nextProps.currentSlide : this.state.currentSlide;
    if (typeof nextProps.currentSlide !== 'undefined' &&
        nextProps.currentSlide !== this.props.currentSlide &&
        (this.state.totalSlides - this.state.slidesToShow + 1) < nextProps.currentSlide) {
      currentSlide = this.state.totalSlides - this.state.slidesToShow;
    }
    if (nextProps.currentSlide !== this.props.currentSlide ||
        nextProps.children.length !== this.props.children.length ||
        nextProps.slideWidth !== this.props.slideWidth ||
        nextProps.slidesToShow !== this.props.slidesToShow) {
      this.setState({
        ...nextProps,
        currentSlide,
      }, this.initialProcessing);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentSlide !== this.state.currentSlide &&
      typeof this.props.onCurrentIndexChange === 'function'
    ) {
      this.props.onCurrentIndexChange(this.state.currentSlide);
    }
  }
  getClasses = (styles) => {
    return {
      sliderBoxContainer: cx(styles.sliderBoxContainer, !!this.props.sliderBoxClass && this.props.sliderBoxClass),
      slideItem: cx(styles.slideItem, !!this.props.slideItemClass && this.props.slideItemClass),
      slidesTrack: cx(styles.slidesTrack, !!this.props.slidesTrackClass && this.props.slidesTrackClass),
      leftArrow: cx(styles.leftArrow, !!this.props.leftArrowClass && this.props.leftArrowClass, this.state.currentSlide === 0 && cx(styles.disableArrow, this.props.disableStateArrowClass)),
      rightArrow: cx(styles.rightArrow, !!this.props.rightArrowClass && this.props.rightArrowClass, (this.state.currentSlide === this.state.totalSlides - this.state.slidesToShow || this.state.totalSlides < this.state.slidesToShow) && cx(styles.disableArrow, this.props.disableStateArrowClass)),
      slidesTrackContainer: cx(styles.slidesTrackContainer, !!this.props.slidesTrackContainer && this.props.slidesTrackContainer)
    };
  }
  initialProcessing = () => {
    if (this.props.children.length > 0) {
      const totalWidth = ((this.state.slideWidth + this.GUTTER_SPACE) * this.props.children.length) - this.GUTTER_SPACE;
      this._slidesContainerRef.style.width = totalWidth + 'px';
      if (!this.props.isMobile) this._slidesTrackContainerRef.style.width = this.state.slidesToShow * (this.state.slideWidth + this.GUTTER_SPACE) - this.GUTTER_SPACE + 'px';
      this.updateSliderPosition();
    }
  }
  slideLeft = (event) => {
    if (typeof event !== 'undefined') {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.state.currentSlide > 0) {
      this.setState({
        currentSlide: this.state.currentSlide - this.state.slidesToScroll
      }, this.updateSliderPosition);
    }
    if (!!this.props.onLeftArrowClick) {
      this.props.onLeftArrowClick(this.state.currentSlide);
    }
  }
  slideRight = (event) => {
    if (typeof event !== 'undefined') {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.state.currentSlide < (this.state.totalSlides - this.state.slidesToShow)) {
      this.setState({
        currentSlide: this.state.currentSlide + this.state.slidesToScroll
      }, this.updateSliderPosition);
    }
    if (!!this.props.onRightArrowClick) {
      this.props.onRightArrowClick(this.state.currentSlide);
    }
  }
  updateSliderPosition = () => {
    let slideWidth = 0;
    let translateDirection = Constants.RIGHT_SLIDE_SIGN;
    if (this.state.currentSlide === this.state.totalSlides - this.state.slidesToScroll + 1) {
      slideWidth = this.state.slideWidth + (this.GUTTER_SPACE / 2);
    } else {
      slideWidth = this.state.slideWidth + this.GUTTER_SPACE;
    }
    let scrollableVal = this.state.currentSlide * slideWidth;

    // Display side slides
    if (!!this.props.sideDisplayWidth) {
      if (scrollableVal === 0) {
        scrollableVal = this.GUTTER_SPACE + this.props.sideDisplayWidth;
        translateDirection = Constants.LEFT_SLIDE_SIGN;
      } else {
        scrollableVal -= this.GUTTER_SPACE + this.props.sideDisplayWidth;
      }
    }
    this._slidesContainerRef.style.transform = `translateX(${translateDirection}${scrollableVal}px)`;
  }
  startDragCapture = (event) => {
    this.setState({
      dragStartPosition: event.pageX || event.nativeEvent.touches[0].pageX,
      dragStart: true,
      slideDirection: Constants.NONE
    });
  }
  updateDrag = (event) => {
    if (this.state.dragStart) {
      const xPos = event.pageX || event.nativeEvent.touches[0].pageX;
      const scrollDiff = xPos - this.state.dragStartPosition;
      if (scrollDiff > Constants.SLIDE_THRESHOLD) {
        this.setState({
          slideDirection: Constants.LEFT
        });
      } else if (scrollDiff < -Constants.SLIDE_THRESHOLD) {
        this.setState({
          slideDirection: Constants.RIGHT
        });
      } else {
        this.setState({
          slideDirection: Constants.NONE
        });
      }
    }
  }
  completeDragSlide = () => {
    if (this.state.dragStart) {
      switch (this.state.slideDirection) {
        case Constants.LEFT: this.slideLeft(); break;
        case Constants.RIGHT: this.slideRight(); break;
        default: return;
      }
    }
    this.setState({
      dragStart: false,
      slideDirection: Constants.NONE
    });
  }
  render() {
    // Remove null or undefined slides
    const styles = require('./ReactSlider.scss');
    const slides = this.props.children.filter(slide => !!slide);

    // If no slides return null
    if (slides.length === 0 || typeof slides === 'undefined' || !slides) {
      return null;
    }

    // Get and combine all css classes at one place
    const cssNameObj = this.getClasses(styles);

    const slideStyles = {
      width: this.state.slideWidth + 'px',
      margin: '0 ' + this.GUTTER_SPACE / 2 + 'px'
    };
    return (
      <div ref={(r) => this._slideBoxContainer = r}
            className={cssNameObj.sliderBoxContainer}
            onMouseDown={this.startDragCapture}
            onMouseMove={this.updateDrag}
            onMouseUp={this.completeDragSlide}
            onTouchStart={this.startDragCapture}
            onTouchMove={this.updateDrag}
            onTouchEnd={this.completeDragSlide}>
        {
          !this.state.hideArrows &&
          <span
            className={cssNameObj.leftArrow}
            onClick={this.slideLeft} />
        }
        {
          !this.state.hideArrows &&
          <span
            className={cssNameObj.rightArrow}
            onClick={this.slideRight} />
        }
        <div ref={(r) => this._slidesTrackContainerRef = r}
             className={cssNameObj.slidesTrackContainer}>
          <ul ref={(r) => this._slidesContainerRef = r}
              className={cssNameObj.slidesTrack}>
            {
              slides.map((slide, index) =>
                <li
                  key={index}
                  style={slideStyles}
                  className={cx(cssNameObj.slideItem, index === this.state.currentSlide && !!this.props.currentSlideClass && this.props.currentSlideClass)}>
                  { slide }
                </li>
              )
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default ReactSlider;
