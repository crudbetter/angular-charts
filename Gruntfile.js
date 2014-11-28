module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      dist: 'dist',
      filename: '<%= pkg.name %>',
      karma: {
         options: {
            configFile: 'karma.conf.js'
         }
         unit: {
            autoWatch: true
         },
         travis: {
            singleRun: true,
            reporters: ['dots']
            browsers: ['Firefox']
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

   grunt.registerTask('default', ['karma:unit']);
   grunt.registerTask('build', ['clean', 'concat', 'uglify']);

   return grunt;
};
