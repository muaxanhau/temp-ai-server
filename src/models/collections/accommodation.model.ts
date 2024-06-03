import { FirestoreBaseModel } from '../base.model';

export type AccommodationModel = {
  itineraryId: string;
  accommodationName: string;
  coords: [number, number];
  description: string;
};
export type AccommodationIdModel = FirestoreBaseModel<AccommodationModel>;
