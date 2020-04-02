editpost = () => {

    var submitbutton = document.getElementById("submitbutton");
    var cancelbutton = document.getElementById("cancelbutton");
    var ptitle = document.getElementById("ptitle");

    if(ptitle.style.display==="none") {
        ptitle.style.display="block";
        cancelbutton.style.display="inline-block";
        ptitle.focus();
        submitbutton.value = "Submit";
        return false;
    }
    else {
        ptitle.style.display="block";
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

cancelEdit = () => {
    var cancelbutton = document.getElementById("cancelbutton");
    var ptitle = document.getElementById("ptitle");
    var submitbutton = document.getElementById("submitbutton");

    ptitle.style.display="none";
    cancelbutton.style.display="none";
    submitbutton.value = "Edit Post";

    return false;
};