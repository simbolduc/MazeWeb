import Square from "./Square.js"

export default class Maze {

    #mazeElement // HTML Element representing the maze
    #width // How many squares are in the X dimension
    #height // How many squares are in the Y dimension
    #squareCount // How much squares are in total
    #squares = [] // List of all squares generated in the maze
    #startSquare = null // Start square object
    #stopSquare = null // Stop square object

    constructor(width, height, maze) {
        this.#width = width
        this.#height = height
        this.#mazeElement = maze
        this.#squareCount = this.#width * this.#height

        this.#init()
    }

    #init() {
        let mazeWidth = this.#mazeElement.offsetWidth
        let squareLength = Math.floor(mazeWidth / this.#width)
        this.#mazeElement.innerHTML = '' // Clear previous maze
        this.#createSquares(squareLength)
        this.#draw()
    }

    #createSquares(squareLength, count = 0) {
        if(count === this.#squareCount)
            return

        if(count % this.#width === 0) {
            let row = document.createElement('div')
            row.classList.add('row', 'w-full', 'flex', 'flex-wrap', 'justify-center', 'items-center')
            row.dataset.row = ((count % this.#width) + Math.floor(count / this.#width)) + ''
            this.#mazeElement.append(row)
        }

        let rows = this.#mazeElement.getElementsByClassName('row')
        let lastRow = rows[rows.length - 1]

        let square = document.createElement('div')
        square.style.width = (squareLength - 1) + 'px'
        square.style.height = (squareLength - 1) + 'px'
        square.classList.add('square')

        lastRow.append(square)
        this.#squares.push(new Square(this, square, rows.length - 1, lastRow.children.length - 1))

        return this.#createSquares(squareLength, ++count)
    }

    #draw() {
        let visited = 0
        let history = []

        let nextSquare
        let currentSquare
        let nextSquareData
        history.push(this.#squares[0])
        while(visited < this.#squareCount && history.length >= 1) {
            currentSquare = history[history.length - 1]
            currentSquare.setAsVisited(true)

            if(!this.#hasUnvisitedNeighbor(currentSquare)) {
                history.pop()
                continue
            }

            nextSquareData = this.#getUnvisitedSquare(currentSquare)
            nextSquare = nextSquareData[0]

            if(nextSquare === null)
                continue

            nextSquare.setAsVisited(true)
            currentSquare.setVisitedSide(nextSquareData[1])
            history.push(nextSquare)
            visited++
        }

        this.#squares.forEach(square => {
            square.draw(this.#getNeighbors(square))
        })
    }

    #hasUnvisitedNeighbor(square) {
        let neighbor
        for(let i = 0; i < 4; i++) {
            neighbor = this.getSquareAtDirection(square, i)
            if(neighbor !== null && !neighbor.isVisited()) {
                return true
            }
        }

        return false
    }

    getSquareAtDirection(square, direction) {
        let row = square.getRow()
        let column = square.getColumn()

        if(direction === 0)
            row -= 1
        if(direction === 1)
            column += 1
        if(direction === 2)
            row += 1
        if(direction === 3)
            column -= 1

        if(row >= this.#height || row < 0 || column >= this.#width || column < 0) {
            return null
        }

        return this.#getSquare(row, column)
    }

    #getSquare(row, column) {
        return this.#squares[row * this.#width + column]
    }

    #getUnvisitedSquare(square) {
        let sides = [0, 1, 2, 3]
        let neighbor = null
        while(sides.length > 0) {
            sides = sides.sort(() => 0.5 - Math.random())
            neighbor = this.getSquareAtDirection(square, sides[0])
            if(neighbor === null || neighbor.isVisited()) {
                neighbor = null
                sides.shift()
                continue
            }

            return [neighbor, sides[0]]
        }
        return null
    }

    #getNeighbors(square) {
        return [
            this.getSquareAtDirection(square, 0),
            this.getSquareAtDirection(square, 1),
            this.getSquareAtDirection(square, 2),
            this.getSquareAtDirection(square, 3)
        ]
    }

    getSquares() {
        return this.#squares
    }

    setPosition(square) {
        if(this.#startSquare === null) {
            this.#startSquare = square
            square.getElement().style.backgroundColor = '#AED581'
            return
        }
        if(this.#stopSquare === null) {
            this.#stopSquare = square
            square.getElement().style.backgroundColor = '#EF5350'
        }
    }

    arePositionsSet() {
        return this.#startSquare !== null && this.#stopSquare !== null
    }

    findPath() {
        const array = []

        const start = this.#startSquare
        const end = this.#stopSquare

        const visited = new Map()
        visited.set(start, null)

        let current = start
        let adjacents = current.getAdjacents()
        while(current !== end){

            adjacents = current.getAdjacents()
            for (let i = 0; i < adjacents.length; i++) {
                const adj = adjacents[i]
                if(adj === null || visited.has(adj)) continue

                visited.set(adj, current)
                array.push(adj)
            }

            current = array.shift()
        }

        /*
        * Build path
        * */
        let path = [current]
        while(current !== this.#startSquare){
            current = visited.get(current)
            path.unshift(current)
        }

        /*
        * Draw path
        * */
        let i = 1
        let int = setInterval(()=>{
            if(i === path.length){
                clearInterval(int)
                return
            }

            let square = path[i]

            if(square !== this.#stopSquare) {
                square.getElement().style.backgroundColor = "#F5D637"
            }

            i++
        }, 25)

    }
}
