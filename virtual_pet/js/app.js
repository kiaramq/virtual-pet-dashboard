class VirtualPetApp {
    constructor() {
        // create a new virtual pet
        this.pet = new VirtualPet();
        
        // create the dashboard and give it the containers and pet
        // "#stats-container" is where stats bars go
        // "#pet-container" is where dog sprite and emotes go
        this.dashboard = new Dashboard("#stats-container", "#pet-container", this.pet);
        
        // set up all the button click handlers
        this.initializeEventListeners();
        
        // start the game loop that updates stats over time
        this.startGameLoop();
        
        // update the display right away when app starts
        this.updateDisplay();
    }
    
    // this function sets up what happens when user clicks buttons
    initializeEventListeners() {
        // regular click events for desktop/laptop users
        
        // when feed button is clicked
        document.getElementById('feed-btn').addEventListener('click', () => {
            // try to feed the pet
            if (this.pet.feed()) {
                // if feeding worked, show talking emote and trigger 3D feeding animation
                this.dashboard.showTemporaryEmote("assets/Emotes/left/talkingEmote.png", 1500, 'feed');
            }
            // update the display to show new stats
            this.updateDisplay();
        });
        
        // when play button is clicked
        document.getElementById('play-btn').addEventListener('click', () => {
            // try to play with pet
            if (this.pet.play()) {
                // if playing worked, show happy emote and trigger 3D playing animation
                this.dashboard.showTemporaryEmote("assets/Emotes/left/happyEmote.png", 1500, 'play');
            }
            this.updateDisplay();
        });
        
        // when clean button is clicked
        document.getElementById('clean-btn').addEventListener('click', () => {
            // try to clean the pet
            if (this.pet.clean()) {
                // if cleaning worked, show talking emote and trigger 3D cleaning animation
                this.dashboard.showTemporaryEmote("assets/Emotes/left/talkingEmote2.png", 1500, 'clean');
            }
            this.updateDisplay();
        });
        
        // when sleep button is clicked
        document.getElementById('sleep-btn').addEventListener('click', () => {
            // toggle sleep (always works)
            this.pet.sleep();
            // if pet is now sleeping, show sleepy emote for 2 seconds
            if (this.pet.isSleeping) {
                this.dashboard.showTemporaryEmote("assets/Emotes/left/boredEmote.png", 2000);
            }
            this.updateDisplay();
        });
        
        // touch events for mobile/tablet users 
        // e.preventDefault() stops the default touch behavior
        
        document.getElementById('feed-btn').addEventListener('touchstart', (e) => {
            e.preventDefault(); // prevent default touch behavior
            if (this.pet.feed()) {
                this.dashboard.showTemporaryEmote("assets/Emotes/left/talkingEmote.png", 1500, 'feed');
            }
            this.updateDisplay();
        });
        
        document.getElementById('play-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.pet.play()) {
                this.dashboard.showTemporaryEmote("assets/Emotes/left/happyEmote.png", 1500, 'play');
            }
            this.updateDisplay();
        });
        
        document.getElementById('clean-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.pet.clean()) {
                this.dashboard.showTemporaryEmote("assets/Emotes/left/talkingEmote2.png", 1500, 'clean');
            }
            this.updateDisplay();
        });
        
        document.getElementById('sleep-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.pet.sleep();
            if (this.pet.isSleeping) {
                this.dashboard.showTemporaryEmote("assets/Emotes/left/boredEmote.png", 2000);
            }
            this.updateDisplay();
        });
    }
    
    // function to refresh all the visual elements
    updateDisplay() {
        // tell dashboard to update stats bars and pet display
        this.dashboard.updateDashboard();
        // tell dashboard to update activity log
        this.dashboard.updateActivityLog();
    }
    
    // function to start the automatic game loop
    startGameLoop() {
        // setInterval runs a function repeatedly every X milliseconds
        // 10000 milliseconds = 10 seconds
        setInterval(() => {
            // make pet stats degrade over time
            this.pet.updateOverTime();
            // update display to show new stats
            this.updateDisplay();
        }, 10000); // repeat every 10 seconds
        
        // handle window resize for 3D canvas
        window.addEventListener('resize', () => {
            if (this.dashboard && this.dashboard.pet3D) {
                this.dashboard.pet3D.onWindowResize();
            }
        });
    }
}

// wait until webpage is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // create and start the app
    new VirtualPetApp();
});