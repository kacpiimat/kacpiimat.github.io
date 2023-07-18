import { RobustnessCheckInterface } from 'interfaces/robustness-check';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ModelInterface {
  id?: string;
  name: string;
  user_id?: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  robustness_check?: RobustnessCheckInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    robustness_check?: number;
  };
}

export interface ModelGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
  organization_id?: string;
}
