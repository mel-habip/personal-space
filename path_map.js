const example_schema = [{
        "id": "page_1",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "next": "page_2"
    },
    {
        "id": "page_2",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "next": "jump_1"
    },
    {
        "id": "jump_1",
        "type": "jump",
        "branches": [{
                "next": "page_3",
                "condition": {
                    "field_1": "value_1"
                }
            },
            {
                "next": "jump_2",
                "condition": {
                    "field_2": "value_2"
                }
            },
            {
                "next": "page_4"
            }
        ]
    },
    {
        "id": "page_3",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "next": "page_4"
    },
    {
        "id": "page_4",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "submit": true
    },
    {
        "id": "jump_2",
        "type": "jump",
        "branches": [{
                "next": "page_3",
                "condition": {
                    "field_3": "value_3"
                }
            },
            {
                "next": "page_6"
            }
        ]
    },
    {
        "id": "page_6",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "next": "page_7"
    },
    {
        "id": "page_7",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "next": "jump_3"
    },
    {
        "id": "jump_3",
        "type": "jump",
        "branches": [{
                "next": "page_8",
                "condition": {
                    "field_4": "value_4"
                }
            },
            {
                "next": "page_9"
            }
        ]
    },
    {
        "id": "page_8",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "submit": true
    },
    {
        "id": "page_9",
        "type": "page",
        "title": "example_title",
        "subtitle": "example_subtitle",
        "fields": [],
        "submit": true
    }
];

const RESERVED = Symbol('RESERVED');

// console.log(RESERVED === RESERVED);

Object.prototype.first_value = function (self = this) {
    return Object.values(self)[0] ?? false;
};

Object.prototype.first_key = function (self = this) {
    return Object.keys(self)[0] ?? false;
};

Object.prototype.length = function () {
    return Object.values(this).length;
};


/** Steps
 * 1) start from the first element
 * 2) for "page" types, find the next page, then the next and keep going. This is your array.
 * 3) When you come across a jump, create an object for each branch and keep going under each branch. Once you finish the branches, add all the branches as separate paths to the main array.
 * 4) At any point, when you see "submit: true", do break;
 */

var DONE = false;
const result = [];

console.log(map_constructor(example_schema));

function map_constructor(schema) {
    let RESULT = [
        []
    ];
    let submit, last_position, last_next;

    if (schema[0].submit === true) {
        console.warn('This schema has only a single page.');
        submit = true;
        RESULT[0].push([schema[0].id, {}]);
    } else if (schema[0].type === 'page') {
        RESULT[0].push([schema[0].id, {}]);
        last_position = schema[0].id;
        last_next = schema[0].next;
    } else if (schema[0].type === 'jump') {
        console.warn('starting with a jump condition is not supported (yet)');
        process.exit();
    }

    let index = 0;
    while (!submit) {
        let page = page_finder(schema, last_next);
        last_position = page.id;
        if (page.submit === true) {
            submit = true;
            RESULT.forEach((el, ind) => {
                RESULT[ind] = RESULT[ind].concat([
                    [page.id, {}]
                ]);
            });
            break;
        } else if (page.type === 'page') {
            last_next = page.next;
            RESULT.forEach((el, ind) => {
                RESULT[ind] = RESULT[ind].concat([
                    [page.id, {}]
                ]);

            });
        } else if (page.type === 'jump') {
            let branches_from_here = jump_handler(schema, page);
            // console.log(branches_from_here);
            let temp = [];
            let stringified_result = JSON.stringify(RESULT);
            for (let i = 1; i <= branches_from_here.length; i++) { //duplicating the paths
                temp.push(JSON.parse(stringified_result));
            };
            temp = temp.flat(1);
            branches_from_here.forEach((jump_path, jump_index) => {
                temp[jump_index] = temp[jump_index].concat(jump_path);
            });
            RESULT = temp;
            break; //not necessary??
        }
        index++;
    };
    return RESULT;
};

