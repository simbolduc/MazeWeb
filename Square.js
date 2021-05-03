export default class Square {

    #element
    #row
    #column
    #visited = false
    #visitedSide

    static wallDirections = ['border-top', 'border-right', 'border-bottom', 'border-left']

    constructor(element, row, column) {
        this.#element = element
        this.#row = row
        this.#column = column
    }

    draw(neighbors) {
        for(let i = 0; i < Square.wallDirections.length; i++) {
            if(this.#visitedSide) continue
            if(neighbors[i] !== null && neighbors[i].getVisitedSide() === i) continue
            this.#element.style[Square.wallDirections[i]] = '1px solid black'
        }
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

    setVisitedSide(side) {
        this.#visitedSide = side
    }

    getVisitedSide() {
        return this.#visitedSide
    }

    getElement() {
        return this.#element
    }

}