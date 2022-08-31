import deepEqual from './mongoTruthValidator.mjs';

export function condition_combiner(condition_1, condition_2) {
    if (Object.keys(condition_1).length === 0) return condition_2; //empty conditions
    if (Object.keys(condition_2).length === 0) return condition_1;
    let temp = {};
    if (condition_1.$and && condition_1.$and.some(cond => deepEqual(condition_2, cond))) { //if one contains the other entirely
        console.log('condition_1 already contains condition_2');
        return condition_1;
    } else if (condition_2.$and && condition_2.$and.some(cond => deepEqual(condition_1, cond))) {
        console.log('condition_2 already contains condition_1');
        return condition_2;
    };
    if (deepEqual(condition_1, condition_2)) { //identical
        console.log('These two conditions are identical');
        return condition_1;
    };
    if (condition_1.$and && condition_2.$and ) { //merge the $and conditions
        let temp = condition_1;
        condition_2.$and.forEach(individual_condition_1 => {
            if (!condition_1.$and.some(individual_condition_2 => deepEqual(individual_condition_1, individual_condition_2))) {
                temp.$and.push(individual_condition_1);
            }
        });
        return temp;
    };
    if (condition_1.$and) {
        temp = {
            ...condition_1
        };
        temp.$and.push(condition_2);
    } else if (condition_2.$and ) {
        temp = {
            ...condition_2
        };
        temp.$and.push(condition_1);
    } else {
        temp = {
            "$and": [
                condition_1,
                condition_2
            ]
        }
    }
    return temp;
};

