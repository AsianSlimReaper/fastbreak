import React from 'react';
import './about.css';
import LandingNav from "../../components/landing/landingnav.jsx";
import Footer from "../../components/landing/Footer.jsx"


function About(){
    return(
        <>
            <LandingNav/>
            <main>
                <div className='about-container'>
                    <h1>About Us</h1>
                    <h3>Revolutionizing Basketball Performance</h3>
                    <p>FastBreak merges cutting-edge stat tracking with seamless film review, empowering teams to excel
                        on and off the court.</p>
                    <h3>Why FastBreak</h3>
                    <ul>
                        <li><strong>For Coaches</strong>: Manage teams, analyze performance, and deliver targeted
                            feedback—all in one place.
                        </li>
                        <li><strong>For Players</strong>: Access personalized stats and video analysis to enhance your
                            game and stay connect to your development.
                        </li>
                        <li><strong>For Every Team</strong>: Designed for simplicity and built for performance, from
                            local clubs to competitive leagues.
                        </li>
                    </ul>
                    <h3>Our Mission</h3>
                    <p>
                        We believe every team deserves data-driven coaching. FastBreak makes advanced analytics and
                        video tools accessible to all, helping players and coaches grow together.
                    </p>
                    <p>note that this is a project for school and not an actual app</p>
                </div>
                <Footer/>
            </main>
        </>
    )
}

export default About