module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      html2js: {
         test: {
            options: {
               base: '.',
               module: null
            },
            files: [{
               expand: true,
               src: ['template/**/*.html'],
               ext: '.html.js'
            }]
         }
      },
      karma: {
         unit: {
            configFile: 'karma.conf.js',
            autoWatch: true
         }
      }
   });

   grunt.loadNpmTasks('grunt-html2js');
   grunt.loadNpmTasks('grunt-karma');

   grunt.registerTask('default', ['html2js', 'karma']);

   return grunt;
};
