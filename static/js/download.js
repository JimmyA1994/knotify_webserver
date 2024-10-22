function register_download_events() {
    // initialize download global variables
    window.svg_background = true;
    window.width = 1280;
    window.height = 720;
    window.size = "1280x720"
    window.download_format = "svg"

    document.getElementById("background-check").checked = true;
    var checkbox = document.querySelector("#background-check");
    checkbox.addEventListener('change', function() {
        // toggle svg background
        window.svg_background = !window.svg_background;
    });

    var svg_radio = document.querySelector("#svg-radio");
    svg_radio.addEventListener('change', function() {
        if (this.checked) {
            display_download_svg_options();
            for(var i = 1; i<=3; i++){
                var radio = document.querySelector("#img-radio"+i);
                radio.checked = false;
            }
            window.download_format = this.name;
        }
    });

    for(var i = 1; i<=3; i++){
        var radio = document.querySelector("#img-radio"+i);
        radio.addEventListener('change', function() {
        if (this.checked) {
            display_download_img_options();
            var svg_radio = document.querySelector("#svg-radio");
            svg_radio.checked = false;
            for(var i = 1; i<=3; i++){
                var radio = document.querySelector("#img-radio"+i);
                radio.checked = false;
            }
            this.checked = true;
            window.download_format = this.name;
            }
        });
    }

    for(var i = 1; i<=4; i++){
        var radio = document.querySelector("#size-radio"+i);
        radio.addEventListener('change', function() {
            if (this.checked) {
                // unset all radio buttons
                for(var j = 1; j<=4; j++){
                    var temp = document.querySelector("#size-radio"+j);
                    temp.checked = false;
                }
                // set the one we selected
                this.checked = true;
                window.size = this.name;
            }
        });
    }
}


function display_download_svg_options(){
    var download_img_options = document.getElementById("download-img-options");
    download_img_options.style.display = "none";
    var download_svg_options = document.getElementById("download-svg-options");
    download_svg_options.style.display = "block";
}

function display_download_img_options(){
    var download_svg_options = document.getElementById("download-svg-options");
    download_svg_options.style.display = "none";
    var download_img_options = document.getElementById("download-img-options");
    download_img_options.style.display = "block";
}

function download_img(){
    // set download_size
    if(window.download_format != "svg"){
        var resolution = window.size.split("x");
        var chosen_width = resolution[0];
        var chosen_height = resolution[1];
        if(window.width != chosen_width || window.height != chosen_height){
            window.width = chosen_width;
            window.height = chosen_height;
            if(window.plotType == 'static'){
                clearChart();
                createChart();
            }else{
                init_container();
            }
        }
    }
    var name = get_filename();
    var format = window.download_format;
    if(format == 'svg'){
        var svgData = get_svg_string();
        var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    else{
        var data = {"svg": get_svg_string(), "format": format, 'width': width, "height": height};
        var cookie = document.cookie;
        var split = cookie.split("=");
        var token = split[1];

        var url = window.location.protocol + '//' + window.location.host + '/' + 'convert_svg';
        var tuple = fetch(url,{
            method: 'POST',
            headers: {
                'X-CSRFToken': token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(b64_binary =>{
            if(format == 'png'){
                var svgUrl = 'data:image/png;base64,' + b64_binary;
            } else if(format == 'ps'){
                var svgUrl = 'data:application/postscript;base64,' + b64_binary;
                name += ".ps"
            } else if(format == 'pdf'){
                var svgUrl = 'data:application/octetstream;base64,' + b64_binary;
                name += ".pdf"
            } else {return;}
            var downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = name
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }
}

function get_filename(){
    var name_input = document.getElementById("name-input").value.trim();
    var name = '';
    if(name_input){ name = name_input;}
    else{
        if (window.plotType == 'interactive'){
            name = 'interactive';
        }
        else {
            name = window.request_id;
        }
    }
    return name;
}

function clear_name(){
    var name_field = document.getElementById("name-input");
    name_field.value = ""
    name_field.focus()
}

function get_svg_string() {
    // get css to incorporate into svg
    var css = window.css
    var svg = get_svg();

    // get svg in string format
    var serializer = new XMLSerializer();
    var svgData = serializer.serializeToString(svg);

    // add style element to svg
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(svgData, "text/xml");
    var svgNode = xmlDoc.childNodes[0];
    var gNode = svgNode.childNodes[0];
    const is_interactive = window.plotType == 'interactive';
    const is_naview = window.plotType == 'static' && which_graphic_tab() == "naview";
    // add css styling to forna.js generated charts
    if (is_interactive || is_naview) {
        var style = xmlDoc.createElement("style");
        style.innerHTML = css;
        svgNode.insertBefore(style, gNode);
    }

    // enforce background
    if (window.svg_background || window.download_format != "svg") {
        if(window.plotType == 'static'){
            var rectNode = xmlDoc.createElement('rect');
            rectNode.setAttribute("fill","white");
            rectNode.setAttribute("style", "visibility: visible;");
            rectNode.setAttribute("width", "100%");
            rectNode.setAttribute("height", "100%");
            svgNode.insertBefore(rectNode, gNode);
        } else {
            var rectNode = xmlDoc.querySelector(".background");
            rectNode.setAttribute("fill","white");
            rectNode.setAttribute("style", "visibility: visible;");
        }
    }

    // get final svg in string format
    svgData = serializer.serializeToString(xmlDoc);
    // XMLSerializer adds xmlns attribute in style element, remove it
    svgData = svgData.replaceAll("xmlns=\"\"", "");
    return svgData;
}

function get_svg(){
    /* Return the svg element */
    if(window.plotType == 'static'){
        const tab = which_graphic_tab();
        if(tab == 'naview'){
            var div = document.querySelector('.svg-container');
            var svg = div.childNodes[0];
        }
        else if(tab == "arc"){
            var div = document.querySelector('#arc-container');
            var svg_element = div.children[0];
            // replace scaling attributes with initial scaling
            var serializer = new XMLSerializer();
            var svgData = serializer.serializeToString(svg_element);
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(svgData, "text/xml");
            const svg_root_elem = xmlDoc.children[0];
            svg_root_elem.attributes.removeNamedItem('viewBox');
            const g_element = svg_root_elem.children[0];
            g_element.removeAttribute("transform");
            const transform_values = getArcDiagramFittingTransform(g_element, window.width, window.height);
            const transformed_x = transform_values.transformed_x;
            const transformed_y = transform_values.transformed_y;
            const scale = transform_values.scale;
            g_element.setAttribute("transform", "translate("+transformed_x+","+transformed_y+") scale("+scale+")")
            var svg = svg_root_elem;
        }
    } else {
        var div = document.querySelector('#rna_ss');
        var svg = div.children[0];
    }
    return svg;
}

function which_graphic_tab(){
    const naview_tab = document.querySelector("#naview-tab");
    const is_naview_displayed = naview_tab.attributes["aria-selected"].value == 'true';
    if (is_naview_displayed){
        return 'naview';
    }
    const arc_tab = document.querySelector("#arc-tab");
    const is_arc_displayed = arc_tab.attributes["aria-selected"].value == 'true';
    if (is_arc_displayed){
        return 'arc';
    }
}
