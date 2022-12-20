## Merkel Proof URN
```
urn:tmt:hZwT7hw_yOxsKYb514RTTEjdpEY73CardVYj4235BOg?Mw.aKo8P8WbPGlJQrY8EvhMDf9WA3PswcQZVO0qomjZE30=L.kGT98loGejXOSz7zk-51rMULP3e823tBTjXpxIb1WUE~L.IPgWeVcHvMU0Nisf1GUu5xy6kylzE-Wx3GsyfsotS2E~R.OB3GnYEXPXcNLVShq-47KdCqJ79j60kJQHxw2AXSMkA
```

## Merkel Tree Object
```json
{
  "root": "hZwT7hw_yOxsKYb514RTTEjdpEY73CardVYj4235BOg",
  "members": [
    "Mw"
  ],
  "salts": [
    "aKo8P8WbPGlJQrY8EvhMDf9WA3PswcQZVO0qomjZE30"
  ],
  "proofs": [
    "L.kGT98loGejXOSz7zk-51rMULP3e823tBTjXpxIb1WUE~L.IPgWeVcHvMU0Nisf1GUu5xy6kylzE-Wx3GsyfsotS2E~R.OB3GnYEXPXcNLVShq-47KdCqJ79j60kJQHxw2AXSMkA"
  ]
}
```

## Merkel Proof Mermaid

```mermaid
%%{
  init: {
    'flowchart': { 'curve': 'monotoneX' },
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#2a2d4c',
      'primaryTextColor': '#565a7c',
      'nodeBorder': '#565a7c',
      'edgeLabelBackground': '#2a2d4c',
      'clusterBkg': '#2a2d4c',
      'clusterBorder': '#2a2d4c',
      'lineColor': '#565a7c',
      'fontFamily': 'monospace',
      'darkmode': true
    }
  }
}%%
graph LR
linkStyle default fill:none, stroke-width: 1px, stroke: #565a7c
  subgraph &nbsp;
    direction LR
		fca1f7d357bc7db71ecfa0e8d10fafb4754a71745a2276964e7c21e7188660da("hZwT7hw_yOxsKYb514RTTEjdpEY73CardVYj4235BOg") 
		b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7("Mw") 
		2cae03cd28cf63be1328d38a1983305e8d81941b4d02b9700c29960e73a6a6c2("aKo8P8WbPGlJQrY8EvhMDf9WA3PswcQZVO0qomjZE30") 
		42b869007c27bed0f28fe75e04b87214b501fdc6e8ee237984e67ef8eaccd550("uNo--OxMStv86ZwfQadD33_qdo9sA_HHuN9jc9rXlu4") 
		f9210b82dd198e1f049f793d69d9ff9eaa78aab930d19ffcf650330d450e3f19("kGT98loGejXOSz7zk-51rMULP3e823tBTjXpxIb1WUE") 
		3916a2df29c29440b3c29a3df1df70dcf5c642be8f964b7f27034ffd585e6290("IPgWeVcHvMU0Nisf1GUu5xy6kylzE-Wx3GsyfsotS2E") 
		ef18fdcdecf7266c386a8536c36176fa7380d14600e825713343208ab83afad9("OB3GnYEXPXcNLVShq-47KdCqJ79j60kJQHxw2AXSMkA") 
		b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7 -- member --> 42b869007c27bed0f28fe75e04b87214b501fdc6e8ee237984e67ef8eaccd550 
		2cae03cd28cf63be1328d38a1983305e8d81941b4d02b9700c29960e73a6a6c2 -- salt --> 42b869007c27bed0f28fe75e04b87214b501fdc6e8ee237984e67ef8eaccd550 
		42b869007c27bed0f28fe75e04b87214b501fdc6e8ee237984e67ef8eaccd550 -- left --> f9210b82dd198e1f049f793d69d9ff9eaa78aab930d19ffcf650330d450e3f19 
		f9210b82dd198e1f049f793d69d9ff9eaa78aab930d19ffcf650330d450e3f19 -- left --> 3916a2df29c29440b3c29a3df1df70dcf5c642be8f964b7f27034ffd585e6290 
		3916a2df29c29440b3c29a3df1df70dcf5c642be8f964b7f27034ffd585e6290 -- right --> ef18fdcdecf7266c386a8536c36176fa7380d14600e825713343208ab83afad9 
		ef18fdcdecf7266c386a8536c36176fa7380d14600e825713343208ab83afad9 -- proof --> fca1f7d357bc7db71ecfa0e8d10fafb4754a71745a2276964e7c21e7188660da 
		style fca1f7d357bc7db71ecfa0e8d10fafb4754a71745a2276964e7c21e7188660da color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7 color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style 2cae03cd28cf63be1328d38a1983305e8d81941b4d02b9700c29960e73a6a6c2 color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style 42b869007c27bed0f28fe75e04b87214b501fdc6e8ee237984e67ef8eaccd550 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style f9210b82dd198e1f049f793d69d9ff9eaa78aab930d19ffcf650330d450e3f19 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style 3916a2df29c29440b3c29a3df1df70dcf5c642be8f964b7f27034ffd585e6290 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style ef18fdcdecf7266c386a8536c36176fa7380d14600e825713343208ab83afad9 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		linkStyle 0 color:#fcb373, stroke-width: 2.0px 
		linkStyle 1 color:#fcb373, stroke-width: 2.0px 
		linkStyle 2 color:#ff605d, stroke-width: 2.0px 
		linkStyle 3 color:#ff605d, stroke-width: 2.0px 
		linkStyle 4 color:#ff605d, stroke-width: 2.0px 
		linkStyle 5 color:#fcb373, stroke-width: 2.0px 
  end
```

