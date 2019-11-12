this.addEventListener('message', function(e) {
  var type = e.data.type;
  var propertyJSON = e.data.propertyJson;
  var descriptorJSON = e.data.descriptorJSON;

  this.postMessage({'properties' : []});
}, false);
