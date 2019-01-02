let ROOMS = [];
let RIDDLES = [];
let RIDDLES_DATAS = [];

$.ajaxSetup({
    headers: { 'Authorization': 'adminToken' }
});

const showTab = (tab) => {
    $("aside button").removeClass("selected");
    $("aside button[tab=" + tab + "]").addClass("selected");

    $(".tab").hide();
    $("#" + tab).show();
};

$("aside button").click(function() {
    showTab($(this).attr("tab"));
});
