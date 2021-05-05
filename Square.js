export default class Square {

    #maze // Labyrinthe en question
    #element // Élément HTML représentant le carré
    #row // Ligne où le carré est situé
    #column // Colonne où le carré est situé
    #visited = false // Définis si le carré a été visité par l'agorithme ou pas
    #visitedSide = [false, false, false, false] // Liste des côtés ayant été visités (permet de savoir si on met un mur ou pas)
    #walls = [false, false, false, false] // Liste des murs

    // Propriétés CSS pour l'affichage des murs
    static wallDirections = ['border-top', 'border-right', 'border-bottom', 'border-left']

    // Constructeur de l'objet du carré
    constructor(maze, element, row, column) {
        this.#maze = maze
        this.#element = element
        this.#row = row
        this.#column = column
    }

    // Dessiner les murs selon le carré précédent
    draw(neighbors) {
        for(let i = 0; i < Square.wallDirections.length; i++) {
            if(this.#visitedSide[i] === true) continue
            if(neighbors[i] !== null && Square.getReversedSides(neighbors[i].getVisitedSide())[i] === false) continue
            this.#element.style[Square.wallDirections[i]] = '1px solid black'
            this.#walls[i] = true
        }
    }

    // Affichage du tracé jaune permettant de visualiser le chemin le plus court
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

    // Ajoute l'élément HTML permettant d'afficher le tracé pour le carré
    #getLineElement(rotation = false, widthFactor = 1, mt = 0.5, mr = 0.5, mb = 0, ml = 0) {
        let element = document.createElement('div')
        element.classList.add('absolute', 'top-0', 'right-0', 'bottom-0', 'left-0')

        // Création d'un élément HTML avec une ligne selon une position donnée
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

    // Retourne de quel côté est le voisin précisé par rapport au carré présent
    #getWhichNeighbor(neighbor) {
        if(this.#row > neighbor.getRow()) return 0
        if(this.#row < neighbor.getRow()) return 2
        if(this.#column > neighbor.getColumn()) return 3
        if(this.#column < neighbor.getColumn()) return 1
    }

    // Retourne la liste des voisins
    getAdjacents(){
        const adjacents = []

        for(let i = 0; i < Square.wallDirections.length; i++){
            let adj = this.#maze.getSquareAtDirection(this, i)
            if(this.#walls[i]) adj = null

            adjacents.push(adj)
        }

        return adjacents
    }

    // Retourne s'il y a un mur sur un côté donné
    isClosed(side){
        return this.#walls[side]
    }

    // Retourne la ligne du carré
    getRow() {
        return this.#row
    }

    // Retourne la colonne du carré
    getColumn() {
        return this.#column
    }

    // Retourne l'élément HTML réprésentant le carré
    getElement() {
        return this.#element
    }

    // Retourne si la case a été visitée
    isVisited() {
        return this.#visited
    }

    // Définis le carré comme visité et, en même temps, définis sa couleur
    setAsVisited(value) {
        this.#visited = value
        if(value) {
            this.#element.style.backgroundColor = '#CFD8DC'
        }
    }

    // Définis un côté comme visité au carré
    setVisitedSide(side) {
        this.#visitedSide[side] = true
    }

    // Retourne les côtés selon s'ils ont été visités
    getVisitedSide() {
        return this.#visitedSide
    }

    // Retourne les côtés opposés aux côtés envoyés
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
