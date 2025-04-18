# ensemble SocialShare

ensemble.SocialShare JavaScript class, based on ensemble from loltgt

This social sharing component has buttons to share on popular socials and supports the WebShare API.

It has copy link to clipboard and send to e-mail buttons.

It comes with options and hooks to customize.


## Install

Using npm:
```shell
npm install --save-dev loltgt/ensemble-social-share
```

## Demo

Live demo on this page: [https://loltgt.github.io/ensemble-social-share/demo/](https://loltgt.github.io/ensemble-social-share/demo/)

View source from `demo` to discover options and examples.


## Usage

Simple usage example:
```javascript
new ensemble.SocialShare(document.querySelector("[data-social-share]"),
  {
    intents: ["send-email", "copy-link", "web-share"]
  }
);
```

Another example, vertical layout and a custom share button:
```javascript
new ensemble.SocialShare(document.querySelector("[data-social-share]"),
  {
    layout: "v",
    intents: ["custom-button", "web-share"],
    onIntent: (self, event, intent, data) =>
      intent === "custom-button" && alert("custom share button")
  }
);
```

## License

[MIT License](LICENSE)
