module.exports = Object.values(
  require('require-all')({
    dirname: __dirname,
    filter: /.json$/,
    map: function(__, path) {
      return `${path}`;
    },
  })
);
