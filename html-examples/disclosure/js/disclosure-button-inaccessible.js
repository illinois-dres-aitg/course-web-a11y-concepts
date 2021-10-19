/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   disclosure-button.js
 *
 *   Desc:   Show button that does NOT support the keyboard
 */

'use strict';

/*
 *   @constructor ShowButton
 *
 *
 */
class ShowButton {
  constructor(buttonNode) {
    this.buttonNode = buttonNode;
    this.controlledNode = this.buttonNode.parentNode.nextElementSibling.firstElementChild;
;
    this.hideContent();

    this.buttonNode.addEventListener('click', this.onClick.bind(this));
  }

  showContent() {
    if (this.controlledNode) {
      this.controlledNode.style.display = 'block';
    }
  }

  hideContent() {
    if (this.controlledNode) {
      this.controlledNode.style.display = 'none';
    }
  }

  toggleExpand() {
    if (this.buttonNode.classList.contains('expanded')) {
      this.buttonNode.classList.remove('expanded');
      this.hideContent();
    } else {
      this.buttonNode.classList.add('expanded');
      this.showContent();
    }
  }

  /* EVENT HANDLERS */

  onClick() {
    this.toggleExpand();
  }

}

/* Initialize Hide/Show Buttons */

window.addEventListener(
  'load',
  function () {
    var buttons = document.querySelectorAll(
      'dl.faq div.button'
    );

    for (var i = 0; i < buttons.length; i++) {
      new ShowButton(buttons[i]);
    }
  },
  false
);
