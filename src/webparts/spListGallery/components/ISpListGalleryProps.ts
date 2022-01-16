import { WebPartContext } from '@microsoft/sp-webpart-base';
import { DataService } from './Code/codelogic';
export interface ISpListGalleryProps {
  description: string;
  context: WebPartContext;
}

export interface IAnnouncementItem {
  title: string;
  accdescription: string;
  attachement: string;
  department: string;
}
export interface Ilistvalues {

}
export type JsonPrimitive = string | number | boolean | null;
export interface IJsonMap extends Record<string, JsonPrimitive | IJsonArray | IJsonMap> { }
export interface IJsonArray extends Array<JsonPrimitive | IJsonArray | IJsonMap> { }
export type Json = JsonPrimitive | IJsonMap | IJsonArray;
