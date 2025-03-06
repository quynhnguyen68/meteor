import type {Icon} from './figma/index.js';
import FigmaApiClient from './figma/index.js';
import FigmaUtil from './figma/util/index.js';
import * as fse from 'fs-extra';
import chalk from 'chalk';
import * as cliProgress from 'cli-progress';
import type {OptimizedSvg} from 'svgo';
import {optimize} from 'svgo';
import md5 from 'js-md5';
import fs from 'node:fs';
import {PromisePool} from '@supercharge/promise-pool';
// @ts-expect-error - this dependency has no type definitions
import * as svgoAutocrop from 'svgo-autocrop';
import dotenv from 'dotenv';

dotenv.config();

const client = new FigmaApiClient();
const util = new FigmaUtil();

console.log(chalk.green('Clean up...'));

fs.rmSync(`${import.meta.dirname}/../icons`, {recursive: true, force: true});

console.log(chalk.green('Fetching Figma file stand by...'));

client.getFile().then(async (response) => {
  // @ts-expect-error -- TODO: add types for figma response
  const iconOverview = response.data.document.children.find(node => node.id === '217:6');

  console.log(chalk.green('Gathering icons...'));
  // @ts-expect-error -- TODO: add types for iconMap
  const iconMap = await util.buildIconMap(iconOverview);
  const meta = util.buildMeta(iconMap);

  console.log(chalk.green('Downloading and optimizing icons...'));
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  bar.start(iconMap.size, 0);

  //Const promises: Promise<void>[] = [];
  const styling = [] as { name: string, width: string, height: string }[];

  await PromisePool
    .for(Array.from(iconMap.keys()))
    .withConcurrency(25)
    .onTaskFinished((iconName, pool) => {
      bar.update(pool.processedItems().length);
    })
    .process(async (iconName: string) => {
      // @ts-expect-error -- TODO: add types for iconMap
      const icon: Icon = iconMap.get(iconName);

      const result = await client.downloadImage(icon.image);
      const svg = result.data as string;

      // Remove width/height from SVGs
      const optimizedSvgResult = optimize(svg, {
         
        plugins: [
          {name: 'removeDimensions'},
          {
            ...svgoAutocrop,
            params: {
              disableTranslateWarning: true,
            },
          },
        ],
      }) as OptimizedSvg;

      let optimizedSvg = optimizedSvgResult.data;

      const viewBox = optimizedSvg.match(/viewBox="(\d*) (\d*) (\d*) (\d*)"/);
      if (viewBox) {
        const width = viewBox[3];
        const height = viewBox[4];
        const className = iconName.replace(/icons\//, '').replace(/\//g, '-');

        // Add class name to SVG
        optimizedSvg = optimizedSvg.replace(/<svg/, `<svg id="meteor-icon-kit__${className}"`);

        styling.push({
          name: className,
          // @ts-expect-error - we know that viewBox is defined
          width,
          // @ts-expect-error - we know that viewBox is defined
          height,
        });
      } else {
        console.log(chalk.red(`Could not find viewBox for ${iconName}`));
      }

      fse.outputFileSync(`${import.meta.dirname}/../${iconName}.svg`, optimizedSvg);
    });

  bar.stop();
  console.log(chalk.green('All icons written!'));

  console.log(chalk.green('Writing styling...'));

  let cssFileContent = '/* This file is auto-generated by meteor-icon-kit. */\n';
  let scssFileContent = cssFileContent;

  scssFileContent += '#meteor-icon-kit {';

  styling.forEach(({name, width, height}) => {
    cssFileContent += `#meteor-icon-kit__${name}{width:${width}px;height:${height}px;}`;
    scssFileContent += `\n  &__${name} {\n    width: ${width}px;\n    height: ${height}px;\n  }\n`;
  });

  scssFileContent += '}\n';

   
  fse.outputFileSync(`${import.meta.dirname}/../icons/meteor-icon-kit-${md5(styling)}.css`, cssFileContent);
   
  fse.outputFileSync(`${import.meta.dirname}/../icons/meteor-icon-kit.scss`, scssFileContent);

  console.log(chalk.green('Writing metadata'));
  fse.outputFileSync(`${import.meta.dirname}/../icons/meta.json`, JSON.stringify(meta));

  console.log(chalk.green('All done!'));
  //});
}).catch((e) => {
  console.error(e);
});
