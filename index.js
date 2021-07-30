// index.js
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');
const ip4 = `174.119.234.252`;
const myCoords = { latitude: 43.6752, longitude: -79.3472 };

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP: ", ip);
});

fetchCoordsByIP(ip4, (error, coords) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! My coordinates are: ", coords);
});

fetchISSFlyOverTimes(myCoords, (error, passingTime) => {
  if (error) return console.log("It didn't work!", error);

  console.log("It worked! ISS passing overhead at: ", passingTime);
});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) return console.log("It didn't work!", error);

  printPassTimes(passTimes);
});