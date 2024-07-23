export const AGES_RANGES = [
  "Under 5",
  "5-9",
  "10-14",
  "15-19",
  "20-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45-49",
  "50-54",
  "55-59",
  "60-64",
  "65-69",
  "70-74",
  "75-79",
  "80-84",
  "85+",
];

export const GENDERS = {
  "M": "Male",
  "F": "Female",
  "B": "Both Genders",
};

export const NATIONALITIES = [
  "American",
  "British",
  "Canadian",
  "Irish",
  "French",
];
export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
];
export const BUSINESS_SIZES = [
  "Small",
  "Medium",
  "Large",
];
export const BUDGETS = [
  "< $50",
  "$50 - $100",
  "$100 - $500",
  "> $500", 
];

export const TABLE_TOOLTIP_TEXT = {
  ranking: "The ranking is based on the combined score of demographic score and busyness score.",
  demographic: "A location’s demographic score, lowest being 0 and highest being 100, is calculated to match target gender, target age and target market interest.",
  busyness: "A location’s busyness score, lowest being 0 and highest being 100, is calculated to show the optimal busyness level at different time slots within the target date range.",
};


// TOUR STEPS
export const ONBOARD_TOUR_STEPS = [
  {
    title: "Welcome to Ad Optima",
    description: "Welcome to Ad Optima description",
    imgSrc: "https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png",
  },
  {
    title: "Search Name",
    description: "Search Name description",
    placement: "top",
    id: "field-name",
  },
  {
    title: "Target Market Interest",
    description: "Target Market Interest description",
    placement: "top",
    id: "field-target-markets",
  },
  {
    title: "Target Gender",
    description: "Target Gender description",
    placement: "top",
    id: "field-target-gender",
  },
  {
    title: "Target Age",
    description: "Target Age description",
    placement: "top",
    id: "field-target-ages",
  },
  {
    title: "Target Date",
    description: "Target Date description",
    placement: "top",
    id: "field-date-range",
  },
  {
    title: "Start my free search",
    description: "Start my free search description",
    placement: "top",
    id: "submit-button",
  }
];

export const ANALYTICS_TOUR_STEPS = [
  {
    title: "Welcome to Analytics",
    description: "Analytics description",
    imgSrc: "https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png",
  },
  {
    title: "Select Target Date",
    description: "Select Target Date description",
    placement: "top",
    id: "select-date",
  },
  { 
    title: "Show All Recommendations",
    description: "Show All Recommendations description",
    placement: "top",
    id: "show-recommendations",
  },
  {
    title: "Top Recommendation Highlights",
    description: "Top Recommendation Highlights description",
    placement: "top",
    id: "advertising-carousel",
  },
  {
    title: "Recommendations table ",
    description: "Recommendations table description",
    placement: "top",
    id: "recommendations-table",
  },
  {
    title: "Location cell",
    description: "Location cell description",
    placement: "top",
    selector: 'td.ant-table-cell:nth-child(2)'
  },
  {
    title: "Time cell",
    description: "Time cell description",
    placement: "top",
    selector: 'td.ant-table-cell:nth-child(3)'
  },  
  {
    title: "Busyness chart’s Menu tabs",
    description: "Busyness chart’s Menu tab description",
    placement: "top",
    id: 'zone-tabs'
  },
  {
    title: "Busyness Activity by Location",
    description: "Busyness Activity by Location description",
    placement: "top",
    id: "tour-line-chart",
  },
  {
    title: "Demographic by Location",
    description: "Demographic by Location description",
    placement: "top",
    id: "tour-column-chart",
  },
  {
    title: "Point-of-interest by Location",
    description: "Point-of-interest by Location description",
    placement: "top",
    id: "tour-pie-chart",
  },
];