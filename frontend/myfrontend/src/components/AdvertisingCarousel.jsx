import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel, Button } from 'antd';

const AdvertisingCarousel = ({ advertisingLocations }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = React.createRef();

  const handleBeforeChange = (from, to) => {
    setCurrentSlide(to);
  };

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  console.log('Advertising Locations:', advertisingLocations);

  if (advertisingLocations.length === 0) {
    console.log('No advertising locations to display.');
    return null;
  }

  return (
    <div>
      <div>
        <Button
          type="primary"
          icon={<LeftOutlined />}
          onClick={prev}
          disabled={currentSlide === 0}
        />
        <div>
          <Carousel ref={carouselRef} beforeChange={handleBeforeChange}>
            {advertisingLocations.map((location, index) => (
              <div key={index}>
                <img
                  src={`/img/${location.property}/${location.photo_url}`}
                  alt={location.location}
                  style={{ width: '100%', height: 'auto' }}
                />
                <h3>{location.location}</h3>
                <h4>Zone: {location.zone_name}</h4>
                <p>{location.description}</p>
                <div>
                  <div>
                    <span>Busyness Score: </span>
                    <span>{location.max_busyness}/100</span>
                  </div>
                  <div>
                    <span>Demographic Score: </span>
                    <span>{location.demographic_score}/100</span>
                  </div>
                  <div>
                    <span>Cost per Day: </span>
                    <span>${location.cost_per_day}</span>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        <Button
          type="primary"
          icon={<RightOutlined />}
          onClick={next}
          disabled={currentSlide === advertisingLocations.length - 1}
        />
      </div>
      <div>
        Slide {currentSlide + 1} of {advertisingLocations.length}
      </div>
    </div>
  );
};

export default AdvertisingCarousel;
