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
		O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA("ROOT")
			style O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA stroke: red, stroke-width: 2.0px
		X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k("LEAF")
			style X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k stroke: green, stroke-width: 2.0px
		a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s("LEAF")
			style a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s stroke: green, stroke-width: 2.0px
		qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ("qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ")
		AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE("AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE")
		1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU("LEAF")
			style 1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU stroke: green, stroke-width: 2.0px
		TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84("LEAF")
			style TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84 stroke: green, stroke-width: 2.0px
		ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU("ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU")
		SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o("LEAF")
			style SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o stroke: green, stroke-width: 2.0px
		7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450("LEAF")
			style 7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450 stroke: green, stroke-width: 2.0px
		E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og("E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og")
		xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U("xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U")
		5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM("LEAF")
			style 5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM stroke: green, stroke-width: 2.0px
		eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE("LEAF")
			style eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE stroke: green, stroke-width: 2.0px
		qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q("qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q")
		X-zrZv_IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V-k -.-> a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s 
		a4ayc_80_OGda4BO_1o_V0etpOqiLx1JwB5S3beHW0s -.-> qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ 
		qfWzq2Hig1fPzRTitCOX-Jau6o1pmNGebahVhOFQ0rQ -.-> AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE 
		AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE -.-> O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA 
		1HNeOiZeFu7gP1lxi5tdAwGcB9i2xR-Q2jpmbuwTqzU -.-> TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84 
		TgdAhWK-24tgzgXB3s_jrRa3IjCWfeAfZAt-Rym0n84 -.-> ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU 
		ubEKG8d9KiQdEgMk2387gbLttn646c8Cr5yV0wMprvU -.-> AwLJb0Wrvq2yOHgzGpukBgeL0L1dwgLBAq97mYYknwE 
		SyJ3d9TdH8Ycb4hPSGQdArTRIdP9Moywi1Ux_Kzav4o -.-> 7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450 
		7y0SfeN7lCuq0GFF5UsMYZofIjJ7LrvPvsePVWSv450 -.-> E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og 
		E0hDr3_I8plQseHft8SXUuD3txG0WO6a48XKIgFm1og -.-> xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U 
		xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U -.-> O4KMT0tIxdTLVWKkdOyeL9jVVG-uQOkHMu9jWJLkJyA 
		5_bAEXdujbfNMwtUF0_Xb30CFrYSOHpf_PuB5vCRloM -.-> eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE 
		eQJpm-Qsio5G-7tFAXJlF-hrIsVqGJ92JabaSQgbJFE -.-> qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q 
		qr2YcVOcN72p93v0dEDfWlfCpXNqBDh9HDuS3_76R-Q -.-> xHj-rQyJt5VAY4-ETIgZ2aQoF2OvknLH85aHdrYFI0U 
	end
```