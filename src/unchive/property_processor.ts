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
export function process_properties(propertyJSON: ComponentJson, descriptorJSON: ExtensionDescriptorProperty[]) {
    const properties: { name: string, value: string, editorType?: string }[] = [];
    for (let property of descriptorJSON) {
        if (propertyJSON.hasOwnProperty(property.name)) {
            properties.push({
                name: property.name,
                value: propertyJSON[property.name] as string
            });
        } else {
            properties.push({
                name: property.name,
                value: property.defaultValue,
                editorType: property.editorType
            });
        }
    }
    return properties
}
