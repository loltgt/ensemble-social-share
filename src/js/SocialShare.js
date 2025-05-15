/*!
 * ensemble SocialShare
 *
 * @version 0.4.0
 * @link https://github.com/loltgt/ensemble-social-share
 * @copyright Copyright (C) Leonardo Laureti
 * @license MIT License
 */

'use strict';

/**
 * @namespace ensemble
 * @exports SocialShare
 */

import base from "@loltgt/ensemble";


/**
 * SocialShare action enumeration
 *
 * @constant {object}
 * @enum {int}
 */
const SocialShareActionEnum = Object.freeze({
  share: 0,
  send: 1,
  email: 2,
  copy: 3,
  webapi: 4
});


/**
 * SocialShare ensemble component
 *
 * @class
 * @extends base
 * @inheritdoc
 * @param {Element} [element] A valid Element node placeholder to replace with the component
 * @param {object} options Options object
 * @param {string} [options.ns=share] The namespace for social share
 * @param {string} [options.root=body] A root Element node
 * @param {string[]} [options.className=social-share] The component CSS class name
 * @param {string} [options.layout='h'] Set layout model: h=horizontal, v=vertical
 * @param {object} [options.icons] Set icons model
 * @param {string} [options.icons.type='font'] Set icons type: font, svg, symbol, shape
 * @param {string} [options.icons.prefix='icon'] Set icons CSS class name prefix, for icons: font
 * @param {string} [options.icons.src] Set icons SVG symbol href or SVG image hash, for icons: symbol, svg
 * @param {string} [options.icons.viewBox] Set icons SVG viewBox
 * @param {boolean} [options.effects=true] Allow effects
 * @param {string} [options.link=''] The link, leave empty to auto-discover, selector or location.href
 * @param {string} [options.title=''] The title, leave empty to auto-discover, selector or window.title
 * @param {string} [options.description=''] The description, leave empty to auto-discover, selector
 * @param {string[]} [options.intents] Sharing intent buttons to display, default to most popular
 * @param {object} [options.scaffold] Scaffold for sharing intents with enumeration
 * @param {object} [options.uriform] Object containing social sharing URL literals
 * @param {string|boolean} [options.ariaLabel] Parameter text for aria-label, false to disable, default to locale.label
 * @param {object|boolean} [options.label] Parameters for titling label, false to disable
 * @param {string} [options.label.text] Label text, default to locale.label
 * @param {string[]} [options.label.className] Label CSS class name
 * @param {number} [options.copiedEffectDelay=1000] Copied effect delay time in milliseconds
 * @param {object} [options.selectorLink] An element selector {element, attribute} for link
 * @param {object} [options.selectorTitle] An element selector {element, attribute} for title
 * @param {object} [options.selectorDescription] An element selector {element, attribute} for description
 * @param {object} [options.locale] Localization strings
 * @param {function} [options.onIntent] onIntent callback, on sharing intent call
 * @param {function} [options.onInit] onInit callback, on component initialization
 * @example
 * new ensemble.SocialShare(document.querySelector("[data-social-share]"), {intents:["send-email", "copy-link", "web-share"]});
 */
class SocialShare extends base {

  /**
   * Shorthand for sharing action enum
   *
   * @static
   * @returns {SocialShareActionEnum}
   */
  static actionEnum() {
    return SocialShareActionEnum;
  }

  /**
   * Default scaffold sharing intents
   *
   * @constant {object} SocialShareActionEnum Sharing action enum
   * @returns {object}
   */
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

  /**
   * Default properties
   *
   * @returns {object}
   */
  defaults() {
    this.ska = this.aks();

    return {
      ns: 'share',
      root: 'body',
      className: 'social-share',
      layout: 'h',
      icons: {
        type: 'font',
        prefix: 'icon'
      },
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
      label: {
        className: 'sr-only'
      },
      ariaLabel: true,
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
      onIntent: () => {},
      onInit: () => {}
    };
  }

  /**
   * Methods binding
   */
  binds() {
    this.intent = this.wrap(this.intent);
  }

  /**
   * Constructor
   *
   * @constructs
   */
  constructor() {
    super(...arguments);

    /**
     * @see encodeURIComponent
     *
     * @name encoder
     * @function
     */
    this.encoder = encodeURIComponent;
    this.init();
  }

  /**
   * Initializes the component
   *
   * @emits #options.onInit
   */
  init() {
    if (this.built)
      return;

    const opts = this.options;
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

    this.layout();

    if (this.element) {
      this.$.place(this.element, (function(node) {
        this.element = node;
      }).bind(this));
    }

    this.drawer();

    /**
     * @event #options.onInit
     * @type {function}
     * @param {object} this
     */
    opts.onInit.call(this, this);
  }

