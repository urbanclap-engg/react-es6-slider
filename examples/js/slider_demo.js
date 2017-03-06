import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactSlider from '../../src/ReactSlider';

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
      <div className={styles.container}>
        <ReactSlider {...sliderSettings}>
          {
            dummyData.map((item, index) => {
              return (
                <div className={styles.sliderItem} key={index}>
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
