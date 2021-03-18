/*!
 * loltgt ensemble.SocialShare
 *
 * @version 0.0.1
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

// (function(window, module, require, ensemble) {

  // const base = ensemble ? ensemble.base : require('../../../ensemble-stack-d1/base');

  import base from '../../../ensemble-stack-d1/base.js';


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
        onInit: function() {},
        onIntent: function() {}
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
    }

    // className
    //  tag, name
    //  with no ns prefix
    generator() {
      const opts = this.options;

      const share = this.share = this.compo('div', 'social-share');
      //TODO
      // dataset
      share.setAttr('data-social-share', '');
      share.up(this.element);

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
          case 0: title = opts.locale.share.replace('%s', name); break;
          case 1: title = opts.locale.send.replace('%s', name); break;
          case 2: title = opts.locale.email; break;
          case 3: title = opts.locale.copy; break;
          case 4:
            if (! ('share' in window.navigator && typeof window.navigator.share == 'function')) {
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
      });
      //TODO
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

      if (! e.isTrusted) return;

      const opts = this.options;

      //TODO
      // direct access to node
      const action_node = target._share.parentElement;

      if (! this.hasAttr(action_node, 'data-share-intent')) return;

      const intent = this.getAttr(action_node, 'data-share-intent');

      let url, title, summary, text;

      if (this.selector('link[rel="canonical"]')) {
        url = this.selector('link[rel="canonical"]').href;
      } else {
        url = window.location.href;
      }
      title = summary = document.title;
      if (this.selector('meta[name="description"]')) {
        summary = this.selector('meta[name="description"]').content
      }
      text = '\r\n\r\n%title%\r\n%url%\r\n\r\n';

      const data = { url, title, text, summary };

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
            // action_node
            this.social(e, data, intent, action_node);
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

    social(e, data, intent, action_node) {
      const opts = this.options;

      if (intent in opts.uriform === false) return;

      let url = opts.uriform[intent]
        .replace('%url%', encodeURIComponent(data.url))
        .replace('%title%', encodeURIComponent(data.title))
        .replace('%summary%', encodeURIComponent(data.summary));

      // action_node
      const title = this.getAttr(action_node, 'ariaLabel');
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
      const url = opts.uriform['send-email']
        .replace('%subject%', encodeURIComponent(opts.locale.subject))
        .replace('%text%', this.text(data));

      console.log(url, '_self');
      window.open(url, '_self');
    }

    copyLink(e, data) {
      const opts = this.options;

      const cb = document.createElement('textarea');
      cb.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
      cb.value = data.url.toString();
      //TODO
      // access to node
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
        const self = this;
        const root = this.root;

        const gnd = this.compo('div', 'fx-copied-link--ground', { hidden: true });
        const msg = this.compo('span', 'copied-link-message', { innerText: opts.locale.copied });

        root.classList.add('share-fx-copied-link');

        gnd.install(root);
        msg.install(root);

        gnd.show();

        this.delay(function() {
          msg.uninstall(root);
          gnd.uninstall(root);
          root.classList.remove('share-fx-copied-link');
        }, gnd, 8e2);
      }
    }

    async webShare(e, data) {
      try {
        await window.navigator.share({ title: data.title, url: data.url });
      } catch (err) {
        if (err instanceof TypeError) {
          console.info('ensemble.SocialShare.webShare', 'TODO fallback');
        } else {
          console.log('ensemble.SocialShare.webShare', err.message);
        }
      }
    }

  }


  // window.ensemble = { ...ensemble, ...{ SocialShare } };
  // module.exports = SocialShare;

// }((typeof window != 'undefined' ? window : {}), (typeof module != 'undefined' ? module : {}), (typeof require != 'undefined' ? require : function() {}), globalThis.ensemble));


export { SocialShare };