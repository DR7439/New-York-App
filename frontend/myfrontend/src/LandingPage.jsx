import React from "react";
import { Button, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import {Link, Element} from "react-scroll"
import TimeSquare from "/Times-Square.jpg"
import LoyalCustomer from "/Loyal-Customers.jpg"
import Computer from "/computer.png"
import Review1 from "/review1.png"
import Review2 from "/review2.png"
import Review3 from "/review3.png"
import FAQ from "/FAQ.png"
export default function LandingPage() {
    const navigate = useNavigate();

    const handleNavigate = () => {
    console.log("Navigating to /register")
    navigate("/register");
  };




  return (
    <> 
    {/* <nav className="flex justify-between items-center bg-blue-600 w-full pt-2.5 pr-4 pb-3 px-4 h-12	 text-white">
        <h2 className=" w-[95px] h-[28px]">Ad Optima</h2>
        <ul className="flex space-x-4">
                <li href="#" className="cursor-pointer  w-[95px] h-[28px]">
                    Features
                </li>
                <li href="#" className="cursor-pointer  w-[95px] h-[28px]">
                    Testimonials
                </li>
                <li href="#" className="cursor-pointer  w-[95px] h-[28px]">
                    FAQ
                </li>
        </ul>
        <Button type="primary" onClick={handleNavigate}>Get Started</Button>
    </nav> */}
        <nav className="flex justify-between items-center bg-blue-600 w-full pt-2.5 pr-4 pb-3 px-4 h-12 text-white">
        <h2 className="w-[95px] h-[28px]">Ad Optima</h2>
        <ul className="flex space-x-4">
            <li className="cursor-pointer w-[95px] h-[28px]">
            <Link to="features" smooth={true} duration={500} className="hover:underline">
                Features
            </Link>
            </li>
            <li className="cursor-pointer w-[95px] h-[28px]">
            <Link to="testimonials" smooth={true} duration={500} className="hover:underline">
                Testimonials
            </Link>
            </li>
            <li className="cursor-pointer w-[95px] h-[28px]">
            <Link to="faq" smooth={true} duration={500} className="hover:underline">
                FAQ
            </Link>
            </li>
        </ul>
        <Button type="primary" onClick={handleNavigate}>Get Started</Button>
        </nav>


        
        <section className="flex justify-center items-center space-x-16 p-8 h-screen">
            <div className="flex flex-col space-y-4 max-w-md">
                <h1 className="text-3xl font-bold text-justify">Boost Your Advertising Strategy with Ad Optima</h1>
                <p className="text-gray-400 text-justify">Get targeted advertising recommendations based on foot traffic and demographics in Manhattan.</p>
                <div className="flex space-x-4">
                    <Button type="primary" onClick={handleNavigate}>Get Started</Button>
                    <Button type="default">Learn More</Button>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center">
                        <img
                            src={LoyalCustomer} // Replace RegCustomers with BusinessDeal
                            alt="Loyal Customer"
                            className="w-24 h-24 object-cover rounded-lg" // Adjust size to fit your layout
                        />
                    </div>
                    
                    <div className="w-px bg-gray-300 h-auto mx-4"></div>
                    <div className="flex flex-col items-start">
                        <div className="flex items-center">
                            <Rate allowHalf={false} defaultValue={5} disabled className="custom-rate" />
                            <span className="text-gray-400 pl-1.5">5.0</span>
                        </div>
                        <div className="mt-2 text-gray-400">
                            <p>Rated Best Over <span className="font-semibold text-black">15.7k</span> Reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <img
                    src={TimeSquare}
                    alt="Times Square"
                    className="w-[448px] h-[654.766px] object-cover rounded-lg"
                />
            </div>
        </section>
        <Element name="features">
            <section>
            <div className="flex flex-col items-center justify-center">
                <div className="text-center mb-16"> 
                    <h2 className="font-bold text-2xl">Optimize Your Targeted Advertising</h2>
                    <p className="text-gray-400 max-w-[732px] mx-auto">
                        Ad Optima is a web-based application that leverages foot traffic and demographic data to provide businesses with tailored advertising recommendations in Manhattan. 
                        Maximize the effectiveness of your ad placements with actionable insights from Ad Optima.
                    </p>
                </div>

                <div className="flex items-start justify-between w-full max-w-[1200px] relative">
                    <div className="flex flex-col space-y-16 mt-24"> 
                        <div>
                            <h3 className="font-bold text-2xl text-center">Location Analysis</h3>
                            <p className="text-gray-400 max-w-[327px] text-center">Utilize real-time foot traffic data to identify the best locations for your ads.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-2xl text-center">Demographic Targeting</h3>
                            <p className="text-gray-400 max-w-[310px] text-center">Tailor your ads to specific demographics based on comprehensive data analysis.</p>
                        </div>
                    </div>
                    <div className="ml-40">
                        <img src={Computer} alt="Computer" className="max-w-[672px] h-[384px]" />
                    </div>
                </div>
            </div>
        </section>
        </Element>
        <Element name="testimonials">
            <section className="mt-8">
            <h2 className="font-bold text-2xl mb-8 text-center">What Others Say About Us</h2>
            <div className="flex flex-row space-x-8">
                <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-center mb-2">"Ad Optima has revolutionized the way we approach advertising. The recommendations are spot on and have significantly improved our campaign outcomes."</p>
                    <div className="flex items-center space-x-4">
                        <img src={Review1} alt="Customer Review 1" className="w-16 h-16 rounded-full"/>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-600 font-semibold mb-0">Jessica Smith</p>
                            <p className="text-gray-400 text-sm mt-1">Marketing Manager</p>
                        </div>
                    </div>
                    
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-center mb-2">"I was skeptical at first, but Ad Optima proved its worth. We saw a noticeable increase in foot traffic and sales after following its suggestions."</p>
                    <div className="flex items-center space-x-4">
                        <img src={Review2} alt="Customer Review 2" className="w-16 h-16 rounded-full"/>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-600 font-semibold mb-0">Michael Johnson</p>
                            <p className="text-gray-400 text-sm mt-1">Sales Director</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-center mb-2">"Ad Optima is a game-changer for businesses in Manhattan. The insights provided are invaluable, and the interface is user-friendly. Highly recommend it!"</p>
                    <div className="flex items-center space-x-4">
                        <img src={Review3} alt="Customer Review 3" className="w-16 h-16 rounded-full"/>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-600 font-semibold mb-0">Emily Brown</p>
                            <p className="text-gray-400 text-sm mt-1">Business Owner</p>
                        </div>
                    </div>
                </div>

            </div>
            
        </section>
        </Element>
        
        <Element name="faq">
            <section className="mt-8">

        <div className="flex flex-col items-center p-8">
            <h2 className="font-bold text-2xl mb-8">FAQ</h2>

            <div className="flex items-center space-x-[112px]">
                <div className="flex-shrink-0">
                    <img src={FAQ} alt="FAQ Image" className="w-[536px] h-[536px] object-cover rounded-lg" />
                </div>

                <div className="max-w-[536px] flex flex-col justify-center">
                    <div className="mb-6">
                        <p className="font-semibold">How does Ad Optima analyze foot traffic?</p>
                        <p className="pt-4 pr-6 pb-4 pl-4">Ad Optima utilizes GPS tracking data from mobile devices and partnerships with location data providers to analyze foot traffic patterns in real-time.</p>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold">What demographic data does Ad Optima consider?</p>
                        <p className="pt-4 pr-6 pb-4 pl-4"></p>
                    </div>

                    <div className="mb-6">
                        <p className="font-semibold">How does Ad Optima integrate local demographic and foot traffic data to recommend the most effective advertisement locations?</p>
                        <p className="pt-4 pr-6 pb-4 pl-4"></p>
                    </div>
                </div>
            </div>
        </div>

        <div>
            
        </div>
            


        </section>
        </Element>
        







  </>
  )
} 