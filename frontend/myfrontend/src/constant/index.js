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
    description: "By making a search with desired inputs, you can know where and when to best place ads to increase ROI. Let's create a first search!",
  },
  {
    title: "Search Name",
    description: "Fill in this field with a meaningful search search name. This helps you track your search later on when there are many search records.",
    placement: "top",
    id: "field-name",
  },
  {
    title: "Target Market Interest",
    description: "Pick the fields of interests that are relevant to your ads' target.",
    placement: "top",
    id: "field-target-markets",
  },
  {
    title: "Target Gender",
    description: "Pick the genders that are relevant to your ads' target.",
    placement: "top",
    id: "field-target-gender",
  },
  {
    title: "Target Age",
    description: "Pick the age brackets that are relevant to your ads' target.",
    placement: "top",
    id: "field-target-ages",
  },
  {
    title: "Target Date",
    description: "Pick the date range that is relevant to your ads' target. Your date range can be 1 day or up to 14 days. Past dates from today are no longer relevant and thus unselectable. A rate of 10 credits applied per selected day.",
    placement: "top",
    id: "field-date-range",
  },
  {
    title: "Start my free search",
    description: "As a new user, you are granted 100 credits. Your first search won't charge any credits. We hope you enjoy our gift :)",
    placement: "top",
    id: "submit-button",
  }
];

export const ANALYTICS_TOUR_STEPS = [
  {
    title: "Welcome to Analytics",
    description: "Here you can explore top recommendation highlights and see score analysis for recommended time and locations. Use visualized charts to make informed decisions on placing your ads.",
  },
  {
    title: "Select Target Date",
    description: "Use this filter to see the recommendation and chart results for a selected date from your search.",
    placement: "top",
    id: "select-date",
  },
  { 
    title: "Show All Recommendations",
    description: "Use this toggle to display all recomendations in a table format. The toggle is Off by default for optimal result viewing but you can turn that on at any time.",
    placement: "top",
    id: "show-recommendations",
  },
  {
    title: "Top Recommendation Highlights",
    description: "View our top ten recommendations for you. These are the best matches given what you had in mind when making this search.",
    placement: "top",
    id: "advertising-carousel",
  },
  {
    title: "All Recommendations table",
    description: "This table can be turned on/off with the Show All Recommendations toggle. It is hidden by default until you feel our top ten recommendations are not enough info and you want MORE!",
    placement: "top",
    id: "recommendations-table",
  },
    {
    title: "All Recommendations table row",
    description: "Click on a row to navigate to its corresponding time and location results shown on map and to see visualized info on busyness per hour, demographics, and point-of-interest in charts.",
    placement: "top",
    selector: 'tbody>tr:first-child'
  },
  // {
  //   title: "Location cell",
  //   description: "Location cell description",
  //   placement: "top",
  //   selector: 'td.ant-table-cell:nth-child(2)'
  // },
  // {
  //   title: "Time cell",
  //   description: "Time cell description",
  //   placement: "top",
  //   selector: 'td.ant-table-cell:nth-child(3)'
  // },  
  {
    title: "Map Visualization",
    description: "Click on the highlighted area on the map to view a specific location with corresponding busyness at a given hour and all the available billboards within that location.",
    placement: "top",
    id: "map-container",  
  },
  {
    title: "Data Analysis’s Menu tabs",
    description: "Click on a tab with your desired location's name to view the busyness, demographic, and point-of-interest data charts of that location. This action can also be done by clicking on the All Recommendations table's rows.",
    placement: "top",
    id: 'zone-tabs'
  },
  {
    title: "Busyness Activity by Location",
    description: "View all the busyness activity per hour of a location throughout a selected day.",
    placement: "top",
    id: "tour-line-chart",
  },
  {
    title: "Demographic by Location",
    description: "View all the demographic data of a location throughout a selected day.",
    placement: "top",
    id: "tour-column-chart",
  },
  {
    title: "Point-of-interest by Location",
    description: "View all the demographic data of a location throughout a selected day.",
    placement: "top",
    id: "tour-pie-chart",
  },
];

export const TOUR_STORAGE_KEY = {
  onboard: "visited-onboard-tour",
  analytic: "visited-analytic-tour"
}