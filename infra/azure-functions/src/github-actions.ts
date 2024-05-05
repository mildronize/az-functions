import * as core from '@actions/core';

import type { InfraEnvConfig } from './types';

import { toTarget } from './utils';
import { infraConfigs } from './config';

export interface GithubActionsMatrix {
  os: string;
  /**
   * Node or Bun
   */
  runtime: 'node' | 'bun';
  /**
   * Node or Bun version
   */
  version: string;
  /**
   * target runtime
   */
  target: string;
  /**
   * Resource Identifier
   */
  resource_identifier: string;
}

/**
 * Select github actions runner
 *
 * @ref https://github.com/actions/runner-images
 *
 * - when platform is `linux` (x64), use [ubuntu-latest](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md)
 * - when platform is `windows` (x64), use [windows-latest](https://github.com/actions/runner-images/blob/main/images/windows/Windows2022-Readme.md)
 * - when platform is `macos` (arm64), use [macos-latest](https://github.com/actions/runner-images/blob/main/images/macos/macos-14-arm64-Readme.md)
 */

export function toGithubActionsMatrix(configs: InfraEnvConfig[]): GithubActionsMatrix[] {
  return configs.map(config => {
    const { platform, runtime } = config;
    /**
     * Using Node 20 LTS to build but the target runtime is can be different
     */
    const version = runtime === 'node18' ? '20' : 'latest';

    if (!config.resourceIdentifier) {
      throw new Error('resourceIdentifier is required');
    }
    return {
      os: platform === 'linux' ? 'ubuntu-latest' : platform === 'win' ? 'windows-latest' : 'macos-latest',
      runtime: runtime === 'bun' ? 'bun' : 'node',
      version,
      target: toTarget(config),
      resource_identifier: config.resourceIdentifier,
    } satisfies GithubActionsMatrix;
  });
}

const matrix = toGithubActionsMatrix(infraConfigs);
console.log('Github Actions Matrix', JSON.stringify(matrix, null, 2));
core.setOutput('matrix', JSON.stringify(matrix));
