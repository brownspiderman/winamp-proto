export class Equalizer {
    private frequencies: number[];
    private equalizerElement: HTMLElement;

    constructor(equalizerElement: HTMLElement) {
        this.frequencies = Array(10).fill(0); // Initialize 10 frequency bands
        this.equalizerElement = equalizerElement;
        this.render();
    }

    private render() {
        this.equalizerElement.innerHTML = '';
        this.frequencies.forEach((value, index) => {
            const band = document.createElement('div');
            band.className = 'equalizer-band';
            band.style.height = `${value}px`;
            band.dataset.index = index.toString();
            band.addEventListener('click', () => this.adjustFrequency(index));
            this.equalizerElement.appendChild(band);
        });
    }

    private adjustFrequency(index: number) {
        this.frequencies[index] = this.frequencies[index] === 100 ? 0 : this.frequencies[index] + 10; // Adjust frequency value
        this.render();
    }

    public getFrequencies() {
        return this.frequencies;
    }
}