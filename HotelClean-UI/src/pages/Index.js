import React from 'react';
import Footer from '../components/Footer';
import HowContent from '../components/HowContent';
import InstructionsContent from '../components/InstructionsContent';
import DasboardContent from '../components/DashboardContent';
import DescriptionContent from '../components/DescriptionContent';
import { hotelActions } from "../modules/actions";
const LandingPage = () => {
    return (
        <div className="container">
            <header className="top">
                <div className="branding">
                    <img src='../assets/svgs/logo.svg' />
                    <p className="tagline">a &lt;Trave/Scrum&gt; Hackathon project by Smart Hotel Rate</p>
                </div>
            </header>
            <DescriptionContent />
            <HowContent />
            <InstructionsContent />
            <DasboardContent />
            <Footer />
        </div>
    )
}

LandingPage.fetchData = hotelActions.initHotel;
export default LandingPage;
