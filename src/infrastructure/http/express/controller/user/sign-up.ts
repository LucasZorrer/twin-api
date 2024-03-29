import { Request, Response } from "express";
import { StoreAccount } from "../../../../../application/user/store-account";
import { UserPrismaRepository } from "../../../../../adapters/user/user-prisma-repository";

export class signUpController {
  static async execute(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const repository = new UserPrismaRepository();
    const useCase = await new StoreAccount(repository).execute({
      name: name,
      email: email,
      password: password,
    });

    return res.status(useCase.statusCode).json(useCase.body);
  }
}
