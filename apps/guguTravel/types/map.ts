export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface OsmPlace {
  name: string;
  wkb_geometry: {
    coordinates: [number, number];
  };
  distance: number;
}
