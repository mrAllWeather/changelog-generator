# changelog-generator
_Fork of [changelog-generator](https://github.com/jackyef/changelog-generator) by Jacky Efendi.
Read more about his project at: https://link.medium.com/Ct3ef4I9V0_

This project aims to automatically update the version number and changelog of a project to reflect changes made within the projects git.

## Requirements
### Packages
Requirements Git and Node to be installed and available from your command line.

### Project
Within your project you need to include a package.json file with the following format. Additional fields may be included.
```
{
    "version": "0.1.7",
    "git-remote-path": "https://github.com/mrAllWeather/changelog-generator/",
    "auto-push": true
}
```
Fields
* version: The current 3-4 value version number. If you include a 4th value it will be considered a build number and will be automatically incremented
* git-remote-path (optional): The current remote path of your git project
* auto-push (optional, req. git-remote-path): Automatically perform git push on repo and tag after generating Changelog


## Installation
Download this package and at the command line run 
```npm install -g```
this will make changelog-generator available globally.
  
## Usage:

### GIT
When commiting to your git, include one of the following prefixes in your message to categorise the change.

* [Feat] Adding a feature
* [Dep] Deprecation of feature
* [Bug] Bug Fix
* [Tweak] Adjustment / Modification to code (of interest)
* [Chore] Misc clean up / adjustment / addition of files (not of interest)
 
 Feat and Dep can be marked as major by prepending an '!' at the front. 
 
 e.g. 
 ```git commit -m "![Dep] Removed RedundantFeature as it has been replaced by RelevantFeature"```
 

 ### Generating CHANGELOG.md
 When generating a changelog for release. Ensure all relevant git commits have been submitted and then run changelog-generator in you projects directory.
 A CHANGELOG.md will be generated, the 'version' field within your package.json will be updated and your current git branch will be tagged as the new release number.   
