let GameParams = {

    level: {
        1: {speed: 500, points: 100},
        2: {speed: 300, points: 200},
        3: {speed: 100, points: 300},
        4: {speed: 50, points: 999999},
    },

    size: {
        x: 10,
        y: 25,
    },

    blockTypes: {
        1: [
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
        ],
        2: [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
        ],
        3: [
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 1, y: -1},
        ],
        4: [
            {x: 0, y: -1},
            {x: -1, y: -1},
            {x: -1, y: 0},
        ],
        5: [
            {x: -1, y: 0},
            {x: 0, y: -1},
            {x: 1, y: -1},
        ],
        6: [
            {x: -1, y: 0},
            {x: 0, y: -1},
            {x: 1, y: 0},
        ],

        7: [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 1, y: 0},
        ],
    },

    newBlockPosition: {
        x: 5,
        y: 0,
    },

    score: {
        multipleRate: 1.2,
        points: 10
    },

    smallMatrix: {
        x: 5,
        y: 4,
        start: {
            x:3,
            y:3
        }
    }
};

export default GameParams;


