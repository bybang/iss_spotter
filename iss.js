// iss.js

// finding my ip address
const request = require('request');

const fetchMyIP = function(callback) {
  request(`https://api.ipify.org/?format=json`, function(error, response, body) {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//finding a coordinates
const fetchCoordsByIP = function(ip4, callback) {
  request(`https://freegeoip.app/json/${ip4}`, function(error, response, body) {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // const latitude = JSON.parse(body).latitude
    // const longitude = JSON.parse(body).longitude
    const { latitude, longitude } = JSON.parse(body);

    return callback(null, { latitude, longitude });
  });
};

// ISS TIMES PASSING OVER MY HEAD

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS passing time: ${body}`), null);
      return;
    }

    const result = JSON.parse(body).response;
    return callback(null, result);
  });
};

// NEXT ISS TIMES FOR MY LOCATION

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, passingTime) => {
        if (error) {
          return callback(error, null);
        }
        // console.log(ip)
        // console.log(coords)
        // console.log(passingTime);
        // console.log(date)
        callback(null, passingTime);
        // const risetime = passingTime
        // console.log(risetime)
        //return callback(null, finalTime)
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };