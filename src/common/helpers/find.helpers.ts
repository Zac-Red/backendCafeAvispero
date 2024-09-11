import { Repository, SelectQueryBuilder } from "typeorm";
import { PaginateQueryRaw } from "../interfaces/PaginatedQuery";
// import { Paginated } from "../interfaces/Paginated";
// import { Metadata } from "../interfaces/Metadata";

export async function getPaginatedItems<T>(
    repository: Repository<T>,
    pagination: { limit: number, page: number },
    where
) {
    const { limit, page } = pagination;
    const items = await repository.find({
        where,
        take: limit,
        skip: limit * (page - 1),
    });

    const itemsPerPage = limit;
    const currentPage = page;
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const nextPage = totalPages - currentPage <= 0 ? null : currentPage + 1;

    return {
        itemsPerPage,
        currentPage,
        nextPage,
        totalItems,
        totalPages,
        items,
    };
}


export const getAllPaginated = async <T>(
    qb: SelectQueryBuilder<T>,
    query: PaginateQueryRaw
    )=> {

    const {page, take} = query;
    const skip = take * page - take;

    const [rows, count] = await qb
        .take(take)
        .skip(skip)
        .getManyAndCount()

    const itemsPerPage = take
    const totalPages = Math.ceil(count / itemsPerPage)
    const totalItems = count
    const currentPage = page
    const nextPage = totalPages - currentPage <= 0 ? null : currentPage + 1

    return { items: rows,
        itemsPerPage,
        totalPages,
        totalItems,
        currentPage,
        nextPage,
    }
}