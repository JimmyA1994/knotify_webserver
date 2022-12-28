function init(){
    // Enable popover
    var popover = new bootstrap.Popover(document.querySelector('#copy-structure-btn'), {
        trigger: 'focus'
    })
    var popover = new bootstrap.Popover(document.querySelector('#copy-sequence-btn'), {
        trigger: 'focus'
    })

    window.sequence = document.querySelector('#sequence').textContent;
    window.structure = document.querySelector('#structure').textContent;
    window.id = document.querySelector('#run_id').textContent;
    window['input-size'] = window['sequence'].length
    window.displayNumbering = true;
    window.showNucleotideLabels = true;
    reportWindowSize();

    registerPresentationButtons();

    createChart();

    createArcDiagram();
}


function reportWindowSize() {
    var rootElem = document.querySelector('#root');
    // console.log('height: ', window.innerHeight);
    // console.log('width: ', window.innerWidth);
    // console.log('sequence width: ', rootElem.offsetWidth)
    const font = 15;
    const n = Math.floor(rootElem.offsetWidth / font)

    // results output root node
    root = document.querySelector('#root');
    // delete all existing nodes
    while(root.children.length > 0){
        root.children[0].remove();
    }

    var count = 1;
    for(i=0; i<=window['input-size']; i+=n){
        // create sequence line and append it
        var seq_count = document.createElement('div');
        seq_count.setAttribute("class", "counter results noselect")
        seq_count.innerHTML = count + "> ";
        var seq_content = document.createElement('div');
        seq_content.setAttribute("class", "results");
        seq_content.setAttribute("id", "sequence" + (count > 1 ? '-'+count : ''));
        seq_content.innerHTML = window['sequence'].slice(i, i+n);

        seq_div = document.createElement('div');
        seq_div.setAttribute('class', 'responsive-line')
        seq_div.setAttribute('id', 'seq_div' + (count > 1 ? '-'+count : ''))

        seq_div.appendChild(seq_count);
        seq_div.appendChild(seq_content);
        root.appendChild(seq_div)

        // create structure line and append it
        var dot_count = document.createElement('div');
        dot_count.setAttribute("class", "counter results noselect")
        dot_count.innerHTML = count + "> ";
        var dot_content = document.createElement('div');
        dot_content.setAttribute("class", "results");
        dot_content.setAttribute("id", "structure" + (count > 1 ? '-'+count : ''))
        dot_content.innerHTML = window['structure'].slice(i, i+n);

        dot_div = document.createElement('div');
        dot_div.setAttribute('class', 'responsive-line')
        dot_div.setAttribute('id', 'dot_div' + (count > 1 ? '-'+count : ''))

        dot_div.appendChild(dot_count);
        dot_div.appendChild(dot_content);
        root.appendChild(dot_div)

        count++;
    }
}

function registerPresentationButtons(){
    // register numbering checkbox evenet listener
    document.getElementById("numberingCheckbox").checked = true;
    var numberingCheckbox = document.querySelector("#numberingCheckbox");
    numberingCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.displayNumbering = true;
        } else {
            window.displayNumbering = false;
        }
        clearChart();
        createChart();
    });

    // register node label checkbox evenet listener
    document.getElementById("nodeLabelCheckbox").checked = true;
    var nodeLabelCheckbox = document.querySelector("#nodeLabelCheckbox");
    nodeLabelCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.showNucleotideLabels = true;
        } else {
            window.showNucleotideLabels = false;
        }
        clearChart();
        createChart();
    });
}

function copySequence(){
    console.log('Sequence copied!');
    navigator.clipboard.writeText(window.sequence)
}

function copyStructure(){
    console.log('Structure copied!');
    navigator.clipboard.writeText(window.structure)
}

function unset_active_file_format_links() {
    const anchors = document.querySelectorAll("#file-format-anchors a");
    anchors.forEach(anchor => anchor.classList.remove('active'));
}

function selectVIENNA() {
    // unset all active links
    unset_active_file_format_links();

    // set vienna as active link
    const anchor = document.querySelector("#vienna-anchor");
    anchor.classList.add('active')

    const span = document.querySelector("#file-format-span");
    span.innerHTML = "VIENNA";

    const download_btn = document.querySelector("#download-output-btn");
    download_btn.onclick = downloadVIENNA;

}

