import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactSlider from 'react-es6-slider';
import '../scss/example.css';

class BasicExample extends Component {
  constructor(props) {
    super(props);
    console.log(ReactSlider);
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

ReactDOM.render(
  <BasicExample />,
  document.getElementById('exampleContainer')
);
