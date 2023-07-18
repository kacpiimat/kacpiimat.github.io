import { ModelInterface } from 'interfaces/model';
import { GetQueryInterface } from 'interfaces';

export interface RobustnessCheckInterface {
  id?: string;
  result: string;
  model_id?: string;
  created_at?: any;
  updated_at?: any;

  model?: ModelInterface;
  _count?: {};
}

export interface RobustnessCheckGetQueryInterface extends GetQueryInterface {
  id?: string;
  result?: string;
  model_id?: string;
}
