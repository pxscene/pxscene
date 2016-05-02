/**
 * Created by tcarro004
 * on 7/6/15.
 */

px.import({RenderedComponent:'renderedcomponent.js'}).then(importsAreReady);

function importsAreReady(imports) {
  var RenderedComponent = imports.RenderedComponent;

  function ContainerComponent(params) {
    this.mainPxElement = null;
    this.componentList = [];
    RenderedComponent.call(this, params);
  };

  ContainerComponent.prototype = new RenderedComponent(); //Object.create(RenderedComponent.prototype);
  ContainerComponent.prototype.constructor = ContainerComponent;
  ContainerComponent.prototype.baseClass = RenderedComponent.prototype.constructor;

  ContainerComponent.prototype.initialize = function () {
  };

  ContainerComponent.prototype.render = function (params) {
    this.showObject("ContainerComponent render params", params);
    this.mainPxElement = scene.create({
      t: "object",
      parent: params.pxParent,
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      clip: false
    });

    for (var k = 0; k < this.componentList.length; ++k) {
      this.componentList[k].render(params);
    }
  }

  ContainerComponent.prototype.unrender = function (parent) {

    for (var k = 0; k < this.componentList.length; ++k) {
      this.componentList[k].unrender();
    }

    if (this.mainPxElement != null) {
      this.mainPxElement.visible = false;
      this.mainPxElement.remove();
    }
  }

  ContainerComponent.prototype.addChild = function (component) {
    this.componentList.push(component);
  };

  ContainerComponent.prototype.handleKeyDown = function (keyEvent) {
    console.log("TJC: ContainerComponent#handleKeyDown()");
    //TODO - work on focus selection

    for (var k = 0; k < this.componentList.length; ++k) {
      px.log.message(2, "TJC: ContainerComponent#handleKeyDown() - call component " + k);
      this.componentList[k].handleKeyDown(keyEvent);
    }

  }


  module.exports = ContainerComponent;

}
