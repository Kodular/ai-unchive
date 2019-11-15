this.addEventListener('message', function(e) {
  var propertyJSON = e.data.propertyJSON;
  var descriptorJSON = e.data.descriptorJSON;

  var properties = [];
  for(let property of descriptorJSON) {
    if(propertyJSON.hasOwnProperty(property.name))
      properties.push({
        'name' : property.name,
        'value' : propertyJSON[property.name]
      });
    else
      properties.push({
        'name' : property.name,
        'value' : property.defaultValue,
				'editorType' : property.editorType
      });
  }
  this.postMessage({'properties' : properties});
}, false);
