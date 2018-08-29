import { Component, Prop, Event, EventEmitter } from "@stencil/core";
import xss from "xss";

@Component({
  tag: "teddyt-header",
  styleUrls: [
    "header.scss"
  ]
})
export class Header {
  // The name of the project
  @Prop({ mutable: true }) private projectName: string = "Untitled";

  // A buffer fed while editing the project's name
  private projectNameBuffer: string;

  @Event() private projectNameChanged: EventEmitter<string>;
  @Event() private saveProject: EventEmitter<string>;
  @Event() private newProject: EventEmitter<null>;

  // A reference to the h1 element hosting the project's name
  private projectNameRef: HTMLElement;

  // Closes the project's name editing
  private closeName() {
    return this.projectNameRef.blur();
  }

  // Closes the project's name editing and save the name
  private closeNameAndSave() {
    if (this.projectName != this.projectNameBuffer) {
      this.projectName = this.projectNameBuffer;
      this.projectNameChanged.emit(this.projectName);
    }

    return this.closeName();
  }

  // Closes the project's name editing without saving the name
  private closeNameWithoutSaving() {
    this.projectNameRef.innerText = this.projectName;
    return this.closeName();
  }

  // Handles input on the project's name editing
  private handleNameChange(e: TextEvent) {
    this.projectNameBuffer = xss((e.target as HTMLElement).innerText);
  }

  // Handles paste on the project's name editing
  private handlePaste(e: ClipboardEvent) {
    const data: string = e.clipboardData.getData("Text");

    if ((this.projectNameRef.innerText + data).length > 30) {
      return e.preventDefault();
    }
  }

  // Handles drag and drop on the project's name editing
  private handleDragAndDrop(e: DragEvent) {
    const data: string = e.dataTransfer.getData("Text");

    if ((this.projectNameRef.innerText + data).length > 30) {
      return e.preventDefault();
    }
  }

  private handleSaveProject() {
    return this.saveProject.emit(this.projectName);
  }

  private handleNewProject() {
    return this.newProject.emit();
  }

  // Handles key strokes like Enter or Escape on the project's name editing
  private handleKeyBindings(e: KeyboardEvent) {
    // Checks for the Enter key
    if (e.keyCode === 13) {
      if (this.projectNameBuffer.length === 0 || this.projectNameBuffer.length > 30) {
        this.closeNameWithoutSaving();
      } else {
        this.closeNameAndSave();
      }

      return e.preventDefault();
    }

    // Checks for the Escape key
    if (e.keyCode === 27) {
      return this.closeNameWithoutSaving();
    }

    // Checks for NOT the Backspace key
    if (e.keyCode !== 8 && (e.target as HTMLElement).innerText.length > 30) {
      return e.preventDefault();
    }
  }

  render(): JSX.StencilJSX {
    return (
      <header class="has-background-secondary">
        <img src="/assets/images/logo.svg" class="logo" alt="teddyt logo">Logo</img>
        <div class="project-name-box">
          <h1 class="title teddyt-has-text-primary is-marginless has-text-weight-bold" 
            contentEditable
            onKeyDown={this.handleKeyBindings.bind(this)} 
            onInput={this.handleNameChange.bind(this)}
            onPaste={this.handlePaste.bind(this)}
            onDrop={this.handleDragAndDrop.bind(this)}
            ref={(el: HTMLElement) => {this.projectNameRef = el}}
            >{this.projectName}</h1>
          <i class="fas fa-edit teddyt-has-text-icon"></i>
        </div>
        <div class="control-box">
          <button class="button is-outlined is-primary" onClick={this.handleNewProject.bind(this)}>New project</button>
          <button class="button is-danger" onClick={this.handleSaveProject.bind(this)}>Save</button>
        </div>
      </header>
    )
  }
}