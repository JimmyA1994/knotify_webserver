function init(){
    // Enable popover
    var popover = new bootstrap.Popover(document.querySelector('#copy-btn'), {
        trigger: 'focus'
      })

    window.sequence = document.querySelector('#sequence').textContent;
    window.structure = document.querySelector('#structure').textContent;
    window.uuid = document.querySelector('#uuid').textContent;
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

function copyOutput(){
    console.log('Result copied!');
    navigator.clipboard.writeText(window.structure)
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
    window.naview_height = node.offsetHeight;
    window.naview_width = node.offsetWidth;

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
        'uuid': window.uuid,
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
        const inner_g_element = svg_node.children[0]
        const svg = d3
            .create("svg")
            .attr("viewBox", "0 0 " + window.naview_width.toString() + " " + window.naview_height.toString());
            // .attr("width", svg_node.getAttribute("width"))
            // .attr("preserveAspectRatio", "xMidYMid meet")
            // .attr("height", svg_node.getAttribute("height"))
        const x = d3.scaleLinear([0, 1], [0, 100]);
        const y = d3.scaleLinear([0, 1], [0, 100]);
        svg.node().appendChild(inner_g_element);
        const g = svg.select('g');
        var g_node = g.node();
        var initial_width = Number(g_node.children[g_node.childElementCount-1].getAttribute('x'));
        var scale = (window.naview_width/(1.05*initial_width)).toString();

        var transform;
        const zoom = d3.zoom().on("zoom", e => {
            g.attr("transform", (transform = e.transform));
        });

        final_node = svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(0, window.naview_height/4).scale(scale)).node();
        // remove spinner and add arc diagram
        document.querySelector("#spinner-container").remove();
        document.querySelector('#arc-container').appendChild(final_node);
    });
}

window.onload = init;
window.addEventListener('resize', reportWindowSize);
