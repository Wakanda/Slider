(function(Slider) {
    "use strict";

    Slider.setWidth(160);
    Slider.setHeight(20);

    Slider.addEvents({
        name: 'slidestart',
        description: 'On Start Slide',
        category: 'Slider Events'
    },{
        name: 'slide',
        description: 'On Slide',
        category: 'Slider Events'
    },{
        name: 'slidechange',
        description: 'On Slide Change',
        category: 'Slider Events'
    },{
        name: 'slidestop',
        description: 'On Stop Slide',
        category: 'Slider Events'
    });

    Slider.customizeProperty('value', {
        title: 'Value',
        description: 'Static value or datasource value'
    });
    Slider.customizeProperty('shape', {
        title: 'Handle',
        description: 'Slider\'s handle shape'
    });
    Slider.customizeProperty('min', {
        title: 'Minimum value',
        description: 'Minimum value for the Slider'
    });
    Slider.customizeProperty('max', {
        title: 'Maximum value',
        description: 'Maximum value for the Slider'
    });
    Slider.customizeProperty('step',  {
        title: 'Step',
        description: 'Step value for the Slider'
    });
    Slider.customizeProperty('range',  {
        description: 'Slider\'s range to display'
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
        'text': false,
        'textShadow': false,
        'dropShadow': true,
        'innerShadow': false,
        'background': true,
        'border': true,
        'label': true,
        'sizePosition': true
    });
});