function createContainer(width, height) {
    var seq = window.sequence;
    var str = window.structure;
    var container = new fornac.FornaContainer("#rna_ss",
    {'animation': true, 'zoomable': true, 'initialSize':[width, height]});

     var options = {'structure': str,
        'sequence': seq
    };
    container.addRNA(options.structure, options);
    return container;
}

function init_container() {
    window.container = createContainer(window.width, window.height);
    setSize();
}

function setSize() {
    /** Replica of forna.setSize that resizes plot to main-body current size */

    // Get size of main-body element
    var mainBody = document.querySelector(".main-body");
    // Divide by 4 to have plot occupy most space.
    // The bigger the divisor the bigger the plot.
    window.width = mainBody.offsetWidth/4;
    window.height = mainBody.offsetHeight/4;

    // save width and height
    window.container.options.svgW = window.width;
    window.container.options.svgH = window.height;
    var options = window.container.options;

    // set the viewBox
    var svg = window.container.options.svg;
    svg.attr('viewBox', "0 0 " + window.width + " " + window.height)

    // Set the output range of the scales
    var xScale = d3.scale.linear().domain([0, options.svgW]).range([0, options.svgW]);
    xScale.range([0, window.width]).domain([0, window.width]);
    var yScale = d3.scale.linear().domain([0, options.svgH]).range([0,  options.svgH]);
    yScale.range([0, window.height]).domain([0, window.height]);

    // re-attach the scales to the zoom behaviour
    window.container.zoomer.x(xScale).y(yScale);
    window.container.brusher.x(xScale).y(yScale);

    // resize the background
    svg.select('.background').attr('width', window.width).attr('height', window.height);

    // center the view
    window.container.centerView();
}

function selectDropdown(item) {
    /** enforces color scheme selected dropdown item style */

    // unset all items
    var item1 = document.getElementById("dropdown-item1");
    item1.style.background = "#FFFFFF";
    item1.style.color = "#000000";
    var item2 = document.getElementById("dropdown-item2");
    item2.style.background = "#FFFFFF";
    item2.style.color = "#000000";
    var item3 = document.getElementById("dropdown-item3");
    item3.style.background = "#FFFFFF";
    item3.style.color = "#000000";

    // set selected item
    var item = document.getElementById("dropdown-item"+item);
    item.style.background = "#7A7978";
    item.style.color = "#FFFFFF";
}

function reset() {
    // reset controls
    document.querySelector("#animateCheckbox").checked = true;
    document.querySelector("#numberingCheckbox").checked = true;
    document.querySelector("#nodeLabelCheckbox").checked = true;
    document.querySelector("#pseudoknotCheckbox").checked = true;
    document.querySelector("#directionArrowsCheckbox").checked = true;
    document.querySelector("#linksCheckbox").checked = true;

    // default color scheme
    selectDropdown(2);

    // reset graph
    init_container();
}

function init(){

    // register plot sizing on every window resizing
    window.addEventListener('resize', setSize);

    // register animation checkbox evenet listener
    document.getElementById("animateCheckbox").checked = true;
    var checkbox = document.querySelector("#animateCheckbox");
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.startAnimation()
        } else {
            window.container.stopAnimation()
        }
    });

    // register numbering checkbox evenet listener
    document.getElementById("numberingCheckbox").checked = true;
    var numberingCheckbox = document.querySelector("#numberingCheckbox");
    numberingCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.displayNumbering(true);
        } else {
            window.container.displayNumbering(false);
        }
    });

    // register node label checkbox evenet listener
    document.getElementById("nodeLabelCheckbox").checked = true;
    var nodeLabelCheckbox = document.querySelector("#nodeLabelCheckbox");
    nodeLabelCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.displayNodeLabel(true);
        } else {
            window.container.displayNodeLabel(false);
        }
    });

    // register pseudoknot links checkbox evenet listener
    document.getElementById("pseudoknotCheckbox").checked = true;
    var pseudoknotCheckbox = document.querySelector("#pseudoknotCheckbox");
    pseudoknotCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.displayPseudoknotLinks(true);
        } else {
            window.container.displayPseudoknotLinks(false);
        }
    });

    // register direction arrows checkbox evenet listener
    document.getElementById("directionArrowsCheckbox").checked = true;
    var directionArrowsCheckbox = document.querySelector("#directionArrowsCheckbox");
    directionArrowsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.displayDirectionArrows(true);
        } else {
            window.container.displayDirectionArrows(false);
        }
    });

    // register direction arrows checkbox evenet listener
    document.getElementById("linksCheckbox").checked = true;
    var linksCheckbox = document.querySelector("#linksCheckbox");
    linksCheckbox.addEventListener('change', function() {
        if (this.checked) {
            window.container.displayLinks(true);
        } else {
            window.container.displayLinks(false);
        }
    });

    // from download.js
    register_download_events();

    // receive django template context data and save it globally
    window.css = document.getElementById("css_text").textContent;
    window.sequence = document.getElementById("sequence").textContent;
    window.structure = document.getElementById("structure").textContent;

    // get svg from svg_ss element
    window.plotType = 'interactive'

    // generate the container
    init_container();
}

//
// Initialization of interactive page and registration pages
window.onload = init;
