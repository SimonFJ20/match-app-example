import { generateId } from "./utils";

export type ComponentUpdater = (full?: boolean) => void;

export abstract class Component {
    protected abstract onRender(): string;
    protected abstract onHydrate(update: ComponentUpdater): void;

    private elementId = generateId();

    public render() {
        this.elementId = generateId();
        return html`<div id="${this.elementId}">${this.onRender()}</div>`;
    }

    public hydrate(update: ComponentUpdater) {
        const rerenderAndHydrate = () => {
            domSelectId(this.elementId).innerHTML = this.onRender();
            requestAnimationFrame(() => {
                this.onHydrate((full) => {
                    return full ? update(true) : rerenderAndHydrate()
                })
            })
        }
        this.onHydrate((full) => {
            return full ? update(true) : rerenderAndHydrate()
        });
    }
}

export function renderApp(app: Component) {
    document.body.innerHTML = app.render();
    requestAnimationFrame(() => {
        app.hydrate(() => renderApp(app));
    })
}

export function domSelectId<T extends HTMLElement>(id: string): T {
    const result = document.querySelector<T>("#" + id);
    if (!result) {
        throw new Error("Could not find element from id: " + id);
    }
    return result;
}

export function domAddEvent<
    T extends HTMLElement,
    K extends keyof HTMLElementEventMap,
>(
    id: string,
    type: K,
    listener: (this: T | HTMLElement, ev: HTMLElementEventMap[K]) => any,
) {
    domSelectId<T>(id).addEventListener<K>(type, listener);
}

export const html = (
    literals: TemplateStringsArray,
    ...substrings: any[]
): string =>
    literals.reduce(
        (acc, literal, i) =>
            acc +
            substrings[i - 1].toString() +
            literal,
    );
