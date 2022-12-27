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
	subgraph Merkle Tree
		direction LR
		O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA("O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA") 
		X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k("X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k") 
		a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s("a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s") 
		qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ("qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ") 
		AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE("AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE") 
		1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU("1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU") 
		TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84("TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84") 
		ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU("ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU") 
		SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o("SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o") 
		7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450("7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450") 
		E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og("E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og") 
		xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U("xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U") 
		5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM("5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM") 
		eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE("eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE") 
		qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q("qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q") 
		X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k -- right --> a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s
		a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s -- right --> qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ
		qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ -- right --> AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE
		AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE -- proof --> O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA
		1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU -- right --> TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84
		TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84 -- left --> ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU
		ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU -- right --> AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE
		SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o -- right --> 7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450
		7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450 -- right --> E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og
		E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og -- left --> xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U
		xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U -- proof --> O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA
		5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM -- right --> eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE
		eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE -- left --> qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q
		qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q -- left --> xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U
	end
```