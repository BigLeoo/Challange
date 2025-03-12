import { User } from '../../enterprise/models/User'

export interface UserRepository {
  create(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<void>
  getByEmail(email: string): Promise<User | null>
  getById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
  fetch(): Promise<User[]>
  save(user: User): Promise<void>
}
