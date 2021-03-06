// Generated by CoffeeScript 1.7.1
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      main: {
        options: {
          bare: true
        },
        expand: true,
        cwd: 'src',
        src: ['**/*.coffee', '!ignore/**/*.coffee'],
        dest: './',
        ext: '.js'
      }
    },
    watch: {
      coffee: {
        files: ['src/**/*.coffee', '!src/ignore/**/*.coffee'],
        tasks: ['coffee'],
        options: {
          atBegin: true,
          debounceDelay: 5000
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  return grunt.registerTask('default', ['watch']);
};
