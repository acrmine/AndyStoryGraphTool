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
        
        if(locationData.Choices) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }

        this.addKeyedElements(locationData);
        this.addItems(locationData);
    }

    addKeyedElements(locationData)
    {
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
    }

    addItems(locationData)
    {
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
            if(this.engine.storyData.Locations[choice.Target].Goal)
            {
                this.engine.gotoScene(Numpad, choice.Target);
            } else
            {
                this.engine.gotoScene(Location, choice.Target);
            }
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

class Numpad extends Location
{
    create(key)
    {
        this.numpadData = this.engine.storyData.Locations[key];
        this.engine.show(this.numpadData.Body);
        this.currentAnswer = "";
        this.answerElements = 0;

        let display = document.createElement("div");
        display.innerHTML = "> ";
        display.style.paddingBottom = '20px';
        this.engine.output.appendChild(display);

        if(this.numpadData.Leave)
        {
            this.handleLeave(this.numpadData.Leave.Text, this.numpadData.Leave.Target);
        }
        if(this.numpadData.Buttons)
        {
            for(let btn of this.numpadData.Buttons)
            {
                this.engine.addNumPadBtn(btn, display);
            }
        }
        this.engine.addNumPadBtn(this.numpadData.EnterButton, display);
    }

    handleChoice(button, display)
    {
        if(button)
        {
            if(button.innerText == this.numpadData.EnterButton.Label)
            {
                while(this.engine.actionsContainer.firstChild) {
                    this.engine.actionsContainer.removeChild(this.engine.actionsContainer.firstChild)
                }
                this.engine.history.push(display.innerHTML);
                this.clearOutput();
                if(this.currentAnswer == this.numpadData.Goal)
                {
                    this.engine.show("> "+this.numpadData.Success.Text);
                    if(this.engine.storyData.Locations[this.numpadData.Success.Target].Goal)
                    {
                        this.engine.gotoScene(Numpad, this.numpadData.Success.Target);
                    } else
                    {
                        this.engine.gotoScene(Location, this.numpadData.Success.Target);
                    }
                } else
                {
                    this.engine.show("> "+this.numpadData.Failure.Text);
                    if(this.engine.storyData.Locations[this.numpadData.Failure.Target].Goal)
                    {
                        this.engine.gotoScene(Numpad, this.numpadData.Failure.Target);
                    } else
                    {
                        this.engine.gotoScene(Location, this.numpadData.Failure.Target);
                    }
                }
            } else if(this.numpadData.InputLength != this.answerElements)
            {
                if(this.currentAnswer == "")
                {
                    display.innerHTML = display.innerHTML + "First " + button.innerText;
                    this.currentAnswer = this.currentAnswer + button.innerText;
                } else
                {
                    display.innerHTML = display.innerHTML + " then " + button.innerText;
                    this.currentAnswer = this.currentAnswer + button.innerText;
                }
            }
        }
    }

    handleLeave(text, target)
    {
        let leaveButton = this.engine.actionsContainer.appendChild(document.createElement("button"));
        leaveButton.innerText = text;
        leaveButton.onclick = () => {
            while(this.engine.actionsContainer.firstChild) {
                this.engine.actionsContainer.removeChild(this.engine.actionsContainer.firstChild)
            }
            this.clearOutput();
            this.engine.show("> "+text);
            if(this.engine.storyData.Locations[target].Goal)
            {
                this.engine.gotoScene(Numpad, target);
            } else
            {
                this.engine.gotoScene(Location, target);
            }
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