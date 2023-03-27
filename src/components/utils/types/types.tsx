export interface ProjectDataItem {
    code: string;
    isPublic: boolean;
    name: string;
    sort: number;
    tags: Array<string>;
    description_short: string;
    status: ProjectDataStatus;
    showcase: ProjectDataShowcase;
}

// string currently is a wildcard -> else typescript gives an error
type ProjectFormat = "image" | "images" | "video" | false | string;

interface ProjectDataStatus {
    isLive: boolean;
    src: string;
}

interface ProjectDataShowcase {
    format: ProjectFormat;
    amount?: number;
    src?: string;
    alt?: string;
}