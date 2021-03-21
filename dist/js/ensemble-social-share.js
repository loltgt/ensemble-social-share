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

  const _Symbol$2 = typeof Symbol == 'undefined' ? 0 : Symbol;

  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;
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

  class Compo {
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
    constructor(ns, tag, name, props) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      const ctag = name ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(ctag)) {
        throw new Error(`ensemble.Compo error: The tag name provided (\'${ctag}\') is not a valid name.`);
      }

      const node = this[_ns] = document.createElement(ctag); //TODO

      this.__Compo = true;
      this[_ns].__compo = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const cprop = prop.toString();

          if (DENIED_PROPS.test(cprop)) {
            throw new Error(`ensemble.Compo error: The property name provided (\'${cprop}\')' is not a valid name.`);
          }

          if (cprop.indexOf('on') === 0 && props[cprop]) {
            node[cprop] = props[cprop].bind(this);
          } else if (typeof props[cprop] != 'object') {
            node[cprop] = props[cprop];
          } else if (cprop === 'children') {
            if (typeof props[cprop] == 'object' && props[cprop].length) {
              for (const child of props.children) {
                const tag = child.tag;
                const name = child.name;
                const props = child.props;
                this.append(new Compo(ns, tag, name, props));
              }
            }
          }
        }
      } //TODO args coherence


      if (name != false && name != true) {
        const _name = node.className;
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


    install(root, cb) {
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


    uninstall(root, cb) {
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


    up(pholder, cb) {
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


    append(compo) {
      const _ns = this._ns;
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


    prepend(compo) {
      const _ns = this._ns;
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


    remove(compo) {
      const _ns = this._ns;
      return !!this[_ns].removeChild(compo[_ns]);
    }
    /**
     * Replace this composition with another compo.
     *
     * @todo TODO
     * @param {ensemble.Compo} compo - An ensemble.Compo composition
     */


    replace(compo) {}
    /**
     * Clones this composition.
     * 
     * @todo TODO
     * @param {boolean} deep - Clone also all compo inside this composition
     */


    clone(deep = false) {}
    /**
     * Inject an element node inside this composition.
     * Note that any inner element contained will be removed.
     *
     * @see Element.appendChild()
     *
     * @param {Element} node - A valid Element node
     * @returns {boolean}
     */


    inject(node) {
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


    empty() {
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


    hasAttr(attr) {
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


    getAttr(attr) {
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


    setAttr(attr, value) {
      this[this._ns].setAttribute(attr, value);
    }
    /**
     * Removes an attribute from this composition. 
     *
     * @see Element.removeAttribute()
     *
     * @param {string} attr - An attribute
     */


    delAttr(attr) {
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


    getStyle(prop) {
      return window.getComputedStyle(this[this._ns])[prop];
    }
    /**
     * Time to show this composition.
     */


    show() {
      this[this._ns].hidden = false;
    }
    /**
     * Time to hide this composition.
     */


    hide() {
      this[this._ns].hidden = true;
    }
    /**
     * Util to set attribute disabled to true
     */


    enable() {
      this[this._ns].disabled = false;
    }
    /**
     * Util to set attribute disabled to false
     */


    disable() {
      this[this._ns].disabled = true;
    }
    /**
     * Getter for node property, intended as the Element node inside this composition.
     * Note that a direct access to the Element node is discouraged.
     *
     * @var {getter}
     * @returns {Element}
     */


    get node() {
      console.warn('ensemble.Compo', 'Direct access to the Element node is strongly discouraged.');
      return this[this._ns];
    }
    /**
     * Getter for parent property, intended as the parent compo of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get parent() {
      const _ns = this._ns;
      return this[_ns].parentElement && '__compo' in this[_ns].parentElement ? this[_ns].parentElement.__compo : null;
    }
    /**
     * Getter for children property, intended as children compo of this composition.
     *
     * @var {getter}
     * @returns {array}
     */


    get children() {
      return Array.prototype.map.call(this[this._ns].children, node => {
        return node.__compo;
      });
    }
    /**
     * Getter for first property, intended as the first compo contained inside of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get first() {
      const _ns = this._ns;
      return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
    }
    /**
     * Getter for last property, intended as the last compo contained inside of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get last() {
      const _ns = this._ns;
      return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
    }
    /**
     * Getter for previous property, intended as the previous sibling of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get previous() {
      const _ns = this._ns;
      return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
    }
    /**
     * Getter for next property, intended as the next sibling of this composition.
     *
     * @var {getter}
     * @returns {ensemble.Compo}
     */


    get next() {
      const _ns = this._ns;
      return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
    }
    /**
     * Getter for classList property, intended as the classList of the Element node inside this composition.
     *
     * @var {getter}
     * @returns {DOMTokenList}
     */


    get classList() {
      return this[this._ns].classList;
    }
    /**
     * Check if passed object is an ensemble.Compo instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isCompo(obj) {
      if (_Symbol$2) return _Symbol$2.for(obj) === _Symbol$2.for(Compo.prototype);else return obj && typeof obj == 'object' && '__Compo' in obj;
    }
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


    get [_Symbol$2.toStringTag]() {
      return 'ensemble.Compo';
    }

  }
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


  const _Symbol$1 = typeof Symbol == 'undefined' ? 0 : Symbol;
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


  class Data {
    /**
     * Constructor method.
     *
     * @constructs
     * @param {string} ns - Data namespace
     * @param {object} obj - A starter Object
     */
    constructor(ns, obj) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const _ns = this._ns = '_' + ns;

      this.__Data = true;
      this[_ns] = {
        ns
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


    compo(tag, name, props, defer = false, fresh = false, stale = false) {
      const ns = this[this._ns].ns;
      let compo;

      if (defer) {
        compo = {
          ns,
          tag,
          name,
          props,
          fresh,
          stale
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


    async render(slot) {
      const _ns = this._ns;

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
    }
    /**
     * Freezes a composition, passed by reference.
     *
     * @async
     * @param {mixed} slot - Reference of the element that will be rendered
     */


    async stale(slot) {
      const _ns = this._ns;

      if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].stale();
      }
    }
    /**
     * Refresh a composition, passed by reference.
     *
     * @async
     * @param {mixed} slot - Reference of the element that will be rendered.
     * @param {boolean} force - It forces the reflow.
     */


    async reflow(slot, force) {
      const _ns = this._ns;

      if (force) {
        this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
      } else if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].fresh();
      }
    }
    /**
     * Check if passed object is an ensemble.Data instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isData(obj) {
      if (_Symbol$1) return _Symbol$1.for(obj) === _Symbol$1.for(Data.prototype);else return obj && typeof obj == 'object' && '__Data' in obj;
    }
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


    get [_Symbol$1.toStringTag]() {
      return 'ensemble.Data';
    }

  }
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


  const _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;
  /**
   * Event is an event manager.
   * 
   * It is a wrapper around the native Event [DOM].
   *
   * @example
   * new ensemble.Event('namespace-of-my-foo-component', 'mousewheel', node).add(func, { capture: true });
   * @class
   */


  class Event {
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
    constructor(ns, name, node) {
      if (!new.target) {
        throw 'ensemble error: Bad invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document; //TODO

      this.__Event = true;
      this[_ns] = {
        name,
        node
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


    add(handle, options = false) {
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


    remove(handle) {
      this[this._ns].node.removeEventListener(this[this._ns].name, handle);
    }
    /**
     * Check if passed object is an ensemble.Event instance.
     *
     * @static
     * @returns {boolean}
     * @todo backward compatibility
     */


    static isEvent(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);else return obj && typeof obj == 'object' && '__Event' in obj;
    }
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


    get [_Symbol.toStringTag]() {
      return 'ensemble.Event';
    }

  }
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


  class base {
    /**
     * Constructor method.
     *
     * @constructs
     */
    constructor() {
      if (!new.target) {
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


    defaults(defaults, options) {
      const j = {};

      for (const k in defaults) {
        if (defaults[k] != null && typeof defaults[k] === 'object') {
          j[k] = Object.assign(defaults[k], options[k]);
        } else {
          j[k] = typeof options[k] != 'undefined' ? options[k] : defaults[k];
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


    compo(tag, name, props) {
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


    data(obj) {
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


    event(event, node) {
      if (typeof event === 'string') {
        return new Event(this.options.ns, event, node);
      } else if (event) {
        event.preventDefault();
        event.target.blur();
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


    selector(query, node, all = false) {
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


    appendNode(parent, node) {
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


    prependNode(parent, node) {
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


    removeNode(root, node) {
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


    cloneNode(node, deep = false) {
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


    hasAttr(node, attr) {
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


    getAttr(node, attr) {
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


    setAttr(node, attr, value) {
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


    delAttr(node, attr) {
      node.removeAttribute(attr);
    }
    /**
     * Creates a proxy function with bindings to instance and optionally an event.
     *
     * @param {function} method - A method from the current instance
     * @returns {function}
     * @todo untrusted method
     */


    binds(method) {
      const self = this;
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


    delay(func, node, dtime) {
      const delay = node ? this.timing(node) : 0;
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


    timing(node, prop = 'transitionDuration') {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? parseFloat(time) * 1e3 : parseInt(time);
      }

      return time || 0;
    }

  }
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


  class SocialShare extends base {
    /**
     * Options object default properties.
     *
     * @returns {object}
     */
    _defaults() {
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
        onInit: function () {},
        onIntent: function () {}
      };
    }
    /**
     * Methods binding.
     */


    _bindings() {
      this.intent = this.binds(this.intent);
    }
    /**
     * Constructor method.
     */


    constructor(element, options = {}) {
      super();

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);
      this.element = element;
      this.init();
    }
    /**
     * The generator creates almost everything the component needs and replaces the element placeholder.
     *
     * @todo TODO
     */


    generator() {
      const opts = this.options;
      const share = this.share = this.compo('div', 'social-share'); //TODO
      // dataset

      share.setAttr('data-social-share', '');
      share.up(this.element, function (node) {
        this.element = node;
      }.bind(this));

      if (opts.label) {
        const label = this.compo('span', 'label', opts.label);
        label.classList.add('label');
        share.append(label);
      }

      const actions = this.actions = this.compo('ul', 'actions');
      share.append(actions);
      this.built = true;
    }
    /**
     * Initializes the component.
     *
     * @todo TODO
     */


    init() {
      const opts = this.options;
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


    populate() {
      const opts = this.options;

      for (const intent in opts.intents) {
        const name = intent in opts.locale ? opts.locale[intent] : intent.replace(/\w/, cap => cap.toUpperCase());
        let title;

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


    action(intent, title) {
      const opts = this.options;
      const action = this.compo('li', 'action', {
        className: opts.ns + '-action-' + intent
      });
      const button = this.compo('button', 'intent', {
        className: opts.ns + '-intent-' + intent,
        title,
        ariaLabel: title,
        onclick: this.intent
      }); //TODO
      // dataset

      action.setAttr('data-share-intent', intent);
      action.append(button);
      const icon = this.compo('span', 'icon', {
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


    intent(e, target) {
      this.event(e);
      if (!e.isTrusted) return;
      const opts = this.options;
      if (!this.compo().isCompo(target)) return;
      const action = target.parent;
      if (!(action && action.hasAttr('data-share-intent'))) return;
      const intent = action.getAttr('data-share-intent');
      let url, title, summary, text;

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
      const data = {
        url,
        title,
        text,
        summary
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


    text(data) {
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


    social(e, data, intent, action) {
      const opts = this.options;
      if (intent in opts.uriform === false) return;
      let url = opts.uriform[intent].replace('%url%', encodeURIComponent(data.url)).replace('%title%', encodeURIComponent(data.title)).replace('%summary%', encodeURIComponent(data.summary)); //TODO

      const title = action.getAttr('ariaLabel');
      const options = 'toolbar=0,status=0,width=640,height=480';

      if (/%text%/.test(opts.uriform[intent])) {
        url = url.replace('%text%', this.text(data));
      }

      if (intent === 'messenger') {
        const app_id = 'messenger_app_id' in opts ? opts.messenger_app_id : '';
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


    sendEmail(e, data) {
      const opts = this.options;
      const url = opts.uriform['send-email'].replace('%subject%', encodeURIComponent(opts.locale.subject)).replace('%text%', this.text(data));
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


    copyLink(e, data) {
      const opts = this.options;
      const cb = document.createElement('textarea');
      cb.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
      cb.value = data.url.toString();
      this.appendNode(this.element, cb);

      if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
        const sr = document.createRange();
        const gs = getSelection();
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
        const root = this.root;
        const gnd = this.compo('div', 'fx-copied-link--ground', {
          hidden: true
        });
        const msg = this.compo('span', 'copied-link-message', {
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


    async webShare(e, data) {
      try {
        await window.navigator.share({
          title: data.title,
          url: data.url
        });
      } catch (err) {
        if (err instanceof TypeError) {
          console.info('ensemble.SocialShare.webShare', 'TODO fallback');
        } else {
          console.log('ensemble.SocialShare.webShare', err.message);
        }
      }
    }

  }

  _exports.SocialShare = SocialShare;
});