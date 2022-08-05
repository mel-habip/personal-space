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
    }
];

const RESERVED = Symbol('RESERVED');

console.log('hello');
console.log(RESERVED === RESERVED);

Object.prototype.first_value = function (self = this) {
    return Object.values(self)[0] ?? false;
};

Object.prototype.first_key = function (self = this) {
    return Object.keys(self)[0] ?? false;
};

Object.prototype.length = function () {
    return Object.values(this).length;
};


let path_map_v3 = [

    [
        ['page_1', {}],
        ['page_2', {}],
        ['jump_1', {}],
        ['page_5', {
            field_1: 'value_1'
        }],
        ['page_6', {
            field_1: 'value_1'
        }],
        ['jump_2', {
            field_1: 'value_1'
        }],
        ['page_7', {
            "$and": [{
                field_1: 'value_1'
            }, {
                field_2: 'value_a'
            }]
        }]
    ]
];


/** Steps
 * 1) start from the first element
 * 2) for "page" types, find the next page, then the next and keep going. This is your array.
 * 3) When you come across a jump, create an object for each branch and keep going under each branch. Once you finish the branches, add all the branches as separate paths to the main array.
 * 4) At any point, when you see "submit: true", do break;
 */


let done = false;
let result = [];

path_constructor(example_schema);

console.log(path_constructor(example_schema));

function path_constructor(schema) {
    let temp = [];
    let jumps_we_saw = [];
    let jump_map_tracking = {};
    let submit, last_position, last_next;

    if (schema[0].submit === true) {
        console.log('This schema has only a single page.');
        submit = true;
        temp.push([schema[0].id, {}]);
    } else if (schema[0].type === 'page') {
        temp.push([schema[0].id, {}]);
        last_position = schema[0].id;
        last_next = schema[0].next;
    } else if (schema[0].type === 'jump') {
        jumps_we_saw.push(schema[0].id);
        jump_map_tracking[schema[0].id] = {};
        schema[0].branches.forEach(branch => {
            jump_map_tracking[schema[0].id][branch] = branch
        });

    }
    let index = 0;
    while (!submit) {
        let page = page_finder(schema, last_next); 
        last_position = page.id;
        if (page.submit === true) {
            submit = true;
            temp.push([page.id, temp[index][1]]);
            break;
        } else if (page.type === 'page') {
            last_next = page.next;
            temp.push([page.id, temp[index][1]]);
        } else if (page.type === 'jump') {
            let branches_from_here = jump_handler(schema, page);
            console.log(branches_from_here);
            // branches_from_here.forEach(path => {
            //     temp.forEach((el, ind) => {
            //         temp[ind] = temp[ind].concat(path)
            //     });
            // });
        }
        index++;
    }
    return temp;
};

function individual_path_constructor(schema, page_id, condition = {}) {
    const temp = [[]];
    let last_next = page_id;
    let submit;
    let index = 0;
    while (!submit) {
        let page = page_finder(schema, last_next);
        if (page.submit === true) {
            submit = true;
            temp.forEach((el, ind) => {
                temp[ind].push([page.id, condition_combiner(temp[0][index]?.[1] ?? {}, condition)])
            });
            break;
        } else if (page.type === 'page') {
            last_next = page.next;
            temp.forEach((el, ind) => {
                console.log(temp[0]);
                temp[ind].push([page.id, condition_combiner(temp[0][index]?.[1] ?? {}, condition)])
            });
        } else if (page.type === 'jump') {
            let branches_from_here = jump_handler(schema, page, condition);
            branches_from_here.forEach(path => {
                temp.forEach((el, ind) => {
                    temp[ind].push(temp[0].concat(path));
                });
            });
        }
        index++;
    };
    console.log(temp);
    return temp;
};



function jump_handler(schema, jump) {
    let index = 0;
    let submit;
    let last_next = jump.id;
    let jump_result = {};
    jump.branches.forEach((branch, num) => {
        console.log(branch);
        jump_result[`branch_${num}`] = individual_path_constructor(schema, branch.next, branch.condition ?? {});
    });
    console.log(jump_result);
    return Object.values(jump_result);
};




function condition_combiner(condition_1, condition_2) {
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



/**
 * Feed an array and an object.
 * goes through the layers of the object looking at the keys as per the array.
 */
function deep_digger(array_to_dig_by, obj_to_dig) {
    let current = obj_to_dig;
    array_to_dig_by.forEach(item => {
        current = current[item]
    });
    return current;
}




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


let array_1 = ["a", "b", "c", "", ""];
let array_2 = ["a", "b", "", "c", "d"];

console.log(array_equal(array_1, array_2, false));


















function sidebar_customizer(path_map_v3) {

};