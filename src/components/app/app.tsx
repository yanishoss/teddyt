import { Component } from "@stencil/core";

@Component({
  tag: "teddyt-app",
  styleUrl: "app.scss"
})
export class App {
  render(): JSX.Element {
    return (
      <div>
        <teddyt-header id="header"></teddyt-header>
        <teddyt-tabs id="tabs"></teddyt-tabs>
      </div>
    );
  }
}
