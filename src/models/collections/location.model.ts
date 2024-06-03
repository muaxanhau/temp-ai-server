import { FirestoreBaseModel } from '../base.model';

export type LocationModel = {
  itineraryId: string;
  locationName: string;
  coords: [number, number];
  time: string;
  note: string;
  day: number;
};
export type LocationIdModel = FirestoreBaseModel<LocationModel>;
