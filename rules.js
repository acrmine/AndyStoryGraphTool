class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
        this.engine.pullupInit('inventory', 'inventoryList', 'toggleInventory', this.engine.inventory);
        this.engine.pullupInit('history', 'historyList', 'toggleHistory', this.engine.history);
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body); 

        if(locationData.keyedBodies)
        {
            for(let text of locationData.keyedBodies)
            {
                if(this.engine.inventory.indexOf(text.item) != -1)
                {
                    this.engine.show(text.Body);
                }
            }
        }
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }

        if(locationData.keyedChoices)
        {
            for(let choice of locationData.keyedChoices)
            {
                if(this.engine.inventory.indexOf(choice.item) != -1)
                {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        }

        if(locationData.Items)
        {
            for(let items of locationData.Items)
                {
                    if(this.engine.inventory.indexOf(items.item) == -1)
                    {
                        this.engine.addItemPickup(items.Action, items);
                    }
                }
        }
    }

    handleChoice(choice) {
        this.clearOutput();

        if(choice) {
            this.engine.show("> "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    clearOutput()
    {
        while(this.engine.output.firstChild)
        {
            this.engine.output.removeChild(this.engine.output.firstChild);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');