# ensemble SocialShare

ensemble.SocialShare JavaScript class from loltgt

This social sharing component has buttons to share on popular socials and supports the WebShare API.

It has copy link to clipboard and send to e-mail buttons.

It comes with options and hooks to customize.


## Install

Using npm:
```shell
npm install --save-dev github:loltgt/ensemble-social-share
```

## Usage

Simple usage example:
```javascript
new ensemble.SocialShare(
  document.getElementById('placeholder'),
  {
    displays: ['copy-link', 'web-share']
  }
);
```

## License

[MIT License](LICENSE)
