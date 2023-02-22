import { Component, ComponentUpdater, domAddEvent, html, renderApp } from "./framework";
import { generateId } from "./utils";

class Counter extends Component {
    private buttonId = generateId();
    private buttonId2 = generateId();
    private count = 0;

    protected onRender(): string {
        return html`
            <h2>${this.count}</h2>
            <button id="${this.buttonId}">Increment</button>
            <button id="${this.buttonId2}">Reeeeee</button>
        `;
    }

    protected onHydrate(update: ComponentUpdater): void {
        domAddEvent(this.buttonId, "click", () => {
            this.count += 1;
            return update();
        });
        domAddEvent(this.buttonId2, "click", () => {
            return update(true);
        });
    }
}

class Router extends Component {
    private counter = new Counter();

    protected onRender(): string {
        return this.counter.render();
    }

    protected onHydrate(update: ComponentUpdater): void {
        return this.counter.hydrate(update);
    }
}

class Layout extends Component {
    private renderCount = 0;
    private router = new Router();

    protected onRender() {
        this.renderCount += 1;
        return html`
            <h1>fuck 'em all ${this.renderCount}</h1>
            ${this.router.render()}
        `;
    }

    protected onHydrate(update: ComponentUpdater): void {
        this.router.hydrate(update);
    }
}

renderApp(new Layout());

