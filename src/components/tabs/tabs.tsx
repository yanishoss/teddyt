import { Component, Prop, Watch, Listen, Element } from "@stencil/core";
import { getDifferences } from "../../utils/getDifferences";

export interface ITabData {
  tabName: string;
  tabIcon?: string;
  isTabActive: boolean;
}

export type ITabsData = ITabData[];

@Component({
  tag: "teddyt-tabs",
  styleUrl: "./tabs.scss"
})
export class Tabs {
  // The tabs informations (see ITabData and ITabsData)
  @Prop() private tabsData: ITabsData = [];

  // The area of the tab the user clicked (used to move correctly the tab) 
  private draggedTabX: number;

  // The tab currently being dragged
  private draggedTab: HTMLElement;

  // A reference to this element
  @Element() private element: HTMLElement;

  // A map mapping tab names to their respective reference
  private tabsRefs: { [tabName: string]: HTMLElement };

  // Deletes the references of the deleted tabs
  @Watch("tabsData")
  deleteRefs(newTabsData, oldTabsData) {
    getDifferences(oldTabsData, newTabsData).forEach((tabName: string) => {
      delete this.tabsRefs[tabName];
    });
  }

  // Starts the draggable mode
  @Listen("mousedown")
  enableDraggableMode(e: MouseEvent) {
    if (e.srcElement["s-hn"] === "teddyt-tab" && !e.srcElement.classList.contains("cross")) {
      const tabKey: string = Object.keys(this.tabsRefs).find((key: string) => {
        return this.tabsRefs[key].contains(e.srcElement);
      });

      this.draggedTab = this.tabsRefs[tabKey];
      this.draggedTabX = e.clientX - this.element.offsetLeft - this.draggedTab.offsetLeft;
    }
  }

  // Disables the draggable mode
  @Listen("mouseup")
  disableDraggableMode() {
    if (this.draggedTab) {
      const tabs: HTMLElement[] = Object.keys(this.tabsRefs).map((k: string) => this.tabsRefs[k]);
      const tab: HTMLElement = tabs.find((el) => this.draggedTab.offsetLeft >= el.offsetLeft && this.draggedTab.offsetLeft <= el.offsetLeft + this.draggedTab.offsetWidth && el !== this.draggedTab);

      const order: number = parseInt(tab.style.order);

      // Assumes that if the tab is forward another one, the tab will be placed forward 
      // Else backward
      if (this.draggedTab.offsetLeft >= tab.offsetLeft + tab.offsetWidth / 2) {
        this.draggedTab.style.order = String(order + 1);

        // Remaps the correct order for the next elements
        tabs.forEach((el: HTMLElement) => {
          if (el !== this.draggedTab && parseInt(el.style.order) >= order + 1) {
            el.style.order = String(parseInt(el.style.order) + 1);
          }
        });
      } else {
        this.draggedTab.style.order = String(order - 1);

        // Remaps the correct order for the previous elements
        tabs.forEach((el: HTMLElement) => {
          if (el !== this.draggedTab && parseInt(el.style.order) <= order - 1) {
            el.style.order = String(parseInt(el.style.order) - 1);
          }
        });
      }

      this.draggedTab.style.position = "initial";
      this.draggedTab = null;
    }
  }

  // Moves the tab
  @Listen("mousemove")
  dragTab(e: MouseEvent) {
    if (this.draggedTab) {
      this.draggedTab.style.position = "absolute";
      const posX: number = e.clientX - this.element.offsetLeft - this.draggedTabX;

      // Limits the area to the tabs zone
      if (posX + this.element.offsetLeft >= this.element.offsetLeft && posX + this.draggedTab.offsetWidth + this.element.offsetLeft <= this.element.offsetLeft + this.element.offsetWidth) {
        this.draggedTab.style.left = `${String(posX)}px`;
      }
    }
  }

  render() {
    return (
      <section>
        {this.tabsData.map(
          ({ tabName, tabIcon, isTabActive }, i: number) => (
            <teddyt-tab
              tabName={tabName}
              tabIcon={tabIcon}
              isTabActive={isTabActive}
              ref={(e: HTMLElement) => {
                e.style.order = String(i);
                this.tabsRefs = {
                  ...this.tabsRefs,
                  [tabName]: e
                }
              }}></teddyt-tab>
          )
        )}
      </section>
    );
  }
}