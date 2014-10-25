var jsx2rv = require('./jsx2rv.js'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-jsx2rv';

module.exports = function gulpJSX2RV () {
    return through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }
        file.contents = new Buffer(jsx2rv.parseFileContent(file.contents.toString()));
        this.push(file);
        cb();
    });
};