import gulp from "gulp";
import fs from "fs";

import svgSprite from "gulp-svg-sprite";
import fonter from "gulp-fonter-fix";
import ttf2woff2 from "gulp-ttf2woff2";

export const sprite = () => {
   return gulp
      .src("./src/assets/svgicons/*.svg", {})
      .pipe(
         svgSprite({
            mode: {
               symbol: {
                  sprite: "../assets/img/icons/icons.svg",
                  //example: true
               },
            },
            shape: {
               id: {
                  separator: "",
                  generator: "",
               },
               transform: [
                  {
                     /*svgo: {
							plugins: [
								{ removeXMLNS: true },
								{ convertPathData: false },
								{ removeViewBox: false },
							]
						}*/
                  },
               ],
            },
            svg: {
               rootAttributes: {
                  style: "display: none;",
                  "aria-hidden": true,
               },
               xmlDeclaration: false,
            },
         })
      )
      .pipe(gulp.dest("./src"));
};

export const otfToTtf = () => {
   return gulp
      .src("./src/assets/fonts/*.otf", {})
      .pipe(
         fonter({
            formats: ["ttf"],
         })
      )
      .pipe(gulp.dest("./src/assets/fonts/"));
};

export const ttfToWoff = () => {
   return gulp
      .src("./src/assets/fonts/*.ttf", {})
      .pipe(
         fonter({
            formats: ["woff"],
         })
      )
      .pipe(gulp.dest("./src/assets/fonts/"))
      .pipe(gulp.src("./src/assets/fonts/*.ttf"))
      .pipe(ttf2woff2())
      .pipe(gulp.dest("./src/assets/fonts/"))
      .pipe(gulp.src("./src/assets/fonts/*.{woff,woff2}"))
      .pipe(gulp.dest("./src/assets/fonts/"));
};

export const fonstStyle = () => {
   let fontsFile = "./src/assets/scss/fonts.scss";
   process.argv.includes("--rewrite") ? fs.unlink(fontsFile, cb) : null;
   fs.readdir("./src/assets/fonts/", function (err, fontsFiles) {
      if (fontsFiles) {
         if (!fs.existsSync(fontsFile)) {
            fs.writeFile(fontsFile, "", cb);
            let newFileOnly;
            for (var i = 0; i < fontsFiles.length; i++) {
               let fontFileName = fontsFiles[i].split(".")[0];
               if (newFileOnly !== fontFileName) {
                  let fontName = fontFileName.split("-")[0]
                     ? fontFileName.split("-")[0]
                     : fontFileName;
                  let fontWeight = fontFileName.split("-")[1]
                     ? fontFileName.split("-")[1]
                     : fontFileName;
                  if (fontWeight.toLowerCase() === "thin") {
                     fontWeight = 100;
                  } else if (fontWeight.toLowerCase() === "extralight") {
                     fontWeight = 200;
                  } else if (fontWeight.toLowerCase() === "light") {
                     fontWeight = 300;
                  } else if (fontWeight.toLowerCase() === "medium") {
                     fontWeight = 500;
                  } else if (fontWeight.toLowerCase() === "semibold") {
                     fontWeight = 600;
                  } else if (fontWeight.toLowerCase() === "bold") {
                     fontWeight = 700;
                  } else if (
                     fontWeight.toLowerCase() === "extrabold" ||
                     fontWeight.toLowerCase() === "heavy"
                  ) {
                     fontWeight = 800;
                  } else if (fontWeight.toLowerCase() === "black") {
                     fontWeight = 900;
                  } else {
                     fontWeight = 400;
                  }
                  fs.appendFile(
                     fontsFile,
                     `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
                     cb
                  );
                  newFileOnly = fontFileName;
               }
            }
         } else {
            console.log(
               "Файл scss/fonts/fonts.scss уже существует. Для обновления файла необходимо удалить его!"
            );
         }
      } else {
         fs.unlink(fontsFile, cb);
      }
   });
   return gulp.src("./src/assets");
};

function cb() {}

export const fonts = gulp.series(otfToTtf, ttfToWoff, fonstStyle);
