export function object_fixer(obj, params) {
    let entries = Object.entries(obj);
    let result = {};
    entries.forEach(([prop, value]) => {
        prop = string_fixer(prop, params);
        if (Array.isArray(value)) {
            result[prop] = array_fixer(value, params)
        } else if (typeof value === 'object') {
            result[prop] = object_fixer(value, params)
        } else {
            result[prop] = string_fixer(value, params)
        }
    });
    return result;
};
/**
  Takes an array and replaces all its fragment templated parts based on the fragment_params
*/
export function array_fixer(array, params) {
    let result = [];
    array.forEach(element => {
        if (Array.isArray(element)) {
            result.push(array_fixer(element, params))
        } else if (typeof element === 'object') {
            result.push(object_fixer(element, params))
        } else {
            result.push(string_fixer(element, params))
        }
    });
    return result;
};

/**
  Takes an individual string and replaces all its fragment templated parts based on the fragment_params
*/
export function string_fixer(str, params) {
    if (typeof str === 'boolean' || typeof str === 'number') {
        return str
    };
    const prop_split = str.split('');
    let isolated_parameters = [];
    let temp = '';
    let flag = false;

    for (let i = 0; i < prop_split.length; i++) {
        if (prop_split[i] == '%' && prop_split[i + 1] == '{') {
            flag = true;
        } else if (flag && prop_split[i] === '}') {
            isolated_parameters.push(temp);
            temp = '';
            flag = false;
        } else if (flag && prop_split[i] !== '{') {
            temp += prop_split[i];
        }
    };
    isolated_parameters.forEach(parameter => {
        if (isolated_parameters.length > 1 && (typeof params[parameter] === 'object' || typeof params[parameter] === 'number' || typeof params[parameter] === 'boolean')) {
            throw Error(`You have a parameter ${parameter} that is a ${typeof params[parameter]} that is not stand-alone in the string ${str}.`);
        } else if (typeof params[parameter] === 'object' || typeof params[parameter] === 'number' || typeof params[parameter] === 'boolean') {
            str = params[parameter];
        } else {
            str = str.replace(`%{${parameter}}`, params[parameter]);
        }
    });
    return str;
};