(function f(){
	if(!window.Test){
		setTimeout(f,0);
		return;
	}
	Test.add("Global Occurrance of GroupedCallbacks",function(t){
		t.assert(window.GroupedCallbacks !== undefined, 'GroupedCallbacks exists');
		t.assert(typeof window.GroupedCallbacks === 'function', 'GroupedCallbacks is a function');
	});
	Test.add("Object signature of GroupedCallbacks objects",function(t){
		var gc = new GroupedCallbacks();
		var function_names=['add', 'apply', 'count', 'functions', 'run', 'remove'];
		var i,l;
		for(i=0,l=function_names.length;i<l;++i){
			t.assert(typeof gc[function_names[i]] === 'function', 'has ' + function_names[i] + '() method' );
		}
	});
	Test.add("Basic functionality (one level)",function(t){
		var gc = new GroupedCallbacks();
		var called = false;
		gc.add('group1',function(){
			called = true;
		});
		t.assert(called === false, 'callbacks not called only by add()');
		gc.run('group1');
		t.assert(called === true, 'callbacks called by run()');
		called = false;
		gc.run('group2');
		t.assert(called === false, 'callbacks not called only with incorrect group');
	});
	Test.add("Multiple level functionality",function(t){
		var gc = new GroupedCallbacks();
		var called = 0;
		gc.add(['main1', 'sub1'],function(){
			called += 1;
		});
		gc.add(['main1', 'sub2'],function(){
			called += 2;
		});
		gc.add(['main1'],function(){
			called += 4;
		});
		gc.run('main1');
		t.assert(called === 7, 'sub-group callbacks are called when parent group specified');
		called = 0;
		gc.run(['main1','sub2']);
		t.assert(called === 6, 'matched & parent callbacks are called');
	});
	Test.add("Irregular input",function(t){
		var gc = new GroupedCallbacks();
		var called = false;
		gc.add('group',function(){
			called = true;
		});
		t.must_throw(function(){
			gc.add(function(){});
		}, '.add() without groups throws error');
		
		t.must_throw(function(){
			gc.add(['group2']);
		}, '.add() without func throws error');
		t.assert(gc.count() === 1, '.count() without groups counts all functions');
		gc.run();
		t.assert(called === true, '.run() without groups runs all functions');
	});
	Test.add("apply()",function(t){
		var gc = new GroupedCallbacks();
		var applied_this = null, applied_param = null;
		gc.add('group',function(param){
			applied_this = this;
			applied_param = param;
		});
		var some_object={};
		gc.apply('group',some_object, [2]);
		t.assert(applied_param === 2, 'parameter is properly applied');
		t.assert(applied_this === some_object, '"this" is properly applied');
	});
	
})();
