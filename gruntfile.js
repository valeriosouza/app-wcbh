var grunt = require('grunt');

grunt.loadNpmTasks('grunt-angular-gettext');

grunt.initConfig({
  nggettext_extract: {
    pot: {
      files: {
        'po/template.pot': ['www/views/*.html']
      }
    },
  },
  nggettext_compile: {
    all: {
      files: {
        'www/js/translations.js': ['po/*.po']
      }
    },
  },
})

grunt.task.registerTask('default', 'nggettext_extract');
grunt.task.registerTask('translate', 'nggettext_compile');