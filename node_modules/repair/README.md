# Repair

[![Version npm][version]](http://browsenpm.org/package/repair)[![Build Status][build]](https://travis-ci.org/Swaagie/repair)[![Dependencies][david]](https://david-dm.org/Swaagie/repair)[![Coverage Status][cover]](https://coveralls.io/r/Swaagie/repair?branch=master)

[version]: http://img.shields.io/npm/v/repair.svg?style=flat-square
[build]: http://img.shields.io/travis/Swaagie/repair/master.svg?style=flat-square
[david]: https://img.shields.io/david/Swaagie/repair.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/Swaagie/repair/master.svg?style=flat-square

Repair broken instances of native JS constructors, making `instanceof` work!
Running code in different VMs will break the instance's reference.
Simply pass an instance or collection of instances to repair and `instanceof`
checks will run again. Although this sounds silly, consider a configuration
with multiple `RegExp` instances or dependencies that assume `instanceof`
checks to work.

### Install

```
npm install --save repair
```

### Example

```
var repair = require('repair')
  , vm = require('vm')
  , config = {};

vm.createContext(config);
vm.runInContext('date=new Date', config);

assert.equal(config.date instanceof Date, true, 'Different instance');
assert.equal(repair(config.date) instanceof Date, true);
```

### License

MIT