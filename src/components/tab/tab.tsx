import { Component, Prop, EventEmitter, Event } from "@stencil/core";

@Component({
  tag: "teddyt-tab",
  styleUrl: "./tab.scss"
})
export class Tab {
  // The tab name (the "file" name if you prefer)
  @Prop() private tabName: string = "Untitled";

  // The icon corresponding to the file extension (tabIcon is the class of the icon)
  @Prop() private tabIcon: string = "far fa-file teddyt-has-text-icon";

  // The state of the tab (either active or not, active means that the file is being edited)
  @Prop() private isTabActive: boolean = true;

  // Triggered when the tab goes closed
  @Event() private tabClosed: EventEmitter<string>;

  // Triggered when the tab is clicked and therefore active
  @Event() private tabActive: EventEmitter<string>;

  // Emits tabClosed event
  private handleClose() {
    this.tabClosed.emit(this.tabName);
  }

  // Emits tabActive event
  private handleActive() {
    this.tabActive.emit(this.tabName);
  }

  render() {
    return (
      <li
        class={`${this.isTabActive ? "active" : null}`}
        onClick={this.handleActive.bind(this)}>
        <i 
          class={this.tabIcon}
          onMouseDown={(e: MouseEvent) => e.preventDefault()}></i>
        <a 
          class="teddyt-has-text-primary is-paddingless is-unselectable" 
          onMouseDown={(e: MouseEvent) => e.preventDefault()}>{this.tabName}</a>
        <i class={`fas fa-times cross`} onClick={this.handleClose.bind(this)}></i>
      </li>
    );
  }
}