  /**
   * Lead layout
   */
  layout() {
    const opts = this.options;
    const locale = opts.locale;

    const compo = this.$ = this.compo(false, false, {
      className: typeof opts.className == 'object' ? Object.values(opts.className).join(' ') : opts.className
    });
    if (opts.ariaLabel) {
      const ariaLabel = opts.ariaLabel;
      compo.setAttr('aria-label', typeof ariaLabel == 'string' ? ariaLabel : locale.label);
    }

    if (opts.label) {
      const labelParams = opts.label;
      const label = this.compo('span', 'label', {
        className: labelParams.className,
        innerText: labelParams.text ?? locale.label
      });

      compo.append(label);
    }

    if (opts.layout == 'v') {
      compo.classList.add(`${opts.ns}-vertical`);
    }

    const actions = this.actions = this.compo('ul', 'actions');
    compo.append(actions);

    this.built = true;
  }

  /**
   * Places all the actions in a drawer
   *
   * @see Navigator.share
   */
  drawer() {
    const act = SocialShareActionEnum;
    const opts = this.options;
    const locale = opts.locale;

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

  /**
   * Creates the action with a share button
   *
   * @param {string} intent Intent name
   * @param {string} title Title for action
   */
  action(intent, title) {
    const opts = this.options;

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

    {
      const {type, prefix, src, viewBox} = opts.icons;
      const icon = this.icon(type, intent, prefix, src, intent, viewBox);

      button.append(icon);
    }

    this.actions.append(action);
  }

  /**
   * Selects a sharing intent
   *
   * This method is called from each action.
   *
   * @see Window.location
   *
   * @emits #options.onIntent
   *
   * @param {Event} evt An Event
   * @param {Element} target The element is invoking
   */
  intent(evt, target) {
    this.event().prevent(evt);

    if (! evt.isTrusted) return;

    const act = SocialShareActionEnum;
    const opts = this.options;
    const locale = opts.locale;

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
      title = document.title; // [DOM]
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

    /**
     * @event #options.onIntent
     * @type {function}
     * @param {object} this
     * @param {Event} evt
     * @param {string} intent
     * @param {object} data
     */
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
  }

  /**
   * Text substitutions and URL encodes
   *
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   * @return {string} URL encoded text string
   */
  text(data) {
    const encoder = this.encoder;

    return encoder(
      data.text
        .replace('%url%', data.url)
        .replace('%title%', data.title)
        .replace('%summary%', data.summary)
    );
  }

  /**
   * Share intent for social sharing action
   *
   * @see Window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   * @param {string} intent Intent name
   */
  share(evt, data, intent) {
    const {options: opts, encoder} = this;

    if (! intent in opts.uriform) return;

    let url = opts.uriform[intent]
      .replace('%url%', encoder(data.url))
      .replace('%title%', encoder(data.title))
      .replace('%summary%', encoder(data.summary));

    const features = 'toolbar=0,status=0,width=640,height=480';

    if (/%text%/.test(opts.uriform[intent])) {
      url = url.replace('%text%', this.text(data));
    }
    if (intent == 'facebook' || intent == 'messenger') {
      const app_id = opts[`${intent}_app_id`] ?? '';
      url = url.replace('%app_id%', encoder(app_id));
    }

    window.open(url, null, features);
  }

  /**
   * Send email intent
   *
   * Tries to open the default e-mail client.
   *
   * @see Window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  sendEmail(evt, data) {
    const {options: opts, encoder} = this;
    const locale = opts.locale;

    const url = opts.uriform['send-email']
      .replace('%subject%', encoder(locale.subject))
      .replace('%text%', this.text(data));

    window.open(url, '_self');
  }

  /**
   * Copy link intent
   *
   * Tries to copy the link to the clipboard.
   *
   * @see Navigator.clipboard
   * @see Document.execCommand
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  copyLink(evt, data) {
    if (! this.element) return;

    const opts = this.options;
    const locale = opts.locale;

    try {
      navigator.clipboard.writeText(data.url);
    } catch (err) {
      if (err instanceof TypeError) {
        // [DOM]
        const doc = document;
        const node = doc.createElement('textarea');
        node.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
        node.value = data.url;
        doc.append(node);
        node.focus();
        node.select();
        doc.execCommand('copy'); // deprecated
        node.remove();
      } else {
        console.error('copyLink', err.message);
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

  /**
   * Share from device caller
   *
   * Calls the native WebShare API
   *
   * @see Navigator.share
   *
   * @async
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   */
  async webShare(evt, data) {
    try {
      await navigator.share({title: data.title, url: data.url});
    } catch (err) {
      console.error('webShare', err.message);
    }
  }

}


export { SocialShare };
