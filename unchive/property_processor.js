this.addEventListener('message', function(e) {
  var propertyJSON = e.data.propertyJson;
  var descriptorJSON = e.data.descriptorJSON;

  var properties = [];
  for(let property of descriptorJSON) {
    console.log(property.name);
    if(propertyJSON.hasOwnProperty(property.name))
      properties.push({
        'name' : property.name,
        'value' : propertyJSON[property.name]
      });
    else
      properties.push({
        'name' : property.name,
        'value' : property.defaultValue
      });
  }
  this.postMessage({'properties' : properties});
}, false);
