# Update YAML Images Action

This GitHub Action updates images in YAML files based on a dispatched payload.

## Inputs

### `target-path`

**Required**: The path to the directory containing YAML files.

### `repo-by-service`

**Required**: A JSON string representing the mapping of service names to repository URLs.

### `dispatched-payload`

**Required**: A JSON string representing the payload to be dispatched. It should contain image information keyed by service names.

## Outputs

None

## Example Usage

```yaml
name: Update YAML Images

on:
  workflow_dispatch:
    inputs:
      target-path:
        description: 'Path to YAML files directory'
        required: true
      service-by-repo:
        description: 'Mapping of service names to repository URLs (JSON)'
        required: true
      dispatched-payload:
        description: 'Payload with image information (JSON)'
        required: true

jobs:
  update-yaml:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v2

    - name: Run Update YAML Action
      uses: your-repository/update-yaml-action@main
      with:
        target-path: 'path/to/yaml/files'
        service-by-repo: '{"repo-url": "service-name"}'
        dispatched-payload: '{"service-name": {"image": "image-name", "tag": "image-tag", "registry": "image-registry", "repository": "image-repository"}}'

```

This action scans the specified directory for YAML files and updates image information based on the dispatched payload.

Ensure to replace 'your-repository/update-yaml-action@main' with the actual reference to your GitHub Action.

##License
This project is licensed under the MIT License.

```
Make sure to replace placeholder values with actual details relevant to your GitHub Action. Feel free to add or modify sections based on your specific needs.
```
        
    