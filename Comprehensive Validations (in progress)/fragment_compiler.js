// Welcome to the Fragment Compiler V1.0 !
const file = process.argv.slice(2).join(' ');
const schema = JSON.parse(fs.readFileSync(file));
import * as fs from 'fs';
import {flattener} from './flattener.js';
import {mongoTruthValidator} from './mongoTruthValidator.mjs';
import {object_fixer} from './fragment_templaters.js';

import * as url from 'url';
// const __filename = url.fileURLToPath( //filename is not used 
//     import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)); //this is merely a workaround for the __dirname which is not available inside of an ES module


/**
 attempts to find the directory for GitHub
 */
let path_ends = [
    '/GitHub',
    '/Documents/GitHub',
    '/Desktop/GitHub'
];
var github_location;
loop1: for (let i = -1; i > -7; i--) {
    let path = `${__dirname.split('\\').slice(0,i).join('/')}`;
    for (let end of path_ends) {
        // console.log(path + end, fs.existsSync(path + end));
        if (fs.existsSync(path + end)) {
            github_location = path + end + '/form-fragments';
            break loop1;
        }
    }
}

// console.log('GitHub location: ' + github_location);

if (!github_location) {
    throw Error('cannot find the GitHub folder. Please hard-code your script or seek help for this bug.');
}

const fragment_folders = fs.readdirSync(github_location).filter(dir_name => !dir_name.includes('.')); //This preps list of top level folders
// TO-DO List:
// 1) flattener for objects and arrays DONE
// 2) top-level operator handling DONE
// 3) field level operator handling DONE
// 4) removal of "fragment_params." from conditions DONE
// 5) import fragments DONE
// 6) iterate over schema and compose new schema DONE?
// 7) consider exporting this or its pieces out - FAILED - Investigate

export const fragmentCompiler = (field, parentFragments = []) => {
    let fragment_schema = [];
    let fragment_params_file = {};

    fragment_folders.forEach(folder => {
        try {
            fragment_schema = JSON.parse(fs.readFileSync(`${github_location}/${folder}/${field.fragment_name}/schema.json`));
            fragment_params_file = JSON.parse(fs.readFileSync(`${github_location}/${folder}/${field.fragment_name}/parameters.json`));
        } catch {}
    });

    if (fragment_schema.length === 0 || Object.keys(fragment_params_file).length === 0) {
        console.warn(`Fragment '${field.fragment_name}' not found and has been skipped.`);
        return [field];
    };

    /**
     * This mechanism compiles a full set of params using the defaults from the file
     */
    Object.keys(fragment_params_file).forEach(param => {
        if (field.fragment_params[param] == null && fragment_params_file[param].required === true) {
            if (parentFragments.length) throw Error(`Your ${field.fragment_name} fragment, nested within ${parentFragments.join('->')} , is missing a parameter "${param}" which is required.`);
            throw Error(`Your ${field.fragment_name} fragment with id ${field.id} is missing a parameter ${param} which is required.`);
        } else if (field.fragment_params[param] === undefined) { //undefined and not just !param because "" or false or 0 are acceptable.
            field.fragment_params[param] = fragment_params_file[param].default;
        }
    });

    fragment_schema = fragment_schema.map(fragment_field => object_fixer(fragment_field, field.fragment_params));

    const flattened_params = flattener(field.fragment_params);

    const fragment_schema_clone = [];

    fragment_schema.forEach(fragment_field => {
        if ((fragment_field.compile_if === undefined || mongoTruthValidator(fragment_field.compile_if, flattened_params, 'fragment_params.')) && fragment_field.type === 'fragment_inclusion') {
            delete fragment_field.compile_if;
            parentFragments.push(field.fragment_name);

            fragmentCompiler(fragment_field, parentFragments).forEach(nestedFragField => fragment_schema_clone.push(nestedFragField));

        } else if (["multi_sub_form", "fixed_iterated_sub_form"].includes(fragment_field.type) && (fragment_field.compile_if === undefined || mongoTruthValidator(fragment_field.compile_if, flattened_params, 'fragment_params.'))) {
            const subFieldsClone = [];
            fragment_field.fields.forEach(subField => {
                if (subField.type === 'fragment_inclusion') {
                    fragmentCompiler(subField, parentFragments).forEach(nestedFragSubField => subFieldsClone.push(nestedFragSubField));
                } else {
                    subFieldsClone.push(subField)
                }
            });
            fragment_field.fields = JSON.parse(JSON.stringify(subFieldsClone));
            delete fragment_field.compile_if;
            fragment_schema_clone.push(fragment_field);
        } else if (fragment_field.compile_if === undefined || mongoTruthValidator(fragment_field.compile_if, flattened_params, 'fragment_params.')) {
            delete fragment_field.compile_if;
            fragment_schema_clone.push(fragment_field);
        }
    });
    return fragment_schema_clone;
}

