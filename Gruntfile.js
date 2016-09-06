module.exports = function(grunt) {
 
  grunt.initConfig({
    jshint: {
		//http://www.jshint.com/docs/options/
		options:{
			eqeqeq: false,
			latedef: false,
			noempty: false,
			asi:true,
			loopfunc:true,
			shadow:true,
			sub:true,
			node:true,
            esversion: 6,
			'-W041': true,
			'-W038': true,
			'-W082': true,
			'-W058': true,
			'-W030': true,
			'-W032': true,
			'-W027': true,
			'-W018': true,
            '-W093': true
		},
		all: ['Gruntfile.js', 'api/api.js', 'api/lib/*.js', 'api/parts/**/*.js', 'api/utils/common.js', 'app.js', 'plugins/pluginManager.js', 'plugins/**/api/*.js', 'plugins/**/api/parts/**/*.js', 'plugins/**/frontend/*.js']
    },
	concat: {
		options: {
			separator: ';'
		},
		dom: {
			src: [
				'public/javascripts/dom/jquery/jquery-1.8.3.min.js',
				'public/javascripts/dom/jquery.form.js',
				'public/javascripts/dom/tipsy/jquery.tipsy.js',
				'public/javascripts/dom/jquery.noisy.min.js',
				'public/javascripts/dom/jquery.sticky.headers.js',
				'public/javascripts/dom/jqueryui/jquery-ui-1.8.22.custom.min.js',
				'public/javascripts/dom/jqueryui/jquery-ui-i18n.js',
				'public/javascripts/dom/slimScroll.min.js',
				'public/javascripts/dom/jquery.easing.1.3.js',
				'public/javascripts/dom/dataTables/js/jquery.dataTables.js',
				'public/javascripts/dom/dataTables/js/ZeroClipboard.js',
				'public/javascripts/dom/dataTables/js/TableTools.js',
                'public/javascripts/dom/pace/pace.min.js'
			],
			dest: 'public/javascripts/min/countly.dom.concat.js'
		},
		utils: {
			src: [
				'public/javascripts/utils/underscore-min.js',
				'public/javascripts/utils/prefixfree.min.js',
				'public/javascripts/utils/moment/moment.min.js',
				'public/javascripts/utils/moment/moment.isocalendar.min.js',
				'public/javascripts/utils/moment/lang-all.min.js',
				'public/javascripts/utils/handlebars.js',
				'public/javascripts/utils/backbone-min.js',
				'public/javascripts/utils/jquery.i18n.properties-min-1.0.9.js',
				'public/javascripts/utils/jstz.min.js',
				'public/javascripts/utils/store+json2.min.js',
				'public/javascripts/utils/jquery.idle-timer.js',
				'public/javascripts/utils/textcounter.min.js',
				'public/javascripts/utils/initialAvatar.js',
				'public/javascripts/utils/jquery.amaran.min.js',
				'public/javascripts/utils/jquery.titlealert.js',
                'public/javascripts/utils/jquery.hoverIntent.minified.js',
				'public/javascripts/countly/countly.common.js'
			],
			dest: 'public/javascripts/min/countly.utils.concat.js'
		},
		visualization: {
			src: [
				'public/javascripts/visualization/jquery.peity.min.js',
				'public/javascripts/visualization/flot/jquery.flot.js',
				'public/javascripts/visualization/flot/jquery.flot.tickrotor.js',
				'public/javascripts/visualization/flot/jquery.flot.pie.js',
				'public/javascripts/visualization/flot/jquery.flot.resize.js',
				'public/javascripts/visualization/flot/jquery.flot.stack.js',
				'public/javascripts/visualization/gauge.min.js',
				'public/javascripts/visualization/d3/d3.min.js',
				'public/javascripts/visualization/rickshaw/rickshaw.min.js'
			],
			dest: 'public/javascripts/min/countly.visualization.concat.js'
		},
		lib: {
			src: [
				'public/javascripts/countly/countly.map.helper.js',
				'public/javascripts/countly/countly.event.js',
				'public/javascripts/countly/countly.session.js',
				'public/javascripts/countly/countly.city.js',
				'public/javascripts/countly/countly.location.js',
				'public/javascripts/countly/countly.user.js',
				'public/javascripts/countly/countly.device.list.js',
				'public/javascripts/countly/countly.device.js',
				'public/javascripts/countly/countly.device.detail.js',
				'public/javascripts/countly/countly.app.version.js',
				'public/javascripts/countly/countly.carrier.js',
				'public/javascripts/countly/countly.allapps.js',
                'public/javascripts/countly/countly.total.users.js',
				'public/javascripts/countly/countly.template.js'
			],
			dest: 'public/javascripts/min/countly.lib.concat.js'
		}
    },
    uglify: {
		options: {
			banner: '/*! Countly <%= grunt.template.today("dd-mm-yyyy") %> */\n',
            mangle: {
                except: ["$super"]
            }
		},
		dist: {
			files: {
				'public/javascripts/min/countly.dom.js': 'public/javascripts/min/countly.dom.concat.js',
				'public/javascripts/min/countly.utils.js': 'public/javascripts/min/countly.utils.concat.js',
				'public/javascripts/min/countly.visualization.js': 'public/javascripts/min/countly.visualization.concat.js',
				'public/javascripts/min/countly.lib.js': 'public/javascripts/min/countly.lib.concat.js'
			}
		}
    },
    copy: {},
    cssmin: {
    	dist: {
    		files: {
    			'public/stylesheets/main.min.css': [
	    		    'public/stylesheets/main.css',
	    			'public/stylesheets/amaranjs/amaran.min.css',
	    			'public/javascripts/dom/tipsy/tipsy.css',
	    		    'public/javascripts/visualization/rickshaw/rickshaw.min.css',
                    'public/javascripts/dom/pace/pace-theme-flash.css'
	    		]
    		}
    	}
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
		  timeout: 50000
        },
        src: ['test/**/*.js']
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
  
  grunt.registerTask('dist', ['concat', 'uglify', 'cssmin']);
  
  grunt.registerTask('plugins', 'Minify plugin JS / CSS files and copy images', function(){
  	var plugins = require('./plugins/plugins.json'), js = [], css = [], img = [], fs = require('fs'), path = require('path');
  	console.log('Preparing production files for following plugins: %j', plugins);

  	plugins.forEach(function(plugin){
  		var files, pluginPath = path.join(__dirname, 'plugins', plugin),
  			javascripts = path.join(pluginPath, 'frontend/public/javascripts'),
  			stylesheets = path.join(pluginPath, 'frontend/public/stylesheets'),
  			images = path.join(pluginPath, 'frontend/public/images', plugin);

  		if (fs.existsSync(javascripts) && fs.statSync(javascripts).isDirectory()) {
  			files = fs.readdirSync(javascripts);
  			if (files.length) {
  				// move models to the top, then all dependencies, then views
  				for (var i = 0; i < files.length; i++) {
  					if (files[i].indexOf('countly.models.js') !== -1 && i !== 0) {
  						files.splice(0, 0, files.splice(i, 1)[0]);
  					} else if (files[i].indexOf('countly.views.js') !== -1 && i !== files.length - 1) {
  						files.splice(files.length - 1, 0, files.splice(i, 1)[0]);
  					}
  				}

	  			files.forEach(function(name){
	  				var file = path.join(javascripts, name);
	  				if (fs.statSync(file).isFile()) {
	  					js.push('plugins/' + plugin + '/frontend/public/javascripts/' + name);
	  				}
	  			});
  			}
  		}

	  	if (fs.existsSync(stylesheets) && fs.statSync(stylesheets).isDirectory()) {
	  		files = fs.readdirSync(stylesheets);
	  		files.forEach(function(name){
	  			var file = path.join(stylesheets, name);
	  			if (fs.statSync(file).isFile() && name !== 'pre-login.css') {
	  				css.push('plugins/' + plugin + '/frontend/public/stylesheets/' + name);
	  			}
	  		});
  		}

  		try {
  			if (fs.existsSync(images) && fs.statSync(images).isDirectory()) {
  				img.push({expand: true, cwd:'plugins/' + plugin + '/frontend/public/images/' + plugin + '/', filter:'isFile', src:'**', dest: 'public/images/' + plugin + '/'});
  			}
  		} catch(err) {
  			if (err.code !== 'ENOENT') { throw err; }
  		}
  	});

	grunt.config('copy.plugins.files', img);

	grunt.config('concat.plugins.src', js);
	grunt.config('concat.plugins.dest', 'public/javascripts/min/countly.plugins.concat.js');

	grunt.config('uglify.plugins.files.public/javascripts/min/countly\\.plugins\\.js', 'public/javascripts/min/countly.plugins.concat.js');

	grunt.config('cssmin.plugins.files.public/stylesheets/plugins\\.min\\.css', css);

	// grunt.task.loadTasks(['copy:plugins', 'concat:plugins', 'uglify:plugins']);
	// grunt.task.run(['concat', 'uglify']);
	grunt.task.run(['concat:plugins', 'uglify:plugins', 'copy:plugins', 'cssmin:plugins']);

  	console.log('Done preparing production files');
  });

  grunt.registerTask('locales', 'Concat all locale files into one', function(){
  	var plugins = require('./plugins/plugins.json'), locales = {}, fs = require('fs'), path = require('path');
  	console.log('Preparing locale files for core & plugins: %j', plugins);

  	var pushLocaleFile = function(name, path){
  		var lang = '';
  		name = name.replace('.properties', '');
  		if (name.indexOf('_') !== -1) {
  			lang = name.split('_').pop();
  		}

  		if (!locales[lang]) {
  			locales[lang] = [];
  		}

  		locales[lang].push(path);
  	};

  	[path.join(__dirname, 'public/localization/dashboard'), path.join(__dirname, 'public/localization/help'), path.join(__dirname, 'public/localization/mail')].forEach(function(dir){
  		if (!fs.existsSync(dir)) return;
  		fs.readdirSync(dir).forEach(function(name){
  			var file = path.join(dir, name);
  		  	if (fs.statSync(file).isFile()) {
  		  		pushLocaleFile(name, dir + '/' + name);
  		  	}
  		});
  	});

  	plugins.forEach(function(plugin){
  		var localization = path.join(__dirname, 'plugins', plugin, 'frontend/public/localization');

  		try {
	  		if (fs.statSync(localization).isDirectory()) {
	  			fs.readdirSync(localization).forEach(function(name){
	  				var file = path.join(localization, name);
	  				if (fs.statSync(file).isFile()) {
	  					pushLocaleFile(name, 'plugins/' + plugin + '/frontend/public/localization/' + name);
	  				}
	  			});
	  		}
  		} catch(err) {
  			if (err.code !== 'ENOENT') { throw err; }
  		}
	});

  	for (var lang in locales) {
  		grunt.config('concat.locales_' + lang + '.options.separator', '\n\n');
  		grunt.config('concat.locales_' + lang + '.src', locales[lang]);
  		grunt.config('concat.locales_' + lang + '.dest', 'public/localization/min/locale' + (lang.length ? '_' + lang : '') + '.properties');
		grunt.task.run('concat:locales_' + lang);
  	}

  	console.log('Done preparing locale files');
  });
 
  grunt.registerTask('dist-all', ['dist', 'plugins', 'locales']);

};