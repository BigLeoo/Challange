import { UserRepository } from '@/domain/application/repositories/UserRepository'
import { User } from '@/domain/enterprise/models/User'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = []

  async getByEmail(email: string): Promise<User | null> {
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

  async getById(userId: string): Promise<User | null> {
    const user = await this.users.find((user) => {
      return user._id === userId
    })

    return user
  }

  async delete(userId: string): Promise<void> {
    const usersFiltered = await this.users.filter((user) => {
      return user._id !== userId
    })

    this.users = usersFiltered
  }

  async fetch(): Promise<User[]> {
    return this.users
  }

  async save(user: User): Promise<void> {
    const itemIndex = this.users.findIndex((item) => {
      return item._id === user._id
    })

    this.users[itemIndex] = user
  }
}
