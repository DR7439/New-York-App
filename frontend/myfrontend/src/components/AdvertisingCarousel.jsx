import React from "react";
import { Carousel } from "antd";
import PropTypes from "prop-types";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const AdvertisingCarousel = ({ advertisingLocations, onCardClick }) => {
  const carouselRef = React.useRef(null);

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  return (
    <div className="relative">
      <Carousel
        className="pb-8"
        dotPosition="bottom"
        ref={carouselRef}
        slidesToShow={3}
        initialSlide={1}
        centerMode
        centerPadding="40px"
        adaptiveHeight
        easing
        // infinite
      >
        {advertisingLocations.map((location, index) => (
          <CardItem
            key={index}
            index={index}
            location={location}
            onClick={() => onCardClick({
              zone_id: location.zone_id,
              datetime: location.max_busyness_time
            })}
          />
        ))}
      </Carousel>
      <div className="gradient-cover"></div>

      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-400 hover:bg-blue-600 w-10 h-10 text-white rounded-full flex items-center justify-center"
        onClick={prev}
      >
        <ArrowLeftOutlined />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-400 hover:bg-blue-600 w-10 h-10 text-white rounded-full flex items-center justify-center"
        onClick={next}
      >
        <ArrowRightOutlined />
      </button>
    </div>
  );
};

function CardItem({ location, index, onClick }) {
  return (
    <div className="mr-12 pb-4 select-none">
      <div
        className="hover:shadow-md rounded-lg hover:border-transparent space-y-4 py-6 border border-neutral-100 cursor-pointer"
        onClick={onClick}
      >
        <div className="text-base px-4">
          <b>Rank {index + 1}</b>
          <span className="ml-2 text-black/45">{location.location}</span>
        </div>
        <div className="w-full aspect-[3/2]">
          <img
            src={`/img/${location.property}/${location.photo_url}`}
            alt={location.location}
            className="w-full h-full object-cover"
          />
        </div>
        <ul className="text-sm space-y-2 px-4">
          <li>
            <b>Location:</b> {location.zone_name}
          </li>
          <li>
            <b>Description:</b> {location.description}
          </li>
          <li className="space-x-2">
            <span>
              <b>Busyness Score:</b> {location.max_busyness.toFixed(2)}/100
            </span> 
          </li> 
          <li>
              <b className="mr-1">Recommended Time:</b>
              {new Date(location.max_busyness_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </li>
          <li className="space-x-2">
            <span>
              <b>Demographic Score:</b> {location.demographic_score.toFixed(2)}
              /100
            </span>
          </li>
          <li>
              <b>Cost per Day:</b> ${location.cost_per_day}
          </li>
        </ul>
      </div>
    </div>
  );
}

AdvertisingCarousel.propTypes = {
  advertisingLocations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      format: PropTypes.string.isRequired,
      category_alias: PropTypes.string.isRequired,
      market: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      calculated_cpm: PropTypes.number.isRequired,
      views: PropTypes.number.isRequired,
      design_url: PropTypes.string.isRequired,
      cost_per_day: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      zone_id: PropTypes.number.isRequired,
      zone_name: PropTypes.string.isRequired,
      total_score: PropTypes.number.isRequired,
      demographic_score: PropTypes.number.isRequired,
      max_busyness: PropTypes.number.isRequired,
      max_busyness_time: PropTypes.string.isRequired,
      property: PropTypes.string.isRequired,
      photo_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AdvertisingCarousel;
