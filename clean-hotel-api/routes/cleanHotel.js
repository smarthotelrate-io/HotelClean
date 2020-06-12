const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const getAllLocationTypes = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './allLocationTypes.json'));
    const allLocationTypes = JSON.parse(data);
    res.json(allLocationTypes);
  } catch (e) {
    next(e);
  }
};

const getLocationsByType = async (req, res, next) => {
  try {
    const locationType = req.params.type;
    const data = fs.readFileSync(path.join(__dirname, './locationsByTypes.json'));
    const allLocationsByTypes = JSON.parse(data);
    const allLocationsByType = allLocationsByTypes.filter(locationsByType => locationsByType.Type === locationType);
    res.json(allLocationsByType);
  } catch (e) {
    next(e);
  }
};

const getLocationActivityByLocationId= async (req, res, next) => {
  try {
    const locationId = req.params.locationId;
    console.log('locationId='+locationId);
    const  data = fs.readFileSync(path.join(__dirname, './locationActivities.json'));
    const allLocationActivities = JSON.parse(data);
    const locationActivitiesById = allLocationActivities.filter(locationActivity => locationActivity.LocationID == parseInt(locationId));
    res.json(locationActivitiesById);
  } catch (e) {
    next(e);
  }
};

const getLocationActivityByLocationName= async (req, res, next) => {
  try {
    const locationName = req.params.locationName;
    console.log('locationName='+locationName);
    const locationTypesData = fs.readFileSync(path.join(__dirname, './locationsByTypes.json'));
    const allLocationsByTypes = JSON.parse(locationTypesData);
    const locationByName = allLocationsByTypes.find(locationsByType => locationsByType.Name === locationName);
    console.log('Locations='+JSON.stringify(locationByName));
    const  locationActivitiesData = fs.readFileSync(path.join(__dirname, './locationActivities.json'));
    const allLocationActivities = JSON.parse(locationActivitiesData);
    const locationActivitiesById= allLocationActivities.filter(locationActivity => locationActivity.LocationID === parseInt(locationByName.LocationID));
    res.json(locationActivitiesById);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/cleanhotel/location_types')
  .get(getAllLocationTypes);
  router
  .route('/api/cleanhotel/locations_type/:type')
  .get(getLocationsByType);
  router
  .route('/api/cleanhotel/location_activity/:locationId')
  .get(getLocationActivityByLocationId);
  router
  .route('/api/cleanhotel/location_activity/location/:locationName')
  .get(getLocationActivityByLocationName);


module.exports = router;