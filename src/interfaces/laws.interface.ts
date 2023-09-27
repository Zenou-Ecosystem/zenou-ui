import { IApiInterface } from './api.interface';

type ILawOptionTitles = "decree" | "order" | "decision";
type ILawTitles = ['convention', 'law', 'decree', 'order', 'decisions', 'notes', 'guidance', 'direction'];
type ILawLocations = ['international', 'continental', 'national'];
type ILawCompliance = ['complaint', 'non-compliant', 'in progress'];
type ILawDomains = ["air", "land", "water", "environment", "business", "education", "transport", "health", "agriculture"];
type ILawDecisions = ['informative', 'administrative', 'financial'];

export interface ILaws extends IApiInterface  {
    number: string;

    title_of_text: string;

    type_of_text: string;

    date_of_issue: string;

    origin_of_text: string;

    source_of_text: string;

    nature_of_text: string;

    parent_of_text: any[];

    sectors_of_activity: string[];

    products_or_services_concerned: string[];

    purpose_and_scope_of_text: string;

    text_analysis: ITextAnalysis[];
}

export interface ITextAnalysis {
    requirement: number;

    applicability: string;

    process_management: string;

    impact: string;

    nature_of_impact: string;

    expertise: string;

    action_plans: string | number;

    proof_of_conformity: any[];

    compliant: boolean;

    conformity_cost: string;

    conformity_deadline: string;
}
