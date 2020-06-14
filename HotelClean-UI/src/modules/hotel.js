import { fetch, createActionByType, createToken } from '../utils/utils';
import { combineReducers } from 'redux';
const FETCH_HOTEL= 'FETCH_HOTEL';
const FETCH_LOCATION_TYPES = 'FETCH_LOCATION_TYPES';

const LOCATION_TYPES = {
    Rooms: 'Rooms',
    PublicArea: "Public Areas",
    Elevators: "Elevators",
    Restrooms: "Restrooms"
}

export const initHotel = () => async (dispatch) => {
    await getHotel()(dispatch);
    await getLocationTypes()(dispatch);
}


export const getHotel =  () => async (dispatch) => {
    const JWT_TOKEN = await createToken("91c9988e-ab0f-45b0-aec5-668657a12421");
    const hotel = await fetch({
        url: `https://kleen.fixhotelrate.com/api/clean-hotel-api/hotel_cleaning_data/Hilton London`,

    }, JWT_TOKEN);
    dispatch(createActionByType(FETCH_HOTEL)(hotel));
}

export const getLocationTypes = () => async (dispatch) => {
    const JWT_TOKEN = await createToken("91c9988e-ab0f-45b0-aec5-668657a12421");
    const locationTypes = await fetch({
        url: 'https://kleen.fixhotelrate.com/api/clean-hotel-api/location_types'
    }, JWT_TOKEN)
    const locationTypesLabels = locationTypes.map((locationType) => {
        return {
            ...locationType,
            label: LOCATION_TYPES[locationType.Name]
        }
    });
    dispatch(createActionByType(FETCH_LOCATION_TYPES)(locationTypesLabels));
}

const hotel = (state = [], { type, payload }) => (type === FETCH_HOTEL ? payload : state) ;
const locationTypes = (state = [], { type, payload }) => (type === FETCH_LOCATION_TYPES ? payload : state) ;

export default combineReducers({
    hotel,
    locationTypes
});
