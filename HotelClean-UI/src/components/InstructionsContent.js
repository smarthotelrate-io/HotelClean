import React, { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';
import { hotelActions } from '../modules/actions';
import { connect } from 'react-redux';
import { Dropdown, Menu } from 'semantic-ui-react';


const getRoomLocationIds = ({ locationByTypes, selectedFloor }) => {
    return locationByTypes
        .filter(({ Type, Name }) => Type === "Room" && parseInt(Name.toString()[0]) === selectedFloor)
        .map(({ LocationID }) => LocationID);
}

const getPanes = ({locationTypes, locationByTypes, activities, selectedLocationType, setSelectedLocationType}) => {
    const [selectedLocationId, setSelectedLocationId] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState(1);
    useEffect(() => {
        const { Name } = locationTypes.find(({ LocationTypeID }) => LocationTypeID === selectedLocationType);
        const locationSubTypes = locationByTypes.filter(({ Type }) => Type === Name);
        if (locationSubTypes.length > 0 ) {
            setSelectedLocationId([locationSubTypes[0].LocationID])
        } else {
            setSelectedLocationId(getRoomLocationIds({ locationByTypes, selectedFloor }));
        }
    }, [selectedLocationType]);
    const options = [
        { key: 1, text: 'Floor 1', value: 1 },
        { key: 2, text: 'Floor 2', value: 2 },
    ]
    return  locationTypes.map(({ Name, label }) => {
        return {
            menuItem: label, render: () => {
                return (
                    <div className="webapp-nav">
                        {
                            selectedLocationType === 1 && <div>
                                <Menu compact>
                                    <Dropdown
                                        placeholder='Select Floor'
                                        fluid
                                        search
                                        selection
                                        value={selectedFloor}
                                        onChange={(event, data) => {
                                            const { value: floor } = data;
                                            setSelectedLocationId(getRoomLocationIds({ locationByTypes, selectedFloor: floor }));
                                            setSelectedFloor(floor);
                                        }}
                                        options={options}
                                    />
                                </Menu>
                            </div>
                        }
                        {
                            locationByTypes.filter(({ Type }) => Type === Name).map(({ Name, LocationID }, index) => {
                                return (
                                    <span
                                        onClick={() => setSelectedLocationId([LocationID])}
                                        key={index} href="#"
                                        className={classNames('btn', { 'selected': selectedLocationId.some((id) => id === LocationID) })}>
                                        {Name}
                                    </span>
                                )
                            })
                        }
                        <table style={{ marginTop: '20px' }} className="webapp">
                            <thead>
                                <tr>
                                    <th>Area</th>
                                    <th>Service</th>
                                    <th>Cleaning Time</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                activities.filter(({ LocationID: activityLocId }) => (selectedLocationId.some((id) => id === activityLocId)) )
                                    .map((activity, index) => {
                                        const { Type, Description, Start, End, LocationID: activityLocId } = activity;
                                        const mStart = moment.utc(Start, 'HH:mm');
                                        const mEnd = moment.utc(End, 'HH:mm');
                                        const duration = moment.duration(mEnd.diff(mStart));
                                        const minutes = duration.asMinutes();
                                        const { Name: areaName } = locationByTypes.find(({ LocationID }) => LocationID === activityLocId);
                                        return (
                                            <tr key={index}>
                                                <td>{areaName}</td>
                                                <td>{Description}</td>
                                                <td>
                                                    {moment.utc(Start).format('MMM DD')}{" "}at{" "}
                                                    {moment.utc(Start).format('HH:mm')}
                                                </td>
                                                <td>{minutes}{" "} minutes</td>
                                            </tr>
                                        )
                                    })
                            }
                            </tbody>
                        </table>
                    </div>
                )
            }
        }
    })
}

const InstructionsContent = (props) => {
    const { Hotel, activities, locationTypes, locationByTypes } = props;
    const [selectedLocationType, setSelectedLocationType] = useState(1);
    const onTabChange = (event, data) => {
        const { activeIndex } = data;
        const { LocationTypeID } = locationTypes.find(({ LocationTypeID }) => LocationTypeID === activeIndex + 1);
        setSelectedLocationType(LocationTypeID);
    }
    return (
        <>
            <section className="instructions content">
                <h3>Try it out the SMS version!</h3>
                <p>If you’d like to see the experience we’ve created in this hackathon, text <strong>DEMO</strong> to
                    one of these 2 numbers:</p>
                <h4>+44 7451 286900 UK</h4>
                <h4>+1 201-422-2788 US</h4>
                <p>You will receive a welcome SMS and then 5 seconds later the welcome SMS as if you have checked into a
                    hotel that has the CleanHotel service. From there you can interact with the chat bot to receive
                    illustrative data similar to what could soon be available.</p>
            </section>
            <section className="instructions content">
                <h3>Web App Simulation</h3>
                <p>To give you a sense of the kind data we believe will be available soon from actual hotel cleaning
                    service providers, here is an interactive widget to demonstrate. Click on any of the buttons below,
                    and this page will call the API we built for the SMS experience and return sample data.</p>
                <div className="webapp-container">
                    <span className="list-property-name">{Hotel.Name}</span>
                    <span className="list-property-location">{Hotel.Address}</span>


                    <Tab style={{ marginTop: '20px' }} defaultActiveIndex={0}
                         onTabChange={onTabChange}
                         menu={{ secondary: true, pointing: true }}
                         panes={getPanes({locationTypes, locationByTypes, activities, selectedLocationType, setSelectedLocationType })}
                    />
                </div>

            </section>
        </>
    )
}


const mapStateToProps = (state) => {
    const { root: { hotel: { Hotel, activities, locationByTypes }, locationTypes } } = state;
    return {
        Hotel,
        activities,
        locationTypes,
        locationByTypes
    };
}

export default connect(mapStateToProps,
    {
        ...hotelActions,
    })(InstructionsContent)

