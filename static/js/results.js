function init(){
    window['sequence'] = document.querySelector('#sequence').textContent;
    window['dot-bracket'] = document.querySelector('#dot-bracket').textContent;
    window['input-size'] = window['sequence'].length
    window['count'] = 1;
    reportWindowSize()
}


function reportWindowSize() {
    var seqElem = document.querySelector('#sequence');
    var dotElem = document.querySelector('#dot-bracket');
    console.log('height: ', window.innerHeight);
    console.log('width: ', window.innerWidth);
    console.log('sequence width: ', seqElem.offsetWidth)
    const font = 13;
    const len = font*seqElem.textContent.length
    console.log(len);
    n = Math.floor(seqElem.offsetWidth / font)
    console.log('n: ',n);

    root = document.querySelector('#root');
    // delete all existing nodes
    while(root.children.length > 0){
        root.children[0].remove();
    }

    var count = 1;
    for(i=0; i<=window['input-size']; i+=n){
        var seq_row = document.createElement('p');
        seq_row.setAttribute("class", "results");
        seq_row.setAttribute("id", "sequence" + (count > 1 ? '-'+count : ''))
        seq_row.innerHTML = count + "> " + window['sequence'].slice(i, i+n);
        var dot_row = document.createElement('p');
        dot_row.setAttribute("class", "results");
        dot_row.setAttribute("id", "dot-bracket" + (count > 1 ? '-'+count : ''))
        dot_row.innerHTML = count + "> " + window['dot-bracket'].slice(i, i+n);

        root.appendChild(seq_row);
        root.appendChild(dot_row);
        count++;
    }
    window['count'] = count - 1;
}

window.onload = init;
window.addEventListener('resize', reportWindowSize);