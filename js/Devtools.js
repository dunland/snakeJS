export var globalVerboseLevel = 2;
export function changeGlobalVerboseLevel(direction) {
    if (direction === "+") globalVerboseLevel += 1;
    else if (direction === "-") globalVerboseLevel -= 1;
    console.log("globalVerboseLevel = ", globalVerboseLevel);
}

export function printObjectcount() {
    console.log(paper.project.getItems({}).length, "objects in the project.");
}

export class Devtools{

    static logs = [];
    static log(message){
        this.logs.push(message);
        document.querySelector('#consoleLog').textContent = message;
        console.log(message);
    }
}