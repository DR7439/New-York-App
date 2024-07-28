// import React from "react";
// import { Button, Rate } from "antd";
// import { useNavigate } from "react-router-dom";
// import { Link, Element } from "react-scroll";
// const FAQURL = "https://i.imgur.com/qAcFhCm.png";
// const LoyalCustomerURL = "https://i.imgur.com/yoeEJxl.jpeg";
// const Review1URL = "https://i.imgur.com/BljlzeW.png";
// const Review2URL = "https://i.imgur.com/eVxQbFk.png";
// const Review3URL = "https://i.imgur.com/qPtFwCu.png";
// const AnalyticsURL = "https://i.imgur.com/O2NT6DB.png";
// const BillBoardsURL = "https://i.imgur.com/j58CQma.png";

// export default function LandingPage() {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     console.log("Navigating to /register");
//     navigate("/register");
//   };

//   return (
//     <>
//       <nav className="flex justify-between items-center bg-blue-600 w-full pt-2.5 pr-4 pb-3 px-4 h-12 text-white">
//         <h2 className="text-xl">Ad Optima</h2>
//         <ul className="flex flex-1 justify-center space-x-8">
//           <li className="cursor-pointer w-[95px] h-[28px]">
//             <Link
//               to="insights"
//               smooth={true}
//               duration={500}
//               className="nav-link text-white transition-opacity duration-500"
//             >
//               Insights
//             </Link>
//           </li>
//           <li className="cursor-pointer w-[95px] h-[28px]">
//             <Link
//               to="testimonials"
//               smooth={true}
//               duration={500}
//               className="nav-link text-white transition-opacity duration-500"
//             >
//               Testimonials
//             </Link>
//           </li>
//           <li className="cursor-pointer w-[95px] h-[28px]">
//             <Link
//               to="faq"
//               smooth={true}
//               duration={500}
//               className="nav-link text-white transition-opacity duration-500"
//             >
//               FAQ
//             </Link>
//           </li>
//         </ul>
//         <Link to="insights" smooth={true} duration={500}>
//           <Button type="default">Learn More</Button>
//         </Link>
//       </nav>

//       <section className="p-8 h-screen flex justify-center items-center gray-300">
//         <div className="flex justify-center items-center space-x-16 max-w-7xl relative">
//           <div className="flex flex-col space-y-4 max-w-md">
//             <div className="flex flex-col" style={{ maxWidth: "608px" }}>
//               <h1 className="text-4xl font-bold" style={{ maxWidth: "547px" }}>
//                 Boost Your Advertising Strategy with Ad Optima
//               </h1>
//               <p
//                 className="text-gray-500 font-normal leading-5 mt-2"
//                 style={{ maxWidth: "547px" }}
//               >
//                 Get targeted advertising recommendations based on foot traffic
//                 and demographics in Manhattan.
//               </p>
//             </div>
//             <div className="flex space-x-4">
//               <Button type="primary" onClick={handleNavigate}>
//                 Get Started
//               </Button>
//               <Link to="insights" smooth={true} duration={500}>
//                 <Button type="deafult">Learn More</Button>
//               </Link>
//             </div>
//             <div className="flex items-center">
//               <div className="flex items-center">
//                 <img
//                   src={LoyalCustomerURL}
//                   alt="Loyal Customer"
//                   className="w-16 h-16 object-cover rounded-lg"
//                 />
//               </div>
//               <div className="w-px bg-gray-300 h-auto mx-4"></div>
//               <div className="flex flex-col items-start">
//                 <div className="flex items-center">
//                   <Rate
//                     allowHalf={false}
//                     defaultValue={5}
//                     disabled
//                     className="text-[16px]"
//                   />
//                   <span className="text-gray-500 pl-1.5 text-xs">5.0</span>
//                 </div>
//                 <div className="mt-2 text-gray-500 text-xs">
//                   <p className="leading-4">
//                     Rated Best Over{" "}
//                     <span className="font-semibold text-black">15.7k</span>{" "}
//                     Reviews
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="relative">
//             <div
//               className="overflow-hidden rounded-lg"
//               style={{ paddingRight: "96px" }}
//             >
//               <img
//                 src={BillBoardsURL}
//                 alt="Times Square"
//                 className="w-[448px] h-[654.766px] object-cover text-left"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <Element name="insights">
//         <section className="pt-12 pb-12 gray-300 relative">
//           <div
//             className="relative mx-auto bg-white p-8 rounded-lg shadow-md"
//             style={{ width: "1248px", marginTop: "-1px" }}
//           >
//             <div className="text-center mb-16">
//               <h2 className="text-4xl font-extrabold mb-4">
//                 Optimize Your Targeted Advertising
//               </h2>
//               <p className="text-gray-400 max-w-[732px] mx-auto">
//                 Ad Optima is a web-based tool designed for businesses to refine
//                 their advertising strategies by offering precise location
//                 recommendations based on your target demographics, market
//                 interests, and dates. Leverage its actionable insights to
//                 optimize your ad placements and effectively reach your target
//                 audience.
//               </p>
//             </div>
//             <div className="relative flex items-start justify-between w-full mt-8">
//               <div className="flex flex-col space-y-16">
//                 <div>
//                   <h3 className="font-bold text-xl text-center mb-2.5">
//                     Location Analysis
//                   </h3>
//                   <p className="text-gray-400 max-w-[327px] text-center">
//                     Receive detailed recommendations with our top 10 suggested
//                     advertising locations and interactive maps highlighting
//                     billboard density and placement throughout Manhattan.
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-xl text-center mb-2.5">
//                     Demographic Targeting
//                   </h3>
//                   <p className="text-gray-400 max-w-[310px] text-center">
//                     Enhance your ad strategy with detailed demographic insights,
//                     including graphs and pie charts, tailored to your selected
//                     target dates for precise audience targeting.
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-xl text-center mb-2.5">
//                     Ad Placement
//                   </h3>
//                   <p className="text-gray-400 max-w-[310px] text-center">
//                     Explore available billboards at each location and their
//                     precise placements within any chosen zone for a tailored
//                     advertising experience.
//                   </p>
//                 </div>
//               </div>
//               <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
//                 <img
//                   src={AnalyticsURL}
//                   alt="Recommended Advertising Locations"
//                   className="max-w-[672px] h-auto object-contain rounded-lg"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//       </Element>

