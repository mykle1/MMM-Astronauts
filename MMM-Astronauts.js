/* Magic Mirror
 * Module: MMM-Astronauts
 *
 * By Mykle1
 *
 */
Module.register("MMM-Astronauts", {

    // Module config defaults.
    defaults: {
        useHeader: true,                 // False if you don't want a header      
        header: "",                      // Change in config file. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000,            // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
        rotateInterval: 5 * 60 * 1000,   // 5 minutes
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-Astronauts.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        //  Set locale.
        this.url = "http://api.open-notify.org/astros.json";
        this.Jetsons = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Lost in space . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }
		
		
	//	Rotating my data
		var Jetsons = this.Jetsons;
		var JetsonsKeys = Object.keys(this.Jetsons);
        if (JetsonsKeys.length > 0) {
            if (this.activeItem >= JetsonsKeys.length) {
                this.activeItem = 0;
            }
            var Jetsons = this.Jetsons[JetsonsKeys[this.activeItem]];
		
	//	console.log(Jetsons);

        var top = document.createElement("div");
        top.classList.add("list-row");
		
		
		// picture
		var img = document.createElement("img");
		img.classList.add("photo");
		img.src = "http://cdn2.ubergizmo.com/wp-content/uploads/2015/11/international-space-station.jpg";
		wrapper.appendChild(img);
		
		
		// date and time
        var date = document.createElement("div");
        date.classList.add("small", "bright", "date");
		// this.sTrim(nasa.data[0].description, 187, ' ', ' ...'); AND function below.
        date.innerHTML = this.sTrim(Date(), 40, ' ', ' ');
        wrapper.appendChild(date);
		
		
        // Their names
        var name = document.createElement("div");
        name.classList.add("small", "bright", "name");
        name.innerHTML = Jetsons.name + " is aboard";
        wrapper.appendChild(name);
 

        // Their spacecraft
        var craft = document.createElement("div");
        craft.classList.add("small", "bright", "craft");
		if (response = "ISS") {
			craft.innerHTML = "The International Space Station";
		} else 	
			craft.innerHTML = Jetsons.craft;
			wrapper.appendChild(craft);
						
		}
        return wrapper;
    },


    processJetsons: function(data) {
        this.today = data.Today;
        this.Jetsons = data; // Object containing an array that contains objects
        this.loaded = true;
    },
	
	sTrim: function(str, length, delim, appendix) {
        if (str.length <= length) return str;
        var trimmedStr = str.substr(0, length + delim.length);
        var lastDelimIndex = trimmedStr.lastIndexOf(delim);
        if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);
        if (trimmedStr) trimmedStr += appendix;
        return trimmedStr;
    },

    scheduleCarousel: function() {
        console.log("Carousel of Jetsons fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getJetsons();
        }, this.config.updateInterval);
        this.getJetsons(this.config.initialLoadDelay);
    },

    getJetsons: function() {
        this.sendSocketNotification('GET_JETSONS', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "JETSONS_RESULT") {
            this.processJetsons(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});