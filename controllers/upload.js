var express = require('express');   //Express Web Server 
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var formidable = require('formidable');
var path = require('path');     //used for file path
var fs =require('fs-extra');    //File System-needed for renaming file etc


var util = require('../util/util.js');

/**
 * 开发临时使用，正式环境应当将这部分代码迁移到静态服务器
 * http://www.ithao123.cn/content-28391.html
 * Nginx+Nodejs搭建图片服务器(Nginx读取文件，文件上传采用nodejs实现)
 */

var mediaLib = [];
var fs = require('fs');
function walkInto(dir, excludes, back) {
    var result = []; mediaLib = result;
    fs.readdir(dir, function(err, files){
        if (err) back(err);
        files = files.filter(function(value){
            return (value[0] != '.') && (excludes.indexOf(value) == -1);
        });
        var pending = files.length;
        if (!pending) return back(null, result);
        files.forEach(function(file){
            fs.stat(dir + '/' + file, function(err, stats) {
                if (stats.isFile()) {
                    result.push({path: '/upload/' + file, name: file, type: 'images', preview: '/upload/' + file, size: stats.size, mtime: stats.mtime});
                    if (!--pending) back(null, result);
                }
                if (stats.isDirectory()) {
                    walkInto(dir + '/' + file, [], function(err, res){
                        result = result.concat(res);
                        if (!--pending) back(null, result);
                    })
                }
            });
        });
    });
}

module.exports = {
	list: function(req, res, next){
		var page, pageSize, force = false, from = null, to = null;

        page = parseInt(req.query.page) || 1;
        pageSize = parseInt(req.query.pageSize) || 4;
        if(false && !force && mediaLib.length > 0) {
        	from = Math.max(0, (page-1)*pageSize)
        	to = Math.min( page*pageSize, mediaLib.length) ;
			util.res(null, res, mediaLib.slice(from, to));
        } else {
			walkInto('./build/public/upload', [], function(err, result){
				if(err){
					var error = {}
					util.res(error, res)
				} else {
					//console.log(result);
					from = Math.max(0, (page-1)*pageSize)
	        		to = Math.min( page*pageSize, result.length) ;
	        		//console.log(page,pageSize, from, to)
					util.res(null, res, {data: result.slice(from, to), total: Math.ceil(result.length / pageSize)});
				}
			})
        }
		

	},

	upload: function(req, res, next){
		var form = new formidable.IncomingForm();
	    //Formidable uploads to operating systems tmp dir by default
	    form.uploadDir = "./upload";       //set upload directory
	    form.keepExtensions = true;     //keep file extension

	    form.parse(req, function(err, fields, files) {
			//TESTING
	        console.log("file size: "+JSON.stringify(files.files.size));
	        console.log("file path: "+JSON.stringify(files.files.path));
	        console.log("file name: "+JSON.stringify(files.files.name));
	        console.log("file type: "+JSON.stringify(files.files.type));
	        console.log("lastModifiedDate: "+JSON.stringify(files.files.lastModifiedDate));

	        //Formidable changes the name of the uploaded file
	        //Rename the file to its original name
	        fs.rename(files.files.path, './build/public/upload/'+files.files.name, function(err) {
	        if (err)
	            throw err;
	          	console.log('renamed complete');  
	        });
	        // res.end();
	        util.res(null, res, {path: '/upload/'+files.files.name})
	    });
	}
}