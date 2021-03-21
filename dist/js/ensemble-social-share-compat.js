(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ensemble = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  'use strict';
  /*!
   * loltgt ensemble.Compo
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */

  /**
   * @namespace ensemble
   * @exports Compo
   */

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SocialShare = void 0;

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }



/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _Symbol$2 = typeof Symbol == 'undefined' ? 0 : Symbol;

  var REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  var REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  var DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;
  /**
   * Compo is a composition element with shorthands method and utils.
   * 
   * It is a wrapper around an Element node [DOM].
   * It could be used as a base for abstraction of a custom component element.
   *
   * @example
   * new ensemble.Compo('namespace-of-my-foo-component', 'div', 'foo', { id: 'fooDiv', tabIndex: 1 });
   * @class
   */

  var Compo = /*#__PURE__*/function () {
    /**
     * Constructor method.
     *
     * @see document.createElement()
     * @see document.createElementNS()
     *
     * //global document.createElement
     * @constructs
     * @constant {RegExp} REJECTED_TAG_NAMES - A regular expression for rejected tag names
     * @constant {RegExp} REJECTED_TAGS - A regular expression for rejected tag
     * @constant {RegExp} DENIED_PROPS - A regular expression for denied properties
     * @param {string} ns - Composition namespace
     * @param {string} tag - The [DOM] Element node tag -or- component name
     * @param {string} name
     * @param {object} props - Properties for Element node -or- component
     * @todo tag, name
     */
    function Compo(ns, tag, name, props) {
      _classCallCheck(this, Compo);

      if (!(this instanceof Compo ? this.constructor : void 0)) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      var _ns = this._ns = '_' + ns;

      var ctag = name ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(ctag)) {
        throw new Error("ensemble.Compo error: The tag name provided ('".concat(ctag, "') is not a valid name."));
      }

      var node = this[_ns] = document.createElement(ctag); //TODO

      this.__Compo = true;
      this[_ns].__compo = this;

      if (props && _typeof(props) == 'object') {
        for (var prop in props) {
          var cprop = prop.toString();

          if (DENIED_PROPS.test(cprop)) {
            throw new Error("ensemble.Compo error: The property name provided ('".concat(cprop, "')' is not a valid name."));
          }

          if (cprop.indexOf('on') === 0 && props[cprop]) {
            node[cprop] = props[cprop].bind(this);
          } else if (_typeof(props[cprop]) != 'object') {
            node[cprop] = props[cprop];
          } else if (cprop === 'children') {
            if (_typeof(props[cprop]) == 'object' && props[cprop].length) {
              var _iterator = _createForOfIteratorHelper(props.children),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var child = _step.value;
                  var _tag = child.tag;
                  var _name2 = child.name;
                  var _props = child.props;
                  this.append(new Compo(ns, _tag, _name2, _props));
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
          }
        }
      } //TODO args coherence


      if (name != false && name != true) {
        var _name = node.className;
        node.className = ns + '-' + tag;

        if (name) {
          node.className += ' ' + ns + '-' + name;
        }

        if (_name) {
          node.className += ' ' + _name;
        }
      }
    }
    /**
     * Install the composition.
     *
     * @see HTMLElement.appendChild()
     *
     * @param {Element} root - A valid Element node
     * @param {function} cb - A function callback
     * @returns {boolean}
     */


    _createClass(Compo, [{
      key: "install",
      value: function install(root, cb) {
        typeof cb == 'function' && cb.call(this, this[this._ns]);
        return !!root.appendChild(this[this._ns]);
      }
      /**
       * Uninstall the composition.
       *
       * @see Element.removeChild()
       *
       * @param {Element} root - A valid Element node
       * @param {function} cb - A function callback
       * @returns {boolean}
       */

    }, {
      key: "uninstall",
      value: function uninstall(root, cb) {
        typeof cb == 'function' && cb.call(this, this[this._ns]);
        return !!root.removeChild(this[this._ns]);
      }
      /**
       * Loads the composition replacing a placeholder element.
       *
       * @see Element.replaceWith()
       *
       * @param {Element} pholder - A valid Element node
       * @param {function} cb - A function callback
       * @returns {boolean}
       * @todo backward compatibility
       */

    }, {
      key: "up",
      value: function up(pholder, cb) {
        typeof cb == 'function' && cb.call(this, this[this._ns]);
        return !!pholder.replaceWith(this[this._ns]);
      }
      /**
       * Appends a compo inside this composition.
       *
       * @see Element.appendChild()
       *
       * @param {ensemble.Compo} compo - An ensemble.Compo composition
       * @returns {boolean}
       */

    }, {
      key: "append",
      value: function append(compo) {
        var _ns = this._ns;
        return !!this[_ns].appendChild(compo[_ns]);
      }
      /**
       * Prepends a compo inside this composition.
       *
       * @see Element.prependChild()
       *
       * @param {ensemble.Compo} compo - An ensemble.Compo composition
       * @returns {boolean}
       */

    }, {
      key: "prepend",
      value: function prepend(compo) {
        var _ns = this._ns;
        return !!this[_ns].prependChild(compo[_ns]);
      }
      /**
       * Removes a compo from this composition.
       *
       * @see Element.removeChild()
       *
       * @param {ensemble.Compo} compo - An ensemble.Compo composition
       * @returns {boolean}
       */

    }, {
      key: "remove",
      value: function remove(compo) {
        var _ns = this._ns;
        return !!this[_ns].removeChild(compo[_ns]);
      }
      /**
       * Replace this composition with another compo.
       *
       * @todo TODO
       * @param {ensemble.Compo} compo - An ensemble.Compo composition
       */

    }, {
      key: "replace",
      value: function replace(compo) {}
      /**
       * Clones this composition.
       * 
       * @todo TODO
       * @param {boolean} deep - Clone also all compo inside this composition
       */

    }, {
      key: "clone",
      value: function clone() {
        var deep = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      }
      /**
       * Inject an element node inside this composition.
       * Note that any inner element contained will be removed.
       *
       * @see Element.appendChild()
       *
       * @param {Element} node - A valid Element node
       * @returns {boolean}
       */

    }, {
      key: "inject",
      value: function inject(node) {
        if (node instanceof Element == false || REJECTED_TAG_NAMES.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
          throw new Error('ensemble.Compo error: The remote object could not be resolved into a valid node.');
        }

        this.empty();
        return !!this[this._ns].appendChild(node);
      }
      /**
       * Empty this composition.
       * Any inner element contained will be removed.
       *
       * @see Element.remove()
       */

    }, {
      key: "empty",
      value: function empty() {
        while (this.first) {
          //TODO
          // backward compatibility
          this.remove(this.first);
        }
      }
      /**
       * Check for an attribute of this composition.
       *
       * @see Element.hasAttribute()
       *
       * @param {string} attr - An attribute
       * @returns {boolean}
       */

    }, {
      key: "hasAttr",
      value: function hasAttr(attr) {
        return this[this._ns].hasAttribute(attr);
      }
      /**
       * Gets an attribute from this composition.
       *
       * @see Element.getAttribute()
       *
       * @param {string} attr - An attribute
       * @returns {string}
       */

    }, {
      key: "getAttr",
      value: function getAttr(attr) {
        return this[this._ns].getAttribute(attr);
      }
      /**
       * Sets an attribute in this composition.
       *
       * @see Element.setAttribute()
       *
       * @param {string} attr - An attribute
       * @param {string} value - The value
       */

    }, {
      key: "setAttr",
      value: function setAttr(attr, value) {
        this[this._ns].setAttribute(attr, value);
      }
      /**
       * Removes an attribute from this composition. 
       *
       * @see Element.removeAttribute()
       *
       * @param {string} attr - An attribute
       */

    }, {
      key: "delAttr",
      value: function delAttr(attr) {
        this[this._ns].removeAttribute(attr);
      }
      /**
       * Gets a current style property.
       *
       * @see window.getComputedStyle()
       *
       * //global window.getComputedStyle
       * @param {string} prop - A style property
       * @returns {mixed}
       */

    }, {
      key: "getStyle",
      value: function getStyle(prop) {
        return window.getComputedStyle(this[this._ns])[prop];
      }
      /**
       * Time to show this composition.
       */

    }, {
      key: "show",
      value: function show() {
        this[this._ns].hidden = false;
      }
      /**
       * Time to hide this composition.
       */

    }, {
      key: "hide",
      value: function hide() {
        this[this._ns].hidden = true;
      }
      /**
       * Util to set attribute disabled to true
       */

    }, {
      key: "enable",
      value: function enable() {
        this[this._ns].disabled = false;
      }
      /**
       * Util to set attribute disabled to false
       */

    }, {
      key: "disable",
      value: function disable() {
        this[this._ns].disabled = true;
      }
      /**
       * Getter for node property, intended as the Element node inside this composition.
       * Note that a direct access to the Element node is discouraged.
       *
       * @var {getter}
       * @returns {Element}
       */

    }, {
      key: "node",
      get: function get() {
        console.warn('ensemble.Compo', 'Direct access to the Element node is strongly discouraged.');
        return this[this._ns];
      }
      /**
       * Getter for parent property, intended as the parent compo of this composition.
       *
       * @var {getter}
       * @returns {ensemble.Compo}
       */

    }, {
      key: "parent",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].parentElement && '__compo' in this[_ns].parentElement ? this[_ns].parentElement.__compo : null;
      }
      /**
       * Getter for children property, intended as children compo of this composition.
       *
       * @var {getter}
       * @returns {array}
       */

    }, {
      key: "children",
      get: function get() {
        return Array.prototype.map.call(this[this._ns].children, function (node) {
          return node.__compo;
        });
      }
      /**
       * Getter for first property, intended as the first compo contained inside of this composition.
       *
       * @var {getter}
       * @returns {ensemble.Compo}
       */

    }, {
      key: "first",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
      }
      /**
       * Getter for last property, intended as the last compo contained inside of this composition.
       *
       * @var {getter}
       * @returns {ensemble.Compo}
       */

    }, {
      key: "last",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
      }
      /**
       * Getter for previous property, intended as the previous sibling of this composition.
       *
       * @var {getter}
       * @returns {ensemble.Compo}
       */

    }, {
      key: "previous",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
      }
      /**
       * Getter for next property, intended as the next sibling of this composition.
       *
       * @var {getter}
       * @returns {ensemble.Compo}
       */

    }, {
      key: "next",
      get: function get() {
        var _ns = this._ns;
        return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
      }
      /**
       * Getter for classList property, intended as the classList of the Element node inside this composition.
       *
       * @var {getter}
       * @returns {DOMTokenList}
       */

    }, {
      key: "classList",
      get: function get() {
        return this[this._ns].classList;
      }
      /**
       * Check if passed object is an ensemble.Compo instance.
       *
       * @static
       * @returns {boolean}
       * @todo backward compatibility
       */

    }, {
      key: _Symbol$2.toStringTag,
      get:
      /**
       * Getter for Symbol property, returns the symbolic name for ensemble.Compo class.
       *
       * @see Symbol.toStringTag
       *
       * @override
       * @returns {string}
       * @todo return undef
       * @todo backward compatibility
       */
      function get() {
        return 'ensemble.Compo';
      }
    }], [{
      key: "isCompo",
      value: function isCompo(obj) {
        if (_Symbol$2) return _Symbol$2.for(obj) === _Symbol$2.for(Compo.prototype);else return obj && _typeof(obj) == 'object' && '__Compo' in obj;
      }
    }]);

    return Compo;
  }();
  /*!
   * loltgt ensemble.Data
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */


  var _Symbol$1 = typeof Symbol == 'undefined' ? 0 : Symbol;
  /**
   * Data is a multi-purpose utility object.
   * 
   * It could be used as a wrapper around a Compo composition, 
   * this object can store any kind of properties. 
   *
   * @example
   * new ensemble.Data('namespace-of-my-foo-component', { compo: ensemble.Compo, foo: 'a text string', fooObj: 'an object' });
   * @class
   */


  var Data = /*#__PURE__*/function () {
    /**
     * Constructor method.
     *
     * @constructs
     * @param {string} ns - Data namespace
     * @param {object} obj - A starter Object
     */
    function Data(ns, obj) {
      _classCallCheck(this, Data);

      if (!(this instanceof Data ? this.constructor : void 0)) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      if (obj && _typeof(obj) == 'object') {
        _extends(this, {}, obj);
      }

      var _ns = this._ns = '_' + ns;

      this.__Data = true;
      this[_ns] = {
        ns: ns
      };
    }
    /**
     * The compo method is a utility render.
     * 
     * When you create a composition with this method, it will create a Compo composition or simply an Object placeholder.
     * With the defer render you can have it rendered in place, refresh, or freeze.
     *
     * //global ensemble.Compo
     * @param {string} tag - Element node tag -or- component name
     * @param {string} name
     * @param {object} props - Properties for Element node -or- component
     * @param {boolean} defer - Defer render for composition
     * @param {mixed} fresh - A function callback, called when is loaded the compo
     * @param {mixed} stale - A function callback, called when is unloaded the compo
     * @returns {mixed} compo - An ensemble.Compo element -or- an Object placeholder 
     */


    _createClass(Data, [{
      key: "compo",
      value: function compo(tag, name, props) {
        var defer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var fresh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
        var stale = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var ns = this[this._ns].ns;
        var compo;

        if (defer) {
          compo = {
            ns: ns,
            tag: tag,
            name: name,
            props: props,
            fresh: fresh,
            stale: stale
          };
        } else {
          compo = new Compo(ns, tag, name, props);
        }

        if (fresh && typeof fresh == 'function') {
          compo.fresh = props.onfresh = fresh;
        }

        if (stale && typeof stale == 'function') {
          compo.stale = props.onstale = stale;
        }

        return compo;
      }
      /**
       * Renderizes a composition, passed by reference.
       *
       * //global ensemble.Compo
       * @async
       * @param {mixed} slot - Reference of the element that will be rendered
       */

    }, {
      key: "render",
      value: function () {
        var _render = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(slot) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _ns = this._ns;

                  if (this[_ns][slot] && this[_ns][slot].rendered) {
                    this[_ns][slot].fresh();
                  } else {
                    this[_ns][slot] = {
                      rendered: true,
                      fresh: this[slot].fresh,
                      stale: this[slot].stale,
                      params: this[slot]
                    };
                    this[slot] = new Compo(this[slot].ns, this[slot].tag, this[slot].name, this[slot].props);

                    this[_ns][slot].fresh();
                  }

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render(_x) {
          return _render.apply(this, arguments);
        }

        return render;
      }()
      /**
       * Freezes a composition, passed by reference.
       *
       * @async
       * @param {mixed} slot - Reference of the element that will be rendered
       */

    }, {
      key: "stale",
      value: function () {
        var _stale = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(slot) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _ns = this._ns;

                  if (this[_ns][slot] && this[_ns][slot].rendered) {
                    this[_ns][slot].stale();
                  }

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function stale(_x2) {
          return _stale.apply(this, arguments);
        }

        return stale;
      }()
      /**
       * Refresh a composition, passed by reference.
       *
       * @async
       * @param {mixed} slot - Reference of the element that will be rendered.
       * @param {boolean} force - It forces the reflow.
       */

    }, {
      key: "reflow",
      value: function () {
        var _reflow = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(slot, force) {
          var _ns;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _ns = this._ns;

                  if (force) {
                    this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
                  } else if (this[_ns][slot] && this[_ns][slot].rendered) {
                    this[_ns][slot].fresh();
                  }

                case 2:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this);
        }));

        function reflow(_x3, _x4) {
          return _reflow.apply(this, arguments);
        }

        return reflow;
      }()
      /**
       * Check if passed object is an ensemble.Data instance.
       *
       * @static
       * @returns {boolean}
       * @todo backward compatibility
       */

    }, {
      key: _Symbol$1.toStringTag,
      get:
      /**
       * Getter for Symbol property, returns the symbolic name for ensemble.Data class.
       *
       * @see Symbol.toStringTag
       *
       * @override
       * @returns {string}
       * @todo return undef
       * @todo backward compatibility
       */
      function get() {
        return 'ensemble.Data';
      }
    }], [{
      key: "isData",
      value: function isData(obj) {
        if (_Symbol$1) return _Symbol$1.for(obj) === _Symbol$1.for(Data.prototype);else return obj && _typeof(obj) == 'object' && '__Data' in obj;
      }
    }]);

    return Data;
  }();
  /*!
   * loltgt ensemble.Event
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */

  /**
   * @borrows Symbol as _Symbol
   * @todo backward compatibility
   */


  var _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;
  /**
   * Event is an event manager.
   * 
   * It is a wrapper around the native Event [DOM].
   *
   * @example
   * new ensemble.Event('namespace-of-my-foo-component', 'mousewheel', node).add(func, { capture: true });
   * @class
   */


  var Event = /*#__PURE__*/function () {
    /**
     * Constructor method.
     *
     * @see Element.addEventListener()
     * @see Element.removeElementListener()
     *
     * //global ensemble.Compo
     * @constructs
     * @param {string} ns - Event namespace
     * @param {string} name - The [DOM] Event type name
     * @param {Element} node - A valid Element node -or- component
     */
    function Event(ns, name, node) {
      _classCallCheck(this, Event);

      if (!(this instanceof Event ? this.constructor : void 0)) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      var _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document; //TODO

      this.__Event = true;
      this[_ns] = {
        name: name,
        node: node
      };
    }
    /**
     * Adds an event for this composition.
     *
     * @see Element.addEventListener()
     *
     * @param {function} handle - The function handler
     * @param {mixed} options - An options Object -or- useCapture boolean
     */


    _createClass(Event, [{
      key: "add",
      value: function add(handle) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this[this._ns].node.addEventListener(this[this._ns].name, handle, options);
      }
      /**
       * Removes an event from this composition.
       *
       * @see Element.removeElementListener()
       *
       * @param {function} handle - The function handler
       * @todo ? removes handle ref.
       */

    }, {
      key: "remove",
      value: function remove(handle) {
        this[this._ns].node.removeEventListener(this[this._ns].name, handle);
      }
      /**
       * Check if passed object is an ensemble.Event instance.
       *
       * @static
       * @returns {boolean}
       * @todo backward compatibility
       */

    }, {
      key: _Symbol.toStringTag,
      get:
      /**
       * Getter for Symbol property, returns the symbolic name for ensemble.Event class.
       *
       * @see Symbol.toStringTag
       *
       * @override
       * @returns {string}
       * @todo return undef
       * @todo backward compatibility
       */
      function get() {
        return 'ensemble.Event';
      }
    }], [{
      key: "isEvent",
      value: function isEvent(obj) {
        if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);else return obj && _typeof(obj) == 'object' && '__Event' in obj;
      }
    }]);

    return Event;
  }();
  /*!
   * loltgt ensemble.base
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */

  /**
   * A base class for ensemble components.
   *
   * @abstract
   * @class
   */


  var base = /*#__PURE__*/function () {
    /**
     * Constructor method.
     *
     * @constructs
     */
    function base() {
      _classCallCheck(this, base);

      if (!(this instanceof base ? this.constructor : void 0)) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }
    }
    /**
     * Creates an options Object from a defaults object of pre-defined properties.
     * 
     * Note it supports only the first level of depth.
     *
     * @param {object} defaults - The default options Object
     * @param {object} options - An options Object that would extends
     * @returns {object}
     */


    _createClass(base, [{
      key: "defaults",
      value: function defaults(_defaults, options) {
        var j = {};

        for (var k in _defaults) {
          if (_defaults[k] != null && _typeof(_defaults[k]) === 'object') {
            j[k] = _extends(_defaults[k], options[k]);
          } else {
            j[k] = typeof options[k] != 'undefined' ? options[k] : _defaults[k];
          }
        }

        return j;
      }
      /**
       * Shorthand method for ensemble.Compo class.
       *
       * When passed the first argument it makes a new Compo instance, 
       * otherwise it returns a reference to the Compo class.
       *
       * //global ensemble.Compo
       * @param {string} ns - Composition namespace
       * @param {string} tag - The [DOM] Element node tag -or- component name
       * @param {string} name
       * @returns {mixed}
       */

    }, {
      key: "compo",
      value: function compo(tag, name, props) {
        return tag ? new Compo(this.options.ns, tag, name, props) : Compo;
      }
      /**
       * Shorthand method for ensemble.Data class.
       *
       * When passed the first argument it makes a new Data instance, 
       * otherwise it returns a reference to the Data class.
       *
       * //global ensemble.Data
       * @param {object} obj - A starter Object
       * @returns {mixed}
       */

    }, {
      key: "data",
      value: function data(obj) {
        return obj ? new Data(this.options.ns, obj) : Data;
      }
      /**
       * Shorthand method for ensemble.Event class.
       *
       * When the passed first argument is a string it makes a new Event instance, 
       * if you pass an Event as the first argument, a preventDefault and blur will be performed, 
       * otherwise it returns a reference to the Event class.
       *
       * //global ensemble.Event
       * @param {object} obj - A starter Object
       * @returns {mixed}
       */

    }, {
      key: "event",
      value: function event(_event, node) {
        if (typeof _event === 'string') {
          return new Event(this.options.ns, _event, node);
        } else if (_event) {
          _event.preventDefault();

          _event.target.blur();
        } else {
          return Event;
        }
      }
      /**
       * Shortcut to querySelectorAll() and querySelector() [DOM].
       *
       * @see Element.querySelectorAll()
       * @see Element.querySelector()
       *
       * //global document
       * @param {string} query - A text query
       * @param {Element} node - An Element node where find
       * @param {boolean} all - Find single or multiple elements
       * @return {mixed} - Element -or- ElementCollection
       */

    }, {
      key: "selector",
      value: function selector(query, node) {
        var all = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        node = node || document;
        return all ? node.querySelectorAll(query) : node.querySelector(query);
      }
      /**
       * Shortcut to appendChild() [DOM].
       *
       * @see Element.appendChild()
       *
       * @param {Element} parent - An Element parent
       * @param {Element} node - An Element node to append
       * @returns {boolean}
       */

    }, {
      key: "appendNode",
      value: function appendNode(parent, node) {
        return !!parent.appendChild(node);
      }
      /**
       * Shortcut to prependChild() [DOM].
       *
       * @see Element.prependChild()
       *
       * @param {Element} parent - An Element parent
       * @param {Element} node - An Element node to prepend
       * @returns {boolean}
       */

    }, {
      key: "prependNode",
      value: function prependNode(parent, node) {
        return !!parent.prependChild(node);
      }
      /**
       * Shortcut to cloneNode() [DOM].
       *
       * @see Element.removeNode()
       *
       * @param {Element} parent - An Element parent
       * @param {Element} node - An Element node to remove
       * @returns {boolean}
       */

    }, {
      key: "removeNode",
      value: function removeNode(root, node) {
        return !!root.removeChild(node);
      }
      /**
       * Shortcut to Element.cloneNode() [DOM].
       *
       * @see Element.cloneNode()
       *
       * @param {Element} node - An Element node to clone
       * @param {boolean} deep - Clone also all children inside the Element node
       * @returns {boolean}
       */

    }, {
      key: "cloneNode",
      value: function cloneNode(node) {
        var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return node.cloneNode(deep);
      }
      /**
       * Shortcut to Element.hasAttribute() [DOM].
       *
       * @see Element.hasAttribute()
       *
       * @param {Element} node - An Element node
       * @param {string} attr - An attribute
       * @returns {boolean}
       */

    }, {
      key: "hasAttr",
      value: function hasAttr(node, attr) {
        return node.hasAttribute(attr);
      }
      /**
       * Shortcut to Element.getAttribute() [DOM].
       *
       * @see Element.getAttribute()
       *
       * @param {Element} node - An Element node
       * @param {string} attr - An attribute
       * @returns {string}
       */

    }, {
      key: "getAttr",
      value: function getAttr(node, attr) {
        return node.getAttribute(attr);
      }
      /**
       * Shortcut to Element.setAttribute() [DOM].
       *
       * @see Element.setAttribute()
       *
       * @param {Element} node - An Element node
       * @param {string} attr - An attribute
       * @param {string} value - The value
       */

    }, {
      key: "setAttr",
      value: function setAttr(node, attr, value) {
        node.setAttribute(attr, value);
      }
      /**
       * Shortcut to Element.removettribute() [DOM].
       *
       * @see Element.removeAttribute()
       *
       * @param {Element} node - An Element node
       * @param {string} attr - An attribute
       */

    }, {
      key: "delAttr",
      value: function delAttr(node, attr) {
        node.removeAttribute(attr);
      }
      /**
       * Creates a proxy function with bindings to instance and optionally an event.
       *
       * @param {function} method - A method from the current instance
       * @returns {function}
       * @todo untrusted method
       */

    }, {
      key: "binds",
      value: function binds(method) {
        var self = this;
        return function (e) {
          method.call(self, e, this);
        };
      }
      /**
       * Provides a delay and executes a callback function
       *
       * @see setTimeout()
       *
       * //global window.setTimeout
       * @param {function} func - A function callback
       * @param {mixed} node - An Element node -or- an ensemble.Compo composition
       * @param {int} dtime - A default value of time in milliseconds
       */

    }, {
      key: "delay",
      value: function delay(func, node, dtime) {
        var delay = node ? this.timing(node) : 0;
        setTimeout(func, delay || dtime);
      }
      /**
       * Calculates a time, based on a time property of the style of an element
       *
       * //global ensemble.Compo
       * //global window.getComputedStyle
       * @param {mixed} node - An Element node -or- an ensemble.Compo composition
       * @param {string} prop - A style property
       * @returns {int} time - Number of time in milliseconds
       */

    }, {
      key: "timing",
      value: function timing(node) {
        var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'transitionDuration';
        var time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

        if (time) {
          time = time.indexOf('s') ? parseFloat(time) * 1e3 : parseInt(time);
        }

        return time || 0;
      }
    }]);

    return base;
  }();
  /*!
   * loltgt ensemble.SocialShare
   *
   * @version 0.0.1
   * @copyright Copyright (C) Leonardo Laureti
   * @license MIT License
   */

  /**
   * ensemble.SocialShare component.
   *
   * @class
   * @extends base
   * @param {Element} element - A valid Element node that will be replaced with this component
   * @param {objects} options - Options object
   * @param {string} [options.ns=share] - The namespace for social share
   * @param {string} [options.root=body] - The root Element node
   * @param {object} [options.intents] - Activity intents
   * @param {object} [options.uriform] - URI strings
   * @param {object} [options.label] - Custom parameters for label
   * @param {object} [options.locale] - Localization
   * @param {function} [options.onInit] - onInit callback, fires when social share is initialized
   * @param {function} [options.onIntent] - onIntent callback, fires when an action is called
   */


  var SocialShare = /*#__PURE__*/function (_base) {
    _inherits(SocialShare, _base);

    var _super = _createSuper(SocialShare);

    /**
     * Constructor method.
     */
    function SocialShare(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, SocialShare);

      _this = _super.call(this);

      _this._bindings();

      _this.options = _this.defaults(_this._defaults(), options);
      Object.freeze(_this.options);
      _this.element = element;

      _this.init();

      return _this;
    }
    /**
     * The generator creates almost everything the component needs and replaces the element placeholder.
     *
     * @todo TODO
     */


    _createClass(SocialShare, [{
      key: "_defaults",
      value:
      /**
       * Options object default properties.
       *
       * @returns {object}
       */
      function _defaults() {
        return {
          ns: 'share',
          fx: true,
          root: 'body',
          intents: {
            'facebook': 0,
            'twitter': 0,
            'whatsapp': 1,
            'messenger': 1,
            'telegram': 1,
            'linkedin': 0,
            'send-email': 2,
            'copy-link': 3,
            'web-share': 4
          },
          uriform: {
            'facebook': 'https://facebook.com/sharer.php?u=%url%',
            'twitter': 'https://twitter.com/share?url=%url%&text=%title%',
            'whatsapp': 'https://api.whatsapp.com/send?text=%text%',
            'messenger': 'fb-messenger://share/?link=%url%&app_id=%app_id%',
            'telegram': 'https://telegram.me/share/url?url=%url%&text=%text%',
            'linkedin': 'https://www.linkedin.com/sharing/share-offsite?mini=true&url=%url%&title=%title%&ro=false&summary=%summary%',
            'send-email': 'mailto:?subject=%subject%&body=%text%'
          },
          label: {},
          locale: {
            label: 'Share',
            share: 'Share on %s',
            send: 'Send to %s',
            subject: 'An interesting thing',
            text: 'Hi! There is something may interesting you: %s',
            email: 'Send via email',
            copy: 'Copy link',
            copied: 'Copied link!',
            'whatsapp': 'WhatsApp',
            'linkedin': 'LinkedIn',
            'web-share': 'Share'
          },
          onInit: function onInit() {},
          onIntent: function onIntent() {}
        };
      }
      /**
       * Methods binding.
       */

    }, {
      key: "_bindings",
      value: function _bindings() {
        this.intent = this.binds(this.intent);
      }
    }, {
      key: "generator",
      value: function generator() {
        var opts = this.options;
        var share = this.share = this.compo('div', 'social-share'); //TODO
        // dataset

        share.setAttr('data-social-share', '');
        share.up(this.element, function (node) {
          this.element = node;
        }.bind(this));

        if (opts.label) {
          var label = this.compo('span', 'label', opts.label);
          label.classList.add('label');
          share.append(label);
        }

        var actions = this.actions = this.compo('ul', 'actions');
        share.append(actions);
        this.built = true;
      }
      /**
       * Initializes the component.
       *
       * @todo TODO
       */

    }, {
      key: "init",
      value: function init() {
        var opts = this.options;
        if (this.built) return;
        this.root = this.selector(opts.root);
        this.generator();
        this.populate();
        opts.onInit.call(this, this);
      }
      /**
       * In this stage the component is populated with all the content progeny.
       *
       * //global window.navigator.share
       */

    }, {
      key: "populate",
      value: function populate() {
        var opts = this.options;

        for (var intent in opts.intents) {
          var name = intent in opts.locale ? opts.locale[intent] : intent.replace(/\w/, function (cap) {
            return cap.toUpperCase();
          });
          var title = void 0;

          switch (opts.intents[intent]) {
            case 0:
              title = opts.locale.share.replace('%s', name);
              break;

            case 1:
              title = opts.locale.send.replace('%s', name);
              break;

            case 2:
              title = opts.locale.email;
              break;

            case 3:
              title = opts.locale.copy;
              break;

            case 4:
              if (!('share' in window.navigator && typeof window.navigator.share == 'function')) {
                continue;
              }

              title = opts.locale['web-share'];
              break;
          }

          this.action(intent, title);
        }
      }
      /**
       * Creates the whole set of buttons.
       *
       * @param {string} intent - The activity name
       * @param {string} title - A title for activity
       */

    }, {
      key: "action",
      value: function action(intent, title) {
        var opts = this.options;
        var action = this.compo('li', 'action', {
          className: opts.ns + '-action-' + intent
        });
        var button = this.compo('button', 'intent', {
          className: opts.ns + '-intent-' + intent,
          title: title,
          ariaLabel: title,
          onclick: this.intent
        }); //TODO
        // dataset

        action.setAttr('data-share-intent', intent);
        action.append(button);
        var icon = this.compo('span', 'icon', {
          className: 'icon-' + intent
        });
        button.append(icon);
        this.actions.append(action);
      }
      /**
       * The intent activity.
       * This method is called from each action.
       *
       * //global ensemble.Compo
       * //global window.location
       * @param {Event} e - An Event
       * @param {Element} target - The element that is invoking
       */

    }, {
      key: "intent",
      value: function intent(e, target) {
        this.event(e);
        if (!e.isTrusted) return;
        var opts = this.options;
        if (!this.compo().isCompo(target)) return;
        var action = target.parent;
        if (!(action && action.hasAttr('data-share-intent'))) return;
        var intent = action.getAttr('data-share-intent');
        var url, title, summary, text;

        if (this.selector('link[rel="canonical"]')) {
          url = this.selector('link[rel="canonical"]').href;
        } else {
          url = window.location.href;
        }

        title = summary = document.title;

        if (this.selector('meta[name="description"]')) {
          summary = this.selector('meta[name="description"]').content;
        }

        text = '\r\n\r\n%title%\r\n%url%\r\n\r\n';
        var data = {
          url: url,
          title: title,
          text: text,
          summary: summary
        };
        opts.onIntent.call(this, this, e, intent, data);
        data.text = opts.locale.text.replace('%s', data.text);

        if (intent in opts.intents) {
          switch (intent) {
            case 'send-email':
              this.sendEmail(e, data);
              break;

            case 'copy-link':
              this.copyLink(e, data);
              break;

            case 'web-share':
              this.webShare(e, data);
              break;

            default:
              this.social(e, data, intent, action);
          }
        }
      }
      /**
       * Makes text substitutions and encodes to an URL
       *
       * @param {object} data - The data object
       * @param {string} data.url - Shared URL
       * @param {string} data.title - Shared title
       * @param {string} data.text - Shared description text
       * @param {string} data.summary - Shared summary
       * @return {string} - The encoded URL text string
       */

    }, {
      key: "text",
      value: function text(data) {
        return encodeURIComponent(data.text.replace('%url%', data.url).replace('%title%', data.title).replace('%summary%', data.summary));
      }
      /**
       * Generic social method for social network sharing intent.
       *
       * //global window.open
       * @param {Event} e - An Event
       * @param {object} data - The data object
       * @param {string} data.url - Shared URL
       * @param {string} data.title - Shared title
       * @param {string} data.text - Shared description text
       * @param {string} data.summary - Shared summary
       */

    }, {
      key: "social",
      value: function social(e, data, intent, action) {
        var opts = this.options;
        if (intent in opts.uriform === false) return;
        var url = opts.uriform[intent].replace('%url%', encodeURIComponent(data.url)).replace('%title%', encodeURIComponent(data.title)).replace('%summary%', encodeURIComponent(data.summary)); //TODO

        var title = action.getAttr('ariaLabel');
        var options = 'toolbar=0,status=0,width=640,height=480';

        if (/%text%/.test(opts.uriform[intent])) {
          url = url.replace('%text%', this.text(data));
        }

        if (intent === 'messenger') {
          var app_id = 'messenger_app_id' in opts ? opts.messenger_app_id : '';
          url = url.replace('%app_id%', encodeURIComponent(app_id));
        }

        console.log(url, title, options);
        window.open(url, title, options);
      }
      /**
       * Send email intent, it tries to open the default mail client.
       *
       * //global window.navigator.share
       * @param {Event} e - An Event
       * @param {object} data - The data object
       * @param {string} data.url - Shared URL
       * @param {string} data.title - Shared title
       * @param {string} data.text - Shared description text
       * @param {string} data.summary - Shared summary
       */

    }, {
      key: "sendEmail",
      value: function sendEmail(e, data) {
        var opts = this.options;
        var url = opts.uriform['send-email'].replace('%subject%', encodeURIComponent(opts.locale.subject)).replace('%text%', this.text(data));
        console.log(url, '_self');
        window.open(url, '_self');
      }
      /**
       * Copy link intent, it tries to copy URL on the clipboard.
       *
       * //global document.createElement
       * //global document.execCommand
       * @param {Event} e - An Event
       * @param {object} data - The data object
       * @param {string} data.url - Shared URL
       * @param {string} data.title - Shared title
       * @param {string} data.text - Shared description text
       * @param {string} data.summary - Shared summary
       */

    }, {
      key: "copyLink",
      value: function copyLink(e, data) {
        var opts = this.options;
        var cb = document.createElement('textarea');
        cb.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
        cb.value = data.url.toString();
        this.appendNode(this.element, cb);

        if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
          var sr = document.createRange();
          var gs = getSelection();
          sr.selectNodeContents(cb);
          gs.removeAllRanges();
          gs.addRange(sr);
          cb.setSelectionRange(0, 999999);
        } else {
          cb.focus();
          cb.select();
        }

        document.execCommand('copy');
        cb.remove();

        if (opts.fx) {
          var root = this.root;
          var gnd = this.compo('div', 'fx-copied-link--ground', {
            hidden: true
          });
          var msg = this.compo('span', 'copied-link-message', {
            innerText: opts.locale.copied
          });
          root.classList.add('share-fx-copied-link');
          gnd.install(root);
          msg.install(root);
          gnd.show();
          this.delay(function () {
            msg.uninstall(root);
            gnd.uninstall(root);
            root.classList.remove('share-fx-copied-link');
          }, gnd, 8e2);
        }
      }
      /**
       * Calls the native WebShare API for sharing.
       *
       * //global window.navigator.share
       * @async
       */

    }, {
      key: "webShare",
      value: function () {
        var _webShare = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(e, data) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;
                  _context4.next = 3;
                  return window.navigator.share({
                    title: data.title,
                    url: data.url
                  });

                case 3:
                  _context4.next = 8;
                  break;

                case 5:
                  _context4.prev = 5;
                  _context4.t0 = _context4["catch"](0);

                  if (_context4.t0 instanceof TypeError) {
                    console.info('ensemble.SocialShare.webShare', 'TODO fallback');
                  } else {
                    console.log('ensemble.SocialShare.webShare', _context4.t0.message);
                  }

                case 8:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, null, [[0, 5]]);
        }));

        function webShare(_x5, _x6) {
          return _webShare.apply(this, arguments);
        }

        return webShare;
      }()
    }]);

    return SocialShare;
  }(base);

  _exports.SocialShare = SocialShare;
});