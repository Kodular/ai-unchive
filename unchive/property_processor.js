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

onmessage = e => {
  const propertyJSON = e.data.propertyJSON;
  const descriptorJSON = e.data.descriptorJSON;

  const properties = [];
  for (let property of descriptorJSON) {
    if (propertyJSON.hasOwnProperty(property.name)) {
      properties.push({
        'name': property.name,
        'value': propertyJSON[property.name]
      });
    } else {
      properties.push({
        'name': property.name,
        'value': property.defaultValue,
        'editorType': property.editorType
      });
    }
  }
  postMessage({'properties': properties});
}
