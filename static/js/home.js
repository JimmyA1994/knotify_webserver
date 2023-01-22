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

function clearInput() {
    // reset textarea
    const textarea = document.getElementById("RNA-sequence");
    textarea.value = "";
    textarea.classList.remove('is-invalid');

    // reset file input
    clearFileInput();

    // remove error alert
    const input_error_alert = document.getElementById("input-error-alert");
    input_error_alert.classList.add('d-none');

    // reset pseudoknot options
    const yaep = document.getElementById("yaep");
    yaep.checked = true;

    const allow_ug = document.getElementById("allow-ug");
    allow_ug.checked = false;

    const max_dd_size = document.getElementById("max-dd-size");
    max_dd_size.value = "2";

    const min_dd_size = document.getElementById("min-dd-size");
    min_dd_size.value = "0";

    const max_stem_allow_smaller = document.getElementById("max-stem-allow-smaller");
    max_stem_allow_smaller.value = "2";

    // reset hairpin options
    const hairpin_allow_ug = document.getElementById("hairpin-allow-ug");
    hairpin_allow_ug.checked = false;

    const min_hairpin_size = document.getElementById("min-hairpin-size");
    min_hairpin_size.value = "3";

    const min_hairpin_stems = document.getElementById("min-hairpin-stems");
    min_hairpin_stems.value = "3";

    const max_hairpins_per_loop = document.getElementById("max-hairpins-per-loop");
    max_hairpins_per_loop.value = "1";

    const max_hairpin_bulge = document.getElementById("max-hairpin-bulge");
    max_hairpin_bulge.value = "0";

    // reset energy options
    const vienna = document.getElementById("vienna");
    vienna.checked = true;
}

function clearFileInput() {
    const file_input = document.querySelector("#formFile");
    file_input.value = null;
    file_input.classList.remove('is-invalid');
}

function show_textarea_invalid_error() {
    const textarea = document.getElementById("RNA-sequence");
    textarea.classList.add('is-invalid');
}

function show_fileinput_invalid_error() {
    const fileinput = document.getElementById("formFile");
    fileinput.classList.add('is-invalid');
}

function display_input_error_alert(msgs) {
    /**
     * Triggers the error alert when the prediction input provided is invalid.
     * Returns null and expects an array of messages.
     * */
    if (msgs.length == 0) {
        return;
    }
    // pass the messages
    const input_error_list = document.getElementById("input-error-list");
    var innerHTML = "";
    msgs.forEach(msg => {
        innerHTML += "<li>"+msg+"</li>";
    });
    input_error_list.innerHTML = innerHTML;

    // display alert
    const input_error_alert = document.getElementById("input-error-alert");
    input_error_alert.classList.remove('d-none');
}

