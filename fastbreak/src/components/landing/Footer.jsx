import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
        <div className="footer-content">
            <p>© {new Date().getFullYear()} FastBreak. All rights reserved.</p>
            <nav className="footer-nav">
                <p>
                    <Link to='/privacy-policy'>
                        Privacy Policy
                    </Link>
                </p>
                <p>
                    <Link to='/terms-of-service'>
                        Terms of Service
                    </Link>
                </p>
            </nav>
        </div>
        </footer>
  );
}

export default Footer;
