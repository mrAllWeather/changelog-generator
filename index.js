#!/usr/bin/env node
/*
 * Author: Jacky Efendi, amended by Ben Weatherall
 * Providence: https://medium.com/better-programming/create-your-own-changelog-generator-with-git-aefda291ea93 
 */

const child = require('child_process');
const fs = require('fs');

const git_path = require('./package')["git-remote-path"];


const latestTag = child.execSync(`git describe --long`).toString('utf-8').split('-')[0];

const output = child
    .execSync(`git log ${latestTag}..HEAD --format=%B%H-----DELIMITER-----`)
    .toString('utf-8');

const commitArray = output.split('-----DELIMITER-----\n').map(commit => {
    const [message, sha] = commit.split('\n');
    
    return { sha, message };
}).filter(commit => Boolean(commit.sha));

// Version Setup
if(!fs.existsSync("./CHANGELOG.md")){
    fs.writeFileSync("./CHANGELOG.md", "");
}

const currentChangeLog = fs.readFileSync("./CHANGELOG.md", {encoding: "utf-8", flag: "r+"});
let currentMajorVersion, currentMinorVersion, currentRevisionVersion, currentBuildNumber;
[currentMajorVersion, currentMinorVersion, currentRevisionVersion,currentBuildNumber] = require("./package").version.split('.');

let newMajorVersion = Number(currentMajorVersion),
    newMinorVersion = Number(currentMinorVersion),
    newRevisionVersion = Number(currentRevisionVersion),
    newBuildNumber = Number(currentBuildNumber);

// Update Types
let majorDeprecations = [];
let majorFeatures = [];

let features = [];
let deprecations = [];
let bugs = [];
let tweaks = [];
let chores = [];

function processCommitPrefix(commit, prefixString, array){
    if(commit.message.startsWith(`${prefixString} `)) {
        if(git_path == undefined || git_path == ""){
            array.push(
                `* ${commit.message.replace(`${prefixString} `, "")} (${commit.sha.substring(
                    0,
                    6
                )})\n`
            );
        } else {
            array.push(
                `* ${commit.message.replace(`${prefixString} `, "")} ([${commit.sha.substring(
                    0,
                    6
                )}](${git_path}commit/${
                    commit.sha
                }))\n`
            );    
        }
        
        
    }
    return array;
}

function addChangeLine(array, ArrayString, logBuffer){
    if(array.length) {
        logBuffer += `### ${ArrayString}\n`;
        array.forEach(element => {
            logBuffer += element;
        });
        logBuffer += '\n';
    }
    
    return logBuffer;
}

commitArray.forEach(commit => {
    // Major Changes 
    majorDeprecations = processCommitPrefix(commit, "![Dep]", majorDeprecations);
    majorFeatures = processCommitPrefix(commit, "![Feature]", majorFeatures);
    
    // Minor Changes
    deprecations = processCommitPrefix(commit, "[Dep]", deprecations);
    features = processCommitPrefix(commit, "[Feature]", features);
    
    // Revision Changes
    bugs = processCommitPrefix(commit, "[Bug]", bugs);
    tweaks = processCommitPrefix(commit, "[Tweak]", tweaks);
    chores = processCommitPrefix(commit, "[Chore]", chores);
    
    // Bugs, Tweaks and Chores are not major updates, catch any accidental slips
    bugs = processCommitPrefix(commit, "![Bug]", bugs);
    tweaks = processCommitPrefix(commit, "![Tweak]", tweaks);
    chores = processCommitPrefix(commit, "![Chore]", chores);
    
});

if(majorFeatures.length || majorDeprecations.length) {
    newMajorVersion += 1;
    newMinorVersion = 0;
    newRevisionVersion = 0;
}
if(features.length || deprecations.length){
    newMinorVersion += 1;
    newRevisionVersion = 0;
} else if (bugs.length || tweaks.length || isNaN(newBuildNumber)){
    newRevisionVersion += 1;
}
newBuildNumber += 1;


if(isNaN(newBuildNumber)){
    newVersion = `${newMajorVersion}.${newMinorVersion}.${newRevisionVersion}`;    
} else {
    newVersion = `${newMajorVersion}.${newMinorVersion}.${newRevisionVersion}.${newBuildNumber}`;
}


let newChangeLog = `# Version ${newVersion} (${
    new Date().toISOString().split("T")[0]})\n\n`;

if(majorFeatures.length || majorDeprecations.length){
    newChangeLog += `## Major Changes\n`;
}
newChangeLog = addChangeLine(majorFeatures, "Features", newChangeLog);
newChangeLog = addChangeLine(majorDeprecations, "Deprecated", newChangeLog);

if(features.length || deprecations.length || bugs.length || tweaks.length || chores.length){
    newChangeLog += `## Minor Changes\n`;    
}

newChangeLog = addChangeLine(features, "Features", newChangeLog);
newChangeLog = addChangeLine(deprecations, "Deprecated", newChangeLog);
newChangeLog = addChangeLine(bugs, "Bugs", newChangeLog);
newChangeLog = addChangeLine(tweaks, "Tweaks", newChangeLog);

// Skip Chores
// newChangeLog = addChangeLine(chores, "Chores", newChangeLog);

// prepend the newChangelog to the current one
fs.writeFileSync("./CHANGELOG.md", `${newChangeLog}${currentChangeLog}`);

// update package.json
let package_info = require("./package");
package_info.version = newVersion;
fs.writeFileSync("./package.json", JSON.stringify(package_info, null, 2));

// create a new commit
child.execSync('git add .');
child.execSync(`git commit -m "[chore]: Bump to version ${newVersion}"`);

// tag the commit
child.execSync(`git tag -a -m "Tag for version ${newVersion}" v${newVersion}`);

if(git_path == undefined || git_path == ""){
   // pass 
} else if(require('./package')["auto-push"]){
    let remote_git = git_path.replace(/\/$/,".git");
    child.execSync(`git push`,{stdio: 'inherit'});
    child.execSync(`git push ${remote_git} v${newVersion}`,{stdio: 'inherit'});
}