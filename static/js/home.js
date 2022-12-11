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
    if (!sequence || sequence.value.length == 0) return;

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

function currentRunsToggleEvent() {
    var current_runs_toggle = document.getElementById("current-runs-button");
    var text = current_runs_toggle.innerText;
    if (text == 'Show') {
        current_runs_toggle.innerText = 'Hide';
    }
    else {
        current_runs_toggle.innerText = 'Show';
    }
}


function resetInformCompleted(){
    window.inform_user_completed_runs = [];
}

function createHistorySection(previous_runs, current_runs){
    var historySection = document.querySelector("#history-container");
    var currentSection = document.querySelector("#current-runs-container");
    var previousSection = document.querySelector("#previous-runs-container");

    if(currentSection.childElementCount == 0 && previousSection.childElementCount == 0){
        // reveal whole overview card
        document.querySelector("#overview").style.display = null;
        // add History title above tables
        var labelDiv = document.createElement("div");
        labelDiv.setAttribute("id", "history-title");
        var label = document.createElement("u");
        label.setAttribute("class", "card-tab col-2 text-center");
        label.innerText = "History"
        labelDiv.appendChild(label);

        historySection.insertBefore(labelDiv, historySection.firstChild);
    }

    if(currentSection.childElementCount == 0 && current_runs.length > 0){
        // create current section
        createCurrentRunsSection(current_runs);
    }

    if(previousSection.childElementCount == 0 && previous_runs.length > 0){
        // create previous section
        createPreviousRunsSection(previous_runs);
    }
}

function createCurrentRunsSection(current_runs){
    var currentSection = document.querySelector("#current-runs-container");

    var upperDiv = document.createElement("div");
    upperDiv.setAttribute("class", "d-flex justify-content-between");
    var titleDiv = document.createElement("div");
    titleDiv.innerText = "Current Runs";
    var hideAnchor = document.createElement("a");
    hideAnchor.setAttribute("data-bs-toggle", "collapse");
    hideAnchor.setAttribute("href", "#current-runs");
    hideAnchor.setAttribute("role", "button");
    hideAnchor.setAttribute("aria-expanded", "true");
    hideAnchor.setAttribute("aria-controls", "current-runs");
    hideAnchor.setAttribute("id", "current-runs-button");
    hideAnchor.innerText = "Hide";
    upperDiv.appendChild(titleDiv);
    upperDiv.appendChild(hideAnchor);

    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("class", "table-responsive collapse show");
    tableDiv.setAttribute("id", "current-runs");
    var table = document.createElement("table");
    table.setAttribute("class", "table table-hover table-bordered table-sm");
    table.setAttribute("id", "current-runs-table");
    table.setAttribute("data-height", "240");
    tableDiv.appendChild(table);
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);
    var th = document.createElement("th");
    th.setAttribute("data-field", "id");
    th.innerText = "ID";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "sequence");
    th.innerText = "Sequence";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "submitted");
    th.innerText = "Submitted";
    tr.appendChild(th);

    currentSection.appendChild(upperDiv);
    currentSection.appendChild(tableDiv);

    var current_runs_toggle = document.getElementById("current-runs-button");
    current_runs_toggle.addEventListener("click", currentRunsToggleEvent);

    // populate table
    if(current_runs){
        var $table = $('#current-runs-table');
        $table.bootstrapTable({data: current_runs})
    }
}


