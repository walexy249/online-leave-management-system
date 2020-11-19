const date = require('date-and-time');
// -------------------------------------
// This class create the date in two formart
// july 17 if its more than a day
// 9:40 if the time is today
// -------------------------------------
module.exports = class {
  constructor(arr) {
    this.arr = arr;
  }

  createExactTime() {
    const pattern = date.compile('MMM D');
    const now = new Date();
    const today = date.format(now, pattern).split(' ')[1];
    // console.log(today);
    this.time = [];
    this.date = [...this.arr];

    this.date.forEach(element => {
      if (today === date.format(element.date, pattern).split(' ')[1]) {
        this.time.push(date.format(element.date, 'hh:mm A', true));
      } else {
        this.time.push(date.format(element.date, pattern));
      }
    });
    return this.time;
  }
};
