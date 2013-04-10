(function($, document, undefined){
  "use strict";

  /**
   * Searchfield constructor
   *
   * @param {jQuery|Element} $el Input element we want to augment
   * @param {Object=} options Behaviour options; see `$.fn.inputSearch.defaults`
   * @constructor
   */
  function Searchfield($el, options){
    this.$el = $el;
    this.options = options || {};
    this.$cancelButton = null;

    if (!$el || !$el instanceof $){
      throw new TypeError('$el should be a jQuery Selector instance.')
    }

    // Initializing features
    this.options.showCancel && this.setupCancelButton();
  }

  Searchfield.prototype = {
    /**
     * Clear the field
     */
    clear: function clear(){
      this.$el.val('');

      this.options.focusAfterClear && this.$el.focus();
      this.hideCancelButton();
    },
    /**
     * Creates a Cancel Button and attach events to it
     */
    setupCancelButton: function setupCancelButton(){
      this.$cancelButton = $( document.createElement('div') );

      this.$cancelButton
        .addClass('search-cancel-button hidden')
        .on('click', $.proxy(this.clear, this) )
        .insertAfter(this.$el);
    },
    /**
     * Positions the Cancel Button to where it belongs
     */
    repositionCancelButton: function repositionCancelButton(){
      var $el = this.$el;
      var position = $el.offset();
      var previousPosition = $el.data('input-search-position') || {};

      // No need to recalculate position
      if (previousPosition.left === position.left && previousPosition.top === position.top){
	return;
      }
      else{
	$el.data('input-search-position', $.extend({}, position));
      }

      position.left += $el.outerWidth() - this.options.offsetRight - this.$cancelButton.outerWidth() - (parseInt($el.css('border-right'), 10) || 0);

      //simulating top=50% + margin-top=-halfsize for middle vertical align
      position.top += (($el.innerHeight() / 2) + (parseInt($el.css('border-top-width'), 10) || 0)) + this.options.offsetTop;
      position.top -= this.$cancelButton.outerHeight() / 2;

      this.$cancelButton.offset(position);
    },
    /**
     * Hide the Cancel Button if there is any reason of that
     * Aka field empty
     */
    maybeHideCancelButton: function maybeHideCancelButton(){
      var isVisible = !this.$cancelButton.hasClass('hidden');

      this.$el.val().trim().length === 0
        ? (isVisible && this.hideCancelButton())
        : (!isVisible && this.showCancelButton());
    },
    /**
     * Hide the Cancel Button
     */
    hideCancelButton: function hideCancelButton(){
      this.$cancelButton.addClass('hidden');
    },
    /**
     * Show the Cancel Button
     */
    showCancelButton: function showCancelButton(){
      this.repositionCancelButton();

      this.$cancelButton.css('visibility', '').removeClass('hidden');
    }
  };

  /**
   * jQuery Plugin for Searchfield
   *
   * @param {Object|String|undefined=} option
   */
  $.fn.inputSearch = function inputSearch(option){
    return $(this).each(function(){
      var $input = $(this);
      var data = $input.data('input-search');
      var options = $.extend({}, $.fn.inputSearch.defaults, typeof option === 'object' && option);

      if (!data){
        $input.data('input-search', (data = new Searchfield($input, options)));
      }

      if (typeof option === 'string'){
        data[option]();
      }
    });
  };

  /**
   * Plugin Defaults
   *
   * @type {{focusAfterClear: boolean, offsetRight: number, offsetTop: number, showCancel: boolean}}
   */
  $.fn.inputSearch.defaults = {
    focusAfterClear: true,
    offsetRight: 5,
    offsetTop: 0,
    showCancel: true
  };

  /**
   * Keep an eye on the Object for testing purpose
   *
   * @type {Searchfield}
   */
  $.fn.inputSearch.Constructor = Searchfield;

  /**
   * Default Event Listeners
   */
  function _initSearchInput(){
    $(this).inputSearch('maybeHideCancelButton');
  }

  $(document)
    .on('focus blur keyup', '.no-search-cancel input[type="search"], .textfield-as-searchfield', _initSearchInput)
    .ready(function(){
      $(this)
	.find('.no-search-cancel input[type="search"][value!=""], .textfield-as-searchfield[value!=""]')
	.each(_initSearchInput)
    });
})(jQuery, document);