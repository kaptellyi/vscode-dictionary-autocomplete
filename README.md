Dictionary autocomplete extension simplifies the process of looking up translation paths to a piece of cake 🍰

It's fast, neat and easy to configure.

## Features

- Provide translation paths from your dictionaries
- Hooks up actual dictionary translations on the go

## Settings

> **Dictionary autocomplete** extension settings start with `dictionaryAutocomplete`

|Setting|Default|Description|
|-|-|-|
|dictionariesFolder|-|Path to folder where dictionaries resist|
|dictionaries|-|Dictionary names|
|methods|-|Method names to hook translations|
|options.maxLength|40|Controls length of a suggested path|

**Example** of main settings:
|dictionariesFolder|dictionaries|methods|
|-|-|-|
|data/translations|['home', 'settings']|['getTranslation', 'getLocalPrice']|
<!-- SETTINGS_END -->
