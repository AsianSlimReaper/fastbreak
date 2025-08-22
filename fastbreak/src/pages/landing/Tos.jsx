import React from "react";
import './Tos.css'
import {Link} from "react-router-dom";
import LandingNav from "../../components/landing/landingnav.jsx";
import Footer from "../../components/landing/Footer.jsx";

function Tos(){
    return(
        <>
            <LandingNav/>
            <main>
                <div className='tos-container'>
                    <h1>Terms of Service</h1>
                    <p>Last updated: July 18, 2025</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using FastBreak, you agree to be bound by these Terms of Service and our Privacy Policy.</p>

                    <h2>2. Use of Service</h2>
                    <p>You agree to use FastBreak only for lawful purposes and in accordance with these terms. You may not use our platform to distribute harmful, offensive, or illegal content.</p>

                    <h2>3. Account Responsibility</h2>
                    <p>You are responsible for maintaining the confidentiality of your account and password. FastBreak is not liable for any unauthorized access resulting from your failure to secure your credentials.</p>

                    <h2>4. Intellectual Property</h2>
                    <p>All content and materials on FastBreak—including logos, graphics, and software—are owned by or licensed to us and are protected by copyright and trademark laws.</p>

                    <h2>5. Termination</h2>
                    <p>We may terminate or suspend your access to FastBreak at any time, without notice or liability, for any reason including violation of these terms.</p>

                    <h2>6. Limitation of Liability</h2>
                    <p>FastBreak is provided "as is" without warranties of any kind. We are not responsible for damages arising from your use of the service.</p>

                    <h2>7. Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time. If we do, we will post the updated version on this page and update the "Last updated" date above.</p>

                    <h2>8. Contact Us</h2>
                    <p>If you have any questions about these Terms <Link to ="/contact"><strong>Please Click Here To Contact Us</strong></Link>.</p>
                    <p>note that this is a project for school and not an actual app</p>
                </div>
                <Footer/>
            </main>
        </>
    )
}

export default Tos