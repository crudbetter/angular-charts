module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      dist: 'dist',
      filename: '<%= pkg.name %>',
      karma: {
         unit: {
            configFile: 'karma.conf.js',
            autoWatch: true
         }
      },
      clean: {
         dist: ['<%= dist %>']
      },
      concat: {
         dist: {
            options: {
               banner: 'angular.module(\'charts\', [\'piechart\', \'linechart\']);\n\n'
            },
            src: ['src/piechart.js', 'src/linechart.js'],
            dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
         }
      },
      uglify: {
         dist: {
            src: ['<%= concat.dist.dest %>'],
            dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
         }
      }
   });

   grunt.loadNpmTasks('grunt-karma');
   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');

   grunt.registerTask('default', ['karma']);
   grunt.registerTask('build', ['clean', 'concat', 'uglify']);

   return grunt;
};
