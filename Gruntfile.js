module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      dist: 'dist',
      filename: 'angular-piechart',
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
      },
      clean: {
         dist: ['<%= dist %>']
      },
      copy: {
         dist: {
            src: ['src/piechart.js'],
            dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
         }
      },
      uglify: {
         dist: {
            src: ['<%= copy.dist.dest %>'],
            dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
         }
      }
   });

   grunt.loadNpmTasks('grunt-html2js');
   grunt.loadNpmTasks('grunt-karma');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-uglify');

   grunt.registerTask('default', ['html2js', 'karma']);
   grunt.registerTask('build', ['clean', 'copy', 'uglify']);

   return grunt;
};
