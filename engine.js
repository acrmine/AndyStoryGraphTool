class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;
        this.topZInd = 0;
        this.history = [];
        this.inventory = ["test item 1", "test item 2"];

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
        this.history.push(msg);
    }

    pullupInit(pullupId, pullupListId, buttonId, pullupArray)
    {
        const arrayContainer = document.getElementById(pullupId); //inventory
        const toggleButton = document.getElementById(buttonId); //toggleInventory

        toggleButton.addEventListener('click', () => 
        {
            const isVisible = arrayContainer.classList.toggle('show');
            if (isVisible) {
                arrayContainer.style.zIndex = this.topZInd + 1;
                this.topZInd++;
                this.renderPullup(pullupListId, pullupArray);
            }
        });
    }

    renderPullup(pullupListId, pullupArray) 
    {
        const arrayList = document.getElementById(pullupListId); //inventoryList

        arrayList.innerHTML = '';
        for(const item of pullupArray)
        {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            arrayList.appendChild(listItem);
        }
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}