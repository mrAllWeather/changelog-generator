# Version 0.1.9 (2020-07-07)

## Minor Changes
### Bugs
* Now generates CHANGELOG.md if doesn't exist ([916026](https://github.com/mrAllWeather/changelog-generator/commit/916026c8c32bc0424616ec20714f7af720ad6b3c))

### Tweaks
* Corrected Bump commit prefix ([e0a184](https://github.com/mrAllWeather/changelog-generator/commit/e0a184d75af326c08013e6afc57279e4493748b8))

# Version 0.1.8 (2020-07-07)

## Minor Changes
### Bugs
* Node projects cannot have 4 digit version numbers ([0dafd3](https://github.com/mrAllWeather/changelog-generator/commit/0dafd3df6d54ac35d09b9fd6cbbccede3278d31a))

### Tweaks
* Updated README.md to include requirements and usage ([70069d](https://github.com/mrAllWeather/changelog-generator/commit/70069d193ac97b74fa70ac84bb8c24ee0230e6fa))

# Version 0.0.0-0.1.7 (2020-07-06)

## Major Changes
### Features
* Now handles version strings with and without build number
* change log now includes major and minor change notices.
* added more complex commit and version handling

## Minor Changes
### Features
* can list remote git path in package.json

### Tweaks
* Updated to reflect internal standards.
* if build_version is NaN, will increment revision number
* Added author line

### Bugs
* corrected package import string