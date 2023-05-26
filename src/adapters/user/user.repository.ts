import { User } from "../../domain/user/User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
