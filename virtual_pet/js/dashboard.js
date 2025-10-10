// contains the dashboard class that handles all the visual display
// it creates the stats bars, shows the pet sprite and emotes, and updates everything

class Dashboard {
    constructor(statsContainerId, petContainerId, pet) {
        // use d3.js to select the html containers where we'll put our graphics
        this.statsContainer = d3.select(statsContainerId); // where stats bars go
        this.petContainer = d3.select(petContainerId);     // where pet graphics go
        
        // store reference to the pet so we can get its stats
        this.pet = pet;
        
        // these will hold svg elements for graphics
        this.statsSvg = null;
        this.petSvg = null;   // svg for emotes only now
        
        // object to store references to stat bar elements
        this.bars = {};
        
        // 3D pet visualization
        this.pet3D = null;
        
        // set up all the visual elements
        this.setupDashboard();
    }
    
    // function to initialize all the visual elements
    setupDashboard() {
        // clear out any existing content in both containers
        this.statsContainer.html(""); // remove old stats
        this.petContainer.html("");   // remove old pet graphics
        
        // create the stats bars (html/css, not svg)
        this.createBarChart();
        
        // create the pet visualization (3D dog + emotes overlay)
        this.createPetVisualization();
    }
    
    // function to create the stats bars (hunger, happiness, energy, cleanliness)
    createBarChart() {
        // get current pet stats
        const stats = this.pet.getStats();
        
        // create main container div for all the bars
        const barsContainer = this.statsContainer.append("div")
            .attr("class", "stats-bars"); // css class for styling
        
        // loop through each stat (hunger, happiness, energy, cleanliness)
        Object.keys(stats).forEach(stat => {
            const value = stats[stat]; // get the current value (0-100)
            
            // create container for this individual stat
            const statContainer = barsContainer.append("div")
                .attr("class", "stat-container");
            
            // create label showing stat name (like "hunger")
            statContainer.append("div")
                .attr("class", "stat-label")
                .text(this.formatStatName(stat)); // convert "hunger" to "Hunger"
            
            // create background bar (the gray part)
            const barBackground = statContainer.append("div")
                .attr("class", "stat-bar-background");
            
            // create the colored fill bar that shows the actual value
            const barFill = barBackground.append("div")
                .attr("class", `stat-bar-fill stat-bar-${stat}`) 
                .style("width", "0%") // start at 0 width, will animate to real value
                .style("background-color", this.getColorForStat(stat, value)); // color based on value
            
            // create text showing percentage
            const percentText = statContainer.append("div")
                .attr("class", "stat-percentage")
                .text(`${value}%`); // show like "75%"
            
            // store references to these elements so i can update them later
            this.bars[stat] = {
                fill: barFill,    // the colored bar
                text: percentText // the percentage text
            };
            
            // animate the bar growing to its real width after a short delay
            setTimeout(() => {
                barFill.style("width", `${value}%`);
            }, 100); // 100 milliseconds delay
        });
    }
    
    // function to create the pet visualization (3D dog + emotes + text)
    createPetVisualization() {
        // create 3D pet visualization first
        this.pet3D = new Pet3D('pet-container');
        
        // create svg overlay for emotes and text (positioned above 3D canvas)
        this.petSvg = this.petContainer.append("svg")
            .attr("width", "100%")        // make it fill the container width
            .attr("height", "100%")       // make it fill the container height
            .attr("viewBox", "0 0 300 300") // set coordinate system (300x300 pixels)
            .style("background", "transparent") // no background color
            .style("position", "absolute") // position over the 3D canvas
            .style("top", "0")
            .style("left", "0")
            .style("pointer-events", "none") // don't interfere with 3D interactions
            .style("z-index", "10"); // ensure it's above the 3D canvas
        
        // create a group element to hold SVG overlay graphics (emotes and text)
        const petGroup = this.petSvg.append("g")
            .attr("class", "pet-visualization")
            .attr("transform", "translate(150, 150)"); // move group to center of 300x300 viewbox
        
        // create the emotion emote that floats above the 3D dog
        this.petEmote = petGroup.append("image")
            .attr("x", -30)  // position 30 pixels left of center
            .attr("y", -100) // position above the 3D dog
            .attr("width", 60)   // 60x60 pixel emote
            .attr("height", 60)
            .attr("href", "assets/Emotes/left/neutralEmote.png") // start with neutral emotion
            .style("image-rendering", "pixelated")         // keep pixel art crisp
            .style("image-rendering", "-moz-crisp-edges")
            .style("image-rendering", "crisp-edges")
            .style("opacity", 1.0) // make fully visible for testing
            .style("pointer-events", "none"); // don't interfere with 3D interactions
        
        // create text that shows pet's current status below the 3D dog
        this.statusText = petGroup.append("text")
            .attr("x", 0)    // centered horizontally
            .attr("y", 110)  // below the 3D dog
            .attr("text-anchor", "middle") // center the text
            .attr("fill", "#495057")       // dark gray color
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .text("Content") // default status text
            .style("pointer-events", "none"); // don't interfere with 3D interactions
        
        // set up the emotion system (no dog selection needed anymore)
        this.initializeEmoteMapping();  // create the emotion database
    }

