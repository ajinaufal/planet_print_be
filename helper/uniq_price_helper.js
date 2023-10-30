const usedNumbers = new Set();
const maxNumber = 3000;
let generatedNumber;

function uniqPrinceHelper() {
    do {
        generatedNumber = Math.floor(Math.random() * (maxNumber + 1));
    } while (usedNumbers.has(generatedNumber));

    usedNumbers.add(generatedNumber);
    return generatedNumber;
}

module.exports = { uniqPrinceHelper };
