let inputData = {
    entities: ["Ahmed", "Mel", "", "Leif", "Leif", ""]
};

function IFL(array) {
    
   for (let i = array.length; i > 0; i--) { //currently set to ignore the first element
       if (array[i]) {
           for (let j = i - 1; j > 0; j--) {
               if (!array[j]) {
                   return false;
               }
           }
       };
       continue;
   };
   return true;
}

console.log(IFL(inputData.entities));


