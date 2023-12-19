const fs = require('fs');
const yaml = require('js-yaml');

function updateImageInYAML(filePath, dispatchedKey, dispatchedEvent) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  try {
    const yamlData = yaml.load(fileContents);
    if (yamlData && typeof yamlData === 'object') {
      updateNestedImage(yamlData, dispatchedKey, dispatchedEvent);
      const updatedYAML = yaml.dump(yamlData);
      fs.writeFileSync(filePath, updatedYAML, 'utf8');
      console.log(`Updated YAML file: ${filePath}`);
    } else {
      console.error('Invalid YAML structure. Root should be an object.');
    }
  } catch (error) {
    console.error(error);
    console.error(`Error parsing YAML file: ${filePath}`);
  }
}

function updateNestedImage(yamlData, dispatchedKey, dispatchedEvent) {  
  if (is_scanable(yamlData[dispatchedKey]) && has_image(yamlData[dispatchedKey])) {
    updateImageValues(yamlData[dispatchedKey].image, dispatchedEvent);
  }
  Object.keys(yamlData).forEach((key) => {
    console.log(key)
    // need to evaluate if yamlData[key] is_scanable otherwise it will iterate over primitive types ... 
    if (is_scanable(yamlData[key])) {
      console.log(key)
      updateNestedImage(yamlData[key], dispatchedKey, dispatchedEvent);
    }
  });
}

function is_scanable(yamlData) {
  return typeof yamlData === "object" && yamlData != null ? true : false;
}

function has_image(yamlData) {
  return yamlData.image ? true : false;
}

function updateImageValues(image, dispatchedEvent) {
  if (dispatchedEvent.registry && image.registry) {
    image.registry = dispatchedEvent.registry;
  }
  if (dispatchedEvent.repository && image.repository) {
    image.repository = dispatchedEvent.repository;
  }
  if (dispatchedEvent.tag) {
    if (image.tag) {
      image.tag = dispatchedEvent.tag;
    } else if (image.version) {
      image.version = dispatchedEvent.tag;
    }
  }
}


module.exports = updateImageInYAML;

// Example usage
// const filePath = 'test-yamls/values.yaml';
// const dispatchedKey = 'metrics';
// const dispatchedEvent = {
//   registry: 'newfoo',
//   repository: 'repository',
//   tag: 'v2',
// };

// updateImageInYAML(filePath, dispatchedKey, dispatchedEvent);
