describe('Repair', function () {
  var assume = require('assume')
    , repair = require('./')
    , vm = require('vm')
    , result, base;

  function destroyInstance(script) {
    var context = vm.createContext({});
    vm.runInContext('base=' + script, context);

    return context.base;
  }

  it('is exposed as function', function () {
    assume(repair).to.be.a('function');
    assume(repair).to.have.length(1);
  });

  it('returns a new instance of native constructors', function () {
    base = destroyInstance('new Date');
    result = repair(base);

    assume(result).to.be.instanceof(Date);
  });

  it('iterates over arrays and objects', function () {
    base = destroyInstance('{ regexp: /test$/ }');
    result = repair(base);

    assume(result).to.have.property('regexp');
    assume(result.regexp.test('something to test')).to.equal(true);
    assume(result.regexp).to.be.instanceof(RegExp);
  });

  it('ignores unknown instances', function () {
    base = new (function Content() {});
    assume(repair(base)).to.equal(base);
  });

  it('ignores valid instances', function () {
    assume(repair(new Date)).to.be.instanceof(Date);
  });

  it('ignores undefined instances', function () {
    result = repair({
      valid: new Date,
      date: undefined
    });

    assume(result).to.have.property('date', undefined);
    assume(result.valid).to.be.instanceof(Date);
  });

  describe('#type', function () {
    it('is a function', function () {
      assume(repair.type).to.be.a('function');
      assume(repair.type).to.have.length(1);
    });

    it('returns the typeof the instance', function () {
      assume(repair.type({})).to.equal('object');
      assume(repair.type(new Date)).to.equal('date');
      assume(repair.type(new RegExp)).to.equal('regexp');
      assume(repair.type('test')).to.equal('string');
    });
  });
});