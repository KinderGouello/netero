'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.baz = exports.Foo = void 0;
var Foo = /** @class */ (function () {
  function Foo(firstName) {
    this.firstName = firstName;
  }
  Foo.prototype.getFirstName = function () {
    return this.firstName;
  };
  return Foo;
})();
exports.Foo = Foo;
function baz() {
  return 'baz';
}
exports.baz = baz;
