import * as ts from 'typescript';
import * as YAML from 'yamljs';
import { ExtendedRoutesConfig, ExtendedSpecConfig } from '../cli';
import { Tsoa, Swagger } from '@tsoa/runtime';
import { SpecGenerator2 } from '../swagger/specGenerator2';
import { SpecGenerator3 } from '../swagger/specGenerator3';
import { fsExists, fsMkDir, fsWriteFile } from '../utils/fs';
import { MetadataSwaggerGeneratorV1 } from '../metadataGeneration/metadataSwaggerGenerator_v1';

export const getSwaggerOutputPath = (swaggerConfig: ExtendedSpecConfig) => {
  const ext = swaggerConfig.yaml ? 'yaml' : 'json';
  const specFileBaseName = swaggerConfig.specFileBaseName || 'swagger';

  return `${swaggerConfig.outputDirectory}/${specFileBaseName}.${ext}`;
};

export const generateSpec = async (
  swaggerConfig: ExtendedSpecConfig,
  routeConfig :ExtendedRoutesConfig,
  compilerOptions?: ts.CompilerOptions,
  ignorePaths?: string[],
  /**
   * pass in cached metadata returned in a previous step to speed things up
   */
  metadata?: Tsoa.Metadata,
) => {
  if (!metadata) {
    metadata = new MetadataSwaggerGeneratorV1(routeConfig.routesDir,compilerOptions).Generate();
  }


  let spec: Swagger.Spec;
  if (swaggerConfig.specVersion && swaggerConfig.specVersion === 3) {
    spec = new SpecGenerator3(metadata, swaggerConfig).GetSpec();
  } else {
    spec = new SpecGenerator2(metadata, swaggerConfig).GetSpec();
  }

  const exists = await fsExists(swaggerConfig.outputDirectory);
  if (!exists) {
    await fsMkDir(swaggerConfig.outputDirectory);
  }

  let data = JSON.stringify(spec, null, '\t');
  if (swaggerConfig.yaml) {
    data = YAML.stringify(JSON.parse(data), 10);
  }

  const outputPath = getSwaggerOutputPath(swaggerConfig);
  await fsWriteFile(outputPath, data, { encoding: 'utf8' });

  return metadata;
};
