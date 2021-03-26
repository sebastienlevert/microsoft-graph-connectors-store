import { IAudienceType } from './IAudienceType';

export interface IAudienceItem {
  id: string;
  type: IAudienceType;
  personImage?: string;
}
