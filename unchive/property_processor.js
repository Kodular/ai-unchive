this.addEventListener('message', function(e) {
  var type = e.data.type;
  var propertyJSON = e.data.propertyJson;
  var descriptorJSON = e.data.descriptorJSON;

  var properties = [];
  for(let property of descriptorJSON.find(x => x.type == type).properties) {
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
