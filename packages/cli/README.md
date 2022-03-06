### @transmute/cli

```
npm i @transmute/cli@latest --save
```

```
npm i -g @transmute/cli@latest
```

### Usage

```
transmute --help
```

### Development

When developing cli commands, it can be useful to run them from `npm` / `package.json`, without the need to install the cli globally.

Don't forget to `npm run build` in order to see changes.

This requires a simple modification to the commands:

Simply change:

```
transmute \
key generate \
--type "ed25519" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44’/0’/0’/0" \
--output "./data/keys/a.json"
```

To:

```
npm run transmute -- \
key generate \
--type "ed25519" \
--mnemonic "correct horse battery staple" \
--hdpath "m/44’/0’/0’/0" \
--output "./data/keys/a.json"
```

Note the `npm run` prefix and the `--` suffix for the `transmute` command, causes package.json to handle the command, with the arugments as the cli would expect them if it were globally installed.
