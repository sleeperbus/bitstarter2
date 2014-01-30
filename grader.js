#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKFILE_DEAFAULT = "checks.json";
var rest = require('restler');

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if (!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1);
	};
	return instr;
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checkfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checkfile).sort();
	var out = {};
	for (var ii in checks) {
//		console.log($(checks[ii]));
		var present = $(checks[ii]).length > 0;
//		console.log("ii is %s, present is %s, checks[ii] is %s", ii, present, checks[ii]);
		out[checks[ii]] = present;
	}
	return out;
};

var clone = function(fn) {
	return fn.bind({});
};

var urlExec = function(url, checksfile) {
	rest.get(url).on('complete', function(result, response) {
		if (result instanceof Error) {
			console.error("%s does not exists. Exting.", url);
		} else {
			fs.writeFileSync("test.html", result);
			var checkJson = checkHtmlFile("test.html", checkfile);
			var outJson = JSON.stringify(checkJson, null, 4);
			console.log(outJson);
			fs.unlink("test.html");
		}
	}
	);
}

if (require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKFILE_DEAFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <url>', 'Path to some url')
		.parse(process.argv);
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson)
} else {
	exports.checkHtmlFile = checkHtmlFile;
}




