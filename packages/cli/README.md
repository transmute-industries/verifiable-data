### @transmute/cli

```
npm i @transmute/cli@latest --save
```

### Development

#### Generate Key

```
npm run transmute -- key generate ed25519 ed585a037d66e126a8fe2cce201c9e247368e6e74e890e852eb16493234b058d  --debug
```

#### Derive Key

```
npm run transmute -- key derive ed25519 "correct horse battery staple" "m/44’/0’/0’/0"  --debug
```

#### Generate data

##### Organization

```
npm run transmute -- data generate organization 123 --debug
```

##### Product

```
npm run transmute -- data generate product 123 --debug
```

##### Device

```
npm run transmute -- data generate device 123 --debug
```

### Credentials

#### Certified Subject Types

```
npm run transmute -- data generate credential "Organization" 123 "Organization" 456 --debug
npm run transmute -- data generate credential "Organization" 123 "Device" 456 --debug
npm run transmute -- data generate credential "Device" 456 "Device" 456 --debug
```

#### Presentations

```
npm run transmute -- data generate presentation "Organization" 123 "./data/credentials" --debug
```
