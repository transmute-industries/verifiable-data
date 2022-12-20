## Merkel Proof URN
```
urn:tmt:bY0iRVbkVrvhTIHUcrYR9YZj6poJReIP4veoaHnxXnw?Mw.8J8LeDKzC3Jwtq5qLOkVJ74MeQNN3aGKapMdzrgolx4=L.Crs4YtRmEyHhX2CprhBYmG2VdOifO_gSP_Mqf9gjaDc~L.ELLFivaUDXk1LXTyo2EWlVZehWCni9bmkI9VP7r3p1M~R.cJy4Qigrk7_gnabGim_TZCxDk_i4SAawO9desIuormg
```

## Merkel Tree Object
```json
{
  "root": "bY0iRVbkVrvhTIHUcrYR9YZj6poJReIP4veoaHnxXnw",
  "members": [
    "Mw"
  ],
  "salts": [
    "8J8LeDKzC3Jwtq5qLOkVJ74MeQNN3aGKapMdzrgolx4"
  ],
  "proofs": [
    "L.Crs4YtRmEyHhX2CprhBYmG2VdOifO_gSP_Mqf9gjaDc~L.ELLFivaUDXk1LXTyo2EWlVZehWCni9bmkI9VP7r3p1M~R.cJy4Qigrk7_gnabGim_TZCxDk_i4SAawO9desIuormg"
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
		d57a9a1e875746ba91a693567761bf616f0c83478688fc448369f45187b33ab7("bY0iRVbkVrvhTIHUcrYR9YZj6poJReIP4veoaHnxXnw") 
		b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7("Mw") 
		230021e457f7cda77acaa2a563599d892a435aec179965e8a25c4bab11f6ce9a("8J8LeDKzC3Jwtq5qLOkVJ74MeQNN3aGKapMdzrgolx4") 
		fcd1a855f74de5745adab9919e6574ea03abc8f3181d1b5aea81f72cbae5886b("n6lzTQ6XLD3nMcJlFVksGXzMAGJzGaY4Bf8dio5ZO_0") 
		5831519fc393227f96f10d342628a326852522166ba78660568f60ff10c32799("Crs4YtRmEyHhX2CprhBYmG2VdOifO_gSP_Mqf9gjaDc") 
		0f16fb4931662a76b8a0fbdd7856a4502616b80b1833a2cc4fc6a3c3a22dde78("ELLFivaUDXk1LXTyo2EWlVZehWCni9bmkI9VP7r3p1M") 
		1b834b9480615d9c9b650e1007138d466bedc35b4c9cb401cbf06effbab9c471("cJy4Qigrk7_gnabGim_TZCxDk_i4SAawO9desIuormg") 
		b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7 -- member --> fcd1a855f74de5745adab9919e6574ea03abc8f3181d1b5aea81f72cbae5886b 
		230021e457f7cda77acaa2a563599d892a435aec179965e8a25c4bab11f6ce9a -- salt --> fcd1a855f74de5745adab9919e6574ea03abc8f3181d1b5aea81f72cbae5886b 
		fcd1a855f74de5745adab9919e6574ea03abc8f3181d1b5aea81f72cbae5886b -- left --> 5831519fc393227f96f10d342628a326852522166ba78660568f60ff10c32799 
		5831519fc393227f96f10d342628a326852522166ba78660568f60ff10c32799 -- left --> 0f16fb4931662a76b8a0fbdd7856a4502616b80b1833a2cc4fc6a3c3a22dde78 
		0f16fb4931662a76b8a0fbdd7856a4502616b80b1833a2cc4fc6a3c3a22dde78 -- right --> 1b834b9480615d9c9b650e1007138d466bedc35b4c9cb401cbf06effbab9c471 
		1b834b9480615d9c9b650e1007138d466bedc35b4c9cb401cbf06effbab9c471 -- proof --> d57a9a1e875746ba91a693567761bf616f0c83478688fc448369f45187b33ab7 
		style d57a9a1e875746ba91a693567761bf616f0c83478688fc448369f45187b33ab7 color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style b340a0c7bc54b1e1d1b283e8dcc756f728dc6ead0090008a232e8ff5a5f54be7 color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style 230021e457f7cda77acaa2a563599d892a435aec179965e8a25c4bab11f6ce9a color:#f5f7fd, fill:#594aa8, stroke:#27225b, stroke-width: 2.0px 
		style fcd1a855f74de5745adab9919e6574ea03abc8f3181d1b5aea81f72cbae5886b color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style 5831519fc393227f96f10d342628a326852522166ba78660568f60ff10c32799 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style 0f16fb4931662a76b8a0fbdd7856a4502616b80b1833a2cc4fc6a3c3a22dde78 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		style 1b834b9480615d9c9b650e1007138d466bedc35b4c9cb401cbf06effbab9c471 color:#8286a3, stroke:#8286a3, stroke-width: 1.0px 
		linkStyle 0 color:#fcb373, stroke-width: 2.0px 
		linkStyle 1 color:#fcb373, stroke-width: 2.0px 
		linkStyle 2 color:#ff605d, stroke-width: 2.0px 
		linkStyle 3 color:#ff605d, stroke-width: 2.0px 
		linkStyle 4 color:#ff605d, stroke-width: 2.0px 
		linkStyle 5 color:#fcb373, stroke-width: 2.0px 
  end
```

