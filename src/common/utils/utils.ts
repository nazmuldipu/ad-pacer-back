
export const filterUpdateAbleModelKeys = ( item, { body }) => {
    for (let key in Object.keys(item)) {
        const unprocessableKeys = ["id", "updatedAt", "createdAt", "deletedAt"];
        if (unprocessableKeys.includes(key)) {
            continue;
        } else if (body[key]) {
            item[key] = body[key];
        }
    }
    return item;
};
