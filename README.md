# React L10N Text components

A simple React provider and component for inserting translated messages
into your React app.

## Install

```
npm install react-l10n-text --save
```

## Usage

A simple example

```javascript
const React = require('react');
const ReactL10nText = require('react-l10n-text');
const LocalizeTextProvider = ReactL10nText.LocalizeTextProvider;
const LocalizeText = ReactL10nText.LocalizeText;

function App(props) {
  return (
    <LocalizeTextProvider messages={{'welcome': 'Hi {{ name }}, welcome to our app!'}}>
      <div>
        <h2>
          <LocalizeText 
            id="welcome"
            description="The welcome message at the top of the app"
            defaultMessage="Hi {{ name }}!"
            values={{name: 'Jim'}}
          />
        </h2>
      </div>
    </LocalizeTextProvider>
  );
}

```

### <LocalizeTextProvider>

The `<LocalizeTextProvider>` component shares the messages to all the
descendant `<LocalizeText>` components.

#### Props

* `message` - An object where the keys are the IDs used in `<LocalizeText>` and the value is the translated text

### <LocalizeText>

The `<LocalizeText>` component inserts the translated message.

#### Props

* `id` **Required**  - A string ID to lookup the translation in the `<LocalizeTextProvider>`'s `messages` prop.
* `defaultMessage` - A default message to fallback to when no message is found.
* `description` - A description to help translators.
* `values` - An object of values to replace in the message.

### Message placeholders

In keeping with the simple nature of this plugin, these components
do not handle pluralization. If you require pluralization, consider
[Format.js](http://formatjs.io/).

Placeholders are wrapped in a double set of curly braces:
`{{ placeholder }}`. The placeholder name is mapped to the key in the
`values` prop object.

```javascript
<LocalizeText
  id="foo"
  defaultMessage="Hi {{ name }}. Your friend {{ friend }} is online."
  values={{friend: 'Ashley', name: 'Katie'}}
/>

// Result
// <span>Hi Katie. Your friend Ashley is online.</span>
```

## Get messages utility

There is a bin utility to grep out all the `<LocalizeText>` and then
output it into JSON or CSV format.

```
$ getLocalizeText --dir=src/components --format=csv --output=messages.csv
```

### Options

* `-d` `--dir=` - The directory to start scanning for `.jsx` files.
* `-f` `--format=` - The format of the output: `key-value`, `csv`, `json` (default).
* `-o` `--output=` - The file to output the results to. If omitted, results are outputted to console.
* `-h` `--help` - Help