    // function to set up the emotion system
    initializeEmoteMapping() {
        // object that maps emotion names to image files and status text
        this.emoteMap = {
            veryHappy: {
                image: "assets/Emotes/left/veryHappyEmote.png", // image file path
                status: "Very Happy!"  // text to show below pet
            },
            happy: {
                image: "assets/Emotes/left/happyEmote.png", 
                status: "Happy!"
            },
            neutral: {
                image: "assets/Emotes/left/neutralEmote.png",
                status: "Content"
            },
            sad: {
                image: "assets/Emotes/left/sadEmote.png",
                status: "A Bit Sad"
            },
            verySad: {
                image: "assets/Emotes/left/sadEmote.png", 
                status: "Very Sad"
            },
            bored: {
                image: "assets/Emotes/left/boredEmote.png",
                status: "Bored"
            },
            worried: {
                image: "assets/Emotes/left/worriedEmote.png",
                status: "Worried"
            }
        };
        
    }


    // main function that updates all visual elements when pet stats change
    updateDashboard() {
        // get current pet stats
        const stats = this.pet.getStats();
        
        // update each stat bar
        Object.keys(stats).forEach(stat => {
            const value = stats[stat];    // current stat value (0-100)
            const bar = this.bars[stat];  // get bar elements that was stored earlier
            
            // animate the bar width and color change
            bar.fill
                .transition()              // start smooth animation
                .duration(500)             // animation takes 500 milliseconds
                .style("width", `${value}%`)  // change width to match stat value
                .style("background-color", this.getColorForStat(stat, value)); // change color
            
            // update the percentage text
            bar.text.text(`${value}%`);
        });
        
        // update pet appearance (emote + status text) based on stats
        const happiness = stats.happiness;
        this.updatePetAppearance(happiness);
    }
    
    updatePetAppearance(happiness) {
        const stats = this.pet.getStats();
        
        // update 3D pet state and animations
        if (this.pet3D) {
            this.pet3D.updatePetState(stats, this.pet.isSleeping);
        }
        
        // determine which emote to show based on various stats
        let emoteKey = this.determineEmoteFromStats(stats);
        
        // get the appropriate emote data
        const emoteData = this.emoteMap[emoteKey];
        
        if (!emoteData) {
            console.error('No emote data found for key:', emoteKey);
            return;
        }
        
        // update pet emote image with fade transition
        this.petEmote
            .transition()
            .duration(300)
            .style("opacity", 0)
            .transition()
            .duration(100)
            .attr("href", emoteData.image)
            .transition()
            .duration(300)
            .style("opacity", 1);
        
        // update status text
        this.statusText
            .transition()
            .duration(500)
            .text(emoteData.status);
        
        // add special animation for very happy state
        if (happiness > 85) {
            this.animateHappyEmote();
        }
    }

    determineEmoteFromStats(stats) {
        const { happiness, hunger, energy, cleanliness } = stats;
        
        // check for specific conditions first (improved sensitivity)
        if (hunger < 30) {
            // hungry - might look worried or sad
            return "worried";
        } else if (energy < 30) {
            // tired - might look bored or sleepy
            return "bored";
        } else if (cleanliness < 30) {
            // dirty - might look confused or worried
            return "worried";
        } else if (happiness > 85) {
            return "veryHappy";
        } else if (happiness > 65) {
            return "happy";
        } else if (happiness > 40) {
            return "neutral";
        } else if (happiness > 20) {
            return "sad";
        } else {
            return "verySad";
        }
    }
    
    animateHappyEmote() {
        // make emote bounce when very happy
        this.petEmote
            .transition()
            .duration(300)
            .attr("y", -90) // slightly higher
            .transition()
            .duration(300)
            .attr("y", -80) // back to normal
            .transition()
            .duration(300)
            .attr("y", -90) // bounce again
            .transition()
            .duration(300)
            .attr("y", -80); // back to normal
            
    }
     // function to show a temporary emote for a short duration
    showTemporaryEmote(emotePath, duration = 2000, action = null) {
        const currentEmote = this.petEmote.attr("href");

    }
    
    // function to get color for stat bars based on how good/bad the value is
    getColorForStat(stat, value) {
        // return different colors based on stat value ranges
        if (value > 75) return "#4CAF50";  // green - good (75-100)
        if (value > 50) return "#FFC107";  // yellow - okay (50-75)
        if (value > 25) return "#FF9800";  // orange - warning (25-50)
        return "#F44336";                  // red - critical (0-25)
    }
    
    // function to convert stat names to proper display format
    formatStatName(stat) {
        // object mapping internal names to display names
        const names = {
            hunger: "Hunger",
            happiness: "Happiness", 
            energy: "Energy",
            cleanliness: "Cleanliness"
        };
        // return display name, or capitalize first letter if not found
        return names[stat] || stat.charAt(0).toUpperCase() + stat.slice(1);
    }
    
    // function to update the activity log display with recent pet activities
    updateActivityLog() {
        // select the activity log container in the html
        const activityLog = d3.select("#activity-log");
        
        // clear out old activity items
        activityLog.html("");
        
        // get current activity log from pet and add each item to display
        this.pet.getActivityLog().forEach(activity => {
            activityLog.append("div")           // create new div for each activity
                .attr("class", "activity-item") // css class for styling
                .text(activity);                // set text content (like "3:45 PM: You fed your pet!")
        });
    }
}