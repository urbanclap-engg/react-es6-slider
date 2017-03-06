import React, {Component, PropTypes} from 'react';
import cx from 'classnames';
import Constants from './Constants';

class ReactSlider extends Component {
  static propTypes = {
    /* Slider Props*/
    slidesToShow: PropTypes.number,
    slidesToScroll: PropTypes.number,
    slideWidth: PropTypes.number,
    initialSlide: PropTypes.number,
    gutterSpace: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    isMobile: PropTypes.bool,

    // If true will render the slider after receiving props in componentWillReceiveProps
    boolRenderLater: PropTypes.bool,

    /* Arrow Props */
    hideArrows: PropTypes.bool,

    /* Slider CSS Classes */
    sliderBoxClass: PropTypes.string,
    slideItemClass: PropTypes.string,
    slidesTrackClass: PropTypes.string,
    leftArrowClass: PropTypes.string,
    rightArrowClass: PropTypes.string,
    disableStateArrowClass: PropTypes.string,
    onLeftArrowClick: PropTypes.func,
    onRightArrowClick: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      slidesToShow: this.props.slidesToShow || Constants.SLIDES_TO_SHOW,
      gutterSpace: this.props.gutterSpace || Constants.GUTTER_SPACE,
      currentSlide: this.props.initialSlide || Constants.CURRENT_SLIDE,
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
    this.setState({
      ...nextProps
    }, this.initialProcessing);
  }
  getClasses = (styles) => {
    return {
      sliderBoxContainer: cx(styles.sliderBoxContainer, !!this.props.sliderBoxClass && this.props.sliderBoxClass),
      slideItem: cx(styles.slideItem, !!this.props.slideItemClass && this.props.slideItemClass),
      slidesTrack: cx(styles.slidesTrack, !!this.props.slidesTrackClass && this.props.slidesTrackClass),
      leftArrow: cx(styles.leftArrow, !!this.props.leftArrowClass && this.props.leftArrowClass, this.state.currentSlide === 0 && cx(styles.disableArrow, this.props.disableStateArrowClass)),
      rightArrow: cx(styles.rightArrow, !!this.props.rightArrowClass && this.props.rightArrowClass, (this.state.currentSlide === this.state.totalSlides - this.state.slidesToShow || this.state.totalSlides < this.state.slidesToShow) && cx(styles.disableArrow, this.props.disableStateArrowClass)),
      slidesTrackContainer: styles.slidesTrackContainer
    };
  }
  initialProcessing = () => {
    if (this.props.children.length > 0) {
      const totalWidth = ((this.state.slideWidth + this.state.gutterSpace) * this.props.children.length) - this.state.gutterSpace;
      this._slidesContainerRef.style.width = totalWidth + 'px';
      if (!this.props.isMobile) this._slidesTrackContainerRef.style.width = this.state.slidesToShow * (this.state.slideWidth + this.state.gutterSpace) - this.state.gutterSpace + 'px';
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
        currentSlide: this.state.currentSlide - 1
      }, () => {
        this.updateSliderPosition();
      });
    }
    if (!!this.props.onLeftArrowClick) {
      this.props.onLeftArrowClick();
    }
  }
  slideRight = (event) => {
    if (typeof event !== 'undefined') {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.state.currentSlide < (this.state.totalSlides - this.state.slidesToShow)) {
      this.setState({
        currentSlide: this.state.currentSlide + 1
      }, () => {
        this.updateSliderPosition();
      });
    }
    if (!!this.props.onRightArrowClick) {
      this.props.onRightArrowClick();
    }
  }
  updateSliderPosition = () => {
    let slideWidth = 0;
    if (this.state.currentSlide === this.state.totalSlides - 1) {
      slideWidth = this.state.slideWidth + (this.state.gutterSpace / 2);
    } else {
      slideWidth = this.state.slideWidth + this.state.gutterSpace;
    }
    const scrollableVal = this.state.slidesToScroll * (this.state.currentSlide * slideWidth);

    this._slidesContainerRef.style.transform = 'translateX(-' + scrollableVal + 'px)';
  }
  startDragCapture = (event) => {
    this.setState({
      dragStartPosition: event.pageX || event.nativeEvent.touches[0].pageX,
      dragStart: true
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
    const styles = require('./ReactSlider.scss');
    // Remove null or undefined slides
    const slides = this.props.children.filter(slide => !!slide);

    // If no slides return null
    if (slides.length === 0 || typeof slides === 'undefined' || !slides) {
      return null;
    }

    // Get and combine all css classes at one place
    const cssNameObj = this.getClasses(styles);

    const slideStyles = {
      width: this.state.slideWidth + 'px',
      margin: this.state.gutterSpace / 2
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
          <span className={cssNameObj.leftArrow} onClick={this.slideLeft}></span>
        }
        {
          !this.state.hideArrows &&
          <span className={cssNameObj.rightArrow} onClick={this.slideRight}></span>
        }
        <div ref={(r) => this._slidesTrackContainerRef = r}
             className={cssNameObj.slidesTrackContainer}>
          <ul ref={(r) => this._slidesContainerRef = r}
              className={cssNameObj.slidesTrack}>
            {
              slides.map((slide, index) =>
                <li key={index} style={slideStyles} className={cssNameObj.slideItem}>
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
