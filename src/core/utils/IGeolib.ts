export interface GeoLibRepository {
  getAddressFromCoordinates(coordinates: [number, number]): Promise<string>
  getCoordinatesFromAddress(address: string): Promise<[number, number]>
}
