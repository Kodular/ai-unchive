/**
 * A web worker that maps two JSON arrays.
 *
 *
 * @file   This file defines the property_processor web worker used in
 *         ai_project::Component::loadProperties.
 * @author vishwas@kodular.io (Vishwas Adiga)
 * @since  1.0.0
 * @license
 */

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
