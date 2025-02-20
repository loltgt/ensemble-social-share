# Build instructions

Follow these instructions to replicate the default icon set used by ensemble SocialShare.

> [!TIP]
> You can create your own icon set, create a new npm package with your settings
> with `npm init` command, or rely to the existing "package.json" as starting point

> [!NOTE]
> Icons are edited and scaled to comply with brand guidelines and to conform with canvas size


## Get started

First download "Ionicons" and "Simple Icons" tarballs, using npm:
```shell
npm install
```

To copy the default icons using predefined list with the command:
```shell
npm run copy
```

To add single icons to your project:
```shell
npm run copy.ionicons icon-name
npm run copy.simple-icons icon-name
```

Icons will be copied to "project" folder by default.

To select another folder, simply pass the folder name as a secundary argument:
```shell
npm run copy folder-name
```


## Use SVG symbols

If you prefer SVG symbols instead of web font, set SocialShare options to `icons: 'symbols'`
```javascript
new ensemble.SocialShare(element,
  {  
    icons: 'symbols'
  }
);
```

Copy all `*.svg` files from your "project" folder.


## Use a Webfont

To create a web font I used [IcoMoon.app](https://icomoon.app)

Create an new empty project and *Import Set*

Select the previously copied icons from your "project" folder.

Set Grid size to: 32

> [!IMPORTANT]
> Do not forget to select a proper license for your webfont and enter the metadata in *Properties*

*Select All* the icons and press *Generate Font*, check that everything is in order.

Edit exporting preferences by clicking on the cog icon, next to the *Download* button.

Finally press *Download* to get your generated font.


## Export the Webfont to WOFF2 Webfont format

To create WOFF2 web font I used [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)

> [!TIP]
> You can upload the file "generator_config.txt" to use the same preset I used

Upload the previously generated font, select `*.ttf` font and *Upload*

Wait until the font is generated and finally press *Download* to get your generated font.

