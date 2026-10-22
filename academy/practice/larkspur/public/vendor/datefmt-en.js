/*! datefmt v3.2.1 | MIT | bundled: en-US */
(function (global) {
  var DATA = {
  "en-US": {
    "months": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    "monthsShort": [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    "days": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "daysShort": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "eras": [
      "BC",
      "AD"
    ],
    "relative": {
      "seconds": "{n} seconds ago",
      "minutes": "{n} minutes ago",
      "hours": "{n} hours ago",
      "days": "{n} days ago",
      "weeks": "{n} weeks ago",
      "months": "{n} months ago",
      "years": "{n} years ago"
    },
    "ordinal": []
  }
};

  function format(date, pattern, locale) {
    var L = DATA[locale || "en-US"] || DATA["en-US"];
    var d = new Date(date);
    return pattern
      .replace("MMMM", L.months[d.getMonth()])
      .replace("MMM", L.monthsShort[d.getMonth()])
      .replace("DD", String(d.getDate()).padStart(2, "0"))
      .replace("YYYY", String(d.getFullYear()));
  }
  global.DateFmt = { format: format, locales: Object.keys(DATA) };
})(this);
