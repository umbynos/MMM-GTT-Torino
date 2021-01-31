# MMM-GTT-Torino

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module shows stops, lines and schedules of the public trasport in Turin (GTT)

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-GTT-Torino',
            position: "top_left",
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
