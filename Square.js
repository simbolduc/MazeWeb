export default class Square {

    #maze
    #element
    #row
    #column
    #visited = false
    #visitedSide = [false, false, false, false]
    #walls = [false, false, false, false]

    static wallDirections = ['border-top', 'border-right', 'border-bottom', 'border-left']

    constructor(maze, element, row, column) {
        this.#maze = maze
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

    drawPathLine(firstNeighbor, secondNeighbor) {
        if((this.#getWhichNeighbor(firstNeighbor) === 0 && this.#getWhichNeighbor(secondNeighbor) === 2) || (this.#getWhichNeighbor(firstNeighbor) === 2 && this.#getWhichNeighbor(secondNeighbor) === 0))
            this.#getLineElement(true)

        if((this.#getWhichNeighbor(firstNeighbor) === 3 && this.#getWhichNeighbor(secondNeighbor) === 1) || (this.#getWhichNeighbor(firstNeighbor) === 1 && this.#getWhichNeighbor(secondNeighbor) === 3))
            this.#getLineElement()

        if((this.#getWhichNeighbor(firstNeighbor) === 0 && this.#getWhichNeighbor(secondNeighbor) === 1) || (this.#getWhichNeighbor(firstNeighbor) === 1 && this.#getWhichNeighbor(secondNeighbor) === 0)) {
            this.#getLineElement(false, .5, .5, 0, 0, 0.5)
            this.#getLineElement(true, .5, .25, 0, 0, .25)
        }

        if((this.#getWhichNeighbor(firstNeighbor) === 1 && this.#getWhichNeighbor(secondNeighbor) === 2) || (this.#getWhichNeighbor(firstNeighbor) === 2 && this.#getWhichNeighbor(secondNeighbor) === 1)) {
            this.#getLineElement(false, .5, .5, 0, 0, .5)
            this.#getLineElement(true, .5, .75, 0, 0, .25)
        }

        if((this.#getWhichNeighbor(firstNeighbor) === 2 && this.#getWhichNeighbor(secondNeighbor) === 3) || (this.#getWhichNeighbor(firstNeighbor) === 3 && this.#getWhichNeighbor(secondNeighbor) === 2)) {
            this.#getLineElement(false, .5, .5, 0, 0, 0)
            this.#getLineElement(true, .5, .75, 0, 0, .25)
        }

        if((this.#getWhichNeighbor(firstNeighbor) === 3 && this.#getWhichNeighbor(secondNeighbor) === 0) || (this.#getWhichNeighbor(firstNeighbor) === 0 && this.#getWhichNeighbor(secondNeighbor) === 3)) {
            this.#getLineElement(false, .5, .5, .5, 0, 0)
            this.#getLineElement(true, .5, .25, 0, 0, .25)
        }
    }

    #getLineElement(rotation = false, widthFactor = 1, mt = 0.5, mr = 0.5, mb = 0, ml = 0) {
        let element = document.createElement('div')
        element.classList.add('absolute', 'top-0', 'right-0', 'bottom-0', 'left-0')

        let line = document.createElement('div')
        let width = parseInt(this.#element.style.width.replace('px', ''))
        line.classList.add('h-1', 'bg-yellow-400', 'line')
        if(rotation) line.classList.add('transform', 'rotate-90')
        line.style.marginTop = (width * mt) + 'px'
        line.style.marginRight = (width * mr) + 'px'
        line.style.marginBottom = (width * mb) + 'px'
        line.style.marginLeft = (width * ml) + 'px'
        line.style.width = (width * widthFactor) + 'px'

        element.append(line)
        this.#element.append(element)
    }

    #getWhichNeighbor(neighbor) {
        if(this.#row > neighbor.getRow()) return 0
        if(this.#row < neighbor.getRow()) return 2
        if(this.#column > neighbor.getColumn()) return 3
        if(this.#column < neighbor.getColumn()) return 1
    }

    getAdjacents(){
        const adjacents = []

        for(let i = 0; i < Square.wallDirections.length; i++){
            let adj = this.#maze.getSquareAtDirection(this, i)
            if(this.#walls[i]) adj = null

            adjacents.push(adj)
        }

        return adjacents
    }

    isClosed(side){
        return this.#walls[side]
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
