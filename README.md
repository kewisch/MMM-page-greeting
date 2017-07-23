# MMM-page-greeting
This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

It displays a personalized greeting to the user and is intended to be used in
combination with the [MMM-pages](https://github.com/edward-shen/MMM-pages)
module. Each separate page is dedicated to a user.

## Installation

First, go to your MagicMirror modules folder:

    cd ~/MagicMirror/modules

Then, clone this repository:

    git clone https://github.com/kewisch/MMM-page-greeting.git

You can now continue with the module configuration.

## Using the Module

To use this module, install both this one and the 
[MMM-pages](https://github.com/edward-shen/MMM-pages) module.
You can configure them by adding the following to your `config/config.js` file:

````javascript
modules: [
    {
        module: "MMM-page-greeting",
        position: "top_bar",    // This can be any of the regions
        config: {
            // The names must be in the same order as the modules 
            // array in the MMM-pages config
            profiles: ["Fred", "Lucy"]
        }
    },
    {
        module: "MMM-pages",
        config: {
            modules: [
              ["DailyXKCD", ...], // Modules for Fred
              ["newsfeed", ...],  // Modules for Lucy
            ],
            excludes: ["clock", "calendar", "MMM-page-greeting"]
        }
    }
]
````

## Configuration Options

The following properties can be configured:


| Option           | Description
| ---------------- | -----------
| `profiles`       | A string array of users of the mirror. Can contain duplicate names if you would like multiple pages per user.
| `greetings`      | The list of greetings. For possible and default values see _Greeting Configuration_ below.
| `classes`        | Override the CSS classes of the div showing the greetings (default: `thin xlarge bright`)

### Greeting configuration

The `greetings` property contains an object with four arrays:
<code>morning</code>, <code>afternoon</code>, <code>evening</code> and
<code>anytime</code>. Based on the time of the day, the compliments will be
picked out of one of these arrays. The arrays contain one or multiple
compliments.

The special value `$USER` is replaced with the current user of the selected
page.


If use the currentweather is possible use a actual weather for set greetings.
The availables properties are:
* `day_sunny`
* `day_cloudy`
* `cloudy`
* `cloudy_windy`
* `showers`
* `rain`
* `thunderstorm`
* `snow`
* `fog`
* `night_clear`
* `night_cloudy`
* `night_showers`
* `night_rain`
* `night_thunderstorm`
* `night_snow`
* `night_alt_cloudy_windy`

#### Example use with currentweather module
````javascript
config: {
    greetings: {
        day_sunny: [
            "What a great day, $USER!"
        ],
        snow: [
            "Snowball battle, $USER!"
        ],
        rain: [
            "Don't forget your umbrella, $USER"
        ]
    }
}
````

#### Default Value
````javascript
config: {
    greetings: {
        anytime: [
            "Hey there, $USER",
            "Hello, $USER",
            "What's up, $USER?"
        ],
        morning: [
            "Good morning, $USER",
            "Enjoy your day, $USER",
            "Rise and shine, $USER"
        ],
        afternoon: [
            "Good day, $USER",
            "Enjoying your day, $USER?"
        ],
        evening: [
            "Good evening, $USER",
            "How was your day, $USER?"
        ]
    }
}
````
