// ===============================================================
//     CONDITIONAL STATEMENTS IN JAVASCRIPT (FULL EXAMPLES)
// ===============================================================


// ---------------------------------------------------------------
// 1. if Statement
// ---------------------------------------------------------------

let age = 20;

if (age >= 18) {
    console.log("1. You are an adult.");
}


// ---------------------------------------------------------------
// 2. if...else Statement
// ---------------------------------------------------------------

let score = 35;

if (score >= 40) {
    console.log("2. You passed the exam.");
} else {
    console.log("2. You failed the exam.");
}


// ---------------------------------------------------------------
// 3. if...else if...else Statement
// ---------------------------------------------------------------

let marks = 85;

if (marks >= 90) {
    console.log("3. Grade A");
} else if (marks >= 75) {
    console.log("3. Grade B");
} else if (marks >= 60) {
    console.log("3. Grade C");
} else {
    console.log("3. Grade D");
}


// ---------------------------------------------------------------
// 4. Nested if (if inside an if)
// ---------------------------------------------------------------

let username = "teja";
let password = "12345";

if (username === "teja") {
    
    if (password === "12345") {
        console.log("4. Login Successful!");
    } else {
        console.log("4. Wrong Password");
    }

} else {
    console.log("4. Username not found");
}


// ---------------------------------------------------------------
// 5. Ternary Operator (Short if else)
// ---------------------------------------------------------------

let isRaining = false;

let message = isRaining ? "5. Take an umbrella." : "5. No need for umbrella.";
console.log(message);


// ---------------------------------------------------------------
// 6. Switch Statement
// ---------------------------------------------------------------

let day = 3;  // 1 = Monday, 2 = Tuesday...

switch(day) {
    case 1:
        console.log("6. Monday");
        break;
    case 2:
        console.log("6. Tuesday");
        break;
    case 3:
        console.log("6. Wednesday");
        break;
    case 4:
        console.log("6. Thursday");
        break;
    case 5:
        console.log("6. Friday");
        break;
    default:
        console.log("6. Weekend!");
}


// ---------------------------------------------------------------
// 7. Multiple conditions using AND (&&)
// ---------------------------------------------------------------

let temp = 25;

if (temp >= 20 && temp <= 30) {
    console.log("7. Weather is pleasant.");
}


// ---------------------------------------------------------------
// 8. Multiple conditions using OR (||)
// ---------------------------------------------------------------

let input = "";

if (input === "" || input === null || input === undefined) {
    console.log("8. Input is empty.");
}


// ---------------------------------------------------------------
// 9. NOT (!) Condition
// ---------------------------------------------------------------

let isLoggedIn = false;

if (!isLoggedIn) {
    console.log("9. Please login first.");
}


// ---------------------------------------------------------------
// 10. Compare number vs string (=== vs ==)
// ---------------------------------------------------------------

// == compares value only
if (5 == "5") {
    console.log("10. == Value is equal");
}

// === compares value + type
if (5 === "5") {
    console.log("10. === True");
} else {
    console.log("10. === False (different types)");
}


// ---------------------------------------------------------------
// 11. Check positive, negative, or zero
// ---------------------------------------------------------------

let number = -4;

if (number > 0) {
    console.log("11. Number is Positive");
} else if (number < 0) {
    console.log("11. Number is Negative");
} else {
    console.log("11. Number is Zero");
}


// ---------------------------------------------------------------
// 12. Largest of three numbers
// ---------------------------------------------------------------

let a = 10, b = 25, c = 15;

if (a > b && a > c) {
    console.log("12. A is largest");
} else if (b > a && b > c) {
    console.log("12. B is largest");
} else {
    console.log("12. C is largest");
}


// ---------------------------------------------------------------
// 13. Even or Odd Number
// ---------------------------------------------------------------

let num = 7;

if (num % 2 === 0) {
    console.log("13. Even Number");
} else {
    console.log("13. Odd Number");
}


// ---------------------------------------------------------------
// END OF CONDITIONALS
// ---------------------------------------------------------------
