interface APIDataParams {
    location: string;
    startDate: string;
    endDate: string;
    fields?: string;
    unitScale?: string;
}
export declare function fetchVisualCrossingData(params: APIDataParams): Promise<any>;
export {};
