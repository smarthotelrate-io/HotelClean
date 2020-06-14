const express = require('express');
const fs = require('fs');
const path = require('path');
const { verify, sign, decode } = require('jsonwebtoken');
var ClientOAuth2 = require('client-oauth2');
const axios = require("axios");
const jwtSecret = process.env.JWT_SECRET;
const { API_CALL, CLIENT_ID, CLIENT_SECRET, API_USER, API_PASSWORD, TOKEN_END_POINT, API_BASE_URL, 
  GET_ALL_LOCATION_TYPES_END_POINT, GET_ALL_LOCATIONS_BY_TYPE_END_POINT, GET_ALL_ACTIVITIES_BY_LOCATION_END_POINT } = process.env;
const router = express.Router();


const verifyJwtToken = async (req, res, next) => {
  try {
    const token = req.headers['jwt-token'];
    console.log(token);
    console.log(jwtSecret);
    const decodedJWT = verify(token, jwtSecret);
    console.log('Token verified successfully');
    next();
  } catch (e) {
    next(e)
  }
};

const getAllLocationTypes = async (req, res, next) => {
  try {
    let data = {};
    console.log(API_CALL);
    if (API_CALL !== 'MOCK') {
      data = await getAllLocationTypesFromTraknKleenAPI();
    } else {
      // call the live api
      data = fs.readFileSync(path.join(__dirname, './allLocationTypes.json'));
    }

    const allLocationTypes = JSON.parse(data);
    res.json(allLocationTypes);
  } catch (e) {
    next(e);
  }
};

const getLocationsByType = async (req, res, next) => {
  try {
    let allLocationsByType = {};
    console.log(API_CALL);
    const locationType = req.params.type;
    if (API_CALL !== 'MOCK') {
      const data = await getAllLocationsByTypeFromTraknKleenAPI(locationType);
      allLocationsByType = JSON.parse(data);
    } else {
      const data = fs.readFileSync(path.join(__dirname, './locationsByTypes.json'));
      const allLocationsByTypes = JSON.parse(data);
      allLocationsByType = allLocationsByTypes.filter(locationsByType => locationsByType.Type === locationType);
    }

    res.json(allLocationsByType);
  } catch (e) {
    next(e);
  }
};

const getLocationActivityByLocationId = async (req, res, next) => {
  try {
    const locationId = req.params.locationId;
    console.log('locationId=' + locationId);
    const data = fs.readFileSync(path.join(__dirname, './locationActivities.json'));
    const allLocationActivities = JSON.parse(data);
    const locationActivitiesById = allLocationActivities.filter(locationActivity => locationActivity.LocationID == parseInt(locationId));
    res.json(locationActivitiesById);
  } catch (e) {
    next(e);
  }
};

const getLocationActivityByLocationName = async (req, res, next) => {
  try {
    let allActivitiesByLocationName = {};
    const locationName = req.params.locationName;
    console.log(API_CALL);    
    console.log('locationName=' + locationName);

    if (API_CALL !== 'MOCK') {
      const data = await getAllActivitiesByLocationFromTraknKleenAPI(locationName);
      allActivitiesByLocationName = JSON.parse(data);
    } else {
      const locationTypesData = fs.readFileSync(path.join(__dirname, './locationsByTypes.json'));
      const allLocationsByTypes = JSON.parse(locationTypesData);
      const locationByName = allLocationsByTypes.find(locationsByType => locationsByType.Name === locationName);
      console.log('Locations=' + JSON.stringify(locationByName));
      const locationActivitiesData = fs.readFileSync(path.join(__dirname, './locationActivities.json'));
      const allLocationActivities = JSON.parse(locationActivitiesData);
      allActivitiesByLocationName = allLocationActivities.filter(locationActivity => locationActivity.LocationID === parseInt(locationByName.LocationID));
    }

    res.json(allActivitiesByLocationName);
  } catch (e) {
    next(e);
  }
};


