// filtering falsy values from an object, like Array.filter()

function object_falsy_filter(obj) {
    Object.keys(obj).forEach((k) => {
        if (!obj[k]) delete obj[k];
    });
    return obj;
}

Object.prototype.length = function () {
    return Object.values(this).length;
};


Object.prototype.filter = function (callback_function) {
    Object.keys(this).forEach((value) => {
        if (callback_function === Boolean) {
            console.log('hello');
            if (!this[value]) delete this[value];
            else if (Array.isArray(this[value]) && !this[value].length) delete this[value];
            else if (typeof this[value] === 'object' && !this[value].length()) delete this[value];
        } else if (!callback_function(this[value])) delete this[value];
    });
    return this;
};


// to filter only blanks

function object_blank_filter(obj) {
    return Object.keys(obj).forEach((k) => obj[k] === '' && delete obj[k]);
}


// Tests below 

let big_object = {
    value_1: '',
    value_2: 'potato',
    value_3: 'blueberry',
    value_4: false,
    value_5: true,
    value_6: 0,
    value_7: {},
    value_8: 156,
    value_9: [],
    value_10: undefined,
    value_11: null
};

// console.log((big_object.filter(Boolean)));



console.log((big_object.filter(x => x>-5 && typeof x === 'number')));
console.log((big_object.filter(x => x > -5 && x)));
console.log((big_object.filter(x => x > -1)));


console.log(object_falsy_filter(big_object));


var some_obj = {
    value_1: '',
    value_2: 'potato',
    value_3: 'blueberry',
    value_4: false,
    value_5: true,
    value_6: 0,
    value_7: {},
    value_8: 156,
    value_9: [],
    value_10: undefined,
    value_11: null
};

var some_arr = ["a", "", "b", 0, 16, true, false, undefined, null, 'hello', [], {}, ["a"], {
    value_1: 'a'
}]

console.log(some_obj.length())

console.log(Object.values(some_arr))


console.log(Boolean(null))