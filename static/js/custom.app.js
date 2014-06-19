$(function() {
    tooltipPluse = new PNotify({
        title: "הוספת שאלה",
        text: "הוספת שאלה הסבר",
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        animate_speed: 100,
        opacity: .9,
        icon: "ui-icon ui-icon-comment",
        // Setting stack to false causes PNotify to ignore this notice when positioning.
        stack: false,
        auto_display: false,
        type: 'info',
    });
    // Remove the notice if the user mouses over it.
    tooltipPluse.get().mouseout(function() {
        tooltipPluse.remove();
    });
    tooltipPluseMove = function(){
        tooltipPluse.get().css({
            'top': event.clientY + 12,
            'left': event.clientX + 12
        });
    }
    tooltipMinus = new PNotify({
        title: "מחיקת שאלה",
        text: "מחיקת שאלה הסבר",
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        animate_speed: 100,
        opacity: .9,
        icon: "ui-icon ui-icon-comment",
        // Setting stack to false causes PNotify to ignore this notice when positioning.
        stack: false,
        type: 'info',
        auto_display: false
    });
    // Remove the notice if the user mouses over it.
    tooltipMinus.get().mouseout(function() {
        tooltipMinus.remove();
    });
    tooltipMinusMove = function(){
        tooltipMinus.get().css({
            'top': event.clientY + 12,
            'left': event.clientX + 12
        });
    }
    tooltipPencil = new PNotify({
        title: "עריכת שאלה",
        text: "עריכת שאלה הסבר",
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        animate_speed: 100,
        opacity: .9,
        icon: "ui-icon ui-icon-comment",
        // Setting stack to false causes PNotify to ignore this notice when positioning.
        stack: false,
        type: 'info',
        auto_display: false
    });
    // Remove the notice if the user mouses over it.
    tooltipPencil.get().mouseout(function() {
        tooltipPencil.remove();
    });
    tooltipPencilMove = function(){
        tooltipPencil.get().css({
            'top': event.clientY + 12,
            'left': event.clientX + 12
        });
    }
});