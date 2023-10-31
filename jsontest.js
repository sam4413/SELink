const jp = require('jsonpath');
const JSONbig = require('json-bigint');

// Your JSON string
const jsonString = '[{"id":130377294433190533,"name":"Gladiator Bug AI","worldData":{"position":{"x":1003140.56,"y":176770.609,"z":1611574.75},"forward":{"x":0.105684042,"y":0.466241866,"z":0.878322124},"up":{"x":0.0582825467,"y":0.878845811,"z":-0.473532766},"linearVelocity":{"x":0,"y":0,"z":0},"angularVelocity":{"x":0,"y":0,"z":0}},"biggestOwner":144115188075855885,"owners":[144115188075855885,144115188075855885],"blockCount":36,"pcu":321},{"id":116079994857152854,"name":"Small Grid 4141","worldData":{"position":{"x":1055522.13,"y":174061.297,"z":1602727.75},"forward":{"x":0.333590448,"y":0.379703939,"z":0.862868667},"up":{"x":0.428242803,"y":0.75437367,"z":-0.497522235},"linearVelocity":{"x":0,"y":0,"z":0},"angularVelocity":{"x":0,"y":0,"z":0}},"biggestOwner":144115188075855885,"owners":[144115188075855885,144115188075855885],"blockCount":2,"pcu":51},{"id":102651910439986365,"name":"Small Grid 113","worldData":{"position":{"x":1003129.31,"y":177211.188,"z":1612646.88},"forward":{"x":-0.68084842,"y":0.607011259,"z":-0.409857273},"up":{"x":-0.634880781,"y":-0.768140674,"z":-0.0829860568},"linearVelocity":{"x":0,"y":0,"z":0},"angularVelocity":{"x":0,"y":0,"z":0}},"biggestOwner":144115188075855885,"owners":[144115188075855885,144115188075855885],"blockCount":8,"pcu":114}]';

// Parse the JSON string with JSONbig library
const jsonData = JSONbig.parse(jsonString);

// Convert the jsonData to a regular JavaScript object
const jsonObject = JSON.parse(JSON.stringify(jsonData));

// Perform JSONPath query to obtain all values with the key "id"
const ids = jp.query(jsonObject, '$..id');

// Output the results
console.log(ids);