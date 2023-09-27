import { IApiInterface } from './api.interface';

export interface IControl  extends IApiInterface  {
    type: string;

    duration: string;

    theme: string;

    department: string[];

    responsible_for: string;

    resources: string;

    evaluation_criteria: string;

    proof_of_success: string;

    text_of_the_law: Record<string, any>;

    action_plan: any[];
}