function downloadVIENNA() {
    console.log('download VIENNA');
    var txt = "> " + window.id + "\n";
    txt += window.sequence + "\n" + window.structure;

    const fileData = new Blob([txt], {type: 'text/plain'});
    const textFileUrl = window.URL.createObjectURL(fileData);

    var downloadLink = document.createElement("a");
    downloadLink.href = textFileUrl;
    downloadLink.download = window.id + ".vienna"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function selectBPSEQ() {
    // unset all active links
    unset_active_file_format_links();

    // set BPSEQ as active link
    const anchor = document.querySelector("#bpseq-anchor");
    anchor.classList.add('active')

    const span = document.querySelector("#file-format-span");
    span.innerHTML = "BPSEQ";

    const download_btn = document.querySelector("#download-output-btn");
    download_btn.onclick = downloadBPSEQ;

}

function get_sequence_pairs(structure) {
    /**
     * Generate an array containing the links of an rna structure,
     * based on the dot bracket structure of the result.
     */
    var pairs = []
    var links_queue = []
    var pseudoknots_queue = []
    for (var i=0; i<structure.length; i++) {
        var pair = -1; // base case: nucleotide has no pair
        if (structure[i] == "[") {
            pseudoknots_queue.push(i);
        }
        else if (structure[i] == "]") {
            pair = pseudoknots_queue.pop();
            pairs[pair] = i;
        }
        else if (structure[i] == "(") {
            links_queue.push(i);
        }
        else if (structure[i] == ")") {
            pair = links_queue.pop();
            pairs[pair] = i;
        }
        else if (structure[i] == ".") {
            ; // should correspond to zero
        }
        else {
            console.error('get_sequence_pairs encountered unknown character: ' + structure[i]);
            return [];
        }
        pairs.push(pair)
    }

    // account for bpseq, ct indexing
    // starting from 1 not 0
    // also, all unpaired nucleotides have 0 value
    return pairs.map(x => x+1)
}

function downloadBPSEQ() {
    console.log('download BPSEQ');
    var txt = "";
    const length = window.sequence.length
    const bpseq_pairs = get_sequence_pairs(window.structure);
    for(var idx=0; idx<length; idx++) {
        txt += (idx+1).toString() + " " + window.sequence[idx] + " " + bpseq_pairs[idx] + "\n";
    }
    const fileData = new Blob([txt], {type: 'text/plain'});
    const textFileUrl = window.URL.createObjectURL(fileData);

    var downloadLink = document.createElement("a");
    downloadLink.href = textFileUrl;
    downloadLink.download = window.id + ".bpseq"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function selectCT() {
    // unset all active links
    unset_active_file_format_links();

    // set CT as active link
    const anchor = document.querySelector("#ct-anchor");
    anchor.classList.add('active')

    const span = document.querySelector("#file-format-span");
    span.innerHTML = "CT";

    const download_btn = document.querySelector("#download-output-btn");
    download_btn.onclick = downloadCT;

}

function downloadCT() {
    /**
     * Documentation of CT format can be found here:
     * http://nestedalign.lri.fr/infos.php
     */
    console.log('download CT');
    const pairs = get_sequence_pairs(window.structure);
    const length = window.structure.length;

    var txt = length + " " + window.id + '\n';
    for(var i=0; i<length; i++) {
        // format should be:
        // 1-based index | ith nucleotide | 5'-connecting base index (i-1) | 3' connecting base index (i+1) | paired base index | base index in the original sequence
        txt += (i+1).toString() + " " + window.sequence[i] + " " + i.toString() + " " + ((i+2)%(length+1)).toString() + " " + pairs[i] + " " + (i+1).toString() + "\n";
    }

    const fileData = new Blob([txt], {type: 'text/plain'});
    const textFileUrl = window.URL.createObjectURL(fileData);

    var downloadLink = document.createElement("a");
    downloadLink.href = textFileUrl;
    downloadLink.download = window.id + ".ct"
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function createChart(elementId='rna_ss') {
    var rna1 = {'structure': window.structure,
                'sequence': window.sequence,
    };

    // get presentation options
    var labelInterval, showNucleotideLabels;
    if(window.displayNumbering){
        labelInterval = 10;
    }
    else {
        labelInterval = false;
    }
    showNucleotideLabels = window.showNucleotideLabels;

    var chart = fornac.rnaPlot()
                .width(window.width)
                .height(window.height)
                .rnaLayout('simple')
                .namePosition('0 0')
                .labelInterval(labelInterval)
                .showNucleotideLabels(showNucleotideLabels);
    var svg = d3.select('#'+elementId)
                .selectAll('svg')
                .data([rna1])
                .enter()
                .append('div')
                .classed('svg-container', true)
                .append('svg')
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr('viewBox', "0 0 " + window.width + " " + window.height)
                .call(chart);

    // remember the size generated
    const node = d3.select('#'+elementId).node()
    if(!window.hasOwnProperty("naview_height") || !window.naview_height){
        // naview dimensions are used to determine arc diagram's size
        window.naview_height = node.offsetHeight;
        window.naview_width = node.offsetWidth;
    }

    return chart;
}

function clearChart(elementId='rna_ss') {
    var rootElem = document.querySelector('#'+elementId);
    while(rootElem.children.length > 0){
        rootElem.children[0].remove();
    }
}

async function getArcDiagram(){
    var cookie = document.cookie;
    var split = cookie.split("=");
    var token = split[1];
    var url = window.location.protocol + "//" + window.location.host + '/get_varna_arc_diagram/';
    var body = {
        'id': window.id,
        'sequence': window.sequence,
        'structure': window.structure,
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': token,
        },
        body: JSON.stringify(body)
    });
    return response.text();
}

function createArcDiagram(){
    getArcDiagram().then(text => {
        const doc = (new DOMParser).parseFromString(text, "image/svg+xml");
        const svg_element = d3.select(doc.documentElement).remove();
        const svg_node = svg_element.node();
        const inner_g_element = svg_node.children[0];
        const viewBox = "0 0 " + window.naview_width.toString() + " " + window.naview_height.toString();
        const svg = d3
            .create("svg")
            .attr("viewBox", viewBox);
        const x = d3.scaleLinear([0, 1], [0, 100]);
        const y = d3.scaleLinear([0, 1], [0, 100]);
        svg.node().appendChild(inner_g_element);
        const g = svg.select('g');
        var g_node = g.node();

        const transform_values = getArcDiagramFittingTransform(g_node, window.naview_width, window.naview_height);
        const transformed_x = transform_values.transformed_x;
        const transformed_y = transform_values.transformed_y;
        const scale = transform_values.scale;

        // zoom+pan event handler
        var transform;
        const zoom = d3.zoom().on("zoom", e => {
            g.attr("transform", (transform = e.transform));
        });

        // apply transformation and zoom event handler
        final_node = svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(transformed_x, transformed_y).scale(scale)).node();
        // replace spinner with arc diagram
        document.querySelector("#spinner-container").remove();
        document.querySelector('#arc-container').appendChild(final_node);

        // show arc diagram toolbar
        document.querySelector('#arc-diagram-toolbar').classList = [];

    });
}

