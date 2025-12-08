


// ---------------------------------------------------------------
// 1. Creating Arrays
// ---------------------------------------------------------------

// Normal array
const fruits = ["Mango", "Banana", "Orange", "Papaya"];

// Using new Array()
const marks = new Array(85, 92, 76, 88);

console.log("1. Arrays created:", fruits, marks);


// ---------------------------------------------------------------
// 2. Accessing Array Elements
// ---------------------------------------------------------------

let fruit2 = fruits[1]; // "Banana"
console.log("2. Second fruit:", fruit2);


// ---------------------------------------------------------------
// 3. Changing Array Elements
// ---------------------------------------------------------------

fruits[0] = "Apple";
console.log("3. Changed fruits:", fruits);


// ---------------------------------------------------------------
// 4. Array Length
// ---------------------------------------------------------------

let size = fruits.length; // 4
console.log("4. Fruits length:", size);


// ---------------------------------------------------------------
// 5. push() → Add at end
// ---------------------------------------------------------------

fruits.push("Grapes");
console.log("5. After push:", fruits);


// ---------------------------------------------------------------
// 6. pop() → Remove last item
// ---------------------------------------------------------------

let removedFruit = fruits.pop();
console.log("6. Removed fruit:", removedFruit);
console.log("   After pop:", fruits);


// ---------------------------------------------------------------
// 7. unshift() → Add at beginning
// ---------------------------------------------------------------

marks.unshift(95);
console.log("7. After unshift:", marks);


// ---------------------------------------------------------------
// 8. shift() → Remove first item
// ---------------------------------------------------------------

let topMark = marks.shift();
console.log("8. First removed mark:", topMark);
console.log("   After shift:", marks);


// ---------------------------------------------------------------
// 9. concat() → Merge arrays
// ---------------------------------------------------------------

const arr1 = [1,2];
const arr2 = [3,4];
const arr3 = arr1.concat(arr2);
console.log("9. Merged array:", arr3);


// ---------------------------------------------------------------
// 10. slice() → Copy portion
// ---------------------------------------------------------------

const cities = ["Delhi","Mumbai","Chennai","Kolkata"];
const metroSouth = cities.slice(2);
console.log("10. Slice result:", metroSouth);


// ---------------------------------------------------------------
// 11. splice() → Add/Remove items
// ---------------------------------------------------------------

cities.splice(1, 1, "Hyderabad", "Pune");
console.log("11. After splice:", cities);


// ---------------------------------------------------------------
// 12. indexOf() → First match position
// ---------------------------------------------------------------

let pos = cities.indexOf("Chennai");
console.log("12. Index of Chennai:", pos);


// ---------------------------------------------------------------
// 13. lastIndexOf()
// ---------------------------------------------------------------

const nums = [5,7,9,7,3];
console.log("13. lastIndexOf 7:", nums.lastIndexOf(7));


// ---------------------------------------------------------------
// 14. includes() → Exists or not
// ---------------------------------------------------------------

console.log("14. Has Delhi?", cities.includes("Delhi"));
console.log("14. Has Goa?", cities.includes("Goa"));


// ---------------------------------------------------------------
// 15. sort() → Alphabetical order
// ---------------------------------------------------------------

const pets = ["Dog","Cat","Elephant","Bee"];
pets.sort();
console.log("15. Sorted pets:", pets);


// ---------------------------------------------------------------
// 16. reverse()
// ---------------------------------------------------------------

pets.reverse();
console.log("16. Reversed pets:", pets);


// ---------------------------------------------------------------
// 17. forEach() → Loop through array
// ---------------------------------------------------------------

console.log("17. forEach output:");
pets.forEach(function(pet){
    console.log("   Pet:", pet);
});


// ---------------------------------------------------------------
// 18. map() → Returns new array
// ---------------------------------------------------------------

const doubled = nums.map(function(n){
    return n * 2;
});
console.log("18. Doubled numbers:", doubled);


// ---------------------------------------------------------------
// 19. filter() → Filter array
// ---------------------------------------------------------------

const highMarks = marks.filter(function(score){
    return score > 80;
});
console.log("19. High marks (>80):", highMarks);


// ---------------------------------------------------------------
// 20. reduce() → Accumulate
// ---------------------------------------------------------------

const total = marks.reduce(function(sum,score){
    return sum + score;
}, 0);
console.log("20. Total marks:", total);


// ---------------------------------------------------------------
// 21. find() → First item matching condition
// ---------------------------------------------------------------

const firstBig = marks.find(function(score){
    return score > 90;
});
console.log("21. First >90:", firstBig);


// ---------------------------------------------------------------
// 22. findIndex() → Index of first match
// ---------------------------------------------------------------

const firstBigIndex = marks.findIndex(function(score){
    return score > 90;
});
console.log("22. First >90 index:", firstBigIndex);


// ---------------------------------------------------------------
// 23. every() → Check all match
// ---------------------------------------------------------------

const allAbove70 = marks.every(function(score){
    return score > 70;
});
console.log("23. All marks >70?", allAbove70);


// ---------------------------------------------------------------
// 24. some() → At least one match
// ---------------------------------------------------------------

const hasFailed = marks.some(function(score){
    return score < 40;
});
console.log("24. Any score <40?", hasFailed);


// ---------------------------------------------------------------
// 25. join() → Convert to string
// ---------------------------------------------------------------

const nameParts = ["Teja","Sai","Vijaya"];
console.log("25. Name joined:", nameParts.join(" "));


// ---------------------------------------------------------------
// 26. toString()
// ---------------------------------------------------------------

console.log("26. Pets toString:", pets.toString());


// ---------------------------------------------------------------
// 27. flat() → Flatten nested arrays
// ---------------------------------------------------------------

const nested = [1,[2,3],[4,[5]]];
console.log("27. flat(1):", nested.flat(1));
console.log("27. flat(2):", nested.flat(2));


// ---------------------------------------------------------------
// 28. Array.isArray()
// ---------------------------------------------------------------

console.log("28. fruits is array?", Array.isArray(fruits));
console.log("28. 'Hello' is array?", Array.isArray("Hello"));



