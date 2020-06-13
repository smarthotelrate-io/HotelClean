import React from 'react';


const HowContent = () => {
    return (
            <section className="how content">
                <h3>What We've Built</h3>
                <p>To demonstrate the potential of this concept, we built a mobile SMS experience, a web app widget and
                    added an illustration of how this data could be incorporated into a travel manager dashboard.</p>
                <div className="example">
                    <aside className="secondary">
                        <h4>Initial Introduction</h4>
                        <p>Traveler receives an SMS upon booking, giving them the option to receive CleanHotel info.</p>
                        <h6>June 14, 2020 11:51 AM</h6>
                        <ol className="chat">
                            <li className="them">
                                <blockquote>Are you ready for your upcoming stay at the Hilton Midtown Manhattan? We're
                                    following the latest guidelines for cleaning and disinfection. These are unique
                                    times, and rest assured, your health and safety is our highest priority.<br/><br/>
                                        Once you check-in, we can provide you with information on when your room was
                                        last cleaned with our CleanHotel service.<br/><br/>
                                        Reply STOP at any time to opt-out from receiving SMS messages.</blockquote>
                            </li>
                            <li className="me">
                                <blockquote>Thank you 😷</blockquote>
                            </li>
                        </ol>
                    </aside>
                    <main className="secondary">
                        <h4>At Check-In</h4>
                        <p>Traveler receives a welcome message with their room number and cleaning information.</p>
                        <h6>June 14, 2020 11:53 AM</h6>
                        <ol className="chat">
                            <li className="them">
                                <blockquote>Hi, again, and welcome to the Hilton Midtown Manhattan! We wanted to let you
                                    know that your room (1205) was last cleaned on Tuesday, June 9, 2020 at
                                    3:42pm.<br/><br/>
                                    Would you like info on other areas of the hotel? You can respond with the
                                    following:<br/><br/>
                                    P for public areas<br/>
                                    R for restrooms<br/>
                                    E for elevators
                                </blockquote>
                            </li>
                            <li className="me">
                                <blockquote>P</blockquote>
                            </li>
                        </ol>
                    </main>
                    <aside className="secondary">
                        <h4>And More</h4>
                        <p>Cleaning information for additional areas throughout the hotel are also available.</p>
                        <h6>June 14, 2020 11:57 AM</h6>
                        <ol className="chat">
                            <li className="them">
                                <blockquote>Here you go... Our lobby area was last cleaned on Tuesday, June 9, 2020 at
                                    3:42pm.<br/><br/>
                                    The breakfast area was last cleaned today at 1:15pm.<br/><br/>
                                    Would you like info on other areas of the hotel? You can respond with the
                                    following:<br/><br/>
                                    R for restrooms<br/>
                                    E for elevators
                                </blockquote>
                            </li>
                            <li className="me">
                                <blockquote>This is great! Thank you, again 😊</blockquote>
                            </li>
                        </ol>
                    </aside>
                </div>
            </section>

    )
}

export default HowContent;
