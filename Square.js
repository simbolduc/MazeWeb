export default class Square {

    #element
    #row
    #column
    #visited = false
    #visitedSide = [false, false, false, false]
    #walls = [false, false, false, false]

    static wallDirections = ['border-top', 'border-right', 'border-bottom', 'border-left']

    constructor(element, row, column) {
        this.#element = element
        this.#row = row
        this.#column = column
    }

    draw(neighbors) {
        for(let i = 0; i < Square.wallDirections.length; i++) {
            if(this.#visitedSide[i] === true) continue
            if(neighbors[i] !== null && Square.getReversedSides(neighbors[i].getVisitedSide())[i] === false) continue
            this.#element.style[Square.wallDirections[i]] = '1px solid black'
            this.#walls[i] = true
        }
    }

    getRow() {
        return this.#row
    }

    getColumn() {
        return this.#column
    }

    getElement() {
        return this.#element
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
        this.#visitedSide[side] = true
    }

    getVisitedSide() {
        return this.#visitedSide
    }

    static getReversedSides(sides) {
        let reversed = []
        for (let i = 0; i < sides.length; i++) {
            if(i === 0) reversed.push(!sides[2])
            if(i === 1) reversed.push(!sides[3])
            if(i === 2) reversed.push(!sides[0])
            if(i === 3) reversed.push(!sides[1])
        }
        return reversed
    }

}