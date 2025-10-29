import fs from "fs-extra";

const srcDir = "./src/app/api";
const destDir = "./build/server/src/app/api";

if (fs.existsSync(srcDir)) {
  fs.copySync(srcDir, destDir);
  console.log("✅ Copied API routes to build folder");
} else {
  console.warn("⚠ No src/app/api folder found, skipping copy.");
}

