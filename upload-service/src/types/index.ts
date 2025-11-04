export interface DeployRequest {
    repoUrl: string;
}

export interface DeployResponse {
    id: string;
}

export interface StatusResponse {
    status: string | null;
}