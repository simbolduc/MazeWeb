import Maze from './Maze.js'

let widthElement = document.getElementById('x-length')
let heightElement = document.getElementById('y-length')
let mazeElement = document.getElementById('maze')

let maze = null

document.getElementById('gen-btn').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()


    let width = widthElement.value
    let height = heightElement.value

    if(!/^\d+$/.test(width) || !/^\d+$/.test(height)) {
        notify('Erreur de paramètres', 'Les paramètres de dimensions doivent être des entiers numériques')
        return;
    }

    width = parseInt(width)
    height = parseInt(height)

    if(width < 10 || width > 50 || width % 10 !== 0 || height < 10 || height > 50 || height % 10 !== 0) {
        notify('Erreur de paramètres', 'Les paramètres de dimensions doivent être un multiple de 10 dans l\'intervalle [10,50]')
        return;
    }

    maze = new Maze(width, height, mazeElement)

    maze.getSquares().forEach(square => {
        square.getElement().addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()

            maze.setPosition(square)
        })
    })

    notify('Sélection des positions', 'Le labyrinthe est créé! Veuillez sélectionner avec le clique de la souris la position de début et de fin.', 'success')
})

document.getElementById('path-btn').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()
    if(maze === null) {
        notify('Aucun labyrinthe', 'Vous devez générer un labyrinthe avant même de trouver le chemin le plus rapide.')
        return
    }

    if(!maze.arePositionsSet()) {
        notify('Positionnements non sélectionnés', 'Veuillez sélectionner avec le clique de la souris la position de début et de fin.')
        return
    }

    maze.findPath()
})

function notify(title, message, type = 'error') {
    const color = type === 'error' ? 'red' : 'green'

    let div = document.createElement('div')
    div.id = 'notification'
    div.className = "fixed top-0 right-0 mt-8 bg-" + color + "-300 p-4 w-96 rounded-l-lg border-solid border-l-4 border-" + color + "-400"
    div.innerHTML = `
                <strong>${title}</strong>
                <p>${message}</p>
            `

    document.body.appendChild(div)
    setTimeout(() => {
        document.body.removeChild(div)
    }, 3000)
}
