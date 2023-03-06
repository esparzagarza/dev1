export interface IItem {
  id: string;
  accountid: string;
  property: string;
  code: string;
  fulladdress: string;
  description: string;
  watermeter: string;
  lightmeter: string;
  floors: string;
  beds: string;
  baths: string;
  landsize: string;
  constructionsize: string;
  color: string;
  price: string;
  image: string;
  type: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
}
