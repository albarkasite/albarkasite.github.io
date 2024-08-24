const filesDenyList = [".exe", ".cmd" , ".bat", ".com", ".msi",".scr", ".pif", ".js", ".vbs", ".ps1", ".wsf", ".hta", ".php", ".asp", ".aspx", ".jsp",
    ".cgi", ".dll", ".sys", ".drv", ".cpl", ".ocx", ".jar", ".war", ".locky", ".crypt", ".cry", ".cryptolocker",
    ".reg", ".dmp"
];

const paymentsGetWayDataRequired = [ "vistamoney" , "tesspgs" , "myfatoraah" , "tap" , "hesab" , "fawry" , "tabby", "tamara" ];

const isPaymentsGetWayDataRequired = (x) => {
    return paymentsGetWayDataRequired.includes(x) ;
}

$(document).ready(function () {
    if ($(window).width() <= 768) {
        $("#cartModal .modal-dialog").removeClass("modal-dialog-centered");
        $("#termsModal .modal-dialog").removeClass("modal-dialog-centered");
        $("#orderModalClient .modal-dialog").removeClass("modal-dialog-centered");


    }
});
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$('.cart-items').on('click', function (e) {
    if ($(this).is(".show")) {
        var target = $(e.target);
        if (target.hasClass("dropdown-keep-open") || target.parents(".dropdown-keep-open").length && !
            target.hasClass('btn-cart')) {
            return false;
        } else {
            return true;
        }
    }
});

function setLang(nameLang) {
    $("#langSelect").val(nameLang);
    $("#selectLanguage").submit();

}


function roundUp(num, precision) {
    precision = Math.pow(10, precision);
    return Math.round(num * precision) / precision;
}

Number.prototype.formatMoney = function (p) {
    var vres = roundUp(p, 2).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace('.00', '');
    if (vres.indexOf('.') > -1) {
        vres = vres.replace(/0+$/, '');
    }
    return vres;
};

function getintlTelNumber(ele, telInputObj) {
    var phoneNumper = '';
    var eleVal = ele.val().trim();
    try {
        if (telInputObj.getSelectedCountryData().dialCode == undefined || eleVal == '+') {
            phoneNumper = '';
        } 
        else if (eleVal.startsWith("+")) {
            phoneNumper = eleVal;
        }
        else if (eleVal.startsWith("00")) {
            phoneNumper = '+' + eleVal.slice(2);
        } else {
            phoneNumper = '+' + telInputObj.getSelectedCountryData().dialCode + eleVal;
        }
    }
    catch (ex) { }
    return phoneNumper;
}

function loadClientInfo(nameForm) {
    if (localStorage.getItem("name")) {
        $(`form[name='${nameForm}']`).find('input[name=customerName]').val(localStorage.getItem("name"));
    }

    if (localStorage.getItem("email")) {
        $(`form[name='${nameForm}']`).find('input[name=customerEmail]').val(localStorage.getItem("email"));
    }

    if (localStorage.getItem("phone")) {
        $(`form[name='${nameForm}']`).find('input[type=tel]').val(localStorage.getItem("phone"));
    }

    if (localStorage.getItem("address")) {
        $(`form[name='${nameForm}']`).find('input[name=CustomerCountry]').val(localStorage.getItem("address"));
    }
}

$(document).ready(
    CheckItemNumberCart()
);


function CheckItemNumberCart() {
    $.ajax({
        url: "/Me/GetSessionLegthItem",
        datatype: 'json',
        method: 'GET',
        success: function (res) {
            console.log(res);
            cartGlobalLengh = res.itemsJsonLength;
            $("#numberitem").html(cartGlobalLengh);
            $("#numberitemMobile").html(cartGlobalLengh);
            if (cartGlobalLengh == 0) {
                $("#numberitem").addClass("d-none");
                $("#numberitemMobile").addClass("d-none");
            } else {
                $("#numberitem").addClass("d-inline-block");
                $("#numberitemMobile").addClass("d-inline-block");
            }


        },
        error: function (err) {
            console.log(err)
        }
    });
}


function openNav() {
    $("#mySidenav2").toggleClass("side-open");
    $("#main").toggleClass("main-hide");
    $("#overlay").toggleClass("overlay");
    if (window.matchMedia("(max-width: 595px)").matches) {
        $(".navbar-nav-cart-mobile").toggleClass("d-none");
    }
}

function closeNav() {
    $("#mySidenav2").removeClass("side-open");
    $("#main").removeClass("main-hide");
    $("#overlay").removeClass("overlay");
    if (window.matchMedia("(max-width: 595px)").matches) {
        $(".navbar-nav-cart-mobile").removeClass("d-none");
    }
}

$(".sidenav ul li .tags-item").click(function () {
    openNav();
});


$(document.body).click(function (e) {
    if (event.target.closest(".feather-menu") || event.target.closest("#mySidenav2")) return;
    closeNav();
});
