const jsonString = '{"name":"Torch Remote","schema":{"type":"object","properties":{"listener":{"type":"object","properties":{"urlPrefix":{"$ref":"#/$defs/string"},"listenerType":{"$ref":"#/$defs/WebListenerType"}},"title":"Web Server Config","description":"Basic configuration for serving web api."},"securityKey":{"$ref":"#/$defs/string"}},"$defs":{"string":{"type":"string","title":"Url Prefix","description":"Root url for all requests. If you want access server from remote replace + with your public ip or domain."},"WebListenerType":{"enum":["HttpSys","Internal"],"title":"Listener Type","description":"Type of listener to serve requests. If you want to run on wine use Internal otherwise default is better choice"}}}}';
;

const jsonObj = JSON.parse(jsonString);
const rootKeys = Object.keys(jsonObj.schema.properties);

console.log(rootKeys); // output: ["enabled", "silenceInvalidPatch", "suppressWpfOutput", "enableLoggingTrace", "enableLoggingDebug", "logFilePath"]
