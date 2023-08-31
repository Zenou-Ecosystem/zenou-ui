export interface LawKPIs {
    total: number;
    totalAnalysed: number;
    percentageAnalysed: number;
    percentageNotAnalysed: number;
    totalConform: number;
    percentageConform: number;
    percentageNotConform: number;
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