function validate_fasta(txt) {
    /**
    Return true and the sequences if txt is a valid fasta formatted text, else returns false and error messages.
     */
    if (!txt) { return false;}

    // split on newlines, remove space around, filter out empty strings or fasta comments
	var lines = txt.split('\n').map(str => str.trim()).filter(str => str);
    // find where sequences start
    sequence_indexes = [];
    for (var i=0; i<lines.length;i++) {
        var line = lines[i]
        if (line[0] == '>'){
            sequence_indexes.push(i);
        }
    }

    var sequences = [];
    const allowed_sequence_chars = new Set(['a', 'A', 'c', 'C', 'g', 'G', 'u', 'U']);
    if (sequence_indexes.length == 0) {
        // check if it is plain sequence separated by newlines
        const sequence_candidate = lines.join("");
        const characters = new Set(sequence_candidate);
        var unexpected_chars = [];
        characters.forEach(char => {
            if (!allowed_sequence_chars.has(char)){
                unexpected_chars.push(char)
            }
        });
        if (unexpected_chars.length > 0){
            var msg = "There were characters on your input that weren't recognized (e.g. \'" +
                      unexpected_chars.slice(0,3).join("\', \'") +
                      "\'). Try submitting sequences consisting only of 'A', 'C', 'G', 'U' characters.";
            return {is_valid:false, error_msg:msg}
        }
        sequences.push({description:"", sequence: sequence_candidate});
    }
    else {
        for (var i=0; i<sequence_indexes.length; i++) {
            var cur_seq_index = sequence_indexes[i] + 1;
            var next_descr_index = (i+1<sequence_indexes.length) ? sequence_indexes[i+1] : lines.length;
            if (next_descr_index - cur_seq_index < 1) {
                // continuous FASTA descriptions without sequence in between
                var msg = "The FASTA formatted text provided lacks sequence.";
                return {is_valid:false, error_msg:msg}
            }
            var sequence = lines.slice(cur_seq_index, next_descr_index).join('');
            // check if sequence has unsupported characters
            var unexpected_chars = [];
            new Set(sequence).forEach(char => {
                if (!allowed_sequence_chars.has(char)){
                    unexpected_chars.push(char)
                }
            });
            if (unexpected_chars.length > 0){
                // var msg = "There were characters on your input that weren't recognized. Try submitting sequences consisting of A,C,G,U characters.";
                var msg = "There were characters on your input that weren't recognized (e.g. \'" +
                          unexpected_chars.slice(0,3).join("\', \'") +
                          "\'). Try submitting sequences consisting only of 'A', 'C', 'G', 'U' characters.";
                return {is_valid:false, error_msg:msg}
            }
            else {
                sequences.push({
                    description: lines[sequence_indexes[i]],
                    sequence: sequence
                })
            }
        }
    }

    return {is_valid: true, sequences: sequences}
}

function submitFunction() {
    /**
     * Validates inputs and sends them for processing.
     * Also, handles input error messages.
     * Note: if both text and file were given, we process both.
     * */

    // check if input was provided, otherwise throw error
    const textarea = document.getElementById("RNA-sequence");
    input_text = textarea.value.trim(); // remove spaces around main body
    const file_input = document.querySelector("#formFile");
    if (input_text == "" && file_input.value == "") {
        const msg = "No sequence or file was provided.";
        display_input_error_alert([msg]);
        show_textarea_invalid_error();
        return;
    }

    // Check if input is properly FASTA formatted.
    // We follow this simple fasta format documentation:
    // https://bioperl.org/formats/sequence_formats/FASTA_sequence_format
    var validation;
    if (input_text != ""){
        validation = validate_fasta(input_text);
        validation.display_error_function = show_textarea_invalid_error;
        if (validation.is_valid) {
            // clear previous error messages
            const input_error_alert = document.getElementById("input-error-alert");
            input_error_alert.classList.add('d-none');

            sendInput(validation.sequences);
        }else {
            // show error messages
            const msg = validation.error_msg
            display_input_error_alert([msg]);
            show_textarea_invalid_error();
            return;
        }
    }

    // check if file is FASTA formatted.
    if (file_input.value != "") {
        const file = file_input.files[0];
        const extension = file.name.split('.').pop()
        if (extension != 'fasta') {
            const msg = 'File uploaded does not have a .fasta extension.'
            display_input_error_alert([msg]);
            show_fileinput_invalid_error();
            return;
        }

        file.text().then((text) => {
            validation = validate_fasta(text);
            if (validation.is_valid) {
                // clear previous error messages
                const input_error_alert = document.getElementById("input-error-alert");
                input_error_alert.classList.add('d-none');

                sendInput(validation.sequences);
            }else {
                // show error messages
                const msg = validation.error_msg
                display_input_error_alert([msg]);
                show_fileinput_invalid_error();
                return;
            }
        })
    }
}

function sendInput(sequences) {
    var form = document.querySelector('form');
    var formData = new FormData(form);
    const serialized_sequences = JSON.stringify(sequences)
    formData.delete('sequence');
    formData.set("input", serialized_sequences);

    fetch('results/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if(data.hasOwnProperty('success') && data['success']){
            var message = 'Your request has been submitted for prediction.';
            triggerPopUp(message);
            startPolling();
        }else {
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

function fillInExample(){
    clearInput();

    const textArea = document.querySelector('#RNA-sequence');
    textArea.value = "> Example Input\nAAAAAACUAAUAGAGGGGGGACUUAGCGCCCCCCAAACCGUAACCCC";
}