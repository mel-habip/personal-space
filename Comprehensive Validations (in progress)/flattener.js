/**
 * Flattens the data so as to make any combination or JSON array/object instructions accessible
 */
export function flattener(obj, parent_key = '', current_obj = {}) {
    let keys = Object.keys(obj);
    parent_key = (parent_key) ? parent_key + '.' : '';
    Object.values(obj).forEach((val, index_1) => {
        current_obj[`${parent_key}${keys[index_1]}`] = val;
        if (Array.isArray(val)) {
            val.forEach((item, index_2) => {
                current_obj[`${parent_key}${keys[index_1]}.${index_2}`] = item;
                if (typeof item === 'object' && item !== null) {
                    flattener(item, `${parent_key}${keys[index_1]}.${index_2}`, current_obj);
                };
            });
        } else if (typeof val === 'object' && val !== null) {
            let inner_keys = Object.keys(val);
            Object.values(val).forEach((item, index_2) => {
                current_obj[`${parent_key}${keys[index_1]}.${inner_keys[index_2]}`] = item;
                if (typeof item === 'object' && item !== null) {
                    flattener(item, `${parent_key}${keys[index_1]}.${inner_keys[index_2]}`, current_obj);
                }
            });
        }
    });
    return current_obj;
};