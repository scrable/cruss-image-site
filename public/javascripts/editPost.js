editpost = () => {

    var submitbutton = document.getElementById("submitbutton");
    var cancelbutton = document.getElementById("cancelbutton");
    var ptitle = document.getElementById("ptitle");
    var ititle = document.getElementById("ititle");

    if(ptitle.style.display==="none") {
        ptitle.style.display="block";
        cancelbutton.style.display="inline-block";
        ititle.style.display="none";
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
    var ititle = document.getElementById("ititle");

    ptitle.style.display="none";
    cancelbutton.style.display="none";
    submitbutton.value = "Edit Post";
    ititle.style.display="block";

    return false;
};