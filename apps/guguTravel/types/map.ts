export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface OsmPlace {
  name: string;
  wkb_geometry: {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | string;
    coordinates: any; //any 또는 [넘버,넘버] | [배역<[넘버,넘버]>] | 과 같은 더 구체적인 유니온 유형을 사용할수있으면 해봅시다 
  };
  distance: number | null;
}
