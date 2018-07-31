
// define a spinner but do not show it yet

window.spinner = new Spinner(
    {
        lines: 16, // The number of lines to draw
        length: 0, // The length of each line
        width: 37, // The line thickness
        radius: 84, // The radius of the inner circle
        scale: 10, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#749a50', // CSS color or array of colors
        fadeColor: '#151515', // CSS color or array of colors
        speed: 2.2, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-more', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        position: 'fixed' // Element positioning
    }
);
