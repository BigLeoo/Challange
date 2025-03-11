import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { User } from '@/domain/enterprise/models/User'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.users.find((user) => {
      return user.email === email
    })

    return user
  }

  async create(
    name: string,
    email: string,
    address: string,
    coordinates: [number, number],
  ): Promise<void> {
    const user = {
      name,
      email,
      address,
      coordinates,
      _id: randomUUID(),
      regions: [randomUUID()],
    }

    await this.users.push(user)
  }
}