function individual_path_constructor(schema, page_id, condition = {}) {
    let RESULT = [
        []
    ];
    let last_next = page_id;
    let submit;
    let index = 0;
    while (!submit) {
        let page = page_finder(schema, last_next);
        if (page.submit === true) {
            submit = true;
            RESULT.forEach((el, ind) => {
                RESULT[ind] = RESULT[ind].concat([
                    [page.id, condition_combiner(RESULT[0][index]?. [1] ?? {}, condition)]
                ]);
            });
            break;
        } else if (page.type === 'page') {
            last_next = page.next;
            RESULT.forEach((el, ind) => {
                RESULT[ind] = RESULT[ind].concat([
                    [page.id, condition_combiner(RESULT[0][index]?. [1] ?? {}, condition)]
                ]);

            });
        } else if (page.type === 'jump') {
            let branches_from_here = jump_handler(schema, page, condition);
            let temp = [];
            let stringified_result = JSON.stringify(RESULT);
            for (let i = 1; i <= branches_from_here.length; i++) { //duplicating the paths
                temp.push(JSON.parse(stringified_result));
            };
            temp = temp.flat(1);
            branches_from_here.forEach((jump_path, jump_index) => {
                temp[jump_index] = temp[jump_index].concat(jump_path);
            });
            RESULT = temp;
            break;
        }
        index++;
    };
    return RESULT;
};

function jump_handler(schema, jump) {
    let jump_result = {};
    jump.branches.forEach((branch, num) => {
        if (num + 1 === jump.branches.length) { //means the last branch
            if (branch.condition) {
                console.warn('The last branch is not a default branch. It should be.');
            };
            let default_condition;
            if (jump.branches.length === 2) {
                default_condition = {
                    $not: jump.branches[0].condition
                }
            } else if (jump.branches.length > 2) {
                default_condition = {
                    $and: jump.branches.slice(0, -1).map(cond => {
                        return {
                            $not: cond.condition
                        }
                    })
                };
            } else {
                console.warn(`Something is off. The branch length is: `, jump.branches.length);
                default_condition = {};
            };
            jump_result[`branch_${num}`] = individual_path_constructor(schema, branch.next, default_condition);
        } else {
            jump_result[`branch_${num}`] = individual_path_constructor(schema, branch.next, branch.condition);
        }
    });
    let result = Object.values(jump_result).flat(1);
    return result;
};

function condition_combiner(condition_1, condition_2) {
    if (Object.keys(condition_1).length === 0) return condition_2; //empty conditions
    if (Object.keys(condition_2).length === 0) return condition_1;
    let temp = {};
    if (condition_1.$and && condition_1.$and.some(cond => deepEqual(condition_2, cond))) { //if one contains the other entirely
        console.warn('condition_1 already contains condition_2');
        return condition_1;
    } else if (condition_2.$and && condition_2.$and.some(cond => deepEqual(condition_1, cond))) {
        console.warn('condition_2 already contains condition_1');
        return condition_2;
    };
    if (deepEqual(condition_1, condition_2)) { //identical
        console.warn('These two conditions are identical');
        return condition_1;
    };
    if (condition_1.$and && condition_2.$and) { //merge the $and conditions
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
    } else if (condition_2.$and) {
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

function deepEqual(x, y) {
    const ok = Object.keys,
        tx = typeof x,
        ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
        ok(x).length === ok(y).length &&
        ok(x).every(key => deepEqual(x[key], y[key]))
    ) : (x === y);
};

function page_finder(schema, page_to_find) {
    let step_1 = schema.filter(page => page.id === page_to_find);
    if (step_1.length === 0) {
        throw Error(`Page with id ${page_to_find} could not be found!`);
    } else if (step_1.length > 1) {
        throw Error(`Page with id ${page_to_find} exists more than once in your schema!`);
    };
    return {
        id: step_1[0].id,
        type: step_1[0].type,
        next: step_1[0].next,
        submit: step_1[0].submit,
        branches: step_1[0].branches
    };
}

function array_equal(arr1, arr2, same_order = true) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (same_order) {
        return (arr1.length === arr2.length && arr1.every((el, ind) => el === arr2[ind]));
    }
    return (arr1.length === arr2.length && arr1.every(el => arr2.includes(el)) && arr2.every(el => arr1.includes(el)));
};


// let array_1 = ["a", "b", "c", "d", ""];
// let array_2 = ["a", "b", "c", "", "d"];

// console.log(deepEqual(array_1, array_2));
