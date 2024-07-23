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
        slidesToShow={2}
        initialSlide={1}
        centerMode
        centerPadding="40px"
        adaptiveHeight
        swipeToSlide
        draggable
        easing
        // infinite
      >
        {advertisingLocations.map((location, index) => (
          <CardItem
            key={index}
            index={index}
            location={location}
            onClick={() => onCardClick(location)}
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
    <div className="mr-12 select-none">
      <div
        className="hover:shadow-xl hover:border-transparent space-y-4 py-6 border border-neutral-100 cursor-pointer"
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
            <b>Zone:</b> {location.zone_name}
          </li>
          <li>
            <b>Description:</b> {location.description}
          </li>
          <li className="space-x-2">
            <span>
              <b>Busyness Score:</b> {Math.round(location.max_busyness)}/100
            </span>
            <span>
              <b className="mr-1">Recommend Time:</b>
              {new Date(location.max_busyness_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </li>
          <li className="space-x-2">
            <span>
              <b>Demographic Score:</b> {Math.round(location.demographic_score)}
              /100
            </span>
            <span>
              <b>Cost per Day:</b> ${location.cost_per_day}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CardItem2({ location, index }) {
  return (
    <div className="pr-12">
      <div className="shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-3/5 pr-4">
            <h3 className="text-2xl font-bold">Rank #{index + 1}</h3>
            <h4 className="text-xl font-medium">{location.location}</h4>
            <p className="text-sm">
              <strong>Zone:</strong> {location.zone_name}
            </p>
            <p className="text-sm">{location.description}</p>
          </div>
          <div className="w-2/5">
            <img
              src={`/img/${location.property}/${location.photo_url}`}
              alt={location.location}
              className="max-w-full h-auto"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col items-center w-1/4">
            <h4 className="text-lg font-medium">Busyness Score</h4>
            <div className="w-3/4 h-2 bg-gray-200 rounded">
              <div
                className={`h-full rounded ${
                  location.max_busyness > 50 ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{ width: `${location.max_busyness}%` }}
              />
            </div>
            <span className="text-sm">
              {location.max_busyness.toFixed(2)}/100
            </span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <h4 className="text-lg font-medium">Demographic Score</h4>
            <div className="w-3/4 h-2 bg-gray-200 rounded">
              <div
                className={`h-full rounded ${
                  location.demographic_score > 50
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
                style={{ width: `${location.demographic_score}%` }}
              />
            </div>
            <span className="text-sm">
              {location.demographic_score.toFixed(2)}/100
            </span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <h4 className="text-lg font-medium">Cost per Day</h4>
            <span className="text-xl font-bold">${location.cost_per_day}</span>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <h4 className="text-lg font-medium">Peak Time</h4>
            <span className="text-lg font-bold">
              {new Date(location.max_busyness_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
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