function createPreviousRunsSection(previous_runs){
    var previousSection = document.querySelector("#previous-runs-container");

    var upperDiv = document.createElement("div");
    upperDiv.setAttribute("class", "d-flex justify-content-between");
    var titleDiv = document.createElement("div");
    titleDiv.innerText = "Previous Runs";
    var hideAnchor = document.createElement("a");
    hideAnchor.setAttribute("data-bs-toggle", "collapse");
    hideAnchor.setAttribute("href", "#previous-runs");
    hideAnchor.setAttribute("role", "button");
    hideAnchor.setAttribute("aria-expanded", "true");
    hideAnchor.setAttribute("aria-controls", "previous-runs");
    hideAnchor.setAttribute("id", "previous-runs-button");
    hideAnchor.innerText = "Hide";
    upperDiv.appendChild(titleDiv);
    upperDiv.appendChild(hideAnchor);

    var tableDiv = document.createElement("div");
    tableDiv.setAttribute("class", "table-responsive collapse show");
    tableDiv.setAttribute("id", "previous-runs");
    var toolbarDiv = document.createElement("div");
    toolbarDiv.setAttribute("id", "toolbar");
    tableDiv.appendChild(toolbarDiv);
    var table = document.createElement("table");
    table.setAttribute("class", "table table-hover table-bordered table-sm");
    table.setAttribute("id", "previous-runs-table");
    table.setAttribute("data-toggle", "previous-runs-table");
    table.setAttribute("data-pagination", "true");
    table.setAttribute("data-page-list", "[10, 25, 50, 100, 200, All]");
    table.setAttribute("data-detail-view", "true");
    table.setAttribute("data-detail-view-icon", "false");
    table.setAttribute("data-detail-formatter", "detailFormatter");
    table.setAttribute("data-buttons-prefix", "btn-sm btn");
    table.setAttribute("data-show-columns", "true");
    table.setAttribute("data-buttons-class", "danger");
    table.setAttribute("data-icon-size", "sm");
    table.setAttribute("data-height", "460");
    table.setAttribute("data-toolbar", "#toolbar");
    table.setAttribute("data-search", "true");
    table.setAttribute("data-search-highlight", "true");
    table.setAttribute("data-search-align", "left");
    table.setAttribute("data-sort-name", "completed");
    table.setAttribute("data-sort-order", "desc");
    table.setAttribute("data-header-style", "headerStyle");
    tableDiv.appendChild(table);
    var thead = document.createElement("thead");
    table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);
    var th = document.createElement("th");
    th.setAttribute("data-field", "id");
    th.setAttribute("data-sortable", "true");
    th.innerText = "ID";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "sequence");
    th.setAttribute("class", "text-truncate");
    th.setAttribute("data-sortable", "true");
    th.innerText = "Sequence";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "structure");
    th.setAttribute("class", "text-truncate");
    th.setAttribute("data-sortable", "true");
    th.innerText = "Structure";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "submitted");
    th.setAttribute("data-sortable", "true");
    th.innerText = "Submitted";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "completed");
    th.setAttribute("data-sortable", "true");
    th.innerText = "Completed";
    tr.appendChild(th);
    var th = document.createElement("th");
    th.setAttribute("data-field", "operate");
    th.setAttribute("data-formatter", "operateFormatter");
    th.setAttribute("data-events", "operateEvents");
    th.innerText = "Actions";
    tr.appendChild(th);

    previousSection.appendChild(upperDiv);
    previousSection.appendChild(tableDiv);

    var previous_runs_toggle = document.getElementById("previous-runs-button");
    previous_runs_toggle.addEventListener("click", previousRunsToggleEvent);

    // populate table
    if(previous_runs){
        var $table = $('#previous-runs-table');
        $table.bootstrapTable({data: previous_runs})
    }
}

function triggerPopUp(message, completed_runs=[]){
    var modal_options = document.querySelector("#modal-options");
    if(completed_runs.length == 0){
        // make modal default size, so that the text is not very spacious
        if(modal_options.classList.contains('modal-lg')){
            modal_options.classList.remove('modal-lg');
        }

        var html = "<p>"+message+"</p>";
    }else{
        // make modal large, so that the table can fit
        if(!modal_options.classList.contains('modal-lg')){
            modal_options.classList.add('modal-lg');
        }

        var tds = ""
        completed_runs.forEach(obj => {
            tds += '<tr><td>'+obj.id+'</td><td>'+obj.sequence+'</td><td><a href="results/?id='+obj.id+'"<i class="bi bi-box-arrow-in-up-right"></i></td></tr>';
        });
        var html =  '<span>The following runs have been completed:</span>' +
                    '<table class="table table-sm" style="border: 1px solid #ffd199;">' +
                        '<thead>' +
                            '<tr>' +
                                '<th>ID</th>' +
                                '<th>Sequence</th>' +
                                '<th>View Result</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                            tds +
                        '</tbody>' +
                    '</table>';
    }
    document.querySelector('#submit-modal-text').innerHTML = html;
    $('#submitModal').modal('show');
}

