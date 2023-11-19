import { AIProject } from "aia-kit/ai_project.js";

export function getPackageName(project: AIProject) {
  let mainClass = project.properties.main;
  return mainClass.split(".").slice(0, -1).join(".");
}