const schemaClone = [];

schema.forEach(page => {
    if (page.type === 'jump') {
        schemaClone.push(page);
    } else if (page.type === 'page') {
        let pageClone = [];
        page.fields.forEach(field => {
            if (field.type === 'fragment_inclusion') {
                fragmentCompiler(field)?.forEach(compiled_field => {
                    pageClone.push(compiled_field);
                });
            } else if (["multi_sub_form", "fixed_iterated_sub_form"].includes(field.type)) {
                let subFieldsClone = [];
                field.fields.forEach(subField => {
                    if (subField.type === 'fragment_inclusion') {
                        fragmentCompiler(subField).forEach(compiled_sub_field => {
                            subFieldsClone.push(compiled_sub_field);
                        });
                    } else {
                        subFieldsClone.push(subField);
                    }
                });
                field.fields = JSON.parse(JSON.stringify(subFieldsClone));
                pageClone.push(field);
            } else {
                pageClone.push(field);
            }
        });
        page.fields = JSON.parse(JSON.stringify(pageClone));
        schemaClone.push(page);
    }
});


fs.writeFile(`${file.replace('.json','')} - compiled.json`, JSON.stringify(schemaClone, null, 2), (err) => {
    if (err) throw err;
});



//The following are some unit tests - uncomment to view result

/**
var example_data_1 = {
    required: true,
    prefix: 'client',
    eim_prefix: 'client',
    pipeline: 'Investor',
    has_eim: true,
    custom_param: {
        part_1: 0,
        part_2: 10
    },
    age: 25,
    client_name: {
        "first_name": "Jack",
        "last_name": "Doe"
    }
};

example_data_1 = flattener(example_data_1);

var example_condition_1 = {
    "client_name": {
        "first_name": "Jack",
        "last_name": "Doe"
    },
    "age": {
        "$lte": 30
    },
    "has_eim": {
        "$truthy": true
    }
};

console.log(mongoTruthValidator(example_condition_1, example_data_1));


var example_data_2 = {
    required: true,
    prefix: 'client',
    is_enhanced: true,
    exclude_canada: false,
    eim: {},
    default: [],
    is_searchable: true,
    form_name: 'rc518'
};

example_data_2 = flattener(example_data_2);

var example_condition_2 = {
    $not: {}
};

console.log(mongoTruthValidator(example_condition_2, example_data_2));

var example_data_3 = {
    required: true,
    prefix: 'client',
    is_enhanced: true,
    exclude_canada: false,
    eim: {},
    default: [],
    is_searchable: true,
    form_name: 'rc518',
    include_tombstone: "optional"
};

example_data_3 = flattener(example_data_3);

var example_condition_3 = {
    "fragment_params.form_name": "rc518",
    "fragment_params.is_searchable": true,
    "fragment_params.include_tombstone": {
        "$in": ["always", "optional", "yes"]
    }
};

console.log(mongoTruthValidator(example_condition_3, example_data_3));
*/