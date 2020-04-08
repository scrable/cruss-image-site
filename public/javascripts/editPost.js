editpost = () => {

    var submitbutton = document.getElementById("submitbutton");
    var cancelbutton = document.getElementById("cancelbutton");
    var ptitle = document.getElementById("ptitle");
    var pdesc = document.getElementById("pdesc");
    var ititle = document.getElementById("ititle");
    var idesc = document.getElementById("idesc");

    if(ptitle.style.display==="none") {
        // display inputs for new title & descriptions
        ptitle.style.display="block";
        pdesc.style.display="block";

        // show a cancel button to cancel editing
        cancelbutton.style.display="inline-block";

        // hide the original title & description
        ititle.style.display="none";
        idesc.style.display="none";

        ptitle.focus();
        submitbutton.value = "Submit";
        return false;
    }
    else {
        ptitle.style.display="block";
        pdesc.style.display="block";
        return (validateTitle() && validateDescription());
    }
};

validateDescription = () => {
    let post_description = document.getElementById("pdesc");

    if(post_description.value.length < 10){
        alert("Please enter a description with at least 10 characters.");
        post_description.focus();
        return false;
    }
    return true;
};

validateTitle = () => {
    var ptitle = document.getElementById("ptitle");

    if(ptitle.value.length < 3){
        alert("Please enter a title with at least 3 characters.");
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
    var pdesc = document.getElementById("pdesc");
    var idesc = document.getElementById("idesc");

    // hide the editors
    ptitle.style.display="none";
    pdesc.style.display="none";

    cancelbutton.style.display="none";
    submitbutton.value = "Edit Post";

    // show the title and desc
    ititle.style.display="block";
    idesc.style.display="block";

    return false;
};