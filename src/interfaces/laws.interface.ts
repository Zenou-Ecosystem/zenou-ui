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
    options?: Record<decisionTitles, Decision[]>;
}

type decisionTitles = "decree" | "order" | "decision"

interface Decision {
    id: string;
    title: string;
    reference: string;
    description: string | null;
}
