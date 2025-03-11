import { GeoLibRepository } from '@/core/utils/IGeolib'

interface addressAndCoordinates {
  address: string
  coordinates: [number, number]
}

export class InMemoryGeoLibRepository implements GeoLibRepository {
  private addressAndCoordinates: addressAndCoordinates[] = [
    {
      address: 'Rua Salomao',
      coordinates: [123, 111],
    },
    {
      address: 'Rua da Solitude',
      coordinates: [4444, 3333],
    },
  ]

  async getAddressFromCoordinates(
    coordinates: [number, number],
  ): Promise<string> {
    const region = await this.addressAndCoordinates.find((arr) => {
      return JSON.stringify(arr.coordinates) === JSON.stringify(coordinates)
    })

    return region.address
  }

  async getCoordinatesFromAddress(address: string): Promise<[number, number]> {
    const region = await this.addressAndCoordinates.find((arr) => {
      return arr.address === address
    })

    return region.coordinates
  }
}
