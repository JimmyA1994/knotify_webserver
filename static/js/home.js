function sendInput(){
    var input = document.getElementById("RNA-sequence").value;
    if(input){
        // send request
        const request = new XMLHttpRequest();
        request.open("GET", "results/");
        request.send();
        request.onreadystatechange = (e)=>{console.log(request.responseText)}
    }
    console.log("input: ", input);
    console.log('sent!!!');
}

function correctWindowSize(){
    // window size should not exceed sequence's length.
    // Enforce this on window-size change.
    console.log('correcting..');
    var sequence = document.getElementById("RNA-sequence");
    if (!sequence) return;

    var N = sequence.value.length;
    var maxWindowSize = document.getElementById("max-window-size");
    if (maxWindowSize.valueAsNumber > N) maxWindowSize.value = N;
    var minWindowSize = document.getElementById("min-window-size");
    if (minWindowSize.valueAsNumber > N) minWindowSize.value = N;
}

function previousRunsToggleEvent() {
    var previous_runs_toggle = document.getElementById("previous-runs-button");
    var text = previous_runs_toggle.innerText;
    if (text == 'Show') {
        previous_runs_toggle.innerText = 'Hide';
    }
    else {
        previous_runs_toggle.innerText = 'Show';
    }
}

window.addEventListener('load', function() {
    console.log('All assets are loaded')
    var maxWindowSize = document.getElementById("max-window-size");
    maxWindowSize.addEventListener("change", correctWindowSize);
    var minWindowSize = document.getElementById("min-window-size");
    minWindowSize.addEventListener("change", correctWindowSize);

    var sequence = document.getElementById("RNA-sequence");
    sequence.addEventListener("focusout", correctWindowSize);

    var previous_runs_toggle = document.getElementById("previous-runs-button");
    previous_runs_toggle.addEventListener("click", previousRunsToggleEvent);
})