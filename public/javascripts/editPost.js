editpost = () => {

    var submitbutton = document.getElementById("submitbutton");
    var edit = document.getElementById("edit");
    var ptitle = document.getElementById("ptitle");

    if(ptitle.style.display==="none") {
        ptitle.style.display="block";
        ptitle.focus();
        submitbutton.value = "Submit";
        return false;
    }
    else {
        return validateTitle();
    }
};

validateTitle = () => {
    var ptitle = document.getElementById("ptitle");

    if(ptitle.value.length < 1){
        alert("Please enter a title.");
        ptitle.focus();
        return false;
    }
    return true;
};