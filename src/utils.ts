import {AIProject} from "./unchive/ai_project";
import {BlobWriter, Entry, TextWriter} from "@zip.js/zip.js";
import simpleComponentsJson from './unchive/simple_components.json'

/**
 * Convert the color in &HAARRGGBB format to #RRGGBBAA format
 * @param color
 */
export function convertAiColor(color: string) {
    return '#' + color.substring(4, 10) + color.substring(2, 4);
}

export async function getTextFileContent(file: Entry): Promise<string> {
    return await file.getData!(new TextWriter())
}

export async function getBlobFileContent(file: Entry): Promise<Blob> {
    return await file.getData!(new BlobWriter())
}

export function getFileInfo(file: Entry): [string, string] {
    // return name and type
    const a = file.filename.lastIndexOf('/')
    const b = file.filename.lastIndexOf('.')
    return [file.filename.substring(a + 1, b), file.filename.substring(b + 1)]
}

export async function readProjectProperties(file: Entry): Promise<{ name: string, value: string }[]> {
    const content = await getTextFileContent(file);

    return content.split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .map(line => line.split('=', 2) as [string, string])
        .map(([name, value]) => ({
            name, value
        }));
}


export function getDescriptor(componentType: string) {
    let descriptor = simpleComponentsJson.find(x => x.type === 'com.google.appinventor.components.runtime.' + componentType);
    if (descriptor !== undefined) {
        return descriptor;
    }
    // for (let extension of AIProject.extensions) {
    //     if (extension.name.split('.').pop() === componentType) {
    //         return extension.descriptorJSON;
    //     }
    // }
    return null
}
