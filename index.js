const glob = require('glob');
const core = require("@actions/core");
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
    core.setOutput("updated-services", Object.keys(dispatchedPayload).join(', '));
}

// imageDataByKey = {
// TODO: probably we need some nesting here so as to track the dispatcher ... 
//     "service-name": {
//         "tag": "image-tag",
//         "registry": "image-registry",
//         "repository": "image-repository",
// TODO: requires validation for the following
//         "github_repository": "github-repository",
//         "commit": "the-commit-hash-of-latest-release",
//  }

function updateYamls(directoryPath, imageDataByKey) {
    const filePaths = glob.sync(`${directoryPath}/**/values*.yaml`);
    for (var file of filePaths) {
        for (var serviceName in imageDataByKey) {
            console.log(serviceName);
            const imageInfo = imageDataByKey[serviceName];
            console.log(imageInfo)
            updateImageInYAML(file, serviceName, imageInfo);
        }
    }
}

async function main(){
    const inputs = getInputs();
    const yaml_root_dir = inputs.targetPath;
    const dispatchedPayload = JSON.parse(inputs.dispatchedPayload);
    console.log(dispatchedPayload)
    updateYamls(yaml_root_dir, dispatchedPayload);
    setOutputs(dispatchedPayload, true)
}

main();