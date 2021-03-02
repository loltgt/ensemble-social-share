/*!
 * loltgt ensemble.SocialShare
 *
 * @version 0.0.1
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

(function(ensemble) {

  class SocialShare extends ensemble.base {

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
      this.intent = this.intent.bind(this);
    }

    constructor(element, options = {}) {
      super();

      this._bindings();

      this.options = this.defaults(this._defaults(), options);
      this.element = element;

      this.init();
    }

    // className
    //  tag, name
    //  with no ns prefix
    generator() {
      const element = this.element;
      const opts = this.options;

      if (opts.label) {
        const label = this.compo('span', 'label', opts.label);
        label.classList.add('label');
        this.appendNode(element, label);
      }

      const actions = this.actions = this.compo('ul', 'actions');
      this.appendNode(element, actions);

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
            if (! ('share' in window.navigator && typeof window.navigator.share === 'function')) {
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

      // dataset
      const button = this.compo('button', 'intent', {
        className: opts.ns + '-intent-' + intent,
        title,
        ariaLabel: title,
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

    intent(e) {
      e.preventDefault();
      e.target.blur();

      if (! e.isTrusted) return;

      const opts = this.options;
      //TODO
      // compo.__compo node.__compo conflict
      // parentElement
      const target = this.hasAttr(e.target.parentElement.__compo, 'data-share-intent') ? e.target.parentElement : e.target.parentElement.parentElement;

      // compo.__compo node.__compo conflict
      if (! this.hasAttr(target.__compo, 'data-share-intent')) return;

      // compo.__compo node.__compo conflict
      const intent = this.getAttr(target.__compo, 'data-share-intent');

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
            this.social(e, data, intent, target);
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

    social(e, data, intent, target) {
      const opts = this.options;

      if (intent in opts.uriform === false) return;

      let url = opts.uriform[intent]
        .replace('%url%', encodeURIComponent(data.url))
        .replace('%title%', encodeURIComponent(data.title))
        .replace('%summary%', encodeURIComponent(data.summary));

      const title = target.ariaLabel;
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
      this.appendNode(this.element, cb);

      if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
        const sr = document.createRange();
        sr.selectNodeContents(cb);
        const gs = getSelection();
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

        root.classList.add('share-fx-copied-link');

        const gnd = this.compo('div', 'fx-copied-link--ground', { hidden: true });
        this.appendNode(root, gnd);

        const msg = this.compo('span', 'copied-link-message', { innerText: opts.locale.copied });
        this.appendNode(root, msg);

        setTimeout(function() {
          gnd.delAttr('hidden');
        });
        setTimeout(function() {
          self.removeNode(root, msg);
          self.removeNode(root, gnd);
          root.classList.remove('share-fx-copied-link');
        }, this.timing(gnd, 8e2));
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


  globalThis.ensemble = { ...ensemble, ...{ SocialShare } };

}(globalThis.ensemble));