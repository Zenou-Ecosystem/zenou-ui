import { IApiInterface } from './api.interface';

export interface IActions extends IApiInterface {
    type: string;

    duration: string;

    theme: string;

    department: string;

    responsible_for: string;

    resources: string;

    evaluation_criteria: string;

    evidence_of_actions: string;

    text_of_the_Law: string;

    control_plan: any[];
} 
