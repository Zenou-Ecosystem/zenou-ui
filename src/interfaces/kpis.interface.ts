type IDomains = "air" | "land" | "water" | "environment" | "business" | "education" | "transport" | "health" | "agriculture";

export interface IStatistics {
    total: number | null;
    totalAnalysed: number | null;
    percentageAnalysed: number | null;
    percentageNotAnalysed: number | null;
    totalConform: number | null;
    percentageConform: number | null;
    percentageNotConform: number | null;
    complianceRate: number | null;
    costOfCompliance: CostOfCompliance;
    domains: Domains;
}

interface Domains {
    applicability: Record<IDomains, number | null>;
    conformity: Record<IDomains, number | null>;
    analysis: Record<IDomains, number | null>;
}

interface CostOfCompliance {
    expected: number | null;
    actual: number | null;
}

export interface OptionsFilter {
    take?: number;
    skip?: number;
}

export interface DateFilter {
    startDate: string,
    endDate: string
}

export interface FilterPayload extends Partial<DateFilter> {
    pageSize?: number,
    summary?:boolean
}
