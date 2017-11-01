# React-es6-slider
---

React ES6 Slider

## Screenshots

<img src="https://cdn.pbrd.co/images/NdP8aaHom.png" width="550"/>

## Demo Link

https://www.urbanclap.com/
Scroll down a bit to see a list of sliders


## Install

```bash
npm install --save react-es6-slider
npm run demo:watch
Open http://localhost:5000/
```


## Usage

````js
class BasicExample extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const sliderSettings = {
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: false,
      slideWidth: 300,
      gutterSpace: 40,
      leftArrowClass: 'fa fa-arrow-circle-o-right',
      rightArrowClass: 'fa fa-arrow-circle-o-right'
    };
    const styles = require('../scss/example.scss');
    const dummyData = [1, 2, 3, 4, 5];
    return (
      <div className='container'>
        <ReactSlider {...sliderSettings}>
          {
            dummyData.map((item, index) => {
              return (
                <div className='sliderItem' key={index}>
                  { item }
                </div>
              )
            })
          }
        </ReactSlider>
      </div>
    );
  }
}
`````

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| slidesToShow | Number | `3` | Number of slides to be shown |
| slidesToScroll | Number | `1` | Number of slides to be scroll when slided |
| slideWidth | Number | `300` | Width of slide |
| initialSlide | Number | `0` | Initial Slide(starting point) |
| gutterSpace | Number | `30` | space between sliders |
| children | Any | `` | Slider items that you want to slide(Automatically taken) |
| isMobile | Boolean | `false` | Is the slider for mobile |
| boolRenderLater | Boolean | `false` | Initialize the slider after this property is passed again later as true |
| hideArrows | Boolean | `` | Hide the arrows |
| sliderBoxClass | String | `` | Class to be applied on container for the slider |
| slideItemClass | String | `` | Class to be applied on slider items |
| slidesTrackClass | String | `` | Class to be applied on the slider track(below slider box and contains all the slider items) |
| leftArrowClass | String | `` | Class to be applied on left arrow |
| rightArrowClass | String| `` | Class to be applied on right arrow |
| disableStateArrowClass | String | `` | Class to be applied on arrows when disabled |
| onLeftArrowClick | Function | `` | Function to be called on click of left arrow |
| onRightArrowClick | Function | `` | Function to be called on click of right arrow |

```

## Example

`npm run demo:watch` and then go to `http://localhost:5000/`


