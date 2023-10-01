import {AIProject} from "aia-kit/dist/ai_project";

export function getPackageName(project: AIProject) {
    let mainClass = project.properties.main;
    return mainClass.split('.').slice(0, -1).join('.');
}
