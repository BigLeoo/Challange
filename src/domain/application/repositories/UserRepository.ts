import { User } from '../../enterprise/models/User'

export interface UserRepository {
  create(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<void>

  getUserByEmail(email: string): Promise<User | null>

  getUserById(id: string): Promise<User | null>

  delete(id: string): Promise<void>

  fetchUsers(): Promise<User[]>
}
