/*!
 * ensemble Social Share
 * @version 0.0.4
 * @link https://github.com/loltgt/ensemble-social-share
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */
(function (exports) {
  'use strict';

  


  
  class locale {

    
    constructor(lang) {
      if (typeof locale[lang] == 'object') {
        return locale[lang];
      } else {
        return locale[0];
      }
    }

    
    static defaults() {
      return Object.fromEntries(['ETAGN', 'EPROP', 'EMTAG', 'EOPTS', 'EELEM', 'EMETH', 'DOM'].map(a => [a, a]));
    }
  }
  
  const l10n = locale.defaults();

  



  const REJECTED_TAGS$1 = 'html|head|body|meta|link|style|script';


  
  class part {

    
    render() {
      delete this.element;
      delete this.render;
    }

    
    bind(root, cb) {
      const el = this[this.ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.appendChild(el);
    }

    
    unbind(root, cb) {
      const el = this[this.ns];
      typeof cb == 'function' && cb.call(this, el);
      return !! root.removeChild(el);
    }

    
    place(node, cb) {
      const el = this[this.ns];
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
      if (! node instanceof Element || RegExp(REJECTED_TAGS$1, 'i').test(node.tagName) || RegExp(`(<(${REJECTED_TAGS$1})*>)`, 'i').test(node.innerHTML)) {
        throw new Error(l10n.EMTAG);
      }

      this.empty();

      return !! this[this.ns].appendChild(node);
    }

    
    empty() {
      while (this.first) {
        this.remove(this.first);
      }
    }

    
    get children() {
      return Array.prototype.map.call(this[this.ns].children, (node) => { return node._1; });
    }

    
    get first() {
      const el = this[this.ns];
      return el.firstElementChild ? el.firstElementChild._1 : null;
    }

    
    get last() {
      const el = this[this.ns];
      return el.lastElementChild ? el.lastElementChild._1 : null;
    }

  }

  



  const REJECTED_TAGS = 'html|head|body|meta|link|style|script';
  const DENIED_PROPS ='attributes|classList|innerHTML|outerHTML|nodeName|nodeType';


  
  class Compo extends part {

    
    constructor(ns, tag, name, props, options, elementNS) {
      super();

      const ns0 = this.ns = `_${ns}`;
      const tagName = tag ? tag.toString() : 'div';

      if (RegExp(REJECTED_TAGS, 'i').test(tagName)) {
        throw new Error(l10n.ETAGN);
      }

      const el = this[ns0] = this.element(ns, tagName, name, props, options, elementNS);

      this.__Compo = 1;
      this[ns0]._1 = this;

      if (props && typeof props == 'object') {
        for (const prop in props) {
          const p = prop.toString();

          if (RegExp(DENIED_PROPS).test(p)) {
            throw new Error(l10n.EPROP);
          }

          if (p.indexOf('on') === 0 && props[p] && typeof props[p] == 'function') {
            el[p] = props[p].bind(this);
          } else if (typeof props[p] != 'object') {
            el[p] = props[p];
          } else if (p == 'children') {
            if (typeof props[p] == 'object' && props[p].length) {
              for (const child of props.children) {
                const {tag, name, props} = child;
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
          el.className = `${ns}-${name}`;
        } else if (typeof name == 'object') {
          el.className = Object.values(name).map(a => `${ns}-${a}`).join(' ');
        }

        if (nodeClass) {
          el.className += ` ${nodeClass}`;
        }
      }

      this.render();
    }

    
    element(ns, tag, name, props, options, elementNS) {
      if (elementNS) return document.createElementNS(elementNS, tag, options);
      else return document.createElement(tag, options);
    }

    
    hasAttr(attr) {
      return this[this.ns].hasAttribute(attr);
    }

    
    getAttr(attr) {
      return this[this.ns].getAttribute(attr);
    }

    
    setAttr(attr, value) {
      this[this.ns].setAttribute(attr, value);
    }

    
    delAttr(attr) {
      this[this.ns].removeAttribute(attr);
    }

    
    getStyle(prop) {
      return getComputedStyle(this[this.ns])[prop];
    }

    
    show() {
      this[this.ns].hidden = false;
    }

    
    hide() {
      this[this.ns].hidden = true;
    }

    
    enable() {
      this[this.ns].disabled = false;
    }

    
    disable() {
      this[this.ns].disabled = true;
    }

    
    get node() {
      console.warn(l10n.DOM);

      return this[this.ns];
    }

    
    get parent() {
      const el = this[this.ns];
      return el.parentElement && el.parentElement._1 ? el.parentElement._1 : null;
    }

    
    get previous() {
      const el = this[this.ns];
      return el.previousElementSibling ? el.previousElementSibling._1 : null;
    }

    
    get next() {
      const el = this[this.ns];
      return el.nextElementSibling ? el.nextElementSibling._1 : null;
    }

    
    get classList() {
      return this[this.ns].classList;
    }

    
    static isCompo(obj) {
      return obj instanceof Compo;
    }

  }

  



  
  class Data {

    
    constructor(ns, obj) {
      if (obj && typeof obj == 'object') {
        Object.assign(this, {}, obj);
      }

      const ns0 = this.ns = `_${ns}`;

      this.__Data = 0;
      this[ns0] = {ns};
    }

    
    compo(tag, name, props, defer = false, load = false, unload = false) {
      const ns = this[this.ns].ns;
      let compo;

      if (defer) {
        compo = {ns, tag, name, props, load, unload};
      } else {
        compo = new Compo(ns, tag, name, props);
      }
      if (load && typeof load == 'function') {
        compo.load = props.onload = load;
      }
      if (unload && typeof unload == 'function') {
        compo.unload = props.onunload = unload;
      }

      return compo;
    }

    
    async render(slot) {
      const el = this[this.ns];
      const self = this;
     

      if (el[slot] && el[slot]._) {
        el[slot].load();
      } else {
        el[slot] = {_: self[slot], load: self[slot].load, unload: self[slot].unload};
        self[slot] = new Compo(self[slot].ns, self[slot].tag, self[slot].name, self[slot].props);
        el[slot].load();
      }
    }

    
    async unload(slot) {
      const el = this[this.ns];
     

      if (el[slot] && el[slot]._) {
        el[slot].unload();
      }
    }

    
    async reflow(slot, force) {
      const el = this[this.ns];
     

      if (force) {
        el[slot] = this.compo(el[slot]._.ns, el[slot]._.name, el[slot]._.props);
      } else if (el[slot] && el[slot]._) {
        el[slot].load();
      }
    }

    
    static isData(obj) {
      return obj instanceof Data;
    }

  }

  



  
  class Event {

    
    constructor(ns, name, node) {
      const ns0 = this.ns = `_${ns}`;

      node = (Compo.isCompo(node) ? node[ns] : node) || document;

      this.__Event = 0;
      this[ns0] = {name, node};
    }

    
    add(func, options = false) {
      const {node, name} = this[this.ns];
      node.addEventListener(name, func, options);
    }

    
    remove(func) {
      const {node, name} = this[this.ns];
      node.removeEventListener(name, func);
    }

    
    static prevent(event) {
      event.preventDefault();
    }

    
    static focus(event, options) {
      const {currentTarget} = event;
      currentTarget && currentTarget.focus(options);
    }

    
    static blur(event) {
      const {currentTarget} = event;
      currentTarget && currentTarget.blur();
    }

    
    static isEvent(obj) {
      return obj instanceof Event;
    }

  }

  



  
  class base {

    
    constructor() {
      const args = arguments;
      let element, options;

      if (args.length > 1) {
        element = args[0];
        options = args[1];
     
      } else if (args[0] && typeof args[0] == 'object' && args[0].nodeType) {
        element = args[0];
      } else {
        options = args[0];
      }

      if (options && typeof options != 'object') {
        throw new TypeError(l10n.EOPTS);
      }
      if (element && typeof element != 'object') {
        throw new TypeError(l10n.EELEM);
      }

      this.binds();

      this.options = this.opts(this.defaults(), options);
      Object.freeze(this.options);

      this.element = element;
    }

    
    opts(defaults, options = {}) {
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
      const ns = this.options.ns;
      return tag != undefined ? new Compo(ns, tag, name, props) : Compo;
    }

    
    data(obj) {
      const ns = this.options.ns;
      return obj != undefined ? new Data(ns, obj) : Data;
    }

    
    event(name, node) {
      const ns = this.options.ns;
      return name != undefined ? new Event(ns, name, node) : Event;
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

    
    removeNode(parent, node) {
      return !! parent.removeChild(node);
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

    
    styleTime(node, prop) {
      let time = Compo.isCompo(node) ? node.getStyle(prop) : getComputedStyle(node)[prop];

      if (time) {
        time = time.indexOf('s') ? (parseFloat(time) * 1e3) : parseInt(time);
      }

      return time || 0;
    }

    
    wrap(method) {
      const self = this;

      if (this[method] && typeof method != 'function') {
        throw new TypeError(l10n.EMETH);
      }

      return function(event) { method.call(self, event, this); }
    }

    
    delay(func, node, time) {
      const delay = node ? this.styleTime(node, 'transitionDuration') : 0;

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

    
    aks() {
      const i = SocialShareActionEnum;

      return {
        'facebook': i.share,
        'x': i.share,
        'linkedin': i.share,
        'threads': i.share,
        'bluesky': i.share,
        'reddit': i.share,
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

    
    defaults() {
      this.ska = this.aks();

      return {
        ns: 'share',
        root: 'body',
        className: 'social-share',
        layout: 'h',
        icons: 'font',
        iconPrefix: 'icon',
        iconSvgSrc: '',
        iconSymbolHashPrefix: 'icon',
        iconSvgHashPrefix: '',
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
        copiedEffectDelay: 1e3,
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
        onInit: () => {},
        onIntent: () => {}
      };
    }

    
    binds() {
      this.intent = this.wrap(this.intent);
    }

    
    constructor() {
      super(...arguments);

      this.init();
    }

    
    generator() {
      const opts = this.options;

      const compo = this.$ = this.compo(false, false, {
        className: typeof opts.className == 'object' ? Object.values(opts.className).join(' ') : opts.className
      });
      compo.setAttr('data-social-share', '');

      if (opts.label) {
        const label = this.compo('span', 'label', opts.label);
        label.classList.add('label');

        if (! opts.label.innerText) {
          label.innerText = opts.locale.label;
        }

        compo.append(label);
      }

      if (opts.layout == 'v') {
        compo.classList.add(`${opts.ns}-vertical`);
      }

      const actions = this.actions = this.compo('ul', 'actions');
      compo.append(actions);

      this.built = true;
    }

    
    init() {
      if (this.built)
        return;

      const {options: opts} = this;

      this.root = this.selector(opts.root);

      let intents = [];

      if (! opts.intents && this.ska === opts.scaffold) {
        const a = Object.keys(this.ska);
        for (const i of [0, 1, 8, 9, 10, 2, 15, 16, 17]) {
          intents.push(a[i]);
        }
      } else if (opts.intents instanceof Array) {
        intents = opts.intents;
      } else if (opts.intents) {
        intents = Object.keys(opts.scaffold);
      }
      this.intents = intents;

      this.generator();

      if (this.element) {
        this.$.place(this.element, (function(node) {
          this.element = node;
        }).bind(this));
      }

      this.populate();

      opts.onInit.call(this, this);
      console.log('init', opts);
    }

    
    populate() {
      const act = SocialShareActionEnum;
      const {options: opts} = this;
      const {locale} = opts;

      for (const intent of this.intents) {
        if (! intent in opts.scaffold)
          continue;

        const name = intent in locale ? locale[intent].toString() : intent.replace(/\w/, cap => cap.toUpperCase());
        let title;

        switch (opts.scaffold[intent]) {
          case act.share: title = locale.share.toString().replace('%s', name); break;
          case act.send: title = locale.send.toString().replace('%s', name); break;
          case act.email: title = locale.email.toString(); break;
          case act.copy: title = locale.copy.toString(); break;
          case act.webapi:
            if (! navigator.share)
              continue;

            title = locale['web-share'].toString();
          break;
        }

        this.action(intent, title);
      }
    }

    
    action(intent, title) {
      const {options: opts} = this;

      const action = this.compo('li', 'action', {
        className: `${opts.ns}-action-${intent}`
      });
      const button = this.compo('button', ['button', 'intent'], {
        className: `${opts.ns}-intent-${intent}`,
        title,
        onclick: this.intent
      });
      action.setAttr('data-share-intent', intent);
      action.append(button);

      const icon = this.compo('span', 'icon', {
        className: `${opts.iconPrefix}-${intent}`
      });

      const svgNsUri = 'http://www.w3.org/2000/svg';

      if (opts.icons == 'symbol') {
        const svg = new (this.compo())(opts.ns, 'svg', false, false, false, svgNsUri);
        const symbol = new (this.compo())(opts.ns, 'use', false, false, false, svgNsUri);
        const {iconSymbolHashPrefix: prefix} = opts;
        const hash = prefix ? `${prefix}-${intent}` : intent;
        symbol.setAttr('href', `#${hash}`);
        svg.append(symbol);
        icon.append(svg);
     
      } else if (opts.icons == 'svg' && opts.iconSvgSrc) {
        const {iconSvgSrc, iconSvgHashPrefix: prefix} = opts;
        const hash = prefix ? `${prefix}-${intent}` : intent;
        const img = this.compo('img', false, {
          'src': `${iconSvgSrc}#${hash}`
        });
        icon.append(img);
      }

      button.append(icon);

      this.actions.append(action);
    }

    
    intent(evt, target) {
      this.event().prevent(evt);

      if (! evt.isTrusted) return;

      const act = SocialShareActionEnum;
      const {options: opts} = this;
      const {locale} = opts;

      if (! this.compo().isCompo(target))
        return;

      const action = target.parent;

      if (! (action && action.hasAttr('data-share-intent')))
        return;

      const intent = action.getAttr('data-share-intent');

      if (this.intents.indexOf(intent) == -1)
        return;

      let url, title, summary, text;
      const {selectorLink, selectorTitle, selectorDescription} = opts;

      if (opts.link) {
        url = new URL(opts.link).toString();
      } else if (selectorLink && selectorLink.element && this.selector(selectorLink.element)) {
        url = this.getAttr(this.selector(selectorLink.element), selectorLink.attribute);
      } else {
        url = window.location.href;
      }
      if (opts.title) {
        title = opts.title;
      } else if (selectorTitle && selectorTitle.element && this.selector(selectorTitle.element)) {
        title = this.getAttr(this.selector(selectorTitle.element), selectorTitle.attribute);
      } else {
        title = document.title;
      }
      if (opts.description) {
        summary = opts.description;
      } else if (selectorDescription && selectorDescription.element && this.selector(selectorDescription.element)) {
        summary = this.getAttr(this.selector(selectorDescription.element), selectorDescription.attribute);
      } else {
        summary = title;
      }
      text = '\n\n%title%\n%url%\n\n';

      const data = {url, title, text, summary};

      opts.onIntent.call(this, this, evt, intent, data);

      data.text = locale.text.toString().replace('%s', data.text);

      if (intent in opts.scaffold) {
        switch (opts.scaffold[intent]) {
          case act.email: this.sendEmail(evt, data); break;
          case act.copy: this.copyLink(evt, data); break;
          case act.webapi: this.webShare(evt, data); break;
          default: this.share(evt, data, intent);
        }
      }

      this.event().blur(evt);

      console.log('intent', this, target, evt, intent, data);
    }

    
    text(data) {
      return encodeURIComponent(
        data.text
          .replace('%url%', data.url)
          .replace('%title%', data.title)
          .replace('%summary%', data.summary)
      );
    }

    
    share(evt, data, intent) {
      const {options: opts} = this;

      if (! intent in opts.uriform) return;

      let url = opts.uriform[intent]
        .replace('%url%', encodeURIComponent(data.url))
        .replace('%title%', encodeURIComponent(data.title))
        .replace('%summary%', encodeURIComponent(data.summary));

      const features = 'toolbar=0,status=0,width=640,height=480';

      if (/%text%/.test(opts.uriform[intent])) {
        url = url.replace('%text%', this.text(data));
      }
      if (intent == 'facebook' || intent == 'messenger') {
        const app_id = opts[`${intent}_app_id`] ?? '';
        url = url.replace('%app_id%', encodeURIComponent(app_id));
      }

      console.log('share', url, null, features);

      window.open(url, null, features);
    }

    
    sendEmail(evt, data) {
      const {options: opts} = this;
      const {locale} = opts;

      const url = opts.uriform['send-email']
        .replace('%subject%', encodeURIComponent(locale.subject))
        .replace('%text%', this.text(data));

      console.log('sendEmail', url, '_self');

      window.open(url, '_self');
    }

    
    copyLink(evt, data) {
      if (! this.element) return;

      const {options: opts} = this;
      const {locale} = opts;

      try {
        navigator.clipboard.writeText(data.url);
      } catch (err) {
        if (err instanceof TypeError) {
          const node = document.createElement('textarea');
          node.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
          node.value = data.url;
          this.appendNode(this.element, node);
          node.focus();
          node.select();

          document.execCommand('copy');

          node.remove();
        } else {
          console.error('webShare', err.message);
        }
      }

      if (opts.effects) {
        const {root} = this;

        const bg = this.compo(false, 'effects-copied-link--bg', {hidden: true});
        const msg = this.compo('span', 'copied-link-msg', {innerText: locale.copied});

        root.classList.add('share-effects-copied-link');
        bg.bind(root);
        msg.bind(root);
        bg.show();

        this.delay(() => {
          msg.unbind(root);
          bg.unbind(root);
          root.classList.remove('share-effects-copied-link');
        }, bg, parseInt(opts.copiedEffectDelay) || 0);
      }
    }

    
    async webShare(evt, data) {
      try {
        await navigator.share({title: data.title, url: data.url});
      } catch (err) {
        if (err instanceof TypeError) ; else {
          console.error('webShare', err.message);
        }
      }
    }

  }

  exports.SocialShare = SocialShare;

})(this.ensemble = this.ensemble || {});
