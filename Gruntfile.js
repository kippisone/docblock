module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        release: {
            options: {
                npm: true, //default: true
                indentation: '  ', //default: '  ' (two spaces)
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'Release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'Tagging release v<%= version %>' //default: 'Version <%= version %>',
                // beforeRelease: ['build'],
                // github: {
                //     repo: 'AndiOxidant/doxydoc.git', //put your user/repo here
                //     usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
                //     passwordVar: 'GITHUB_PASSWORD' //ENVIRONMENT VARIABLE that contains Github password
                // }
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.registerTask('default', 'help');
};
