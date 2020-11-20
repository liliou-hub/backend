
const ageCalculator = function (date) {
  var today = new Date();
  var birthday = new Date(date)
  var age = 0;

  age = today.getFullYear() - birthday.getFullYear();

  return age;
}; ageCalculator()
// console.log(ageCalculator("2004-06-02"));


module.exports = ageCalculator;