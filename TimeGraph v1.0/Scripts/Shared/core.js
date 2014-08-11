﻿/* 
* CORE-SANDBOX-MODULE Pattern implementation
*/
if (typeof (tg) == 'undefined') // default smartdrive namespace
	tg = window.sd = {};

tg.core = tg.core || {};

/*
* @description Sandbox object implements publisher/subscriber mechanism
*/

tg.core.sandbox = function() {
	var cache = [],
		lastUid = -1;

	function publishItem(message, args) {
		if (window.isDebug && window.console && window.console.log) {
			window.console.log(message);
		}

		if (cache[message]) {
			for (var i = 0; i < cache[message].length; i++) {
				if (typeof args === "undefined") {
					args = [];
				}
				if (!(args instanceof Array)) {
					args = [args];
				}
				cache[message][i].callback.apply(cache[message][i].context, args);
			}
		}
	}

	return {
		subscribe: function(message, callback, context) {
			if (!cache[message]) {
				cache[message] = [];
			}
			var token = String(++lastUid);
			cache[message].push( { token : token, callback : callback, context: context } );
			return token;
		},
		
		unsubscribe: function(message) {
			delete cache[message];
		},
		
		unsubscribeToken: function(token) {
			for (message in cache) {
				for (var i = 0; i < cache[message].length; i++ ) {
					if (cache[message][i].token == token) {
						cache[message].splice(i, 1);
					}
				}
			}
		},

		publish: function(message, args) {
			publishItem(message, args, false);
		},
		
		publishAsync: function(message, args) {
			setTimeout(function() {
				publishItem(message, args, true);
			}, 1);
		}
	};
}();

/*
* @description Core manages the life cycle of modules.
*/

tg.core.moduleBuilder = function() {
	var moduleData = { };
	
	return {
		register: function (moduleId, creator, options) {
			if (moduleData[moduleId] == null) {
				moduleData[moduleId] = {
					creator: creator,
					instance: null,
					options: options || {}
				};
			}
		},
		start: function(moduleId) {
			if(moduleData[moduleId].instance == null)
				moduleData[moduleId].instance = new moduleData[moduleId].creator(tg.core.sandbox, moduleData[moduleId].options);
		},
		stop: function(moduleId) {
			var data = moduleData[moduleId];
			if (data.instance) {
				if(typeof(data.instance.destroy) === 'function')
					data.instance.destroy();
				data.instance = null;
			}
		},
		startAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},
		stopAll: function() {
			for (var moduleId in moduleData) {
				if (moduleData.hasOwnProperty(moduleId)) {
					this.stop(moduleId);
				}
			}
		},
		get: function(moduleId) {
			return moduleData[moduleId].instance;
		}
	};
} ();
