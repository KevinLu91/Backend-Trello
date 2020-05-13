function getCurrentDate(){
  n =  new Date();
  y = n.getFullYear();
  m = n.getMonth() + 1;
  d = n.getDate();

  date = y + "/" + m + "/" + d;

  return date;
}

module.exports = getCurrentDate;