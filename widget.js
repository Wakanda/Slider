WAF.define('Slider', ['waf-core/widget', 'Button'], function(widget, WButton) {
    "use strict";

    var Slider = widget.create('Slider', {

        value: widget.property({ type: 'number', defaultValue:  50, bindable: true  }),
        min:   widget.property({ type: 'number', defaultValue:   0, bindable: false }),
        max:   widget.property({ type: 'number', defaultValue: 100, bindable: false }),
        step:  widget.property({ type: 'number', defaultValue:   1, bindable: false }),

        range: widget.property({
            type:         'enum',
            bindable:     false,
            defaultValue: 'none',
            values: {
                none: 'None',
                min:  'Min',
                max:  'Max'
            }
        }),

        shape: widget.property({
            type:         'enum',
            bindable:     false,
            defaultValue: 'circle',
            values: {
                circle: 'Circle',
                square: 'Square'
            }
        }),

        /*
         * Initialize widget
         */
        init: function init () {
            var subscriber, button;

            this.addClass('waf-slider');

            button = this.getPart('handle');
            button.title(' ');

            this._progress     = $('<div class="progress waf-studio-donotsave"/>');
            this._progressBar  = $('<div class="progress-bar"/>').addClass(this.range());
            this._button       = $(button.node).toggleClass('circle', this.shape() === 'circle');
            this._currentValue = this.value();

            this._progress.append(this._progressBar, this._button).appendTo(this.node);
            $(this.node).on('mousedown.slider touchstart.slider', this._startSliding.bind(this));

            this._render();
            setTimeout(this._resize.bind(this), 100);

            subscriber = this.subscribe('change', this._update, this);
            subscriber.options.once = true;
        },

        /*
         * Rendering the slider with new value
         */
        _render: function render () {
            var perc;

            perc = (this._getTruncatedValue(this._currentValue)- this.min()) / (this.max() - this.min()) * 100;
            perc = Math.max(0, Math.min(100, perc));

            perc = perc.toFixed(2);
            this._button.css('left', perc + '%');
            this._progressBar.css('width', ((this.range() === 'min') ? perc : 100 - perc) + '%');
        },

        /*
         * Get truncated value (based on step)
         */
        _getTruncatedValue: function getTruncatedValue (val) {
            return val - (val % this.step());
        },

        /*
         * Start sliding
         */
        _startSliding: function startSliding (e) {
            if (e.which < 2) {
                this._oldValue     = this.value();
                this._currentValue = this.value();
                this.fire('slidestart',{ value: this._currentValue });

                $(window).on('mousemove.slider touchmove.slider', this._processSliding.bind(this));
                $(window).on('mouseup.slider touchend.slider',   this._stopSliding.bind(this));

                this._processSliding(e);
            }
        },

        /*
         * Process sliding
         */
        _processSliding: function processSliding (event) {
            var fx, x, value;

            if (event.type.match(/^touch/i)) {
                x = event.originalEvent.touches[0].pageX;
            }
            else {
                x = event.pageX;
            }

            x -= $(this.node).offset().left;
            fx = x / this._progress.width();
            fx = Math.min(fx, 1.0);
            fx = Math.max(fx, 0.0);

            value  = (this.max() - this.min()) * fx + this.min();
            value += this.step() >> 1; // center
            value  = this._getTruncatedValue(value);

            if (value !== this._currentValue) {
                this._currentValue = value;
                this.fire('slide',{ value:value });
                this._render();
            }
        },

        /*
         * Stop drag drop on mouse up
         */
        _stopSliding: function stopSliding (event) {
            if (event.which < 2) {
                $(window).off('.slider');

                if (this._oldValue !== this._currentValue) {
                    this.value(this._currentValue);
                    this.fire('slidechange',{ value:this._currentValue });
                }

                this.fire('slidestop',{ value:this._currentValue });
            }
        },

        /*
         * Refresh slider on updates
         */
        _update: function update (event) {
            var target, value;

            target = event.target;
            value  = event.data.value;

            switch (target) {
                case 'value':
                    this._currentValue = value;
                    break;

                case 'shape':
                    this._button.toggleClass('circle', value === 'circle');
                    this._resize();
                    break;

                // Avoid (step / 0)
                case 'step':
                    if (value < 1) {
                        this.step(1);
                    }
                    break;

                case 'range':
                    this._progressBar.removeClass('min max none').addClass(value);
                    break;
            }

            this._render();
        },

        /*
         * Resize button element circle based on its height
         */
        _resize: function resize () {
            if (this._button.hasClass('circle')) {
                this._button.css({
                    width:       this._button.height(),
                    marginLeft: -this._button.height() / 2
                });
            }
            else {
                this._button.css({
                    width:      '',
                    marginLeft: ''
                })
            }
        }
    });

    // Run resize event on show to resize the button
    Slider.doAfter('show', function() {
        this._resize();
    });

    // Include button
    Slider.inherit('waf-behavior/layout/composed');
    Slider.setPart('handle', WButton);

    /*
     * Exports
     */
    return Slider;
});