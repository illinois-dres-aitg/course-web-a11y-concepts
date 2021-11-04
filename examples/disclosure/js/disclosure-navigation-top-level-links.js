/*
 *   File:   disclosure-navigation-top-links.js
 *
 *   Desc:   Disclosure button widget for navigation menu with top level links
 */

'use strict';

class DisclosureNav {
  constructor(rootNode) {
    this.rootNode = rootNode;

    this.buttonNodes = rootNode.querySelectorAll('button[aria-expanded]');
    this.topLevelNodes = [];
    this.controlledNodes = [];
    this.linkNodes = [];

    this.keyboardEnhancement = false;

    document.body.addEventListener('focusin', this.onBody.bind(this));
    document.body.addEventListener('pointerdown', this.onBody.bind(this));

    let topLevelIndex = 0;
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

      let linkNode = buttonNode.previousElementSibling;
      this.topLevelNodes.push(linkNode);
      this.topLevelNodes.push(buttonNode);

      if (linkNode) {
        linkNode.setAttribute('data-top-level-index', topLevelIndex);
        topLevelIndex += 1;
        linkNode.addEventListener('click', this.onLinkClick.bind(this));
        linkNode.addEventListener('keydown', this.onTopLevelLinkKeydown.bind(this));
        linkNode.addEventListener('focus', this.onButtonFocus.bind(this));
      }

      buttonNode.setAttribute('data-top-level-index', topLevelIndex);

      this.linkNodes[i] = buttonNode.nextElementSibling.querySelectorAll('a[href]');

      for (let j = 0; j < this.linkNodes[i].length; j += 1) {
        linkNode = this.linkNodes[i][j];
        linkNode.setAttribute('data-top-level-index', topLevelIndex);
        linkNode.setAttribute('data-menu-index', i);
        linkNode.setAttribute('data-link-index', j);
        linkNode.addEventListener('click', this.onLinkClick.bind(this));
        linkNode.addEventListener('keydown', this.onLinkKeydown.bind(this));
      }

      topLevelIndex += 1;
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

  moveToFirstTopLevelItem(node) {
    let topLevelNode = this.topLevelNodes[0];
    topLevelNode.focus();
  }

  moveToLastTopLevelItem(node) {
    let topLevelNode = this.topLevelNodes[this.topLevelNodes.length - 1];
    topLevelNode.focus();
  }

  moveToNextTopLevelItem(node) {
    let topLevelId = parseInt(node.getAttribute('data-top-level-index'));

    let topLevelNode = this.topLevelNodes[topLevelId + 1];

    if (!topLevelNode) {
      topLevelNode = this.topLevelNodes[this.topLevelNodes.length - 1];
    }
    this.hideAll();
    topLevelNode.focus();
  }

  moveToPreviousTopLevelItem(node) {
    let topLevelId = parseInt(node.getAttribute('data-top-level-index'));

    let topLevelNode = this.topLevelNodes[topLevelId - 1];

    if (!topLevelNode) {
      topLevelNode = this.topLevelNodes[0];
    }
    this.hideAll();
    topLevelNode.focus();
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
          this.moveToNextTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (this.keyboardEnhancement) {
          this.moveToPreviousTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'End':
        if (this.keyboardEnhancement) {
          this.moveToLastTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'Home':
        if (this.keyboardEnhancement) {
          this.moveToFirstTopLevelItem(tgt);
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

  onTopLevelLinkKeydown(event) {
    let tgt = event.currentTarget;
    let key = event.key;
    let flag = false;

    switch (key) {

      case 'ArrowRight':
        if (this.keyboardEnhancement) {
          this.moveToNextTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (this.keyboardEnhancement) {
          this.moveToPreviousTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'End':
        if (this.keyboardEnhancement) {
          this.moveToLastTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'Home':
        if (this.keyboardEnhancement) {
          this.moveToFirstTopLevelItem(tgt);
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
          this.moveToNextTopLevelItem(tgt);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (this.keyboardEnhancement) {
          this.moveToPreviousTopLevelItem(tgt);
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
      radioNode.addEventListener('click', this.onClick.bind(this));
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
