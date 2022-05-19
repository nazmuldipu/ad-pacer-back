
export const filterUpdateAbleModelKeys = (Model, object = {}, { body }) => {
    for (let key in Model.rawAttributes) {
        const unprocessableKeys = ["id", "updatedAt", "createdAt", "deletedAt"];
        if (unprocessableKeys.includes(key)) {
            continue;
        } else if (body[key]) {
            object[key] = body[key];
        }
    }
    return object;
};
