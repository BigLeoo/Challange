import { User } from '../../enterprise/models/User'

export interface UserRepository {
  create(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<void>

  getUserByEmail(email: string): Promise<User | null>
}
