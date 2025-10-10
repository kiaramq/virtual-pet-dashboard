// virtualPet class to manage pet stats and actions
class VirtualPet {
    // constructor runs when we create a new pet
    constructor() {
        // these are the pet's main stats, all start at 50 
        this.stats = {
            hunger: 50,        // how hungry the pet is (higher = more hungry)
            happiness: 50,     // how happy the pet is
            energy: 50,        // how much energy the pet has
            cleanliness: 50    // how clean the pet is
        };
        
        // limits for stats
        this.maxStats = 100;   
        this.minStats = 0;     
        
        // array to store what the pet has been doing
        this.activityLog = [];
        
        // boolean to track if pet is sleeping
        this.isSleeping = false;
        
        // add first message to activity log
        this.logActivity("Your virtual pet has been created!");
    }
    
    // this function updates any stat and makes sure it stays between 0-100
    updateStat(stat, value) {
        // math.max makes sure it's not less than 0
        // math.min makes sure it's not more than 100
        // add the value to current stat
        this.stats[stat] = Math.max(this.minStats, Math.min(this.maxStats, this.stats[stat] + value));
    }
    
    // function that runs when user clicks feed button
    feed() {
        // check if pet is sleeping - can't feed sleeping pet
        if (this.isSleeping) {
            this.logActivity("Pet is sleeping... Zzz");
            return false; // return false means action failed
        }
        
        // feeding reduces hunger but uses a bit of energy
        this.updateStat('hunger', 20);    // increase hunger by 20
        this.updateStat('energy', -5);    // reduce energy by 5 (eating is tiring)
        this.logActivity("You fed your pet! Hunger decreased.");
        return true;
    }
    
    // function that runs when user clicks play button
    play() {
        // check if pet is sleeping - can't play with sleeping pet
        if (this.isSleeping) {
            this.logActivity("Pet is sleeping... Zzz");
            return false;
        }
        
        // playing makes pet happy but uses energy and makes them hungry
        this.updateStat('happiness', 15); // increase happiness by 15
        this.updateStat('energy', -10);   // playing is tiring
        this.updateStat('hunger', -5);    // playing makes them hungry
        this.logActivity("You played with your pet! Happiness increased.");
        return true;
    }
    
    // function that runs when user clicks clean button
    clean() {
        // check if pet is sleeping - can't clean sleeping pet
        if (this.isSleeping) {
            this.logActivity("Pet is sleeping... Zzz");
            return false;
        }
        
        // cleaning makes pet cleaner and a bit happier
        this.updateStat('cleanliness', 25); // increase cleanliness by 25
        this.updateStat('happiness', 5);    // pets like being clean
        this.logActivity("You cleaned your pet! Cleanliness increased.");
        return true;
    }
    
    // function that runs when user clicks sleep button
    sleep() {
        // toggle sleep state (if sleeping, wake up; if awake, sleep)
        this.isSleeping = !this.isSleeping;
        
        if (this.isSleeping) {
            // pet is going to sleep
            this.logActivity("Your pet went to sleep... Zzz");
        } else {
            // pet is waking up - restore some energy
            this.updateStat('energy', 30); // sleeping restores energy
            this.logActivity("Your pet woke up! Energy restored.");
        }
        
        return true;
    }
    
    // function to add new activities to the log with timestamp
    logActivity(message) {
        // get current time as string (like "3:45:22 PM")
        const timestamp = new Date().toLocaleTimeString();
        
        // add new activity to beginning of array with timestamp
        this.activityLog.unshift(`${timestamp}: ${message}`);
        
        // keep only the 10 most recent activities (remove old ones)
        if (this.activityLog.length > 10) {
            this.activityLog.pop(); // remove last (oldest) item
        }
    }
    
    // function to get a copy of current stats (not the original)
    getStats() {
        // ...this.stats creates a copy so external code can't mess with original
        return {...this.stats};
    }
    
    // function to get a copy of activity log
    getActivityLog() {
        // [...this.activityLog] creates a copy of the array
        return [...this.activityLog];
    }
    
    // function that runs automatically every 10 seconds to make stats change over time
    updateOverTime() {
        // only degrade stats if pet is awake
        if (!this.isSleeping) {
            // all stats slowly get worse over time (like real pets need care)
            this.updateStat('hunger', -1);      // gets hungrier
            this.updateStat('happiness', -1);   // gets less happy
            this.updateStat('energy', -1);      // gets more tired
            this.updateStat('cleanliness', -1); // gets dirtier
        } else {
            // while sleeping, energy slowly recovers
            this.updateStat('energy', 2);
        }
    }
}