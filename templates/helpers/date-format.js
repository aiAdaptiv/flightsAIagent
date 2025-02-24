Handlebars.registerHelper("formatDate", (date, format) => {
  return moment(date).format(format);
});
