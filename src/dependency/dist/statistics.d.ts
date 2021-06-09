export declare let mean: (list: number[]) => number;
export declare let standardDeviation: (list: number[]) => number;
export declare let removeOutliers: (threshold: number) => (list: number[]) => number[];
export declare let removeOutliers_: (threshold: number) => <T extends unknown>(list: T[], morphism: (_: T) => number) => T[];
