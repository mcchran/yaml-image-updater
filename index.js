const core = require("@actions/core");
const glob = require('glob');
const path = require('path');
const updateImageInYAML = require('./image_yaml_updater');

function getInputs() { 
    const targetPath = core.getInput("target-path");
    const dispatchedPayload = core.getInput("dispatched-payload");
    return {
        targetPath,
        dispatchedPayload,
    }; 
}

function setOutputs(dispatchedPayload, success) {
    core.setOutput("success", success);
    core.setOutput("updated-services", Object.keys(dispatchedPayload.images).join(', '));
    core.setOutput("updated-by-commit", dispatchedPayload["commit-sha"]);
    core.setOutput("updated-by-repo", dispatchedPayload["repo"]);  
    // to open a random branch ... for the automated pr
    core.setOutput("branch-suffix", Math.random().toString(36).substring(7)); 
}

// imageDataByKey = {
//     "service-name": {
//         "tag": "image-tag",
//         "registry": "image-registry",
//         "repository": "image-repository",
//     },
//  }

function updateYamls(filePaths, imageDataByKey) {
    for (var filePath of filePaths) {
        for (var serviceName in imageDataByKey) {
            console.log(serviceName);
            const imageInfo = imageDataByKey[serviceName];
            console.log(imageInfo)
            updateImageInYAML(filePath, serviceName, imageInfo);
        }
    }
}

async function main(){
    const inputs = getInputs();
    const yaml_root_dir = inputs.targetPath;
    const dispatchedPayload = JSON.parse(inputs.dispatchedPayload);

    var filePaths = dispatchedPayload["value-files"] ? dispatchedPayload["value-files"] : [];
    if (filePaths.length > 0) {
        filePaths = filePaths.map((filePath) => path.join(yaml_root_dir, filePath));
    } else {
        filePaths = glob.sync(path.join(yaml_root_dir, "**/*.yaml"));
    }

    console.log("Files to be updated: " + filePaths.join(', '));
    console.log("Images to be updated: " + Object.keys(dispatchedPayload.images).join(', '));

    updateYamls(filePaths, dispatchedPayload.images);
    setOutputs(dispatchedPayload, true)
}

main();