/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Supplemental JS for the disclosure menu keyboard behavior
 */

'use strict';

class DisclosureNav {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.buttonNodes = rootNode.querySelectorAll('button[aria-expanded]');
    this.controlledNodes = [];
    this.linkNodes = [];

    this.keyboardEnhancement = false;

    document.body.addEventListener('focusin', this.onBody.bind(this));
    document.body.addEventListener('pointerdown', this.onBody.bind(this));

    for (let i = 0; i < this.buttonNodes.length; i += 1) {
      this.controlledNodes[i] = false;
      this.linkNodes[i] = [];

      const buttonNode = this.buttonNodes[i];
      const id = buttonNode.getAttribute('aria-controls');

      if (id) {
        this.controlledNodes[i] = document.getElementById(id);
      }

      buttonNode.setAttribute('aria-expanded', 'false');
      buttonNode.setAttribute('data-menu-index', i);

      buttonNode.addEventListener('click',   this.onButtonClick.bind(this));
      buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
      buttonNode.addEventListener('focus',   this.onButtonFocus.bind(this));

      this.linkNodes[i] = buttonNode.nextElementSibling.querySelectorAll('a[href]');

      for (let j = 0; j < this.linkNodes[i].length; j += 1) {
        let linkNode = this.linkNodes[i][j];
        linkNode.setAttribute('data-menu-index', i);
        linkNode.setAttribute('data-link-index', j);
        linkNode.addEventListener('click', this.onLinkClick.bind(this));
        linkNode.addEventListener('keydown', this.onLinkKeydown.bind(this));
      }
    }
  }

  setKeyboardEnhancement(option) {
    this.keyboardEnhancement = option;
  }

  showMenu(index) {
    if (this.controlledNodes[index]) {
      this.controlledNodes[index].classList.add('show');
      this.buttonNodes[index].setAttribute('aria-expanded', 'true');
    }
  }

  hideMenu(index) {
    if (this.controlledNodes[index]) {
      this.controlledNodes[index].classList.remove('show');
      this.buttonNodes[index].setAttribute('aria-expanded', 'false');
    }
  }

  hideAll(index) {
    if (typeof index !== 'number') {
      index = -1;
    }
    for (let i = 0; i < this.controlledNodes.length; i += 1) {
      if (index != i) {
        this.hideMenu(i);
      }
    }
  }

  toggleExpand(index) {
    if (this.buttonNodes[index].getAttribute('aria-expanded') === 'true') {
      this.hideMenu(index);
    } else {
      this.showMenu(index);
    }
  }

  moveToFirstLink(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));
    let linkNode = this.linkNodes[menuId][0]
    linkNode.focus();
  }

  moveToLastLink(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));
    let linkNode = this.linkNodes[menuId][this.linkNodes[menuId].length - 1]
    linkNode.focus();
  }

  moveToNextLink(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));
    let linkId = parseInt(node.getAttribute('data-link-index'));

    let nextLinkNode = this.linkNodes[menuId][linkId + 1];

    if (!nextLinkNode) {
      nextLinkNode = this.linkNodes[menuId][0];
    }
    nextLinkNode.focus();
  }

  moveToPreviousLink(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));
    let linkId = parseInt(node.getAttribute('data-link-index'));

    if (linkId > 0) {
      this.linkNodes[menuId][linkId - 1].focus();
    } else {
      this.linkNodes[menuId][this.linkNodes[menuId].length - 1].focus();
    }
  }

  moveToFirstMenu(node) {
    let menuNode = this.buttonNodes[0];
    menuNode.focus();
  }

  moveToLastMenu(node) {
    let menuNode = this.buttonNodes[this.buttonNodes.length - 1];
    menuNode.focus();
  }

  moveToNextMenu(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));

    let nextMenuNode = this.buttonNodes[menuId + 1];


    if (!nextMenuNode) {
      nextMenuNode = this.buttonNodes[this.buttonNodes.length - 1];
    }
    this.hideAll();
    nextMenuNode.focus();
  }

  moveToPreviousMenu(node) {
    let menuId = parseInt(node.getAttribute('data-menu-index'));

    let nextMenuNode = this.buttonNodes[menuId - 1];

    if (!nextMenuNode) {
      nextMenuNode = this.buttonNodes[0];
    }
    this.hideAll();
    nextMenuNode.focus();
  }

  /* EVENT HANDLERS */


  onBody(event) {
    let tgt = event.target;
    if (!this.rootNode.contains(tgt)) {
      this.hideAll();
    }
  }

  onButtonClick(event) {
    let tgt = event.currentTarget;
    this.toggleExpand(parseInt(tgt.getAttribute('data-menu-index')));
  }

  onButtonKeydown(event) {
    let tgt = event.currentTarget;
    let key = event.key;
    let flag = false;
    let index = parseInt(tgt.getAttribute('data-menu-index'));

    switch (key) {
      case 'Escape':
        this.hideMenu(index);
        flag = true;
        break;

      case 'ArrowDown':
        if (this.keyboardEnhancement) {
          this.showMenu(index)
          this.moveToFirstLink(tgt);
        }
        flag = true;
        break;

      case 'ArrowUp':
        if (this.keyboardEnhancement) {
          this.showMenu(index)
          this.moveToLastLink(tgt);
        }
        flag = true;
        break;

      case 'ArrowRight':
        if (this.keyboardEnhancement) {
          this.moveToNextMenu(tgt);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (this.keyboardEnhancement) {
          this.moveToPreviousMenu(tgt);
        }
        flag = true;
        break;

      case 'End':
        if (this.keyboardEnhancement) {
          this.moveToLastMenu(tgt);
        }
        flag = true;
        break;

      case 'Home':
        if (this.keyboardEnhancement) {
          this.moveToFirstMenu(tgt);
        }
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onButtonFocus() {
    let tgt = event.currentTarget;
    this.hideAll(parseInt(tgt.getAttribute('data-menu-index')));
  }

  onLinkClick(event) {
    let tgt = event.currentTarget;
    this.hideAll();

    // Update title
    let h3Node = document.getElementById('mythical-page-heading');
    let parts = tgt.href.split('#');
    parts = parts[1].split('-')
    let title = parts.slice(1).join(' ');
    h3Node.textContent = title;
    h3Node.tabIndex = -1;
    h3Node.focus();
  }

  onLinkKeydown(event) {
    let tgt = event.currentTarget;
    let key = event.key;
    let flag = false;

    switch (key) {
      case 'Escape':
        let index = parseInt(tgt.getAttribute('data-menu-index'));
        this.hideMenu(index);
        this.buttonNodes[index].focus();
        flag = true;
        break;

      case 'ArrowDown':
        if (this.keyboardEnhancement) {
          this.moveToNextLink(tgt);
        }
        flag = true;
        break;

      case 'ArrowUp':
        if (this.keyboardEnhancement) {
          this.moveToPreviousLink(tgt);
        }
        flag = true;
        break;

      case 'ArrowRight':
        if (this.keyboardEnhancement) {
          this.moveToNextMenu(tgt);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (this.keyboardEnhancement) {
          this.moveToPreviousMenu(tgt);
        }
        flag = true;
        break;

      case 'End':
        if (this.keyboardEnhancement) {
          this.moveToLastLink(tgt);
        }
        flag = true;
        break;

      case 'Home':
        if (this.keyboardEnhancement) {
          this.moveToFirstLink(tgt);
        }
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

class optionsNav {
  constructor(optionNode, disclosureNavs) {

    this.exampleNode = document.getElementById('ex1');

    this.disclosureNavs = disclosureNavs;

    this.radioNodes = optionNode.querySelectorAll('input[type=radio]');

    for (let i = 0; i < this.radioNodes.length; i += 1) {
      let radioNode = this.radioNodes[i];
      radioNode.addEventListener('click', this.onKeyboardClick.bind(this));
      radioNode.addEventListener('focus', this.onFocus.bind(this));
      radioNode.addEventListener('blur', this.onBlur.bind(this));

      if (radioNode.checked) {
        this.setKeyboardOption(radioNode);
      }
    }

    let enhancementNode = optionNode.querySelector('input[name="keyboard-enhancement"]');

    if (enhancementNode) {
      this.setKeyboardEnhancement(enhancementNode);
      enhancementNode.addEventListener('click', this.onEnhancementClick.bind(this));
      enhancementNode.addEventListener('focus', this.onFocus.bind(this));
      enhancementNode.addEventListener('blur', this.onBlur.bind(this));
    }
  }

  setButtonTabindex(value) {
    for (let i = 0; i < this.disclosureNavs.length; i += 1) {
      let rootNode = this.disclosureNavs[i].rootNode;
      let buttonNodes = rootNode.querySelectorAll('button');
      for (let j = 0; j < buttonNodes.length; j += 1) {
        buttonNodes[j].tabIndex = value;
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

  setKeyboardEnhancement(node) {
    if (node.checked) {
      node.parentNode.classList.add('checked');
    } else {
      node.parentNode.classList.remove('checked');
    }

    for (let i = 0; i < this.disclosureNavs.length; i += 1) {
      this.disclosureNavs[i].setKeyboardEnhancement(node.checked);
    }
  }

  onEnhancementClick(event) {
    let tgt = event.currentTarget;
    this.setKeyboardEnhancement(tgt);
  }

  onKeyboardClick(event) {
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

/* Initialize Disclosure Menus */

window.addEventListener(
  'load',
  function () {
    var navs = document.querySelectorAll('.disclosure-nav');
    this.disclosureNavs = [];

    for (var i = 0; i < navs.length; i++) {
      this.disclosureNavs.push(new DisclosureNav(navs[i]));
    }

    var optionNode = document.querySelector(
      'section.options'
    );

    if (optionNode) {
      new optionsNav(optionNode, disclosureNavs);
    }
  },
  false
);