function getArcDiagramFittingTransform(g_node, container_width, container_height){
    /**
     * Determine what transform operations are needed for
     * arc diagram to fill containter's space
     */
    // get an estimation of initial svg size:
    // let the last element's position equal roughly to the size of the svg.
    // Also, add the font size to pad the svg size and
    //       allow leeway to fit in the container.
    const last_svg_element = g_node.children[g_node.childElementCount-1];
    const last_text_font_size = Number(last_svg_element.getAttribute('font-size'));
    const svg_width = Number(last_svg_element.getAttribute('x')) + last_text_font_size;
    const svg_height = Number(last_svg_element.getAttribute('y')) + last_text_font_size;

    // calculate the how much we should scale:
    // select the scalling that will fill the smallest dimension
    const scale = Math.min(container_width/svg_width, container_height/svg_height);
    // calculate how much the svg should move to provide a centered view.
    const scaled_width = scale*svg_width;
    const scaled_height = scale*svg_height;
    const transformed_x = Math.abs(container_width - scaled_width)/2; // a shorter start is required here
    const transformed_y = Math.abs(container_height - scaled_height)/2;

    return {transformed_x: transformed_x,
            transformed_y: transformed_y,
            scale: scale
    };
}

window.onload = init;
window.addEventListener('resize', reportWindowSize);
