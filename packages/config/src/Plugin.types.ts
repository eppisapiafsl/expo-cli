import { ExpoConfig } from '@expo/config-types';
import { JSONObject } from '@expo/json-file';
import { XcodeProject } from 'xcode';

import { AndroidManifest } from './android/Manifest';
import * as AndroidPaths from './android/Paths';
import { ResourceXML } from './android/Resources';
import { InfoPlist } from './ios/IosConfig.types';

type OptionalPromise<T> = Promise<T> | T;

type Plist = JSONObject;

export interface ModProps<T = any> {
  /**
   * Project root directory for the universal app.
   */
  readonly projectRoot: string;
  /**
   * Project root for the specific platform.
   */
  readonly platformProjectRoot: string;

  /**
   * Name of the mod.
   */
  readonly modName: string;

  /**
   * Name of the platform used in the mods config.
   */
  readonly platform: ModPlatform;

  /**
   * [iOS]: The path component used for querying project files.
   *
   * @example projectRoot/ios/[projectName]/
   */
  readonly projectName?: string;

  nextMod?: Mod<T>;
}

// TODO: Migrate ProjectConfig to using expo instead if exp
export interface ExportedConfig extends ExpoConfig {
  mods?: ModConfig | null;
}

export interface ExportedConfigWithProps<Data = any> extends ExpoConfig {
  /**
   * The Object representation of a complex file type.
   */
  modResults: Data;
  modRequest: ModProps<Data>;
}

// TODO: Change any to void
export type ConfigPlugin<Props = any> = (config: ExpoConfig, props: Props) => ExpoConfig;

export type Mod<Props = any> = (
  config: ExportedConfigWithProps<Props>
) => OptionalPromise<ExportedConfigWithProps<Props>>;

export interface ModConfig {
  android?: {
    /**
     * Modify the `android/app/src/main/AndroidManifest.xml` as JSON (parsed with [`xml2js`](https://www.npmjs.com/package/xml2js)).
     */
    manifest?: Mod<AndroidManifest>;
    /**
     * Modify the `android/app/src/main/res/values/strings.xml` as JSON (parsed with [`xml2js`](https://www.npmjs.com/package/xml2js)).
     */
    strings?: Mod<ResourceXML>;
    /**
     * Modify the `android/app/src/main/<package>/MainActivity.java` as a string.
     */
    mainActivity?: Mod<AndroidPaths.ApplicationProjectFile>;
    /**
     * Dangerously modify the `android/app/build.gradle` as a string.
     * Use `expoAppBuildGradle` instead.
     */
    appBuildGradle?: Mod<AndroidPaths.GradleProjectFile>;
    /**
     * Dangerously modify the `android/build.gradle` as a string.
     * Use `expoProjectBuildGradle` instead.
     */
    projectBuildGradle?: Mod<AndroidPaths.GradleProjectFile>;
    /**
     * Modify the generated `android/.expo/app-build.gradle` as a string.
     * This file is used to extend the contents of `android/app/build.gradle` safely.
     * Should be used in favor of `appBuildGradle`.
     */
    expoAppBuildGradle?: Mod<AndroidPaths.GradleProjectFile>;
    /**
     * Modify the generated `android/.expo/project-build.gradle` as a string.
     * This file is used to extend the contents of `android/build.gradle` safely.
     * Should be used in favor of `projectBuildGradle`.
     */
    expoProjectBuildGradle?: Mod<AndroidPaths.GradleProjectFile>;
  };
  ios?: {
    /**
     * Modify the `ios/<name>/Info.plist` as JSON (parsed with [`@expo/plist`](https://www.npmjs.com/package/@expo/plist)).
     */
    infoPlist?: Mod<InfoPlist>;
    /**
     * Modify the `ios/<name>/<product-name>.entitlements` as JSON (parsed with [`@expo/plist`](https://www.npmjs.com/package/@expo/plist)).
     */
    entitlements?: Mod<Plist>;
    /**
     * Modify the `ios/<name>/Expo.plist` as JSON (Expo updates config for iOS) (parsed with [`@expo/plist`](https://www.npmjs.com/package/@expo/plist)).
     */
    expoPlist?: Mod<Plist>;
    /**
     * Modify the `ios/<name>.xcodeproj` as an `XcodeProject` (parsed with [`xcode`](https://www.npmjs.com/package/xcode))
     */
    xcodeproj?: Mod<XcodeProject>;
  };
}

export type ModPlatform = keyof ModConfig;
