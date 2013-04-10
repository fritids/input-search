/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    // Metadata.
    meta: {
      version: '0.1.0'
    },
    copy: {
      src: {
         files: [
           { expand: true, cwd: 'components/', src: 'jquery/*.js', dest: 'src/vendor/'  },
           { expand: true, cwd: 'components/', src: 'modernizr/*.js', dest: 'src/vendor/'  }
         ]
      },
      tests: {
        files: [
          { expand: true, cwd: 'components/', src: '**/*.*', dest: 'test/resources/'  },
          { expand: true, cwd: 'src/', src: '**/*.*', dest: 'test/resources/'  }
        ]
      }
    },
    jquerymanifest: {
      options: {
        source: grunt.file.readJSON('package.json'),
        overrides: {
          title: "Input Search Polyfill",
          author: {
            name: "Thomas Parisot",
            email: "thomas@oncle-tom.net",
            url: "https://case.oncle-tom.net"
          },
          homepage: "https://github.com/oncletom/input-search",
          docs: "https://github.com/oncletom/input-search/blob/master/README.md",
          bugs: "https://github.com/oncletom/input-search/issues",
          dependencies: {
            jquery: ">= 1.8.0"
          }
        }
      }
    },
    qunit: {
      all: ['test/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-jquerymanifest');

  grunt.registerTask('default', ['qunit', 'jquerymanifest']);
  grunt.registerTask('build', ['copy', 'qunit', 'jquerymanifest']);
  grunt.registerTask('build-quick', ['copy:src']);
  grunt.registerTask('test', ['copy:tests', 'test-fast']);
  grunt.registerTask('test-fast', ['qunit']);

};
