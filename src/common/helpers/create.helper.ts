import { Repository } from "typeorm";

export async function createRegister <T>(
  repository: Repository<T>,
  data
) {
  const register = repository.create(data);
  return await repository.save(register);
}

export async function createRegisterForTransaction(
  data,
  manager,
  entity
) {
  const repo = manager.getRepository(entity);
  await repo.create(data);
  return repo.save(data); 
}