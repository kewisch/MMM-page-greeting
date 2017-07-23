/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Portions Copyright (C) Philipp Kewisch, 2017
 * Portions MIT licensed from the compliments module */


/* global Module */

/**
 * Magic Mirror
 * Module: MMM-page-greeting
 *
 * Displays a personalized greeting for use with the MMM-pages module. Each
 * page is dedicated to a separate user. Don't forget to add this module to the
 * `excludes` section of your MMM-pages config.
 *
 */
Module.register("MMM-page-greeting", {
    defaults: {
        // Classes for the greeting wrapper
        classes: "thin xlarge bright",

        // The names must be in the same order as the modules array in the
        // MMM-pages config
        profiles: ["Fred", "Lucy"],

        // Greetings to display. Also supports weather-specific greetings as in
        // the compliments module
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
    },

    /**
     * Retrieves the current greetings based on factors like time of day and weather.
     *
     * @return Array<String>    The greetings for the current situation.
     */
    getCurrentGreetings: function() {
        let hour = (new Date()).getHours();
        let greetings;

        if (hour >= 3 && hour < 12 && this.config.greetings.hasOwnProperty("morning")) {
            greetings = this.config.greetings.morning.slice(0);
        } else if (hour >= 12 && hour < 17 && this.config.greetings.hasOwnProperty("afternoon")) {
            greetings = this.config.greetings.afternoon.slice(0);
        } else if (this.config.greetings.hasOwnProperty("evening")) {
            greetings = this.config.greetings.evening.slice(0);
        }

        if (typeof greetings === "undefined") {
            greetings = [];
        }

        if (this.currentWeatherType in this.config.greetings) {
            greetings.push(...this.config.greetings[this.currentWeatherType]);
        }

        greetings.push(...this.config.greetings.anytime);

        return greetings;
    },


    /**
     * Construct the DOM element to show the greeting
     */
    getDom: function() {
        let pagesModule = MM.getModules().withClass("MMM-pages")[0];
        if (!pagesModule) {
            console.error("MMM-pages is not installed. Please check your config.");
            return document.createTextNode("Uh oh…");
        }

        let currentPage = pagesModule.curPage;
        let currentUser = this.config.profiles[currentPage] || "Earthling";

        let greetings = this.getCurrentGreetings();
        let greeting = greetings[Math.floor(Math.random() * greetings.length)];

        let text = document.createTextNode(greeting.replace("$USER", currentUser));

        let wrapper = document.createElement("div");
        wrapper.className = this.config.classes;
        wrapper.appendChild(text);

        return wrapper;
    },

    /**
     * Sets the current weather type based on weather data.
     *
     * @param data Object   The weather data from the weather module
     */
    setCurrentWeatherType: function(data) {
        let weatherIconTable = {
            "01d": "day_sunny",
            "02d": "day_cloudy",
            "03d": "cloudy",
            "04d": "cloudy_windy",
            "09d": "showers",
            "10d": "rain",
            "11d": "thunderstorm",
            "13d": "snow",
            "50d": "fog",
            "01n": "night_clear",
            "02n": "night_cloudy",
            "03n": "night_cloudy",
            "04n": "night_cloudy",
            "09n": "night_showers",
            "10n": "night_rain",
            "11n": "night_thunderstorm",
            "13n": "night_snow",
            "50n": "night_alt_cloudy_windy"
        };
        this.currentWeatherType = weatherIconTable[data.weather[0].icon];
    },

    /**
     * Called when a notification from the module is received
     *
     * @param notification String       The identifier of the notification
     * @param payload Any               The payload of the notification
     * @param sender Module             The module that sent the notification
     */
    notificationReceived: function(notification, payload, sender) {
        if (["PAGE_CHANGED", "PAGE_INCREMENT", "PAGE_DECREMENT"].includes(notification)) {
            this.updateDom();
        } else if (notification == "CURRENTWEATHER_DATA") {
            this.setCurrentWeatherType(payload.data);
        }
    }
});
