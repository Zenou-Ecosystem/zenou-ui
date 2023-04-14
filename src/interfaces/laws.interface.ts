export interface ILaws {
    title: string;
    location: string;
    ratification: string;
    area: string;
    theme: string;
    link: string;
    area_number: string;
    paragraph_number: string;
    decisions: string;
    compliance: string;
    control_plan: string;
    action_plan: string;
    options?: {
        decree: any[],
        order: any[],
        decision: any[]
    }
}