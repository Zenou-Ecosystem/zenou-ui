
type ILawOptionTitles = "decree" | "order" | "decision";
type ILawTitles = ['convention', 'law', 'decree', 'order', 'decisions', 'notes', 'guidance', 'direction'];
type ILawLocations = ['international', 'continental', 'national'];
type ILawCompliance = ['complaint', 'non-compliant', 'in progress'];
type ILawDomains = ["air", "land", "water", "environment", "business", "education", "transport", "health", "agriculture"];
type ILawDecisions = ['informative', 'administrative', 'financial'];

export interface ILaws {
    title: keyof ILawTitles;
    location: keyof ILawLocations;
    ratification: string;
    area: string;
    theme: string;
    link: string;
    item_number: string;
    paragraph_number: string;
    decisions: keyof ILawDecisions;
    compliance: keyof ILawCompliance;
    domain: keyof ILawDomains;
    articles: string;
    severity: number;
    control_plan: string;
    action_plan: string;
    options?: Record<ILawOptionTitles, ILawOptions[]>;
}

interface ILawOptions {
    id: string;
    title: string;
    dependsOn: string // id of the selected choice
}
