let path_map = {
    id: 'page_1',
    type: 'page',
    next: {
        id: 'page_2',
        type: 'page',
        next: {
            id: 'jump_net_worth',
            type: 'jump'
        }
    }
};

Object.prototype.first_value = function (self = this) {
    return Object.values(self)[0] ?? false;
};

Object.prototype.first_key = function (self = this) {
    return Object.keys(self)[0] ?? false;
};

Object.prototype.length = function () {
    return Object.values(this).length;
};

let path_map_v2 = {
    page_1: {
        type: 'page',
        condition: null,
        next: {
            page_2: {
                type: 'page',
                condition: null,
                next: {
                    jump_1: {
                        type: 'jump',
                        condition: null,
                        next: {
                            page_4: {
                                type: 'page',
                                condition: {
                                    field_1: 'value_1'
                                },
                                next: {
                                    page_10: {
                                        type: 'page',
                                        condition: null,
                                        next: {
                                            page_12: {
                                                type: 'page',
                                                condition: null, //condition to get here
                                                next: {
                                                    jump_2: {
                                                        type: 'jump',
                                                        condition: null,
                                                        next: {
                                                            page_6: {
                                                                type: 'page',
                                                                condition: {
                                                                    field_3: 'value_3'
                                                                },
                                                                submit: true
                                                            },
                                                            page_13: {
                                                                type: 'page',
                                                                condition: {
                                                                    field_3: 'value_4'
                                                                },
                                                                submit: true
                                                            },
                                                            page_14: {
                                                                type: 'page',
                                                                condition: null,
                                                                next: {
                                                                    page_15: {
                                                                        type: 'page',
                                                                        condition: null,
                                                                        submit: true
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            page_5: {
                                type: 'page',
                                condition: {
                                    field_2: 'value_2'
                                },
                                submit: true
                            },
                            page_6: {
                                type: 'page',
                                condition: {
                                    some: 'none'
                                },
                                submit: true
                            },
                            page_6_half: {
                                type: 'page',
                                condition: null,
                                submit: true
                            }
                        }
                    }
                }
            }
        }
    }
};
let page_names_arr = [];
let page_names_obj = {};



    let path_map_v3 = [
    [{
        'field_1': 'value_1'
    }, "page_1", "page_2", "jump_1", "page_3", "page_4"],
    [{
        'field_1': 'value_2'
    }, "page_1", "page_2", "jump_1", "page_4"],
    [
        ["page_1"], "page_2", "jump_1", "page_5", "jump_2", "page_6"
    ],
    [
        ['page_1', {}],
        ['page_2', {}],
        ['jump_1', {}],
        ['page_5', {field_1: 'value_1' }],
        ['page_6', {field_1: 'value_1' }],
        ['jump_2', {field_1: 'value_1' }],
        ['page_7', {"$and": [{ field_1: 'value_1' }, { field_2: 'value_a' } ]}]
    ]
];
let result = [];

function path_map_constructor(schema, index = 0) {
    let temp = [];
    if (schema[0].type === 'page') {
        
    };


    let branch_counter = [1, jump.branches.length];
    while (branch_counter[0] <= branch_counter[1]) {
        // do something
        branch_counter[0]++;
    }

};


function page_finder_1(schema, page_to_find) {
    let step_1 = schema.filter(page => page.id === page_to_find);
    return {
        id: step_1.id,
        type: step_1.type,
        next: step_1.next
    };
}

function path_finder(schema) {
    
}


















function sidebar_customizer(path_map_v3) {

};














// function map_traverser(path_step, parentID = path_step.first_key(), parentCondition = path_step[parentID].condition ?? {}) {
//     let first_key = path_step.first_key();
//     if (path_step[first_key].submit) {
//         console.log('here');
//         if (!page_names_obj[first_key]) {
//             page_names_obj[first_key] = {
//                 conditions: []
//             };
//         }
//         if (path_step[first_key].condition) {
//             parentCondition = {
//                 ...parentCondition,
//                 ...path_step[first_key].condition
//             };
//             page_names_obj[first_key].conditions.push(path_step[first_key].condition);
//         }
//         page_names_arr.push([parentID, parentCondition]);
//     } else if (path_step[first_key].type === 'jump') {
//         console.log('here');

//         Object.keys(path_step[first_key].next).forEach(step => {
//             console.log(path_step[first_key].next[step]);
//             map_traverser({
//                 [step]: path_step[first_key].next[step]
//             }, step, {...parentCondition, ...path_step[first_key].next[step].condition});
//         });
//     } else if (path_step[first_key].type === 'page') {
//         if (path_step[first_key].next.length() > 1) {
//             console.error('mistake in the mapping, page with more than 1 next.');
//         };
//         if (!page_names_obj[first_key]) {
//             page_names_obj[first_key] = {
//                 conditions: []
//             };
//         }
//         if (path_step[first_key].condition) {
//             page_names_obj[first_key].conditions.push(path_step[first_key].condition);
//             parentCondition = {
//                 ...parentCondition,
//                 ...path_step[first_key].condition
//             };
//         }
//         page_names_arr.push([parentID, parentCondition]);
//         map_traverser(path_step[first_key].next, path_step[first_key].next.first_key());
//     }
//     return true;
// };


// console.log(map_traverser(path_map_v2));

// console.log(page_names_arr);
// console.log(page_names_obj);