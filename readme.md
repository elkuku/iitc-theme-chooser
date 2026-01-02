# IITC Theme Chooser

A theme chooser for IITC.

### Installation

Visit: [elkuku.github.io/iitc-theme-chooser](https://elkuku.github.io/iitc-theme-chooser/)

### Add your own Theme

Create a new folder in the `themes` folder for your theme.

Inside that folder create a `meta.json` file containing the following keys:

* `name` - the name being displayed to the user
* `preview`  - link to a preview image

e.g.:
```json
{
  "name": "My awesome Theme",
  "preview": "https://example.com/preview.png"
}
```

Create a `main.css` file with the CSS code of your theme.

You can create additional CSS files that will be included after the main CSS file.

#### Variants

You can optionally define two or more variants (CSS variables) that will be rendered at the beginning.

#### Options

You can define one or more options (arbitrary CSS code) that will be rendered at the end.

Variants and options can be set at runtime using the plugin UI.

### File structure

```
─ themes
   └── YourTheme
       ├── variants
       │   ├── green.css
       │   ├── blue.css
       │   └── red.css
       ├── options
       │   ├── option-one.css
       │   └── option-two.css
       ├── meta.json
       ├── main.css
       ├── additional.css
       └── even-more.css (...)
```

----

Made with :heart: and the [IITC Plugin Kit](https://github.com/McBen/IITCPluginKit)
