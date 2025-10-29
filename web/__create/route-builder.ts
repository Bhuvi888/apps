import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = join(fileURLToPath(new URL('.', import.meta.url)), '../src/app/api');
const generatedFile = join(fileURLToPath(new URL('.', import.meta.url)), 'generated-routes.ts');

async function findRouteFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir);
  let routes: string[] = [];

  for (const file of files) {
    try {
      const filePath = join(dir, file);
      const statResult = await stat(filePath);

      if (statResult.isDirectory()) {
        routes = routes.concat(await findRouteFiles(filePath));
      } else if (file === 'route.js') {
        routes.push(filePath);
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return routes;
}

async function generateRoutes() {
  const routeFiles = await findRouteFiles(__dirname);
  let imports = '';
  let routes = 'const routes = [\n';

  routeFiles.forEach((file, index) => {
    const relativePath = relative(join(__dirname, '..'), file).replace(/\\/g, '/');
    const importName = `route${index}`;
    imports += `import * as ${importName} from '../${relativePath}';\n`;
    routes += `  { path: '${relativePath}', module: ${importName} },\n`;
  });

  routes += '];\n';

  const content = `${imports}\n${routes}\nexport default routes;\n`;
  await writeFile(generatedFile, content);
}

await generateRoutes();