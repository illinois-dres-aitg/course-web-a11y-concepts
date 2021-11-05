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

    if (window.location.hash) {
      let value = window.location.hash.substring(1);
      let button = document.querySelector('[value=' + value + ']');
      if (button) {
        button.checked = true;
      }
    }

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

  updateURL(option) {
    let loc = window.location;
    let url = loc.protocol + "//";
    url += loc.hostname;
    url += loc.pathname;
    url += '#' + option;
    loc.href = url;
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

    switch(inputNode.value) {
      case 'disabled':
        this.exampleNode.classList.add('no-focus');
        this.updateURL('disabled');
        break;

      case 'default':
        this.exampleNode.classList.add('default-focus');
        this.updateURL('default');
        break;

      case 'author':
        this.exampleNode.classList.add('author-focus');
        this.updateURL('author');
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
