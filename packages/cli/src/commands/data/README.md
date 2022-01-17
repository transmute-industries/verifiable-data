These commands are for generating test data.

```
npm run transmute -- data create --help
```

## Create an Organization

```
npm run transmute -- \
data create \
--type "Organization" \
--output "./data/organizations/a.json" \
--debug
```

```
npm run transmute -- \
data create \
--type "Organization" \
--seed "123" \
--output "./data/organizations/a.json" \
--debug
```

## Create a Product

```
npm run transmute -- \
data create \
--type "Product" \
--seed "123" \
--output "./data/products/a.json" \
--debug
```

## Create a Device

```
npm run transmute -- \
data create \
--type "Device" \
--seed "123" \
--output "./data/devices/a.json" \
--debug
```

## Create a Certified Subject Type

```
npm run transmute -- \
data create \
--type "CertifiedDevice" \
--issuerType "Organization" \
--issuerSeed "123" \
--subjectSeed "456" \
--output "./data/credentials/a.json" \
--debug
```

## Create a Presentation

```
npm run transmute -- \
data create \
--type "VerifiablePresentation" \
--holderType "Organization" \
--holderSeed "123" \
--domain "ontology.example" \
--challenge "123" \
--credentialsDirectory "./data/credentials" \
--output "./data/presentations/a.json" \
--debug
```
