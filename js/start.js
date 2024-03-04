const variables = ["imageFile", "realSheetLength", "realSheetWidth", "realGridSize"];

document.addEventListener("DOMContentLoaded", function () {


    variables.forEach(name => {
        console.log(`button_${name}`);

        document.getElementById(`button_${name}`).onclick = () => {
            const value = document.getElementById(`input_${name}`).value;
            document.getElementById(`text_${name}`).textContent = value;
        };
    });

    document.getElementById("buttonCreateProject").onclick = () => {
        var projectExport = {

            newProject: true,

            imageFile: document.getElementById("text_imageFile").textContent,
            realSheetLength: parseInt(document.getElementById("text_realSheetLength").textContent),
            realSheetWidth: parseInt(document.getElementById("text_realSheetWidth").textContent),
            realGridSize: parseInt(document.getElementById("text_realGridSize").textContent)
        }
        console.log(projectExport);

        projectExport = JSON.stringify(projectExport);
        const blob = new Blob([projectExport], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "project.json";
        link.click();

    };
});