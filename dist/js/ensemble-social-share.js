/*!
 * ensemble Social Share
 * @version 0.0.4
 * @link https://github.com/loltgt/ensemble-social-share
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */
(function (exports) {
  'use strict';

  

  
  const _Symbol = typeof Symbol == 'undefined' ? 0 : Symbol;

  


  const REJECTED_TAG_NAMES$1 = /html|head|body|meta|link|style|script/i;
  const REJECTED_TAGS = /(<(html|head|body|meta|link|style|script)*>)/i;


  
  class _composition {

    
    _render() {
      delete this._element;
      delete this._render;
    }

    
    bound(root, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.appendChild(el);
    }

    
    unbound(root, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.removeChild(el);
    }

    
    overlap(node, cb) {
      const ns = this.ns, el = this[ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! node.replaceWith(el);
    }

    
    append(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.appendChild(compo[ns]);
    }

    
    prepend(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.prependChild(compo[ns]);
    }

    
    remove(compo) {
      const ns = this.ns, el = this[ns];
      return !! el.removeChild(compo[ns]);
    }

    
    fill(node) {
      if (node instanceof Element == false || REJECTED_TAG_NAMES$1.test(node.tagName) || REJECTED_TAGS.test(node.innerHTML)) {
        throw new Error('Object cannot be resolved into a valid node.');
      }

      const ns = this.ns, el = this[ns];
      this.empty();

      return !! el.appendChild(node);
    }

    
    empty() {
      while (this.first) {
        this.remove(this.first);
      }
    }

    
    get children() {
      const ns = this.ns, el = this[ns];
      return Array.prototype.map.call(el.children, (node) => { return node.__compo; });
    }

    
    get first() {
      const ns = this.ns, el = this[ns];
      return el.firstElementChild ? el.firstElementChild.__compo : null;
    }

    
    get last() {
      const ns = this.ns, el = this[ns];
      return el.lastElementChild ? el.lastElementChild.__compo : null;
    }

  }

  



  const REJECTED_TAG_NAMES = /html|head|body|meta|link|style|script/i;
  const DENIED_PROPS = /attributes|classList|innerHTML|outerHTML|nodeName|nodeType/;


  
  class Compo extends _composition {

    
    constructor(ns, tag, name, props, options, elementNS) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      super();

      const ns0 = this.ns = '_' + ns;
      const tagName = tag ? tag.toString() : 'div';

      if (REJECTED_TAG_NAMES.test(tagName)) {
        throw new Error('Provided tag name is not a valid name.');
      }

      const el = this[ns0] = this._element(ns, tagName, name, props, options, elementNS);

      this.__Compo = true;
      this[ns0].__compo = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const p = prop.toString();

          if (DENIED_PROPS.test(p)) {
            throw new Error('Provided property name is not a valid name.');
          }
         
          if (p.indexOf('on') === 0 && props[p] && typeof props[p] == 'function') {
            el[p] = props[p].bind(this);
          } else if (typeof props[p] != 'object') {
            el[p] = props[p];
          } else if (p == 'children') {
            if (typeof props[p] == 'object' && props[p].length) {
              for (const child of props.children) {
                const tag = child.tag;
                const name = child.name;
                const props = child.props;

                this.append(new Compo(ns, tag, name, props));
              }
            }
          }
        }
      }

      if (name) {
        const nodeClass = el.className;

        el.className = '';

        if (typeof name == 'string') {
          el.className = ns + '-' + name;
        } else if (typeof name == 'object') {
          el.className = name.map((a) => (ns + '-' + a)).join(' ');
        }

        if (nodeClass) {
          el.className += ' ' + nodeClass;
        }
      }

      this._render();
    }

    
    _element(ns, tag, name, props, options, elementNS) {
      if (elementNS) return document.createElementNS(tag, [...elementNS, ...options]);
      else return document.createElement(tag, options);
    }

    
    hasAttr(attr) {
      const ns = this.ns, el = this[ns];
      return el.hasAttribute(attr);
    }

    
    getAttr(attr) {
      const ns = this.ns, el = this[ns];
      return el.getAttribute(attr);
    }

    
    setAttr(attr, value) {
      const ns = this.ns, el = this[ns];
      el.setAttribute(attr, value);
    }

    
    delAttr(attr) {
      const ns = this.ns, el = this[ns];
      el.removeAttribute(attr);
    }

    
    getStyle(prop) {
      const ns = this.ns, el = this[ns];
      return window.getComputedStyle(el)[prop];
    }

    
    show() {
      const ns = this.ns, el = this[ns];
      el.hidden = false;
    }

    
    hide() {
      const ns = this.ns, el = this[ns];
      el.hidden = true;
    }

    
    enable() {
      const ns = this.ns, el = this[ns];
      el.disabled = false;
    }

    
    disable() {
      const ns = this.ns, el = this[ns];
      el.disabled = true;
    }

    
    get node() {
      console.warn('Direct access to the node is discouraged.');

      return this[this.ns];
    }

    
    get parent() {
      const ns = this.ns, el = this[ns];
      return el.parentElement && '__compo' in el.parentElement ? el.parentElement.__compo : null;
    }

    
    get previous() {
      const ns = this.ns, el = this[ns];
      return el.previousElementSibling ? el.previousElementSibling.__compo : null;
    }

    
    get next() {
      const ns = this.ns, el = this[ns];
      return el.nextElementSibling ? el.nextElementSibling.__compo : null;
    }

    
    get classList() {
      const ns = this.ns, el = this[ns];
      return el.classList;
    }

    
    static isCompo(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Compo.prototype);
      else return obj && typeof obj == 'object' && '__Compo' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Compo';
    }

  }

  



  
  class Data {

    
    constructor(ns, obj) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const ns0 = this.ns = '_' + ns;

      this.__Data = true;
      this[ns0] = {ns};
    }

    
    compo(tag, name, props, defer = false, fresh = false, stale = false) {
     
      const ns1 = this.ns, ns = this[ns1].ns;

      let compo;

      if (defer) {
        compo = {ns, tag, name, props, fresh, stale};
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
      const ns = this.ns, el = this[ns], self = this;

      if (el[slot] && el[slot].rendered) {
        el[slot].fresh();
      } else {
        el[slot] = {rendered: true, fresh: self[slot].fresh, stale: self[slot].stale, params: self[slot]};
        self[slot] = new Compo(self[slot].ns, self[slot].tag, self[slot].name, self[slot].props);
        el[slot].fresh();
      }
    }

    
    async stale(slot) {
      const ns = this.ns, el = this[ns];

      if (el[slot] && el[slot].rendered) {
        el[slot].stale();
      }
    }

    
    async reflow(slot, force) {
      const ns = this.ns, el = this[ns];

      if (force) {
        el[slot] = this.compo(el[slot].params.ns, el[slot].params.name, el[slot].params.props);
      } else if (el[slot] && el[slot].rendered) {
        el[slot].fresh();
      }
    }

    
    static isData(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Data.prototype);
      else return obj && typeof obj == 'object' && '__Data' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Data';
    }

  }

  



  
  class Event {

    
    constructor(ns, name, node) {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      const ns0 = this.ns = '_' + ns;

      node = (Compo.isCompo(node) ? node.node : node) || document;

      this.__Event = true;
      this[ns0] = {name, node};
    }

    
    add(handle, options = false) {
      const ns = this.ns, e = this[ns], node = e.node, name = e.name;
      node.addEventListener(name, handle, options);
    }

    
    remove(handle) {
      const ns = this.ns, e = this[ns], node = e.node, name = e.name;
      node.removeEventListener(name, handle);
    }

    
    static isEvent(obj) {
      if (_Symbol) return _Symbol.for(obj) === _Symbol.for(Event.prototype);
      else return obj && typeof obj == 'object' && '__Event' in obj;
    }

    
    get [_Symbol.toStringTag]() {
      return 'ensemble.Event';
    }

  }

  



  
  class base {

    
   

    
   

    
    constructor() {
      let element, options;

      if (arguments.length > 1) {
        element = arguments[0];
        options = arguments[1];
      } else {
        options = arguments[0];
      }

      if (options && typeof options != 'object') {
        throw new TypeError('Passed argument "options" is not an Object.');
      }
      if (element && typeof element != 'object') {
        throw new TypeError('Passed argument "element" is not an Object.');
      }

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      Object.freeze(this.options);

      this.element = element;
    }

    
    defaults(defaults, options) {
      const opts = {};

      for (const key in defaults) {
        if (defaults[key] != null && typeof defaults[key] == 'object') {
          opts[key] = Object.assign(defaults[key], options[key]);
        } else {
          opts[key] = typeof options[key] != 'undefined' ? options[key] : defaults[key];
        }
      }

      return opts;
    }

    
    compo(tag, name, props) {
      const options = this.options, ns = options.ns;
      return tag != undefined ? new Compo(ns, tag, name, props) : Compo;
    }

    
    data(obj) {
      const options = this.options, ns = options.ns;
      return obj != undefined ? new Data(ns, obj) : Data;
    }

    
    event(event, node) {
      if (typeof event == 'string') {
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
    }

    
    appendNode(parent, node) {
      return !! parent.appendChild(node);
    }

    
    prependNode(parent, node) {
      return !! parent.prependChild(node);
    }

    
    removeNode(root, node) {
      return !! root.removeChild(node);
    }

    
    cloneNode(node, deep = false) {
      return node.cloneNode(deep);
    }

    
    hasAttr(node, attr) {
      return node.hasAttribute(attr);
    }

    
    getAttr(node, attr) {
      return node.getAttribute(attr);
    }

    
    setAttr(node, attr, value) {
      node.setAttribute(attr, value);
    }

    
    delAttr(node, attr) {
      node.removeAttribute(attr);
    }

    
    getTime(node, prop = 'transitionDuration') {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : window.getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? (parseFloat(time) * 1e3) : parseInt(time);
      }

      return time || 0;
    }

    
    binds(method) {
      const self = this;

      return function(event) { method.call(self, event, this); }
    }

    
    delay(func, node, time) {
      const delay = node ? this.getTime(node) : 0;

      setTimeout(func, delay || time);
    }

  }

  



  
  const SocialShareActionEnum = Object.freeze({
    share: 0,
    send: 1,
    email: 2,
    copy: 3,
    webapi: 4
  });


  
  class SocialShare extends base {

    
    static actionEnum() {
      return SocialShareActionEnum;
    }

    
    _aks() {
      const i = SocialShareActionEnum;

      return {
        'facebook': i.share,
        'x': i.share,
        'linkedin': i.share,
        'threads': i.share,
        'bluesky': i.share,
        'reddit': i.share,
        'stumbleupon': i.share,
        'mastodon': i.share,
        'quora': i.share,
        'whatsapp': i.send,
        'messenger': i.send,
        'telegram': i.send,
        'skype': i.send,
        'viber': i.send,
        'line': i.send,
        'snapchat': i.send,
        'send-email': i.email,
        'copy-link': i.copy,
        'web-share': i.webapi
      };
    }

    
    _defaults() {
      this.ska = this._aks();

      return {
        ns: 'share',
        root: 'body',
        className: 'social-share',
        effects: true,
        link: '',
        title: '',
        description: '',
        intents: null,
        scaffold: this.ska,
        uriform: {
          'facebook': 'https://www.facebook.com/dialog/share?display=popup&href=%url%&app_id=%app_id%',
          'x': 'https://twitter.com/intent/tweet?text=%title%&url=%url%',
          'linkedin': 'https://www.linkedin.com/sharing/share-offsite?mini=true&url=%url%&title=%title%&ro=false&summary=%summary%',
          'threads': 'https://threads.net/intent/post?text=%url%',
          'bluesky': 'https://bsky.app/intent/compose?text=%url%',
          'reddit': 'https://www.reddit.com/submit?url=%url%&title=%title%',
          'stumbleupon': 'https://www.stumbleupon.com/submit?url=%url%&title=%title%',
          'mastodon': 'https://mastodon.social/share?text=%text%',
          'quora': 'https://www.quora.com/share?url=%url%&title=%title%',
          'whatsapp': 'https://api.whatsapp.com/send?text=%text%',
          'messenger': 'fb-messenger://share/?link=%url%&app_id=%app_id%',
          'telegram': 'https://telegram.me/share/url?url=%url%&text=%text%',
          'skype': 'https://web.skype.com/share?url=%url%&text=%title%',
          'viber': 'viber://forward?text=%text%',
          'line': 'https://line.me/R/msg/text/?%text%',
          'snapchat': 'https://www.snapchat.com/share?link=%url%',
          'send-email': 'mailto:?subject=%subject%&body=%text%'
        },
        selectorLink: {
          element: 'link[rel="canonical"]',
          attribute: 'href'
        },
        selectorTitle: null,
        selectorDescription: {
          element: 'meta[name="description"]',
          attribute: 'content'
        },
        label: {},
        locale: {
          label: 'Share',
          share: 'Share on %s',
          send: 'Send to %s',
          subject: 'An interesting thing',
          text: 'Hi! Here something may interesting you: %s',
          email: 'Send via email',
          copy: 'Copy link',
          copied: 'Copied link!',
          'whatsapp': 'WhatsApp',
          'linkedin': 'LinkedIn',
          'web-share': 'Share'
        },
        onInit: function() {},
        onIntent: function() {}
      };
    }

    
    _bindings() {
      this.intent = this.binds(this.intent);
    }

    
    constructor() {
      if (! new.target) {
        throw 'Bad invocation. Must be called with `new`.';
      }

      super(...arguments);

      this.init();
    }

    
    generator() {
      const opts = this.options;

      const stage = this.stage = this.compo(false, false, {
        className: typeof opts.className == 'object' ? opts.className.join(' ') : opts.className
      });
     
      stage.setAttr('data-social-share', '');

      if (opts.label) {
        const label = this.compo('span', 'label', opts.label);
        label.classList.add('label');

        if ('innerText' in opts.label == false) {
          label.innerText = opts.locale.label.toString();
        }

        stage.append(label);
      }

      const actions = this.actions = this.compo('ul', 'actions');
      stage.append(actions);

      this.built = true;
    }

    
    init() {
      if (this.built) return;

      const opts = this.options;

      this.root = this.selector(opts.root);

      let intents = [];

      if (! opts.intents && this.ska === opts.scaffold) {
        const a = Object.keys(this.ska);
        for (const i of [0, 1, 9, 10, 11, 2, 16, 17, 18]) {
          intents.push(a[i].toString());
        }
      } else if (Array.prototype.isPrototypeOf(opts.intents)) {
        intents = opts.intents;
      } else if (opts.intents) {
        intents = Object.keys(opts.scaffold);
      }
      this.intents = intents;

      this.generator();

      if (this.element) {
        this.stage.overlap(this.element, (function(node) {
          this.element = node;
        }).bind(this));
      }

      this.populate();

      opts.onInit.call(this, this);
    }

    
    populate() {
      const opts = this.options, locale = opts.locale;
      const act = SocialShareActionEnum;

      for (const intent of this.intents) {
        if (! intent in opts.scaffold) continue;

        const name = intent in locale ? locale[intent].toString() : intent.replace(/\w/, cap => cap.toUpperCase());
        let title;

        switch (opts.scaffold[intent]) {
          case act.share: title = locale.share.toString().replace('%s', name); break;
          case act.send: title = locale.send.toString().replace('%s', name); break;
          case act.email: title = locale.email.toString(); break;
          case act.copy: title = locale.copy.toString(); break;
          case act.webapi:
            if (! ('share' in window.navigator && typeof window.navigator.share == 'function')) {
              continue;
            }

            title = locale['web-share'].toString();

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
      const button = this.compo('button', ['button', 'intent'], {
        className: opts.ns + '-intent-' + intent,
        title,
        onclick: this.intent
      });
     
      action.setAttr('data-share-intent', intent);
      action.append(button);

      const icon = this.compo('span', 'icon', {
        className: 'icon-' + intent
      });
      button.append(icon);

      this.actions.append(action);
    }

    
    intent(evt, target) {
      this.event(evt);

      if (! evt.isTrusted) return;

      const opts = this.options, locale = opts.locale;
      const act = SocialShareActionEnum;

      if (! this.compo().isCompo(target)) return;

      const action = target.parent;

      if (! (action && action.hasAttr('data-share-intent'))) return;

      const intent = action.getAttr('data-share-intent');

      if (this.intents.indexOf(intent) == -1) return;

     
      let url, title, summary, text;

      if (opts.link) {
        url = opts.link;
      } else if (opts.selectorLink && typeof opts.selectorLink == 'object' && this.selector(opts.selectorLink.element)) {
        url = this.getAttr(this.selector(opts.selectorLink.element), opts.selectorLink.attribute);
      } else {
        url = window.location.href;
      }
      if (opts.title) {
        title = opts.title;
      } else if (opts.selectorTitle && typeof opts.selectorTitle == 'object' && this.selector(opts.selectorTitle.element)) {
        title = this.getAttr(this.selector(opts.selectorTitle.element), opts.selectorTitle.attribute);
      } else {
        title = document.title;
      }
      if (opts.description) {
        summary = opts.description;
      } else if (opts.selectorDescription && typeof opts.selectorDescription == 'object' && this.selector(opts.selectorDescription.element)) {
        summary = this.getAttr(this.selector(opts.selectorDescription.element), opts.selectorDescription.attribute);
      } else {
        summary = title;
      }
      text = '\r\n\r\n%title%\r\n%url%\r\n\r\n';

      const data = {url, title, text, summary};

      opts.onIntent.call(this, this, evt, intent, data);

      data.text = locale.text.toString().replace('%s', data.text);

      if (intent in opts.scaffold) {
        switch (opts.scaffold[intent]) {
          case act.email: this.sendEmail(evt, data); break;
          case act.copy: this.copyLink(evt, data); break;
          case act.webapi: this.webShare(evt, data); break;
          default: this.share(evt, data, intent, action);
        }
      }
    }

    
    text(data) {
      return encodeURIComponent(
        data.text
          .replace('%url%', data.url)
          .replace('%title%', data.title)
          .replace('%summary%', data.summary)
      );
    }

    
    share(evt, data, intent, action) {
      const opts = this.options;

      if (! intent in opts.uriform) return;

      let url = opts.uriform[intent]
        .replace('%url%', encodeURIComponent(data.url))
        .replace('%title%', encodeURIComponent(data.title))
        .replace('%summary%', encodeURIComponent(data.summary));

     
      const title = action.getAttr('title');
      const options = 'toolbar=0,status=0,width=640,height=480';

      if (/%text%/.test(opts.uriform[intent])) {
        url = url.replace('%text%', this.text(data));
      }
      if (intent == 'facebook' || intent == 'messenger') {
        const app_id = intent + '_app_id' in opts ? opts[intent + '_app_id'] : '';
        url = url.replace('%app_id%', encodeURIComponent(app_id));
      }

      console.log('social', url, title, options);

      window.open(url, title, options);
    }

    
    sendEmail(evt, data) {
      const opts = this.options, locale = opts.locale;
      const url = opts.uriform['send-email']
        .replace('%subject%', encodeURIComponent(locale.subject.toString()))
        .replace('%text%', this.text(data));

      console.log('sendEmail', url, '_self');

      window.open(url, '_self');
    }

    
    copyLink(evt, data) {
      if (! this.element) return;

      const opts = this.options, locale = opts.locale;

     
      {
        const node = document.createElement('textarea');
        node.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
        node.value = data.url.toString();

        this.appendNode(this.element, node);

        node.focus();
        node.select();

       
        document.execCommand('copy');

        node.remove();
      }

      if (opts.effects) {
        const root = this.root;

        const bg = this.compo(false, 'effects-copied-link--bg', {hidden: true});
        const msg = this.compo('span', 'copied-link-msg', {innerText: locale.copied.toString()});

        root.classList.add('share-effects-copied-link');

        bg.bound(root);
        msg.bound(root);

        bg.show();

       
        this.delay(function() {
          msg.unbound(root);
          bg.unbound(root);
          root.classList.remove('share-effects-copied-link');
        }, bg, 8e2);
      }
    }

    
    async webShare(evt, data) {
      try {
        await window.navigator.share({title: data.title, url: data.url});
      } catch (err) {
        if (err instanceof TypeError) ; else {
          console.error('webShare', err.message);
        }
      }
    }

  }

  exports.SocialShare = SocialShare;

})(this.ensemble = this.ensemble || {});
