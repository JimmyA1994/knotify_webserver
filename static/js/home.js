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
