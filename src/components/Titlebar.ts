import {    } from '../utils/helpers';      

export class Titlebar {
    private titleElement: HTMLElement;

    constructor(title: string) {
        this.titleElement = document.createElement('div');
        this.titleElement.className = 'titlebar';
        this.titleElement.innerText = title;
        this.initDrag();
    }

    private initDrag() {
        (this.titleElement);
    }

    public render(parent: HTMLElement) {
        parent.appendChild(this.titleElement);
    }
}