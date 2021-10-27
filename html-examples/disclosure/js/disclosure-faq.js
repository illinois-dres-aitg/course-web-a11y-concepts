/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   disclosure-button.js
 *
 *   Desc:   Disclosure button widget that implements ARIA Authoring Best Practices
 */

'use strict';

/*
 *   @constructorDisclosureButton
 *
 *
 */
class DisclosureFAQ {
  constructor(buttonNode) {
    this.buttonNode = buttonNode;
    this.controlledNode = false;

    var id = this.buttonNode.getAttribute('aria-controls');

    if (id) {
      this.controlledNode = document.getElementById(id);
    }

    this.buttonNode.setAttribute('aria-expanded', 'false');
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
    if (this.buttonNode.getAttribute('aria-expanded') === 'true') {
      this.buttonNode.setAttribute('aria-expanded', 'false');
      this.hideContent();
    } else {
      this.buttonNode.setAttribute('aria-expanded', 'true');
      this.showContent();
    }
  }

  /* EVENT HANDLERS */

  onClick() {
    this.toggleExpand();
  }
}

class optionsFAQ {
  constructor(optionNode, disclosureFAQs) {

    this.exampleNode = document.getElementById('ex1');

    this.disclosureFAQs = disclosureFAQs;

    this.radioNodes = optionNode.querySelectorAll('input[type=radio]');

    for (let i = 0; i < this.radioNodes.length; i += 1) {
      let radioNode = this.radioNodes[i];
      radioNode.addEventListener('click', this.onClick.bind(this));
      radioNode.addEventListener('focus', this.onFocus.bind(this));
      radioNode.addEventListener('blur', this.onBlur.bind(this));

      if (radioNode.checked) {
        this.setKeyboardOption(radioNode);
      }
    }
  }

  setButtonTabindex(value) {
    for (let i = 0; i < this.disclosureFAQs.length; i += 1) {
      this.disclosureFAQs[i].buttonNode.tabIndex = value;
    }
  }

  setKeyboardOption(inputNode) {

    for (let i = 0; i < this.radioNodes.length; i += 1) {
      let radioNode = this.radioNodes[i];
      if (radioNode === inputNode) {
        radioNode.parentNode.classList.add('checked');
      } else {
        radioNode.parentNode.classList.remove('checked');
      }
    }

    this.setButtonTabindex(0);
    this.exampleNode.classList.remove('no-focus');
    this.exampleNode.classList.remove('default-focus');
    this.exampleNode.classList.remove('author-focus');
    this.exampleNode.classList.remove('author-hc-focus');

    switch(inputNode.value) {
      case 'nokeyboard':
        // disable keyboard support
        this.setButtonTabindex(-1);
        this.exampleNode.classList.add('no-focus');
        break;

      case 'keyboard+none':
        this.exampleNode.classList.add('no-focus');
        break;

      case 'keyboard+default':
        this.exampleNode.classList.add('default-focus');
        break;

      case 'keyboard+author':
        this.exampleNode.classList.add('author-focus');
        break;

      case 'keyboard+author+hc':
        this.exampleNode.classList.add('author-hc-focus');
        break;

      default:
        break;
    }
  }

  onClick(event) {
    let tgt = event.currentTarget;
    this.setKeyboardOption(tgt);
  }

  onFocus(event) {
    let tgt = event.currentTarget;
    tgt.parentNode.classList.add('focus');
  }

  onBlur(event) {
    let tgt = event.currentTarget;
    tgt.parentNode.classList.remove('focus');
  }

}


/* Initialize Hide/Show Buttons */

window.addEventListener(
  'load',
  function () {
    let disclosureFAQs = [];
    var buttons = document.querySelectorAll(
      'dl.faq button[aria-expanded][aria-controls]'
    );

    for (var i = 0; i < buttons.length; i++) {
      disclosureFAQs.push(new DisclosureFAQ(buttons[i]));
    }

    var optionNode = document.querySelector(
      'section.options'
    );

    if (optionNode) {
      new optionsFAQ(optionNode, disclosureFAQs);
    }
  },
  false
);