//       <Element name="testimonials">
//         <section className="pt-20 pb-20 gray-300 relative">
//           <div className="max-w-[1248px] mx-auto px-4">
//             <h2 className="font-bold text-4xl mb-8 text-center">
//               Testimonials
//             </h2>
//             <div className="flex flex-row space-x-8">
//               <div className="flex flex-col items-center">
//                 <p className="text-gray-500 text-center mb-2">
//                   "Ad Optima has transformed our advertising strategy. Its
//                   precise recommendations have markedly enhanced our campaign
//                   results, delivering exceptional improvements in performance."
//                 </p>
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={Review1URL}
//                     alt="Customer Review 1"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="flex flex-col justify-center">
//                     <p className="text-gray-600 font-semibold mb-0">
//                       Jessica Smith
//                     </p>
//                     <p className="text-gray-400 text-sm mt-1">
//                       Marketing Manager
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center">
//                 <p className="text-gray-500 text-center mb-2">
//                   "Ad Optima proved its value remarkably. Following its
//                   recommendations resulted in a substantial increase in both
//                   foot traffic and sales."
//                 </p>
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={Review2URL}
//                     alt="Customer Review 2"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="flex flex-col justify-center">
//                     <p className="text-gray-600 font-semibold mb-0">
//                       Michael Johnson
//                     </p>
//                     <p className="text-gray-400 text-sm mt-1">Sales Director</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col items-center">
//                 <p className="text-gray-500 text-center mb-2">
//                   "The insights provided by Ad Optima are unparalleled. Our
//                   advertising efforts have become more targeted and efficient,
//                   making a significant impact on our ROI."
//                 </p>
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={Review3URL}
//                     alt="Customer Review 3"
//                     className="w-16 h-16 rounded-full"
//                   />
//                   <div className="flex flex-col justify-center">
//                     <p className="text-gray-600 font-semibold mb-0">
//                       Emily Davis
//                     </p>
//                     <p className="text-gray-400 text-sm mt-1">Business Owner</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </Element>

