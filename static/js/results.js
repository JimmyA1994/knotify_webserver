function init(){
    // Enable popover
    var popover = new bootstrap.Popover(document.querySelector('#copy-btn'), {
        trigger: 'focus'
      })

    window.sequence = document.querySelector('#sequence').textContent;
    window.structure = document.querySelector('#structure').textContent;
    window['input-size'] = window['sequence'].length
    window.displayNumbering = true;
    window.showNucleotideLabels = true;
    reportWindowSize();

    registerPresentationButtons();

    createChart();
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
    return chart;
}

function clearChart(elementId='rna_ss') {
    var rootElem = document.querySelector('#'+elementId);
    while(rootElem.children.length > 0){
        rootElem.children[0].remove();
    }
}

window.onload = init;
window.addEventListener('resize', reportWindowSize);