# create new Angular project

```bash
   `
      ng new --style scss --routing --directory ./
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

# npm packages

```bash
   `
      "gulp gulp-svg-sprite gulp-fonter-fix gulp-ttf2woff2"
   `
```
