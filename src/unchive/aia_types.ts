
interface ScmJson {
    authURL: string[];
    YaVersion: string;
    Source: string;
    Properties: ComponentJson;
}

interface ComponentJson {
    $Name: string;
    $Type: string;
    $Version: string;
    Uuid: string;
    $Components?: ComponentJson[];
    [key: string]: string | ComponentJson[] | undefined;
}

interface ExtensionDescriptorJson {
    categoryString: string;
    dateBuilt: string;
    nonVisible: "true" | "false";
    iconName: string;
    helpUrl: string;
    type: string;
    versionName: string;
    androidMinSdk: number;
    versionCode: string;
    external: "true" | "false";
    showOnPalette: "true" | "false";
    name: string;
    helpString: string;
    properties: ExtensionDescriptorProperty[];
    blockProperties: unknown[];
    events: unknown[];
    methods: unknown[];
}

interface ExtensionDescriptorProperty {
    name: string;
    editorType: string;
    defaultValue: string;
}

interface ExtensionBuildInfoJson {
    type: string;
    metadata: unknown[];
}

interface ComponentPropertyEditor {
    name: string;
    value: string;
    editorType?: string;
}