function extract_ids(array){
    var ids = [];
    if(Array.isArray(array)){
        array.forEach((obj) => {
            if(obj.hasOwnProperty('id'))
            ids.push(obj['id']);
        });
    }
    return ids;
}

function areArraysEqual(a, b){
    if(a.length != b.length){
        return false;
    }
    return a.every((elem) => b.includes(elem));
}

function startPolling(){
    if(!window.intervalReference){
        window.intervalReference = setInterval(polling, 1000);
    }
}

function stopPolling(){
    clearInterval(window.intervalReference);
    window.intervalReference = null;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/** Check if any current run is finished, trigger popup and update relevant tables */
function polling(){
    console.log('polling...');
    // Request update for new current runs and previous runs after run specified by window.latest_history
    var url = 'update_history/';
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'X-CSRFToken': token,
        },
        body: JSON.stringify({'latest_history_id': window.latest_history_id})
    })
    .then((response) => response.json())
    .then((data) => {
        // polling data parsing
        // ====================
        var $current_table = $('#current-runs-table');
        var $previous_table = $('#previous-runs-table');
        // 1. check previous runs,
        //    determine if they already exist in table and
        //    add new to a list for updating after showing the pop up
        var previous_runs = data['previous_runs'];
        var update_previous_runs_table = []
        previous_runs.forEach(run =>{
            // check in previous table if run already exists
            id = run['id'];
            if(!window.previous_runs_ids.has(id)){
                update_previous_runs_table.push(run);
            }
        });
        // 2. stop polling when there are no other current runs
        var current_runs = data['current_runs'];
        if(current_runs.length == 0 ){
            // terminate polling
            stopPolling();
        }else{
            if($current_table.length == 0){
                //  create current section
                createHistorySection([], current_runs);
            } else {
                // update current table with new current runs
                var current_table_data = $current_table.bootstrapTable('getData');
                var replace = !areArraysEqual(extract_ids(current_table_data), extract_ids(current_runs));
                if(replace){
                    $current_table.bootstrapTable('load', current_runs);
                    window.current_runs = current_runs;
                }
            }
        }
        if(update_previous_runs_table.length > 0){
            // 3. trigger pop up
            // Note: for pop up inform user purposes. So that we can inform dynamically the user if the modal is still open
            window.inform_user_completed_runs = window.inform_user_completed_runs.concat(update_previous_runs_table);
            triggerPopUp('', window.inform_user_completed_runs);

            // 4. update previous table
            if ($previous_table.length == 0){
                createHistorySection(update_previous_runs_table, []);
            }else {
                $previous_table.bootstrapTable('append', update_previous_runs_table);
            }
            // add new previous entries ids to window.previous_runs_ids set
            extract_ids(update_previous_runs_table).forEach(item => window.previous_runs_ids.add(item));
            if(data['latest_history_id'] && data['latest_history_id'] != window.latest_history_id){
                window.latest_history_id = data['latest_history_id'];
            }
        }

        // 5. clean history section if no tables are left
        if(current_runs.length == 0 ){
            // remove whole current runs section
            var elem = document.querySelector('#current-runs-container');
            if(elem && elem.childElementCount > 0){
                removeAllChildNodes(elem);
                window.current_runs = [];
            }
        }

        // 6. trigger guest history alert
        if(window.is_guest_user && data.hasOwnProperty('notify_guest_user') && data['notify_guest_user']){
            triggerGuestHistoryAlert();
        }
    });
}

function triggerGuestHistoryAlert() {
    var alert = document.querySelector('#guest-history-alert');
    alert.classList.replace('collapse', 'show');
}

