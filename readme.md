# create new Angular project

```bash
   `
      ng new --style scss --skip-tests --routing --directory ./
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

# tsconfig.json: compilerOptions

```bash
   `
      "allowJs": true
   `
```
