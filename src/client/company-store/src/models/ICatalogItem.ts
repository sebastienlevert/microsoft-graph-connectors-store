import { IAudienceItem } from './IAudienceItem';

export interface ICatalogItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  company: string;
  category: string;
  description: string;
  price: number;
  url: string;
  audience?: IAudienceItem[];
}
