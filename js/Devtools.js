export var globalVerboseLevel = 2;
export function changeGlobalVerboseLevel(direction) {
    if (direction === "+") globalVerboseLevel += 1;
    else if (direction === "-") globalVerboseLevel -= 1;
    console.log("globalVerboseLevel = ", globalVerboseLevel);
}
export function printObjectcount() {
    console.log(paper.project.getItems({}).length, "objects in the project.");
}