import Square from "./Square.js"

export default class Maze {

    #mazeElement // Élément HTML représentant le labyrinthe
    #width // Nombre de carrés en X
    #height // Nombre de carrés en Y
    #squareCount // Nomnbre de carrés au total
    #squares = [] // Liste de tous les carrés dans le labyrinthe
    #startSquare = null // Case de départ
    #stopSquare = null // Case de fin

    // Constructeur permettant la génération initiale du labyrinthe
    constructor(width, height, maze) {
        this.#width = width
        this.#height = height
        this.#mazeElement = maze
        this.#squareCount = this.#width * this.#height

        this.#init()
    }

    // Initialisation du labyrinthe
    #init() {
        let mazeWidth = this.#mazeElement.offsetWidth
        let squareLength = Math.floor(mazeWidth / this.#width) // On divise la largeur totale du labyrinthe par le nombre de carrés en X pour obtenir la largeur d'un carré
        this.#mazeElement.innerHTML = '' // Clear previous maze
        this.#createSquares(squareLength)
        this.#draw()
    }

    // Ajout des carrés initialement vides du labyrinthe
    #createSquares(squareLength, count = 0) {
        if(count === this.#squareCount)
            return

        // Chaque fois qu'une ligne est pleine, ajouté une nouvelle
        if(count % this.#width === 0) {
            // Création d'un élément HTML représentant une ligne
            let row = document.createElement('div')
            row.classList.add('row', 'w-full', 'flex', 'flex-wrap', 'justify-center', 'items-center')
            row.dataset.row = ((count % this.#width) + Math.floor(count / this.#width)) + ''
            this.#mazeElement.append(row)
        }

        let rows = this.#mazeElement.getElementsByClassName('row')
        let lastRow = rows[rows.length - 1]

        // Création d'un élément HTML représentant un carré
        let square = document.createElement('div')
        square.style.width = (squareLength - 1) + 'px'
        square.style.height = (squareLength - 1) + 'px'
        square.classList.add('square', 'relative')

        lastRow.append(square)
        this.#squares.push(new Square(this, square, rows.length - 1, lastRow.children.length - 1))

        return this.#createSquares(squareLength, ++count)
    }

    // Algorithme de "back-tracking" permettant de générer les ouvertures de murs et les dessiner pour finalement créer le labyrinthe
    #draw() {
        let visited = 0
        let history = []

        let nextSquare
        let currentSquare
        let nextSquareData
        history.push(this.#squares[0])
        // L'algorithme bouge dans les cases jusqu'attend qu'il ait visité tous les carrés
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

    // Retourne si la carré paramétré a un voisin non-visité
    #hasUnvisitedNeighbor(square) {
        let neighbor
        for(let i = 0; i < 4; i++) {
            neighbor = this.getSquareAtDirection(square, i)
            if(neighbor !== null && !neighbor.isVisited()) { // Si le voisin existe et qu'il n'est pas retourné, retourner VRAI
                return true
            }
        }

        return false
    }

    // Retourne le carré à la direction donnée relativement à un carré précisé
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

    // Retourne le carré selon une ligne et une colonne donnée
    #getSquare(row, column) {
        return this.#squares[row * this.#width + column]
    }

    #getUnvisitedSquare(square) {
        let sides = [0, 1, 2, 3]
        let neighbor = null
        while(sides.length > 0) {
            sides = sides.sort(() => 0.5 - Math.random())
            neighbor = this.getSquareAtDirection(square, sides[0])
            if(neighbor === null || neighbor.isVisited()) { // Si le carré est hors du labyrinthe ou est visité, bouger le curseur
                neighbor = null
                sides.shift()
                continue
            }

            return [neighbor, sides[0]]
        }
        return null
    }

    // Retourne les 4 voisins d'un carré
    #getNeighbors(square) {
        return [
            this.getSquareAtDirection(square, 0),
            this.getSquareAtDirection(square, 1),
            this.getSquareAtDirection(square, 2),
            this.getSquareAtDirection(square, 3)
        ]
    }

    // Retourne la liste des carrés du labyrinthe
    getSquares() {
        return this.#squares
    }

    // Définis les points clefs du labyrinthe (début et fin)
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

    // Retourne VRAI ou FAUX si les positions de début et de fin sont sélectionnées
    arePositionsSet() {
        return this.#startSquare !== null && this.#stopSquare !== null
    }

    // Algorithme permettant de tracer un tracé du chemin le plus court
    // en partant du point de début vers le point de la fin
    findPath() {
        const array = []

        const start = this.#startSquare
        const end = this.#stopSquare

        const visited = new Map() //Map contenant en clé: un voisin et en valeur le prédecesseur.
        visited.set(start, null)

        let current = start //Le premier sommet est la case départ sélectionné par l'utilisateur.
        let adjacents = current.getAdjacents() //On récupère les sommets voisins
        while (current !== end) {

            adjacents = current.getAdjacents()
            for (let i = 0; i < adjacents.length; i++) { //On traite chacun des voisins non-visités.
                const adj = adjacents[i]
                if (adj === null || visited.has(adj)) continue

                visited.set(adj, current) // On ajoute le voisin et son prédécesseur dans la Map
                array.push(adj) //On ajoute le voisin dans le tableau comme ça il est traité lui aussi
            }

            current = array.shift()
        }

        /*
        * Construction du chemin
        * */
        let path = [current]
        while (current !== this.#startSquare) { //Boucle permettant de reconstruire le chemin le plus court en remontant le graphe.
            current = visited.get(current)
            path.unshift(current)
        }

        /*
        * Dessin progressif du chemin (tracé ligné)
        * */
        let i = 1
        let square
        let int = setInterval(() => {
            if (i === path.length) {
                clearInterval(int)
                return
            }

            square = path[i]
            if (square !== this.#stopSquare)
                square.drawPathLine(path[i - 1], path[i + 1])

            i++
        }, 25)
    }

}
