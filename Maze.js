import Square from "./Square.js";

export default class Maze {

    #mazeElement // HTML Element representing the maze
    #width // How many squares are in the X dimension
    #height // How many squares are in the Y dimension
    #squareCount // How much squares are in total
    #squares = []

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
        // console.log(this.#squares)
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
        // square.style.border = '1px solid #212121'
        lastRow.append(square)
        this.#squares.push(new Square(square, rows.length - 1, lastRow.children.length - 1))

        return this.#createSquares(squareLength, ++count)
    }

    #draw() {
        let visited = 0
        let history = []

        let nextSquare
        let currentSquare
        let nextSquareData
        history.push(this.#squares[0])
        while(visited < this.#squareCount) {
            if(history.length < 1) {
                // console.log('ca a break')
                break
            }
            currentSquare = history[history.length - 1]
            currentSquare.setAsVisited(true)

            if(!this.#hasUnvisitedNeighbor(currentSquare)) {
                // console.log('ici1')
                // console.log(currentSquare)
                history.pop()
                continue
            }

            nextSquareData = this.#getUnvisitedSquare(currentSquare)
            nextSquare = nextSquareData[0]

            if(nextSquare === null) {
                // console.log('ici2')
                continue
            }

            console.log(nextSquare)

            nextSquare.setAsVisited(true)
            nextSquare.setVisitedSide(nextSquareData[1])
            // currentSquare.draw(nextSquareData[1])
            // nextSquare.draw(nextSquareData[1])
            history.push(nextSquare)
            visited++
        }

        this.#squares.forEach(square => {
            square.draw(this.#getNeighbors(square))
        })
        console.log(this.#squares)
    }

    #hasUnvisitedNeighbor(square) {
        let neighbor
        for(let i = 0; i < 4; i++) {
            neighbor = this.#getSquareAtDirection(square, i)
            if(neighbor !== null && !neighbor.isVisited()) {
                return true
            }
        }

        return false
    }

    #getSquareAtDirection(square, direction) {
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
        let neighbor
        for(let i = 0; i < 4; i++) {
            neighbor = this.#getSquareAtDirection(square, i)
            if(neighbor !== null && !neighbor.isVisited()) {
                return [neighbor, i]
            }
        }

        return null
    }

    #getNeighbors(square) {
        return [
            this.#getSquareAtDirection(square, 0),
            this.#getSquareAtDirection(square, 1),
            this.#getSquareAtDirection(square, 2),
            this.#getSquareAtDirection(square, 3)
        ]
    }

}