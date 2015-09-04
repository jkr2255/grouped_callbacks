# GroupedCallbacks.js

Manage callbacks by dividing into groups, subgroups... and calling parent groups means all sub grops are called.

## Overview
There are cases where we have to manage so many callbacks, especially in JavaScript.
GroupedCallbacks can help managing many callbacks through dividing to groups, subgroups...

## Usage
GroupedCallbacks can be used as an AMD module, a `require`d module, or a global object.

`GroupedCallbacks` is a constructor function, so make object first like
```
var callbacks = new GroupCallbacks;
```

## Methods

`groups` parameter is specified by an array of strings, each represents group name of each layer.
One level of group can be specified by a string.

### `.add(groups, callback)`
Add `callback` to specified `groups`.

### `.functions([groups])`
Get an array of functions in the `groups`. If `groups` is omitted, return all functions registered.

```JavaScript
// example
var callbacks = new GroupCallbacks;
callbacks.add('Main',func1);
callbacks.add(['Main','sub1'],func2);
callbacks.add(['Main','sub1','sub-sub'],func3);
callbacks.add(['Main','sub2'],func4);

//Includes func1, func2, func3 (order is not guaranteed)
var funcs = callbacks.functions(['Main','sub1']);
```

### `.count([groups])`
Get the number of functions in the `groups`. If `groups` is omitted, return the number of all functions registered.

### `.run([groups])`
Run functions in the `groups` with no argument. If `groups` is omitted, run all functions registered.
The `this` value of called functions is not guaranteed to have specific value.

### `.apply(groups, thisArg, [args])`
Run functions in the `groups` with specified `this` and arguments (just like `Function.prototype.apply`).

### Others

`GroupCallbacks` objects have some underscored methods and properties.
These are intended for internal use only, and may change without explicit notice.

## ToDo

* Removal of callbacks
* Asynchronous running
* Searching group other methods than strict equality

## License
MIT. see LICENSE file.

## Contributing

1. Fork it ( <https://github.com/jkr2255/grouped_callbacks/fork> )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

