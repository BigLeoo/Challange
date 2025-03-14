import { env } from '../../infrastructure/config/env'
import { GeoLibRepository } from './IGeolib'
import axios from 'axios'

export class GeoLib implements GeoLibRepository {
  public async getAddressFromCoordinates(
    coordinates: [number, number] | { lat: number; lng: number },
  ): Promise<string> {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${env.GOOGLE_API_KEY}`

      const response = await axios.get(apiUrl)

      const formattedAddress = response.data.results[0].formatted_address

      return formattedAddress
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  }

  public async getCoordinatesFromAddress(
    address: string,
  ): Promise<[number, number]> {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${env.GOOGLE_API_KEY}`

      const response = await axios.get(apiUrl)

      const { lng, lat } = response.data.results[0].geometry.location

      return [lng, lat]
    } catch (error) {
      return Promise.reject(new Error('Not implemented'))
    }
  }
}

export const geoLib = new GeoLib()
