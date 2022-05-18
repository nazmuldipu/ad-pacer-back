interface ListFilters {
    isDeleted?: boolean
    includeDeleted?: boolean
}

export interface GetAllUsersFilters extends ListFilters { }