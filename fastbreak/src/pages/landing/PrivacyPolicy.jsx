import React from 'react'
import {Link} from "react-router-dom";
import LandingNav from "../../components/landing/landingnav.jsx";
import Footer from "../../components/landing/Footer.jsx";
import "./PrivacyPolicy.css"

function PrivacyPolicy(){
    return(
    <>
        <LandingNav/>
        <main>
            <div className='policy-container'>
                <h1>Privacy Policy</h1>
                <p><strong>Last Updated:</strong> July 18, 2025</p>

                <h2>1. Information We Collect</h2>
                <ul>
                  <li><strong>Personal Information:</strong> Name, email address, password, and other account details.</li>
                  <li><strong>Usage Data:</strong> Game footage, statistics, user interactions, and session activity.</li>
                  <li><strong>Device & Technical Data:</strong> IP address, browser type, OS, and cookies.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <ul>
                  <li>Provide and improve the FastBreak platform.</li>
                  <li>Personalize your analytics and video dashboard.</li>
                  <li>Send updates and respond to support requests.</li>
                  <li>Track usage to improve performance and security.</li>
                </ul>

                <h2>3. Data Sharing & Third Parties</h2>
                <p>We may share your data with:</p>
                <ul>
                  <li><strong>Trusted Service Providers</strong> (e.g., hosting, analytics, video storage).</li>
                  <li>Legal authorities when required by law or necessary to protect rights.</li>
                </ul>
                <p><strong>We do not sell your personal data.</strong></p>
                <h2>4. Cookies & Tracking</h2>
                <p>We use cookies to track usage, enhance functionality, and manage login sessions.</p>

                <h2>5. Data Security</h2>
                <p>We use reasonable measures to secure your personal information against unauthorized access or disclosure.</p>

                <h2>6. Your Rights</h2>
                <ul>
                    <li>Access or update your account information.</li>
                    <li>Request deletion of your data/account.</li>
                    <li>Opt out of non-essential communications.</li>
                </ul>

                <h2>7. Changes to This Policy</h2>
                <p>We may update this Privacy Policy. We will notify users of significant changes by updating this page’s date.</p>

                <h2>8. Contact Us</h2>
                <p>Have questions?<Link to='/contact'> <strong>Click Here To Contact us</strong></Link></p>
            </div>
            <Footer/>
        </main>
    </>
    )
}

export default PrivacyPolicy