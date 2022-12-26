# create new Angular project

```bash
   `
      ng new --styles scss --skip-tests --routing --directory ./
   `
```

# angular.json: projects >> architect >> build >> options

```bash
   `
      "stylePreprocessorOptions": {
         "includePaths": [
            "src/assets/scss"
         ]
      },
   `
```

# svgtofont

```bash
   `
      "svgtofont": {
         "fontName": "icm",
         "website": false,
         "outSVGReact": false,
         "outSVGPath": false,
         "generateInfoData": false,
         "css": {
            "include": "\\.(scss)$",
            "output": "./src/assets/scss",
            "fileName": "icons",
            "cssPath": "../fonts/"
         }
      }
   `
```

# packages:

```bash
	`npm i -D svgo svgtofont`
```

# scripts:

```bash
	`
		"svgicons": "svgo -f ./src/assets/svgicons -o ./src/assets/svgicons && svgtofont --sources ./src/assets/svgicons --output ./src/assets/fonts",
	`
```
