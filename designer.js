(function(Slider) {
    "use strict";

    Slider.setWidth(160);
    Slider.setHeight(20);

    Slider.addEvents({
        name: 'slidestart',
        description: 'On Start Click'
    },{
        name: 'slide',
        description: 'On Slide'
    },{
        name: 'slidechange',
        description: 'On Change'
    },{
        name: 'slidestop',
        description: 'On Stop'
    });

    Slider.customizeProperty('value', {
        title: 'Source',
        description: 'Define the selected value'
    });
    Slider.customizeProperty('shape', {
        title: 'Handle Shape',
        description: 'Define the shape of the widget handle'
    });
    Slider.customizeProperty('min', {
        title: 'Minimum Value',
        description: 'Define the minimum value'
    });
    Slider.customizeProperty('max', {
        title: 'Maximum Value',
        description: 'Define the maximum value'
    });
    Slider.customizeProperty('step',  {
        title: 'Step Value',
        description: 'Define the step value'
    });
    Slider.customizeProperty('range',  {
        description: 'Define where to display the slider bar'
    });

    // Disable the control on Studio
    Slider.doAfter('init', function() {
        $(this.node).off('.slider');

        // Hide Button configuration
        var button = this.getPart('handle');
        ['plainText', 'title', 'url', 'actionSource'].forEach(function(attribute) {
            button[attribute].hide();
        });
    });

    // Add label
    Slider.addLabel({
        position:    'left',
        description: 'Label for widget'
    });

    Slider.studioOnResize(function() {
        this._resize();
    });

    // Set panel menu
    Slider.setPanelStyle({
        'fClass': true,
        'text': true,
        'textShadow': true,
        'dropShadow': true,
        'innerShadow': true,
        'background': true,
        'border': true,
        'label': true,
        'sizePosition': true
    });
});