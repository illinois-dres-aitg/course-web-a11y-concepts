/*
 *   File:   links-and-form-controls.js
 *
 *   Desc:   Setting options for focus styling
 */

'use strict';

class labelFocus {
  constructor() {

    let exampleNode = document.getElementById('ex1');

    this.labelNodes = exampleNode.querySelectorAll('.other input, .control input, .control button');

    for (let i = 0; i < this.labelNodes.length; i += 1) {
      let labelNode = this.labelNodes[i];
      labelNode.addEventListener('focus', this.onFocus.bind(this));
      labelNode.addEventListener('blur', this.onBlur.bind(this));
    }
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


class optionsHTML {
  constructor(optionNode) {

    this.exampleNode = document.getElementById('ex1');

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

  setKeyboardOption(inputNode) {

    for (let i = 0; i < this.radioNodes.length; i += 1) {
      let radioNode = this.radioNodes[i];
      if (radioNode === inputNode) {
        radioNode.parentNode.classList.add('checked');
      } else {
        radioNode.parentNode.classList.remove('checked');
      }
    }

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
    new labelFocus();

    var optionNode = document.querySelector(
      'section.options'
    );

    if (optionNode) {
      new optionsHTML(optionNode);
    }
  },
  false
);
