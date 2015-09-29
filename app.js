// task data
var taskData = {
    "trialID": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    "immAmount": [1000, 990, 960, 920, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 80, 60, 40, 20, 10, 5, 1],
    "delAmount": 1000,
    "delLength": [{
        "inDays": 7,
        "inWords": "1 week"
    }, {
        "inDays": 14,
        "inWords": "2 weeks"
    }, {
        "inDays": 30,
        "inWords": "1 month"
    }, {
        "inDays": 180,
        "inWords": "6 months"
    }, {
        "inDays": 365,
        "inWords": "1 year"
    }, {
        "inDays": 1825,
        "inWords": "5 years"
    }, {
        "inDays": 9125,
        "inWords": "25 years"
    }]
};

]

// subject data
var subjectData = {
    "delays": [],
    "indiffVals": [],
};

var makingChoice = true;

var delayCounter = 0;

function start() {
    // setup trial view/html
    var trialHTML = "<div class=\"task-container\">\r\n  <div class=\"container u-vert-align\">\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\"><p class=\"instructions\">Which would you prefer?<\/p><\/div>\r\n    <\/div>\r\n    <div class=\"row\">\r\n      <div class=\"six columns\">Now<\/div>\r\n      <div class=\"six columns\" id=\"delay\">After x<\/div>\r\n    <\/div>\r\n    <div class=\"row\">\r\n      <div class=\"six columns\">\r\n        <button class=\"button-primary\" id=\"imm-btn\">immediate amount<\/button>\r\n      <\/div>\r\n      <div class=\"six columns\">\r\n        <button class=\"button-primary\" id=\"del-btn\">delayed amount<\/button>\r\n      <\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>";
    document.body.innerHTML = trialHTML;

    // figure out logic for one delay value and then use same logic for each delay value
    delay = document.getElementById("delay");
    delay.textContent = "After " + taskData.delLength[delayCounter].inWords;

    if (makingChoice) {
        console.log("yo!");
        makingChoice = false;
        task();
    } else {
        //calculate indifference

        // FIX: if no immediate value chosen, indiff = taskData.immAmount[amountCounter]
        // probably have to pass it into start()

        console.log("yo-bro!");
        var indiff = (immChoicesDesc[immChoicesDesc.length - 1] + immChoicesAsc[0]) / 2

        // record subject data for each delay
        subjectData.delays.push(taskData.delLength[delayCounter].inDays);
        subjectData.indiffVals.push(indiff);
        console.log(subjectData);
        delayCounter++;
        task();
    }
}

function task() {
    // init variables
    var amountCounter = 0,
    amountCounterAsc = taskData.immAmount.length - 1;

    immChoicesDesc = [],
    immChoicesAsc = [];

    // remember: variable declarations without var are automatically GLOBAL
    immBtn = document.getElementById("imm-btn");
    delBtn = document.getElementById("del-btn");
    immBtn.textContent = taskData.immAmount[amountCounter];
    delBtn.textContent = taskData.delAmount;
    delay.textContent = "After " + taskData.delLength[delayCounter].inWords;

    function nextQuestion() {
        amountCounter++;
        immBtn.textContent = taskData.immAmount[amountCounter];

        if (amountCounter > taskData.immAmount.length - 1) {
            amountCounterAsc--;
            immBtn.textContent = taskData.immAmount[amountCounterAsc];

            if (amountCounterAsc < 1) {
                // reset counters, makingChoice = false -> next delay
                amountCounter = 0;
                amountCounterAsc = taskData.immAmount.length - 1;
                console.log("hey!");
                makingChoice = false;
                start();
            }
        }
    }

    function recordAnswer() {

        if (amountCounter > taskData.immAmount.length - 1) {
            immChoicesAsc.push(parseInt(immBtn.textContent));
            console.log(immChoicesAsc);
            nextQuestion();
        } else {
            immChoicesDesc.push(parseInt(immBtn.textContent));
            console.log(immChoicesDesc);
            nextQuestion();
        }
    }

    immBtn.addEventListener("click", recordAnswer);
    delBtn.addEventListener("click", nextQuestion);

}

function showResults() {
    alert("results!");
}

// event listeners
document.getElementById("start-btn").addEventListener("click", start);
