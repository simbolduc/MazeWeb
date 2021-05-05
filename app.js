import Maze from './Maze.js'

let widthElement = document.getElementById('x-length') // Champ de largeur
let heightElement = document.getElementById('y-length') // Champ de hauteur
let mazeElement = document.getElementById('maze') // Champ constituant le labyrinthe

let maze = null // Variable du labyrinthe courrant

// Action effectué quand le bouton "Génération du labyrinthe" est cliqué
document.getElementById('gen-btn').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()

    let width = widthElement.value // Largeur
    let height = heightElement.value // Hauteur

    // Afficher une erreur si les champs ne sont pas des nombres entiers
    if(!/^\d+$/.test(width) || !/^\d+$/.test(height)) {
        notify('Erreur de paramètres', 'Les paramètres de dimensions doivent être des entiers numériques')
        return;
    }

    // Convertion des mesures en Integer
    width = parseInt(width)
    height = parseInt(height)

    // Vérification si les grandeurs sont dans l'intervalle autorisée [10,50]
    if(width < 10 || width > 50 || width % 10 !== 0 || height < 10 || height > 50 || height % 10 !== 0) {
        notify('Erreur de paramètres', 'Les paramètres de dimensions doivent être un multiple de 10 dans l\'intervalle [10,50]')
        return;
    }

    // Génération du labyrinthe
    maze = new Maze(width, height, mazeElement)

    // Action effectué lorsque l'utilisateur clique sur une case du labyrinthe (pour la gestion des points de début et de fin)
    maze.getSquares().forEach(square => {
        square.getElement().addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()

            maze.setPosition(square)
        })
    })

    notify('Sélection des positions', 'Le labyrinthe est créé! Veuillez sélectionner avec le clique de la souris la position de début et de fin.', 'success')
})

// Aciton effectué quand l'utilisateur clique sur le bouton "Trouver le chemin le plus court"
document.getElementById('path-btn').addEventListener('click', e => {
    e.preventDefault()
    e.stopPropagation()

    // Afficher une erreur si aucun labyrinthe existe
    if(maze === null) {
        notify('Aucun labyrinthe', 'Vous devez générer un labyrinthe avant même de trouver le chemin le plus rapide.')
        return
    }

    // Afficher une erreur si les positions de départ et de fin ne sont pas définies
    if(!maze.arePositionsSet()) {
        notify('Positionnements non sélectionnés', 'Veuillez sélectionner avec le clique de la souris la position de début et de fin.')
        return
    }

    // Méthode permettant de trouver et d'afficher le tracé du chemin le plus court
    maze.findPath()
})

// Méthode permettant d'afficher dynamiquement les messages d'erreurs et de succès
function notify(title, message, type = 'error') {
    const color = type === 'error' ? 'red' : 'green'

    // Création d'un élément HTML avec les styles nécessaires
    let div = document.createElement('div')
    div.id = 'notification'
    div.className = "fixed top-0 right-0 mt-8 bg-" + color + "-300 p-4 w-96 rounded-l-lg border-solid border-l-4 border-" + color + "-400"
    div.innerHTML = `
                <strong>${title}</strong>
                <p>${message}</p>
            `

    // Afficher le message à l'écran pendant 3 secondes
    document.body.appendChild(div)
    setTimeout(() => {
        document.body.removeChild(div)
    }, 3000)
}
