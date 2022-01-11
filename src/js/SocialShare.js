/*!
 * loltgt ensemble.SocialShare
 *
 * @version 0.0.2
 * @link https://github.com/loltgt/ensemble-social-share
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

/**
 * @namespace ensemble
 * @exports SocialShare
 */

import base from '../../../ensemble-stack-d1/lib/base.js';


/**
 * ensemble.SocialShare component.
 *
 * @class
 * @extends base
 * @inheritdoc
 * @param {Element} [element] - A valid Element node that will be replaced with this component
 * @param {object} options - Options object
 * @param {string} [options.ns=share] - The namespace for social share
 * @param {string} [options.root=body] - The root Element node
 * @param {(string|string[])} [options.className=social-share] - The component CSS class name
 * @param {string} [options.link=''] - The link, leave empty to auto-discover with selector or location.href
 * @param {string} [options.title=''] - The title, leave empty to auto-discover with selector or window.title
 * @param {string} [options.description=''] - The description, leave empty to auto-discover with selector
 * @param {object} [options.displays=null] - Actions to display, default to all
 * @param {object} [options.intents] - Action intents
 * @param {object} [options.uriform] - URI strings
 * @param {object} [options.label] - Custom parameters for label
 * @param {object} [options.selectorLink] - An element selector to find link
 * @param {object} [options.selectorTitle] - An element selector to find title
 * @param {object} [options.selectorDescription] - An element selector to find description
 * @param {object} [options.locale] - Localization
 * @param {function} [options.onInit] - onInit callback, fires when social share is initialized
 * @param {function} [options.onIntent] - onIntent callback, fires when an action is called
 * @example
 * new ensemble.SocialShare(document.getElementById('my-div-placeholder'), {});
 * @todo arguments
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
      className: 'social-share',
      link: '',
      title: '',
      description: '',
      displays: null,
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

  /**
   * Methods binding.
   */
  _bindings() {
    this.intent = this.binds(this.intent);
  }

  /**
   * Constructor method.
   */
  constructor() {
    if (! new.target) {
      throw 'ensemble.SocialShare error: Bad invocation, must be called with new.';
    }

    super(...arguments);

    this.init();
  }

  /**
   * The generator creates almost everything the component needs and replaces the element placeholder.
   *
   * @todo dataset
   */
  generator() {
    const opts = this.options;

    const share = this.share = this.compo(false, false, {
      className: typeof opts.className == 'object' ? opts.className.join(' ') : opts.className
    });
    //TODO
    // dataset
    share.setAttr('data-social-share', '');

    if (opts.label) {
      const label = this.compo('span', 'label', opts.label);
      label.classList.add('label');

      if ('innerText' in opts.label == false) {
        label.innerText = opts.locale.label;
      }

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
    this.displays = opts.displays && typeof opts.displays == 'object' ? opts.displays : Object.keys(opts.intents);

    this.generator();

    if (this.element) {
      this.share.up(this.element, (function(node) {
        this.element = node;
      }).bind(this));
    }

    this.populate();

    opts.onInit.call(this, this);
  }

  /**
   * In this stage the component is populated with all the content progeny.
   *
   * @see window.navigator.share()
   */
  populate() {
    const opts = this.options;

    for (const intent in opts.intents) {
      if (this.displays.indexOf(intent) == -1) continue;

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

  /**
   * Creates the whole set of buttons.
   *
   * @param {string} intent - The activity name
   * @param {string} title - A title for activity
   * @todo dataset
   */
  action(intent, title) {
    const opts = this.options;

    const action = this.compo('li', 'action', {
      className: opts.ns + '-action-' + intent
    });
    const button = this.compo('button', ['button', 'intent'], {
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

  /**
   * The intent activity.
   * This method is called from each action.
   *
   * @see window.location
   *
   * @param {Event} e - An Event
   * @param {Element} target - The element that is invoking
   * @todo url validation
   */
  intent(e, target) {
    this.event(e);

    if (! e.isTrusted) return;

    const opts = this.options;

    if (! this.compo().isCompo(target)) return;

    const action = target.parent;

    if (! (action && action.hasAttr('data-share-intent'))) return;

    const intent = action.getAttr('data-share-intent');

    if (this.displays.indexOf(intent) == -1) return;

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
   * @param {string} data.summary - Shared summary
   * @return {string} - The encoded URL text string
   */
  text(data) {
    return encodeURIComponent(
      data.text
        .replace('%url%', data.url)
        .replace('%title%', data.title)
        .replace('%summary%', data.summary)
    );
  }

  /**
   * Generic social method for social network sharing intent.
   *
   * @see window.open()
   *
   * @param {Event} e - An Event
   * @param {object} data - The data object
   * @param {string} data.url - Shared URL
   * @param {string} data.title - Shared title
   * @param {string} data.text - Shared description text
   * @param {string} data.summary - Shared summary
   */
  social(e, data, intent, action) {
    const opts = this.options;

    if (intent in opts.uriform == false) return;

    let url = opts.uriform[intent]
      .replace('%url%', encodeURIComponent(data.url))
      .replace('%title%', encodeURIComponent(data.title))
      .replace('%summary%', encodeURIComponent(data.summary));

    //TODO
    const title = action.getAttr('ariaLabel');
    const options = 'toolbar=0,status=0,width=640,height=480';

    if (/%text%/.test(opts.uriform[intent])) {
      url = url.replace('%text%', this.text(data));
    }
    if (intent == 'messenger') {
      const app_id = 'messenger_app_id' in opts ? opts.messenger_app_id : '';
      url = url.replace('%app_id%', encodeURIComponent(app_id));
    }

    console.log(url, title, options);
    window.open(url, title, options);
  }

  /**
   * Send email intent, it tries to open the default mail client.
   *
   * @see window.open()
   *
   * @param {Event} e - An Event
   * @param {object} data - The data object
   * @param {string} data.url - Shared URL
   * @param {string} data.title - Shared title
   * @param {string} data.text - Shared description text
   * @param {string} data.summary - Shared summary
   */
  sendEmail(e, data) {
    const opts = this.options;
    const url = opts.uriform['send-email']
      .replace('%subject%', encodeURIComponent(opts.locale.subject))
      .replace('%text%', this.text(data));

    console.log(url, '_self');
    window.open(url, '_self');
  }

  /**
   * Copy link intent, it tries to copy URL on the clipboard.
   *
   * @see document.createElement()
   * @see document.execCommand()
   *
   * @param {Event} e - An Event
   * @param {object} data - The data object
   * @param {string} data.url - Shared URL
   * @param {string} data.title - Shared title
   * @param {string} data.text - Shared description text
   * @param {string} data.summary - Shared summary
   * @todo TODO
   */
  copyLink(e, data) {
    if (! this.element) return;

    const opts = this.options;

    const cb = document.createElement('textarea');
    cb.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
    cb.value = data.url.toString();

    this.appendNode(this.element, cb);

    //TODO obsolete (safari mobile | crios?)
    // if (/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
    //   const sr = document.createRange();
    //   const gs = getSelection();
    //   sr.selectNodeContents(cb);
    //   gs.removeAllRanges();
    //   gs.addRange(sr);
    //   cb.setSelectionRange(0, 999999);
    // } else {
      cb.focus();
      cb.select();
    // }

    document.execCommand('copy');

    cb.remove();

    if (opts.fx) {
      const self = this;
      const root = this.root;

      const gnd = this.compo(false, 'fx-copied-link--ground', { hidden: true });
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

  /**
   * Calls the native WebShare API for sharing.
   *
   * @see window.navigator.share()
   *
   * @async
   */
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


export { SocialShare };