function submitFunction() {
    var form = document.querySelector('form');
    var formData = new FormData(form);
    fetch('results/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if(data.hasOwnProperty('success') && data['success']){
            // document.querySelector('#submit-modal-text').innerText = 'Your request has been submitted for prediction.';
            var message = 'Your request has been submitted for prediction.';
            triggerPopUp(message);
            startPolling();
        }else {
            // document.querySelector('#submit-modal-text').innerText = 'Something when wrong...';
            var message = 'Something when wrong...';
            triggerPopUp(message);
        }
        $('#submitModal').modal('show');
    })
    .catch((error) => {
        console.error('Error:', error);
        document.querySelector('#submit-modal-text').innerText = 'Something when wrong...'
        $('#submitModal').modal('show');
    });
}

window.addEventListener('load', function() {
    console.log('All assets are loaded')
    // var maxWindowSize = document.getElementById("max-window-size");
    // maxWindowSize.addEventListener("change", correctWindowSize);
    // var minWindowSize = document.getElementById("min-window-size");
    // minWindowSize.addEventListener("change", correctWindowSize);

    window.intervalReference = null;
    window.inform_user_completed_runs = [];

    // var sequence = document.getElementById("RNA-sequence");
    // sequence.addEventListener("focusout", correctWindowSize);

    if (window.previous_runs.length > 0) {
        // register show/hide button
        var previous_runs_toggle = document.getElementById("previous-runs-button");
        previous_runs_toggle.addEventListener("click", previousRunsToggleEvent);

        // initialize table
        var $table = $('#previous-runs-table');
        $table.bootstrapTable({data: window.previous_runs});
        delete window.previous_runs;
    }
    if (window.current_runs.length > 0) {
        // register show/hide button
        var current_runs_toggle = document.getElementById("current-runs-button");
        current_runs_toggle.addEventListener("click", currentRunsToggleEvent);

        // initialize table
        var $table = $('#current-runs-table');
        $table.bootstrapTable({data: window.current_runs})
        delete window.current_runs;

        // enable polling for current run completion
        startPolling();
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})


function deleteHistoryEntry(){
    $('#delete-history-entry-modal').modal('hide');
    if(!window.history_entry_id){
        return
    }
    const row_id = window.history_entry_id;

    var $table = $('#previous-runs-table');
    $table.bootstrapTable('showLoading');
    // delete entry on server
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var url = window.location.protocol + "//" + window.location.host + '/delete_run/';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify({'run_id':row_id})
    })
    .then(response => response.json())
    .then(data => {
        if(!data['success']){
            // error handling
            triggerPopUp('Run could not be deleted. <i class="bi bi-emoji-frown text-danger"></i>');
            $table.bootstrapTable('hideLoading');
            return;
        }
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row_id]
        });
        // remove element from window.previous_runs_ids and update window.latest_history_id
        window.previous_runs_ids.delete(row_id);
        var previous_runs = $table.bootstrapTable('getData');
        if(previous_runs.length == 0){ // no more previous runs left on the table
            window.latest_history_id = "";

            var current_runs_table = document.querySelector('#current-runs-table');
            if(!current_runs_table){ // no current nor previous runs left to display. Remove history section
                var historyTitle = document.querySelector("#history-title");
                historyTitle.remove();
                var previous_runs_container = document.querySelector('#previous-runs-container');
                removeAllChildNodes(previous_runs_container);
                var current_runs_container = document.querySelector('#current-runs-container');
                removeAllChildNodes(current_runs_container);
                // hide whole overview card
                document.querySelector("#overview").style.display = "none";
            } else{ // remove just the previous runs section
                var previous_runs_container = document.querySelector('#previous-runs-container');
                removeAllChildNodes(previous_runs_container);
            }
        }else {
            if(window.latest_history_id == row_id){ // latest_history_id needs updating
                // find latest completed
                var latest_id = previous_runs.at(0)["id"];
                var latest_completed = previous_runs.at(0)["completed"];
                previous_runs.forEach(obj => {
                    if(obj.completed > latest_completed){
                        latest_completed = obj.completed;
                        latest_id = obj.id;
                    }
                });
                window.latest_history_id = latest_id;
            }
            $table.bootstrapTable('hideLoading');
        }
        delete window.history_entry_id
    });
}