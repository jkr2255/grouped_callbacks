jQuery(function(){
	'use strict';
	var Test={};
	var tests=[];
	
	var messages={
		success: 'Success',
		failed: 'FAILED',
		pending: 'Pending...'
	};
	
	var classes = {
		success: 'success',
		failed: 'danger',
		pending: 'warning'
	}
	
	var row_id_prefix = 'tests_td_';
	
	var textProperty = (document.createElement('span').textContent !== undefined) ? 'textContent' : 'innerText';
	
	var row_template = document.createElement('tr');
	row_template.appendChild(document.createElement('td'));
	row_template.appendChild(document.createElement('td'));
	row_template.appendChild(document.createElement('td'));
	var tbody = document.getElementById('results_tbody');

	Test.add = function(group, func){
		var row;
		tests.push({group: group, func: func});
		row = row_template.cloneNode(true);
		row.id = 'tests_td_' + (tests.length-1);
		row.getElementsByTagName('td')[0][textProperty] = group;
		tbody.appendChild(row);
	};
	
	function TestController(row){
		this._row = row;
		this._asserted = false;
		this._status='pending';
	}
	
	var assertionFailed = {};
	
	TestController.prototype._setStatus=function(status, extra){
		var status_td = this._row.getElementsByTagName('td')[1];
		var display_string = messages[status];
		if(extra){
			display_string += " (" + extra + ")";
		}
		status_td[textProperty] = display_string;
		status_td.className = classes[status];
		this._status = status;
	};
	
	TestController.prototype._setDescription=function(desc){
		var desc_td = this._row.getElementsByTagName('td')[2];
		desc_td[textProperty] = desc;
	}
	
	TestController.prototype.assert = function(value, desc){
		this._asserted = true;
		if(value !== true){
			this._setStatus('failed');
			this._setDescription('Assertion failed: ' + desc);
			throw assertionFailed;
		}
	};
	
	TestController.prototype.must_throw = function(func, desc){
		var thrown = false;
		if(!desc){
			desc = 'expected to throw exception';
		}
		try{
			func();
		}catch(e){
			thrown = true;
		}
		this.assert(thrown, desc);
	};
	
	TestController.prototype.must_not_be_called = function(desc){
		var test_controller = this;
		if(!desc){
			desc = 'function is not called';
		}
		return function(){
			test_controller.assert(false, desc);
		};
	}
	
	Test.run = function(){
		var i = 0, num_tests = tests.length;
		var t;
		
		for(; i< num_tests; ++i){
			t = new TestController(document.getElementById('tests_td_' + i));
			t._setStatus('pending');
			try{
				tests[i].func(t);
				if(t._status === 'pending'){
					if(t._asserted){
						//Success all tests
						t._setStatus('success');
					}else{
						t._setDescription('No assertion was given.');
					}
				}
			}catch(e){
				if(e !== assertionFailed){
					t._setStatus('failed','exception');
					t._setDescription(e.message);
				}
			}
			
		}
		
	};
	
	window.Test=Test;
});
