/**
 * GroupedCallbacks by Jkr2255 (https://github.com/jkr2255/grouped_callbacks)
 * licensed under...
The MIT License (MIT)

Copyright (c) 2015 Jkr2255.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.GroupedCallbacks = factory();
  }
}(this, function () {
	'use strict';
	var global = new Function('return this;')();
	var hasOwn = {}.hasOwnProperty;
	var array_push = [].push;
	
	var GroupedCallbacks = function(){
		this._callbacks={subgroups: {}, functions: []};
	};
	
	function each_leaf(root_leaf, callback, pass_root){
		var sub_group;
		if(!root_leaf) return;
		if(!pass_root) callback(root_leaf);
		for(sub_group in root_leaf.subgroups) if(hasOwn.call(root_leaf.subgroups,sub_group)){
			each_leaf(root_leaf.subgroups[sub_group],callback, false);
		}
	}
	
	if(typeof global.setTimeout === 'function'){
		GroupedCallbacks.asyncRunner=function(func){
			global.setTimeout(func, 0);
		}
	}
	
	GroupedCallbacks.VERSION='0.2.0';

	GroupedCallbacks.prototype.add = function(groups, func){
		if(arguments.length < 2) throw new Error('groups and function must be specified');
		this._drillDown(groups, true).functions.push(func);
		return this;
	};

	GroupedCallbacks.prototype.count = function(groups){
		return this.functions(groups).length;
	};
	GroupedCallbacks.prototype.apply = function(groups, thisArg, params){
		var functions = this.functions(groups);
		var i, l;
		for(i=0, l=functions.length;i<l;++i){
			functions[i].apply(thisArg, params);
		}
		return this;
	};
	GroupedCallbacks.prototype._drillDown = function(groups, createNewLeaf, callback){
		if(groups === undefined) groups = [];
		else if(typeof groups === 'string') groups = [groups];
		var i=0, max_depth = groups.length;
		var group_name, target_object = this._callbacks;
		for(;i<max_depth; ++i){
			group_name = groups[i];
			if(!target_object.subgroups[group_name]){
				if(!createNewLeaf) return null;
				target_object.subgroups[group_name] = {subgroups: {}, functions: []};
			}
			target_object = target_object.subgroups[group_name];
			if(typeof callback === 'function'){
				callback(target_object);
			}
		}
		return target_object;
	};
	GroupedCallbacks.prototype.functions = function(groups){
		var matched_functions = [];
		function leaf_func(leaf){
			array_push.apply(matched_functions, leaf.functions);
		}
		var search_root = this._drillDown(groups, false, leaf_func);
		if(search_root == null) return matched_functions;
		each_leaf(search_root,leaf_func,true);
		return matched_functions;
	};
	GroupedCallbacks.prototype.remove = function(groups, func){
		throw new Error('not implemented');
	};
	GroupedCallbacks.prototype.run = function(groups){
		this.apply(groups, this, []);
		return this;
	};
	
	
    return GroupedCallbacks;
}));
