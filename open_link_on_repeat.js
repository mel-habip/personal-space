const open = require('open');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let counter = 0;
let our_link = '';
let our_views = 0;

async function open_video() {
    try {
        await open(our_link);
        counter++;
    } catch {
        console.log('something is wrong.')
    };
    if (counter === (our_views + 1)) {
        console.log(`%cMaximum (${our_views}) reached. Process terminated.`, "font-weight:bold; color: red;");
        process.exit();
    } else {
        console.log(`Views added so far: ${counter}`);
    };
};


function q1() {
    readline.question('Enter a link below to begin:', link2 => {
        if (!link2.startsWith("http://") && !link2.startsWith("https://")) {
            console.log("Your link doesn't look proper.");
            q1();
        } else if (!link2) {
            console.log("Please enter a link.");
            q1();
        } else if (link2 === 'exit') {
            process.exit();
        } else if (link2) {
            our_link = link2;
        } else {
            throw Error('Something is wrong (link).')
        };
    });
    q2();
};

function q2() {
    readline.question("How many views would you like to add?", views2 => {
        if (!views2) {
            console.log("Please enter a value.");
            q2();
        } else if (views2 === 'exit') {
            process.exit();
        } else if (isNaN(views2)) {
            console.log("Please enter a number.");
            q2();
        } else if (Number(views2) < 1) {
            console.log("Please enter a number greater than 1.");
            q2();
        } else {
            our_views = Number(views2);
        }
    });
    setInterval(open_video, 4000);
};


q1();