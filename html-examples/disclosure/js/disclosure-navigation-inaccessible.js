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

    this.buttonNodes = rootNode.querySelectorAll('.button');
    this.controlledNodes = [];
    this.linkNodes = [];

    document.body.addEventListener('focusin', this.onBody.bind(this));
    document.body.addEventListener('pointerdown', this.onBody.bind(this));

    for (let i = 0; i < this.buttonNodes.length; i += 1) {
      const buttonNode = this.buttonNodes[i];

      this.controlledNodes[i] = buttonNode.nextElementSibling;
      this.linkNodes[i] = [];

      buttonNode.setAttribute('data-menu-index', i);

      buttonNode.addEventListener('click', this.onButtonClick.bind(this));

      this.linkNodes[i] = buttonNode.nextElementSibling.querySelectorAll('a[href]');

      for (let j = 0; j < this.linkNodes[i].length; j += 1) {
        let linkNode = this.linkNodes[i][j];
        linkNode.setAttribute('data-menu-index', i);
        linkNode.addEventListener('click', this.onLinkClick.bind(this));
      }
    }
  }

  showMenu(index) {
    if (this.controlledNodes[index]) {
      this.controlledNodes[index].classList.add('show');
      this.buttonNodes[index].classList.add('expanded');
    }
  }

  hideMenu(index) {
    if (this.controlledNodes[index]) {
      this.controlledNodes[index].classList.remove('show');
      this.buttonNodes[index].classList.remove('expanded');
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
    if (this.buttonNodes[index].classList.contains('expanded')) {
      this.hideMenu(index);
    } else {
      this.showMenu(index);
    }
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
    let index = parseInt(tgt.getAttribute('data-menu-index'));
    this.hideAll(index);
    this.toggleExpand(index);
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

}

/* Initialize Disclosure Menus */

window.addEventListener(
  'load',
  function () {
    var disclosureNavs = document.querySelectorAll('.disclosure-nav');

    for (var i = 0; i < disclosureNavs.length; i++) {
      new DisclosureNav(disclosureNavs[i]);
    }
  },
  false
);
