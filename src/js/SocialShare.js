/*!
 * ensemble SocialShare
 *
 * @version 0.0.4
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
 * @object
 */
const SocialShareActionEnum = {
  share: 0,
  send: 1,
  email: 2,
  copy: 3,
  webapi: 4
}.freeze();


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
 * @param {boolean} [options.effects=true] Allow effects
 * @param {string} [options.link=''] The link, leave empty to auto-discover with selector or location.href
 * @param {string} [options.title=''] The title, leave empty to auto-discover with selector or window.title
 * @param {string} [options.description=''] The description, leave empty to auto-discover with selector
 * @param {string[]} [options.intents] Sharing intent buttons to display, default to most popular
 * @param {object} [options.scaffold] Scaffold for sharing intents with enumeration
 * @param {object} [options.uriform] Object containing social sharing URL literals
 * @param {object} [options.label] Parameters for label of the component
 * @param {object} [options.selectorLink] An element selector for link
 * @param {object} [options.selectorTitle] An element selector for title
 * @param {object} [options.selectorDescription] An element selector for description
 * @param {object} [options.locale] Localization strings
 * @param {function} [options.onInit] onInit callback, on component initialization
 * @param {function} [options.onIntent] onIntent callback, on sharing intent call
 * @example
 * new ensemble.SocialShare(document.getElementById('placeholder'), {intents:['copy-link', 'web-share']});
 */
class SocialShare extends base {

  /**
   * Shorthand for sharing action enum
   *
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
  _act() {
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

  /**
   * Default properties
   *
   * @returns {object}
   */
  _defaults() {
    const scaffold = this._act();
    const intents = Object.keys(scaffold).filter((a, i) => i < 3 || i > 8 && i < 10 || i > 10 && i < 19);

    return {
      ns: 'share',
      root: 'body',
      className: 'social-share',
      effects: true,
      link: '',
      title: '',
      description: '',
      intents,
      scaffold,
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

  /**
   * Methods binding
   */
  _bindings() {
    this.intent = this.binds(this.intent);
  }

  /**
   * Constructor method
   *
   * @constructs
   */
  constructor() {
    if (! new.target) {
      throw 'Bad invocation. Must be called with `new`.';
    }

    super(...arguments);

    this.init();
  }

  /**
   * Element generator
   */
  generator() {
    const opts = this.options;

    const share = this.share = this.compo(false, false, {
      className: typeof opts.className == 'object' ? opts.className.join(' ') : opts.className
    });
    //TODO dataset
    share.setAttr('data-social-share', '');

    if (opts.label) {
      const label = this.compo('span', 'label', opts.label);
      label.classList.add('label');

      if ('innerText' in opts.label == false) {
        label.innerText = opts.locale.label.toString();
      }

      share.append(label);
    }

    const actions = this.actions = this.compo('ul', 'actions');
    share.append(actions);

    this.built = true;
  }

  /**
   * Initializes the component
   */
  init() {
    const opts = this.options;

    if (this.built) return;

    this.root = this.selector(opts.root);
    this.intents = opts.intents && typeof opts.intents == 'object' ? opts.intents : Object.keys(opts.scaffold);

    const intents = this.intents;
    if ('twitter' in intents) intents.splice(intents.indexOf('twitter'), 1, 'x');

    this.generator();

    if (this.element) {
      this.share.overlap(this.element, (function(node) {
        this.element = node;
      }).bind(this));
    }

    this.populate();

    opts.onInit.call(this, this);
  }

  /**
   * On this stage the component is populated with progeny
   *
   * @see window.navigator.share
   */
  populate() {
    const opts = this.options, locale = opts.locale;
    const act = SocialShareActionEnum;

    for (const intent in opts.scaffold) {
      if (this.intents.indexOf(intent) == -1) continue;

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

  /**
   * Creates the action with a share button
   *
   * @param {string} intent The action name
   * @param {string} title A title for action
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
    //TODO dataset
    action.setAttr('data-share-intent', intent);
    action.append(button);

    const icon = this.compo('span', 'icon', {
      className: 'icon-' + intent
    });
    button.append(icon);

    this.actions.append(action);
  }

  /**
   * Selects a sharing intent
   *
   * This method is called from each action.
   *
   * @see window.location
   *
   * @param {Event} evt An Event
   * @param {Element} target The element is invoking
   */
  intent(evt, target) {
    this.event(evt);

    if (! evt.isTrusted) return;

    const opts = this.options, locale = opts.locale;

    if (! this.compo().isCompo(target)) return;

    const action = target.parent;

    if (! (action && action.hasAttr('data-share-intent'))) return;

    const intent = action.getAttr('data-share-intent');

    if (this.intents.indexOf(intent) == -1) return;

    //TODO URL validation
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
      switch (intent) {
        case 'send-email':
          this.sendEmail(evt, data);
          break;
        case 'copy-link':
          this.copyLink(evt, data);
          break;
        case 'web-share':
          this.webShare(evt, data);
          break;
        default:
          this.share(evt, data, intent, action);
      }
    }
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
    return encodeURIComponent(
      data.text
        .replace('%url%', data.url)
        .replace('%title%', data.title)
        .replace('%summary%', data.summary)
    );
  }

  /**
   * Share intent for social sharing action
   *
   * @see window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  share(evt, data, intent, action) {
    const opts = this.options;

    if (intent in opts.uriform == false) return;

    let url = opts.uriform[intent]
      .replace('%url%', encodeURIComponent(data.url))
      .replace('%title%', encodeURIComponent(data.title))
      .replace('%summary%', encodeURIComponent(data.summary));

    //TODO aria-label
    const title = action.getAttr('ariaLabel');
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

  /**
   * Send email intent
   *
   * Tries to open the default e-mail client.
   *
   * @see window.open
   *
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   * @param {string} data.url Share URL
   * @param {string} data.title Share title text
   * @param {string} data.text Share description text
   * @param {string} data.summary Share summary text
   */
  sendEmail(evt, data) {
    const opts = this.options, locale = opts.locale;
    const url = opts.uriform['send-email']
      .replace('%subject%', encodeURIComponent(locale.subject.toString()))
      .replace('%text%', this.text(data));

    console.log('sendEmail', url, '_self');

    window.open(url, '_self');
  }

  /**
   * Copy link intent
   *
   * Tries to copy the link to the clipboard.
   *
   * @see document.createElement
   * @see document.execCommand
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

    const opts = this.options, locale = opts.locale;

    const node = document.createElement('textarea');
    node.style = 'position:absolute;width:0;height:0;opacity:0;z-index:-1;overflow:hidden';
    node.value = data.url.toString();

    this.appendNode(this.element, node);

    node.focus();
    node.select();

    //TODO deprecated
    document.execCommand('copy');

    node.remove();

    if (opts.effects) {
      const self = this;
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

  /**
   * Share from device caller
   *
   * Calls the native WebShare API
   *
   * @see window.navigator.share
   *
   * @async
   * @param {Event} evt An Event
   * @param {object} data Sharing data object
   */
  async webShare(evt, data) {
    try {
      await window.navigator.share({title: data.title, url: data.url});
    } catch (err) {
      if (err instanceof TypeError) {
        //TODO provide a fallback
      } else {
        console.error('webShare', err.message);
      }
    }
  }

}


export { SocialShare };
