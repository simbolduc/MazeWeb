export default class Square {

    #element
    #row
    #column
    #walls = [false, false, false, false]
    #visited = false

    static #wallDirections = ['border-top', 'border-right', 'border-bottom', 'border-left']

    constructor(element, row, column) {
        this.#element = element
        this.#row = row
        this.#column = column
    }

    draw(direction) {
        // for(let i = 0; i < 4; i++) {
        //     if(i === direction) {
        //         this.#walls[i] = false
        //         this.#element.style[Square.#wallDirections[i]] = 'none'
        //     }
        // }
    }

    getRow() {
        return this.#row
    }

    getColumn() {
        return this.#column
    }

    isVisited() {
        return this.#visited
    }

    setAsVisited(value) {
        this.#visited = value
        if(value) {
            this.#element.style.backgroundColor = '#CFD8DC'
        }
    }

    getElement() {
        return this.#element
    }

}