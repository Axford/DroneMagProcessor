
'use strict';

const fs = require('fs');

const inputFilename = 'igrfgridData.json';
const outputFilename = 'mag.dat';

let rawdata = fs.readFileSync(inputFilename);
let magMap = JSON.parse(rawdata);

const minLon = -90;
const maxLon = 0;
const minLat = 0;
const maxLat = 60;

const lonPoints = maxLon - minLon + 1;
const latPoints = maxLat - minLat + 1;
const numPoints = lonPoints * latPoints;

console.log('Creating array size: ' + numPoints);

const points = new Uint8Array(numPoints);

//console.log(magMap.result[0]);

function coordToIndex(lon, lat) {
  return (lon - minLon) + (lat - minLat) * lonPoints;
}

// iterate over map entries
var maxDecl = 0;

for (var i=0; i < magMap.result.length; i++) {
  const r = magMap.result[i];

  const lon = parseInt(r.longitude);
  const lat =  parseInt(r.latitude);
  const index = coordToIndex(lon, lat);
  //console.log(lon, lat, index);

  const decl = parseFloat(r.declination);
  if (Math.abs(decl) > maxDecl) maxDecl = Math.abs(decl);
  points[index] = 128 + Math.round(4*decl);
}

console.log(maxDecl);

console.log(points);

fs.writeFile(outputFilename, points, (err)=> {
  if (err) throw err;
  console.log('It\'s saved!');
});