const getHotelWithCleaningData = async (req, res, next) => {
  try {
    const hotelName = req.params.hotelName;
    console.log('hotelName=' + hotelName);
    const hotelWithCleaningData = fs.readFileSync(path.join(__dirname, './hotelDetailsWithCleaningData.json'));
    const hotelWithCleaningDetailsList = JSON.parse(hotelWithCleaningData);
    const hotelWithCleaningDetails = hotelWithCleaningDetailsList.find(hotelCln => hotelCln.Hotel.Name === hotelName);
    res.json(hotelWithCleaningDetails);
  } catch (e) {
    next(e);
  }
};

// router.use(verifyJwtToken);
router
  .route('/location_types')
  .get(getAllLocationTypes);
router
  .route('/locations_type/:type')
  .get(getLocationsByType);
router
  .route('/location_activity/:locationId')
  .get(getLocationActivityByLocationId);
router
  .route('/location_activity/location/:locationName')
  .get(getLocationActivityByLocationName);
router
  .route('/hotel_cleaning_data/:hotelName')
  .get(getHotelWithCleaningData);


async function getToken() {
  try {
    console.log('Calling token');
    var kleenAPI = new ClientOAuth2({
      clientId: '985ccd74',
      clientSecret: 'cc00c224-9ff8-49e8-8cec-019c16883cae',
      accessTokenUri: 'http://tnkapi.traknprotect.com/token',
    });

    const token = await Promise.resolve(kleenAPI.owner.getToken('Henrik', 'R0e2451@'));
    console.log(token);
    return token;

  }
  catch (error) {
    console.error(error);
  }
}


async function getAllLocationTypesFromTraknKleenAPI() {
  let locationTypesData = {};
  try {
    console.log('Calling token');
    const accessToken = await getToken();
    console.log('accessToken='+accessToken);
    if (accessToken) {
      const response = await axios({
        url: API_BASE_URL+GET_ALL_LOCATION_TYPES_END_POINT,
        method: 'get',
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      });
      locationTypesData = JSON.stringify(response.data);
      console.log('Response=' + locationTypesData);
    }
  } catch (error) { console.error('Error=' + error) }
  return locationTypesData;
}

async function getAllLocationsByTypeFromTraknKleenAPI(locationType) {
  let locationTypesData = {};
  try {
    console.log('Calling token');
    const accessToken = await getToken();
    console.log('accessToken='+accessToken);
    if (accessToken) {
      const response = await axios({
        url: API_BASE_URL+GET_ALL_LOCATIONS_BY_TYPE_END_POINT+'/'+locationType,
        method: 'get',
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      });
      locationTypesData = JSON.stringify(response.data);
      console.log('AllLocationsByTypeResponse=' + locationTypesData);
    }
  } catch (error) { console.error('Error=' + error) }
  return locationTypesData;
}

async function getAllActivitiesByLocationFromTraknKleenAPI(locationName) {
  let locationTypesData = {};
  try {
    console.log('Calling token');
    const accessToken = await getToken();
    console.log('accessToken='+accessToken);
    if (accessToken) {
      const response = await axios({
        url: API_BASE_URL+GET_ALL_ACTIVITIES_BY_LOCATION_END_POINT+'/'+locationName,
        method: 'get',
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        }
      });
      locationTypesData = JSON.stringify(response.data);
      console.log('AllActivitiesByLocationResponse=' + locationTypesData);
    }
  } catch (error) { console.error('Error=' + error) }
  return locationTypesData;
}

async function getToken() {
  let token = '';
  try {
    var kleenAPI = new ClientOAuth2({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      accessTokenUri: API_BASE_URL+TOKEN_END_POINT,
    });

    const tokenDetailsJSON = await kleenAPI.owner.getToken(API_USER, API_PASSWORD);
    const { accessToken } = tokenDetailsJSON;
    console.log('Access token= ' + accessToken);
    token = accessToken;
  } catch (error) {
    console.error(error);
  }
  return token;
}


module.exports = router;