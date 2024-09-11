import { Repository } from "typeorm";

export async function createRegister <T>(
  repository: Repository<T>,
  data
) {
  const register = repository.create(data);
  return await repository.save(register);
}