//       <Element name="faq">
//         <section className="pt-20 pb-20 gray3200 relative mb-0">
//           <div className="flex flex-col items-center p-8">
//             <h2 className="font-bold text-2xl mb-8">FAQ</h2>
//             <div className="flex items-center space-x-[112px]">
//               <div className="flex-shrink-0">
//                 <img
//                   src={FAQURL}
//                   alt="FAQ Image"
//                   className="w-[536px] h-[536px] object-cover rounded-lg"
//                 />
//               </div>
//               <div className="max-w-[536px] flex flex-col justify-center">
//                 <div className="mb-6">
//                   <p className="font-semibold text-gray-500">
//                     How does Ad Optima analyze foot traffic?
//                   </p>
//                   <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal">
//                     Ad Optima utilizes GPS tracking data from mobile devices and
//                     partnerships with location data providers to analyze foot
//                     traffic patterns in real-time.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="font-semibold text-gray-500">
//                     What demographic data does Ad Optima consider?
//                   </p>
//                   <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal">
//                     Ad Optima considers various demographic data, including age,
//                     gender, income level, and interests, to provide tailored
//                     advertising recommendations that match your target audience.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="font-semibold text-gray-500">
//                     How does Ad Optima integrate local demographic and foot
//                     traffic data to recommend the most effective advertisement
//                     locations?
//                   </p>
//                   <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal">
//                     Ad Optima combines local demographic data with real-time
//                     foot traffic patterns to identify the most effective
//                     advertisement locations. This integrated approach ensures
//                     that your ads reach the most relevant audience.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-center items-center mb-8">
//             <div className="flex justify-between w-[1248px] h-[155px] border-solid border-slate-300 border-2 rounded-lg p-6 items-center bg-white">
//               <div>
//                 <h2 className="text-blue-600 text-4xl font-extrabold">
//                   Elevate Your Advertising Strategy
//                 </h2>
//                 <p className="text-neutral-500">
//                   Get personalized advertising recommendations for your business
//                   in Manhattan.
//                 </p>
//               </div>
//               <div>
//                 <Button type="primary" onClick={handleNavigate}>
//                   Get Started
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </Element>
//     </>
//   );
// }
import React from "react";
import { Button, Rate, Collapse } from "antd";
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Link, Element } from "react-scroll";
const FAQURL = "https://i.imgur.com/qAcFhCm.png";
const LoyalCustomerURL = "https://i.imgur.com/yoeEJxl.jpeg";
const Review1URL = "https://i.imgur.com/BljlzeW.png";
const Review2URL = "https://i.imgur.com/eVxQbFk.png";
const Review3URL = "https://i.imgur.com/qPtFwCu.png";
const AnalyticsURL = "https://i.imgur.com/O2NT6DB.png";
const BillBoardsURL = "https://i.imgur.com/j58CQma.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    console.log("Navigating to /register");
    navigate("/register");
  };

  const { Panel } = Collapse;
  

 

  return (
    <>
    <nav className="flex justify-between items-center bg-blue-600 w-full pt-2.5 pr-4 pb-3 px-4 h-12 text-white">
      <h2 className="text-xl">Ad Optima</h2>
      <ul className="flex flex-1 justify-center space-x-8">
          <li className="cursor-pointer">
              <Link 
                  to="insights" 
                  smooth={true} 
                  duration={500} 
                  className="nav-link text-white transition-opacity duration-500"
              >
                  Insights
              </Link>
          </li>
          <li className="cursor-pointer">
              <Link 
                  to="testimonials" 
                  smooth={true} 
                  duration={500} 
                  className="nav-link text-white transition-opacity duration-500"
              >
                  Testimonials
              </Link>
          </li>
          <li className="cursor-pointer">
              <Link 
                  to="faq" 
                  smooth={true} 
                  duration={500} 
                  className="nav-link text-white transition-opacity duration-500"
              >
                  FAQ
              </Link>
          </li>
      </ul>
      <Link to="insights" smooth={true} duration={500}>
          <Button className="text-base leading-normal" type="default">Learn More</Button>
      </Link>
    </nav>

      <section className="p-8 h-screen flex justify-center items-center bg-gray-200">
        <div className="flex justify-center items-center space-x-16 max-w-7xl relative">
          <div className="flex flex-col space-y-4 max-w-md">
            <div className="flex flex-col pb-5" style={{ maxWidth: '608px' }}>
              <h1 className="text-4xl font-bold pb-4 leading-[48px] " style={{ maxWidth: '547px' }}>
                Boost Your Advertising Strategy with Ad Optima
              </h1>
              <p
                className="text-gray-500 font-normal leading-5 mt-2"
                style={{ maxWidth: "547px" }}
              >
                Get targeted advertising recommendations based on foot traffic
                and demographics in Manhattan.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button  className="pr-4 text-base leading-normal" type="primary" onClick={handleNavigate}>Get Started</Button>
              <Link to="insights" smooth={true} duration={500}>
                <Button  className="text-base leading-normal" type="default">Learn More</Button>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <img src={LoyalCustomerURL} alt="Loyal Customer" className="w-16 h-16 object-cover rounded-lg shrink-0	" />
              </div>
              <div className="w-px bg-gray-300 h-auto mx-4"></div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <Rate
                    allowHalf={false}
                    defaultValue={5}
                    disabled
                    className="text-[16px]"
                  />
                  <span className="text-gray-500 pl-1.5 text-xs">5.0</span>
                </div>
                <div className="mt-2 text-gray-500 text-sm">
                  <p className="leading-[14px]">
                    Rated Best Over <span className="font-semibold text-black">15.7k</span> Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-lg" style={{ paddingRight: '96px' }}>
              <img src={BillBoardsURL} alt="Times Square" className="w-[448px] h-[654.766px] object-cover " />
            </div>
          </div>
        </div>
      </section>

      <Element name="insights">
        <section className="pt-12 pb-10 bg-gray-200 relative">
          <div className="relative mx-auto bg-white p-8 rounded-lg shadow-md" style={{ width: '1248px', marginTop: '-1px', height:"796px" }}>
            <div className="text-center">
              <h2 className="text-4xl font-extrabold mb-4 leading-9	tracking-[-1.4px] mb-16">Optimize Your Targeted Advertising</h2>
              <p className="text-gray-500 max-w-[732px] mx-auto text-xl leading-5	pb-16">
              Ad Optima is a web-based application that refines advertising strategies by offering precise location recommendations based on target demographics, market interests, and dates. Maximize the effectiveness of your ad placements with actionable insights from Ad Optima.
              </p>
            </div>
            <div className="relative flex items-start justify-between w-full mt-8">
              <div className="flex flex-col space-y-16">
                <div>
                  <h3 className="font-bold text-l text-center mb-2.5 leading-5	">Location Analysis</h3>
                  <p className="text-gray-500 max-w-[327px] text-center font-normal  text-base leading-4	">
                  Get top 10 recommended ad locations for Manhattan.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-l text-center mb-2.5 leading-5	">Demographic Targeting</h3>
                  <p className="text-gray-500 max-w-[310px] text-center font-normal text-base leading-4	">
                  Refine your ad strategy with targeted demographic insights and visuals.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-l text-center mb-2.5 leading-5	">Ad Placement</h3>
                  <p className="text-gray-500 max-w-[310px] text-center font-normal text-base leading-4	">
                  Explore billboards and placements in selected locations for tailored ads.
                  </p>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <img
                  src={AnalyticsURL}
                  alt="Recommended Advertising Locations"
                  className="max-w-[672px] h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </Element>

      <Element name="testimonials">
        <section className="pt-20 pb-20 bg-gray-200 relative">
            <div className="max-w-[1248px] mx-auto px-4">
            <h2 className="font-bold text-4xl mb-8 text-center leading-9	tracking-[-1.4px]">Testimonials</h2>
            <div className="flex flex-row space-x-8">
                <div className="flex flex-col items-center">
                <p className="text-gray-500 text-center mb-2 leading-normal	">
                    "Ad Optima has transformed our advertising strategy. Its precise recommendations have markedly enhanced our campaign results, delivering exceptional improvements in performance."
                </p>
                <div className="flex items-center space-x-4">
                    <img src={Review1URL} alt="Customer Review 1" className="w-16 h-16 rounded-full"/>
                    <div className="flex flex-col justify-center">
                    <p className="text-blue-600 font-semibold mb-0 leading-4	">Jessica Smith</p>
                    <p className="text-gray-500 text-sm mt-1 leading-[14px]">Marketing Manager</p>
                    </div>
                </div>
                </div>
                <div className="flex flex-col items-center">
                <p className="text-gray-500 text-center mb-2 leading-normal	">
                    "Ad Optima proved its value remarkably. Following its recommendations resulted in a substantial increase in both foot traffic and sales."
                </p>
                <div className="flex items-center space-x-4">
                    <img src={Review2URL} alt="Customer Review 2" className="w-16 h-16 rounded-full"/>
                    <div className="flex flex-col justify-center">
                    <p className="text-blue-600 font-semibold mb-0 leading-4	">Michael Johnson</p>
                    <p className="text-gray-500 text-sm mt-1 leading-[14px]">Sales Director</p>
                    </div>
                </div>
                </div>
                <div className="flex flex-col items-center">
                <p className="text-gray-500 text-center mb-2 leading-normal	">
                    "The recommendations from Ad Optima are absolutely outstanding. Our marketing strategies are now more targeted and effective, greatly enhancing our overall ROI."
                </p>
                <div className="flex items-center space-x-4">
                    <img src={Review3URL} alt="Customer Review 2" className="w-16 h-16 rounded-full"/>
                    <div className="flex flex-col justify-center">
                    <p className="text-blue-600 font-semibold mb-0 leading-4	">Emily Brown</p>
                    <p className="text-gray-500 text-sm mt-1 leading-[14px]">Business Owner</p>
                    </div>
                </div>
                </div>

            </div>
            </div>
        </section>
      </Element>

      <Element name="faq">
          <section className="pt-16 pb-20 bg-gray-200 relative mb-0">
              <div className="flex flex-col items-center p-8">
                  <div className="flex items-center space-x-[112px]">
                      <div className="flex-shrink-0">
                          <img src={FAQURL} alt="FAQ Image" className="w-[536px] h-[536px] object-cover rounded-lg" />
                      </div>
                      <div className="max-w-[536px] flex flex-col justify-start relative" style={{ top: '10px', bottom: '10px' }}>
                          <p className="font-normal text-blue-500 text-lg leadin-[18px]">FAQ</p>
                          <p className="text-3xl font-bold pb-16 leading-[30px]">Looking for answers?</p>

                          <Collapse
                              expandIcon={({ isActive }) => isActive ? <DownOutlined /> : <RightOutlined />}
                              expandIconPosition="right"
                              ghost
                              accordion
                          >
                              <Panel className="font-semibold text-gray-500 font-normal text-lg  leading-[18px]" header="How does Ad Optima analyze foot traffic?" key="1">
                                  <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal text-base leading-4	">
                                      Ad Optima leverages comprehensive datasets from taxi and subway systems to analyze foot traffic patterns. By examining the volume and frequency of taxi pickups and subway ridership, Ad Optima can identify high-traffic areas and peak times.
                                  </p>
                              </Panel>
                              <Panel className="font-semibold text-gray-500 font-normal text-lg leading-[18px]" header="What demographic data does Ad Optima consider?" key="2">
                                  <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal text-base leading-4	">
                                      Ad Optima considers key demographic factors such as age and gender. By analyzing these aspects, Ad Optima tailors advertising strategies to target specific audience segments more effectively, ensuring that your ads reach the most relevant groups based on their age and gender profiles.
                                  </p>
                              </Panel>
                              <Panel className="font-semibold text-gray-500 font-normal text-lg leading-[18px]" header="How does Ad Optima integrate local demographic and foot traffic data to recommend the most effective advertisement locations?" key="3">
                                  <p className="pt-4 pr-6 pb-4 pl-4 text-gray-500 font-normal text-base leading-4	">
                                      Ad Optima merges local demographic data with real-time foot traffic patterns to pinpoint the best ad locations. By analyzing where your target audience frequently visits, Ad Optima ensures your ads reach the most relevant and high-traffic areas.
                                  </p>
                              </Panel>
                          </Collapse>
                      </div>
                  </div>
              </div>
              <div className="flex justify-center items-center">
                  <div className="flex justify-between w-[1248px] h-[155px] border-solid border-slate-300 border-2 rounded-lg p-6 items-center bg-white">
                      <div>
                          <h2 className="text-blue-600 text-4xl font-extrabold pb-5 leading-9 tracking[-1.4px]">Elevate Your Advertising Strategy</h2>
                          <p className="text-neutral-500 leading-[18px]">Get personalized advertising recommendations for your business in Manhattan.</p>
                      </div>
                      <div>
                          <Button className="text-base" type="primary" onClick={handleNavigate}>Get Started</Button>
                      </div>
                  </div>
              </div>
          </section>
      </Element>

    </>
  );
}
