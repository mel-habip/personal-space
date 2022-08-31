
export const TOP_OPERATORS = {
    $or: function (condition, data) {
        if (!Array.isArray(condition[`$or`])) throw Error(`Operator Error \nDetails: Expected array but received ${typeof condition[`$or`]} at ${JSON.stringify(condition)}.`);
        return condition[`$or`].some(individual_condition => mongoTruthValidator(individual_condition, data));
    },
    $and: function (condition, data) {
        if (!Array.isArray(condition[`$and`])) throw Error(`Operator Error \nDetails: Expected array but received ${typeof condition[`$and`]} at ${JSON.stringify(condition)}.`);
        return condition[`$and`].every(individual_condition => mongoTruthValidator(individual_condition, data));
    },
    $not: function (condition, data) {
        if (typeof condition[`$not`] !== 'object' || Array.isArray(condition[`$not`])) throw Error(`Operator Error \nDetails: Expected object but received ${typeof condition[`$not`]} at ${JSON.stringify(condition)}.`);
        return (deepEqual(condition[`$not`]), {}) ? false : !mongoTruthValidator(condition[`$not`], data);
    }
};

export const FIELD_OPERATORS = {
    $eq: function (condition, data) {
        return deepEqual(data, condition[`$eq`]);
    },
    $ne: function (condition, data) {
        return !deepEqual(data, condition[`$ne`]);
    },
    $exists: (condition, data) => {
        console.log('here')
        if (typeof condition[`$exists`] !== 'boolean') throw Error(`Operator Error \nDetails: \tExpected boolean but received ${typeof condition[`$exists`]} at ${JSON.stringify(condition)}.`);
        return ((data != null) === condition[`$exists`]);
    },
    $truthy: (condition, data) => {
        if (typeof condition[`$truthy`] !== 'boolean') throw Error(`Operator Error \nDetails: \tExpected boolean but received ${typeof condition[`$truthy`]} at ${JSON.stringify(condition)}.`);
        return (!!data && data !== null) === condition[`$truthy`];
    },
    $lt: (condition, data) => {
        if (typeof data !== 'number' && typeof data !== 'string') throw Error(`Operator Error \nDetails: \tExpected string or number but received ${typeof data} at ${JSON.stringify(condition)}.`);
        if (condition[`$lt`] != parseFloat(condition[`$lt`])) throw Error(`Operator Error \nDetails: Impossible conversion of the condition value ${condition[`$lt`]} to a number at ${JSON.stringify(condition)}.`);
        if (data != parseFloat(data)) throw Error(`Operator Error \nDetails: Impossible conversion of the parameter ${data} to a number at ${JSON.stringify(condition)}.`);
        return parseFloat(data) < parseFloat(condition[`$lt`]);
    },
    $lte: (condition, data) => {
        if (typeof data !== 'number' && typeof data !== 'string') throw Error(`Operator Error \nDetails: \tExpected string or number but received ${typeof data} at ${JSON.stringify(condition)}.`);
        if (condition[`$lte`] != parseFloat(condition[`$lte`])) throw Error(`Operator Error \nDetails: Impossible conversion of the condition value ${condition[`$lte`]} to a number at ${JSON.stringify(condition)}.`);
        if (data != parseFloat(data)) throw Error(`Operator Error \nDetails: Impossible conversion of the parameter ${data} to a number at ${JSON.stringify(condition)}.`);
        return parseFloat(data) <= parseFloat(condition[`$lte`]);
    },
    $gt: (condition, data) => {
        if (typeof data !== 'number' && typeof data !== 'string') throw Error(`Operator Error \nDetails: \tExpected string or number but received ${typeof data} at ${JSON.stringify(condition)}.`);
        if (condition[`$gt`] != parseFloat(condition[`$gt`])) throw Error(`Operator Error \nDetails: Impossible conversion of the condition value ${condition[`$gt`]} to a number at ${JSON.stringify(condition)}.`);
        if (data != parseFloat(data)) throw Error(`Operator Error \nDetails: Impossible conversion of the parameter ${data} to a number at ${JSON.stringify(condition)}.`);
        return parseFloat(data) > parseFloat(condition[`$gt`]);
    },
    $gte: (condition, data) => {
        if (typeof data !== 'number' && typeof data !== 'string') throw Error(`Operator Error \nDetails: \tExpected string or number but received ${typeof data} at ${JSON.stringify(condition)}.`);
        if (condition[`$gte`] != parseFloat(condition[`$gte`])) throw Error(`Operator Error \nDetails: Impossible conversion of the condition value ${condition[`$gte`]} to a number at ${JSON.stringify(condition)}.`);
        if (data != parseFloat(data)) throw Error(`Operator Error \nDetails: Impossible conversion of the parameter ${data} to a number at ${JSON.stringify(condition)}.`);
        return parseFloat(data) >= parseFloat(condition[`$gte`]);
    },
    $in: (condition, data) => {
        if (!Array.isArray(condition[`$in`])) throw Error(`Operator Error \nDetails: \tExpected array but received ${typeof condition[`$in`]} at ${JSON.stringify(condition)}.`);
        return condition[`$in`].includes(data);
    }
};

/**
 * Handles a single object that has a variable id in it and recurses where necessary.
 * Automatically removes the prefix_replace argument"
 */
export function mongoTruthValidator(condition, data, prefix_replace = '') {
    let pairs = Object.entries(condition);

    if (pairs.length > 1 && pairs.some(pair => {
            if (pair[0].startsWith('$')) throw Error(`Operator Error \nEncountered at: "${pair[0]}" \nDetails: If an operator is used, it must be the only condition`);
        }));

    if (pairs.length === 1 && pairs[0][0].startsWith('$')) {
        return TOP_OPERATORS[pairs[0][0]](condition, data);
    }

    return pairs.every(pair => {
        if (typeof pair[1] === 'object') {
            let inner_pairs = Object.entries(pair[1]);
            if (inner_pairs.length > 1 && inner_pairs.some(pair => {
                    if (pair[0].startsWith('$')) throw Error(`Operator Error \nEncountered at: "${pair[0]}" \nDetails: If an operator is used, it must be the only condition`);
                }));
            if (inner_pairs.length === 1 && inner_pairs[0][0].startsWith('$')) {
                let our_variable = pair[0].replace(prefix_replace, '');
                let our_data = data[our_variable];
                let our_condition_value = pair[1];
                let our_operator = Object.keys(pair[1])[0];
                if (!FIELD_OPERATORS[our_operator]) throw Error(`Operator Error \nEncountered at: "${our_operator}" \nDetails: Operator not found.`);
                return FIELD_OPERATORS[our_operator](our_condition_value, our_data);
            };
            return deepEqual(data[pair[0].replace(prefix_replace, '')], pair[1]);

        } else if (data[pair[0].replace(prefix_replace, '')] === pair[1]) {
            return true
        };
        return false;
    });
};

export function deepEqual(x, y) {
    const ok = Object.keys,
        tx = typeof x,
        ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
};
