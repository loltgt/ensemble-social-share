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
  // (function(window, module, require, ensemble) {

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SocialShare = void 0;
  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/; //TODO
  // backward compatibility

  const _Symbol$2 = typeof Symbol == 'undefined' ? 0 : Symbol;

  class Compo {
    //private proposal
    //TODO
    // tag, name
    constructor(ns, tag, name, props) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
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
    } // return bool


    install(root, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]);
      return !!root.appendChild(this[this._ns]);
    } // return bool


    uninstall(root, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]);
      return !!root.removeChild(this[this._ns]);
    } // return bool


    up(pholder, cb) {
      typeof cb == 'function' && cb.call(this, this[this._ns]); //TODO
      // backward compatibility

      return !!pholder.replaceWith(this[this._ns]);
    } // return bool


    append(compo) {
      const _ns = this._ns;
      return !!this[_ns].appendChild(compo[_ns]);
    } // return bool


    prepend(compo) {
      const _ns = this._ns;
      return !!this[_ns].prependChild(compo[_ns]);
    } // return bool


    remove(compo) {
      const _ns = this._ns;
      return !!this[_ns].removeChild(compo[_ns]);
    } //TODO


    replace(compo) {} //TODO


    clone(deep = false) {}

    inject(node) {
      if (node instanceof Element == false || REJECTED_TAG_NAMES.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
        throw new Error('ensemble.Compo error: The remote object could not be resolved into a valid node.');
      }

      this.empty();

      this[this._ns].appendChild(node);
    }

    empty() {
      while (this.first) {
        //TODO
        // backward compatibility
        this.remove(this.first);
      }
    }

    hasAttr(attr) {
      return this[this._ns].hasAttribute(attr);
    }

    getAttr(attr) {
      return this[this._ns].getAttribute(attr);
    } // return undef


    setAttr(attr, value) {
      this[this._ns].setAttribute(attr, value);
    } // return undef


    delAttr(attr) {
      this[this._ns].removeAttribute(attr);
    }

    getStyle(prop) {
      return window.getComputedStyle(this[this._ns])[prop];
    }

    show() {
      this[this._ns].hidden = false;
    }

    hide() {
      this[this._ns].hidden = true;
    }

    enable() {
      this[this._ns].disabled = false;
    }

    disable() {
      this[this._ns].disabled = true;
    }

    get node() {
      console.warn('ensemble.Compo', 'Direct access to the Element node is strongly discouraged.');
      return this[this._ns];
    }

    get parent() {
      const _ns = this._ns;
      return this[_ns].parentElement && '__compo' in this[_ns].parentElement ? this[_ns].parentElement.__compo : null;
    }

    get children() {
      return Array.prototype.map.call(this[this._ns].children, node => {
        return node.__compo;
      });
    }

    get first() {
      const _ns = this._ns;
      return this[_ns].firstElementChild ? this[_ns].firstElementChild.__compo : null;
    }

    get last() {
      const _ns = this._ns;
      return this[_ns].lastElementChild ? this[_ns].lastElementChild.__compo : null;
    }

    get previous() {
      const _ns = this._ns;
      return this[_ns].previousElementSibling ? this[_ns].previousElementSibling.__compo : null;
    }

    get next() {
      const _ns = this._ns;
      return this[_ns].nextElementSibling ? this[_ns].nextElementSibling.__compo : null;
    }

    get classList() {
      return this[this._ns].classList;
    } //TODO
    // backward compatibility


    static isCompo(obj) {
      if (_Symbol$2) return _Symbol$2.for(obj) === _Symbol$2.for(Compo.prototype);else return obj && typeof obj == 'object' && '__Compo' in obj;
    } //TODO undef
    // backward compatibility


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
  //TODO
  // backward compatibility


  const _Symbol$1 = typeof Symbol == 'undefined' ? 0 : Symbol;

  class Data {
    constructor(ns, obj) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
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

    async stale(slot) {
      const _ns = this._ns;

      if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].stale();
      }
    }

    async reflow(slot, force) {
      const _ns = this._ns;

      if (force) {
        this[_ns][slot] = this.compo(this[_ns][slot].params.ns, this[_ns][slot].params.name, this[_ns][slot].params.props);
      } else if (this[_ns][slot] && this[_ns][slot].rendered) {
        this[_ns][slot].fresh();
      }
    } //TODO
    // backward compatibility


    static isData(obj) {
      if (_Symbol$1) return _Symbol$1.for(obj) === _Symbol$1.for(Data.prototype);else return obj && typeof obj == 'object' && '__Data' in obj;
    } //TODO undef
    // backward compatibility


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
  //TODO
  // backward compatibility


  const _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;

  class Event {
    constructor(ns, name, node) {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }

      const _ns = this._ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document; //TODO

      this.__Event = true;
      this[_ns] = {
        name,
        node
      };
    }

    add(handle, options = false) {
      this[this._ns].node.addEventListener(this[this._ns].name, handle, options);
    }

    remove(handle) {
      this[this._ns].node.removeEventListener(this[this._ns].name, handle);
    } //TODO
    // backward compatibility


    static isEvent(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);else return obj && typeof obj == 'object' && '__Event' in obj;
    } //TODO undef
    // backward compatibility


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


  class base {
    constructor() {
      if (!new.target) {
        throw 'ensemble error: Wrong invocation, must be called with new.';
      }
    }

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

    compo(tag, name, props) {
      return tag ? new Compo(this.options.ns, tag, name, props) : Compo;
    }

    data(obj) {
      return obj ? new Data(this.options.ns, obj) : Data;
    }

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

    selector(query, node, all = false) {
      node = node || document;
      return all ? node.querySelectorAll(query) : node.querySelector(query);
    } // return bool


    appendNode(root, node) {
      return !!root.appendChild(node);
    } // return bool


    prependNode(root, node) {
      return !!root.prependChild(node);
    } // return bool


    removeNode(root, node) {
      return !!root.removeChild(node);
    }

    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    getAttr(node, attr) {
      return node.getAttribute(attr);
    } // return undef


    setAttr(node, attr, value) {
      node.setAttribute(attr, value);
    } // return undef


    delAttr(node, attr) {
      node.removeAttribute(attr);
    }

    binds(method) {
      const self = this;
      return function (e) {
        method.call(self, e, this);
      };
    }

    delay(func, node, dtime) {
      const delay = node ? this.timing(node) : 0;
      setTimeout(func, delay || dtime);
    }

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


  class SocialShare extends base {
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

    _bindings() {
      this.intent = this.binds(this.intent);
    }

    constructor(element, options = {}) {
      super();

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);
      this.element = element;
      this.init();
    } // className
    //  tag, name
    //  with no ns prefix


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

    init() {
      const opts = this.options;
      if (this.built) return;
      this.root = this.selector(opts.root);
      this.generator();
      this.populate();
      opts.onInit.call(this, this);
    }

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

    text(data) {
      return encodeURIComponent(data.text.replace('%url%', data.url).replace('%title%', data.title).replace('%summary%', data.summary));
    }

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

    sendEmail(e, data) {
      const opts = this.options;
      const url = opts.uriform['send-email'].replace('%subject%', encodeURIComponent(opts.locale.subject)).replace('%text%', this.text(data));
      console.log(url, '_self');
      window.open(url, '_self');
    }

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