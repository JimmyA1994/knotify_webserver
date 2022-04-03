function init(){
    // Enable popover
    var popover = new bootstrap.Popover(document.querySelector('#copy-btn'), {
        trigger: 'focus'
      })

    window['sequence'] = document.querySelector('#sequence').textContent;
    window['dot-bracket'] = document.querySelector('#dot-bracket').textContent;
    window['input-size'] = window['sequence'].length
    reportWindowSize()
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

        // create dot-bracket line and append it
        var dot_count = document.createElement('div');
        dot_count.setAttribute("class", "counter results noselect")
        dot_count.innerHTML = count + "> ";
        var dot_content = document.createElement('div');
        dot_content.setAttribute("class", "results");
        dot_content.setAttribute("id", "dot-bracket" + (count > 1 ? '-'+count : ''))
        dot_content.innerHTML = window['dot-bracket'].slice(i, i+n);

        dot_div = document.createElement('div');
        dot_div.setAttribute('class', 'responsive-line')
        dot_div.setAttribute('id', 'dot_div' + (count > 1 ? '-'+count : ''))

        dot_div.appendChild(dot_count);
        dot_div.appendChild(dot_content);
        root.appendChild(dot_div)


        count++;
    }
}

function copyOutput(){
    console.log('Copied!');
    navigator.clipboard.writeText(window['dot-bracket'])
}

window.onload = init;
window.addEventListener('resize', reportWindowSize);