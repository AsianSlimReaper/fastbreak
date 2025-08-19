import React from "react";
import { scroller } from 'react-scroll';
import { Element } from 'react-scroll';
import './home.css';
import LandingNav from '../../components/landing/landingnav.jsx';
import LandingIMG1 from '../../assets/LandingIMG1.png'
import {useNavigate} from "react-router-dom";
import ButtonComponent from "../../components/universal/ButtonComponent.jsx";
import Footer from "../../components/landing/Footer.jsx"
import exampleImage from '../../assets/landing-preview.png';
import statsIcon from '../../assets/stats-icon.png';
import filmCameraIcon from '../../assets/film-camera-icon.png';
import saveIcon from '../../assets/save-icon.webp';
import pieChart from '../../assets/pie-chart-icon.png';

function Home() {
    const navigate = useNavigate()
    const LoginClick = () =>{
        navigate('/login')
    }
    const RegisterClick = () => {
        navigate('/register')
    }

    const scrollToGetStarted = () => {
      scroller.scrollTo('get-started', {
        duration: 1000,
        delay: 0,
        smooth: 'easeInOutQuad'
      });
    }

    return (
        <>
        <LandingNav/>
        <main>
            <div className="landing-home-container">
                <div className="landing-welcome-text">
                    <h1>Welcome To FastBreak</h1>
                    <h2>Redefine Basketball Analytics</h2>
                    <p>
                      FastBreak combines video analysis and stats to create powerful insights and winning strategies
                    </p>
                    <ButtonComponent onClick={scrollToGetStarted}>Get Started</ButtonComponent>
                </div>
                    <img src={LandingIMG1} alt="Basketball strategy dashboard preview" className="LandingIMG1"></img>

                <div className='solution-section-wrapper'>
                    <h2>Solution for High Performance</h2>
                    <div className='solution-icons-grid'>
                        <div className='solution-icon'>
                            <h3>View Film</h3>
                            <img src={filmCameraIcon} alt='View Film' className='view-film-icon'/>
                        </div>
                        <div className='solution-icon'>
                            <h3>Add Stats And Analysis</h3>
                            <img src={statsIcon} alt='Add Stats And Analysis' className='add-stats-icon'/>
                        </div>
                        <div className='solution-icon'>
                            <h3>Export</h3>
                            <img src={saveIcon} alt='Export' className='export-icon'/>
                        </div>
                        <div className='solution-icon'>
                            <h3>Access insights</h3>
                            <img src={pieChart} alt='Access Insights' className='access-insights-icon'/>
                        </div>
                        <div className='example-image'>
                            <img src={exampleImage} alt='FastBreak Example'/>
                        </div>
                    </div>
                </div>

                <Element name='get-started' className="auth-wrapper">
                        <div className="auth-container">
                            <h2>New to Fastbreak?</h2>
                            <p>
                                New here? Create an account to unlock powerful tools,
                                detailed stats, and video breakdowns that elevate your
                                basketball performance and connect you with coaches and
                                teammates seamlessly.
                            </p>
                            <ButtonComponent onClick={RegisterClick}>Create New Account</ButtonComponent>
                        </div>
                        <div className="auth-container">
                            <h2>Already Have An Account?</h2>
                            <p>
                                Welcome back! Please log in to access your personalized dashboard,
                                track your progress, and review the latest game analytics designed
                                to help you improve every step of the way.
                            </p>
                            <ButtonComponent onClick={LoginClick}>Login</ButtonComponent>
                        </div>
                </Element>
            </div>
            <Footer/>
        </main>
        </>
    );
}

export default Home;
