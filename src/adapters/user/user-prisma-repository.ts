import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/user/User";
import { Email } from "../../domain/user/User-email";
import { Password } from "../../domain/user/User-password";
import { Exception } from "../../domain/common/Exception";
import { IUserRepository } from "./user-repository";
import { StatusCode } from "../../domain/common/status-code";

export class UserPrismaRepository implements IUserRepository {
  private prisma = new PrismaClient();

  async updateAuthenticated(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isAuthenticated: true,
      },
    });
    const userReturn = new User({
      id: user.id,
      name: user.name,
      email: new Email(user.email),
      password: new Password(user.password),
      isAuthenticated: user.isAuthenticated,
    });

    return userReturn;
  }

  async create(user: User): Promise<User> {
    try {
      const SavedUser = await this.prisma.user.create({
        data: {
          id: user.getId(),
          name: user.name,
          email: user.email.getEmail(),
          password: await user.password.hashPassword(),
          isAuthenticated: user.isAuthenticated,
        },
      });
      const userReturn = new User({
        id: SavedUser.id,
        name: SavedUser.name,
        email: new Email(SavedUser.email),
        password: new Password(SavedUser.password),
        isAuthenticated: SavedUser.isAuthenticated,
      });
      return userReturn;
    } catch (error: any) {
      throw new Exception(error.message, StatusCode.INTERNAL_SERVER);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    const userReturn = new User({
      id: user.id,
      name: user.name,
      email: new Email(user.email),
      password: new Password(user.password),
      isAuthenticated: user.isAuthenticated,
    });
    return userReturn;
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return null;
    }
    const userReturn = new User({
      id: user.id,
      name: user.name,
      email: new Email(user.email),
      password: new Password(user.password),
      isAuthenticated: user.isAuthenticated,
    });
    return userReturn;
  }
  update(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
