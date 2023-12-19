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
    // generate a random string to avoid caching
    core.setOutput("branch-suffix", Math.random().toString(36).substring(7));   
}

// imageDataByKey = {
//     "service-name": {
//         "tag": "image-tag",
//         "registry": "image-registry",
//         "repository": "image-repository",
//  }

function updateYamls(directoryPath, imageDataByKey) {
    const filePaths = glob.sync(`${directoryPath}/**/*.yaml`);
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