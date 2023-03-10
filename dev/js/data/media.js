var media = {
    img: {
        sprites: {
            player: {
                file: 'player',
                tilesize: 20
            },
            spawn: {
                file: 'spawn',
                tilesize: 20
            },
            door: {
                file: 'door',
                tilewidth: 22,
                tileheight: 42
            },
            button: {
                file: 'button',
                tilewidth: 17,
                tileheight: 16
            },
            laser: {
                file: 'laser',
                tilewidth: 17,
                tileheight: 16
            },
            platform: {
                file: 'platform',
                tilewidth: 38,
                tileheight: 14
            }
        },
        debug: {
            placeholder: {
                file: 'tileset_16_16.jpg',
                tilesize: 16
            }
        },
        info: {
            file: 'info',
            tilesize: 30
        },
        tilesets: {
            main: {
                file: 'main_tileset',
                tileheight: 21,
                tilewidth: 22,
                definition: {}
            }
        }
    },
    sfx: {
        pabam: {
            file: 'success.mp3'
        },
        click: {
            file: 'ui_click.mp3'
        },
        correct: {
            file: 'correct.mp3',
            volume: 10
        },
        wrong: {
            file: 'wrong.mp3',
            volume: 10
        },
        on: {
            file: 'on.mp3'
        },
        off: {
            file: 'off.mp3'
        },
        transform: {
            file: 'transform.mp3'
        },
        fall: {
            file: 'fall.mp3',
            volume: 10
        },
        jump: {
            file: 'jump.mp3',
            volume: 10
        },
        sparkle: {
            file: 'sparkle.mp3'
        },
        fail: {
            file: 'fail.mp3'
        }
    },
    data: {
        levels: {
            intro: {
                file: 'intro',
                title: ''
            },
            end: {
                title: "The end.. for now",
                morphs: {},
                file: 'end',
                next: '0'
            },
            0: {
                title: "Know your keys",
                morphs: {
                    'Spawn.Immovable': 1
                },
                file: '0',
                next: '1'
            },
            1: {
                title: "Building up",
                morphs: {
                    'Spawn.Immovable': 2
                },
                file: '1',
                next: '2'
            },
            2: {
                title: "Know your jump",
                morphs: {
                    'Spawn.Immovable': 1
                },
                file: '2',
                next: '3'
            },
            3: {
                title: "Efficient building",
                morphs: {
                    'Spawn.Immovable': 3
                },
                file: '3',
                next: '4'
            },
            4: {
                title: "Introducing death",
                morphs: {
                    'Spawn.Immovable': 2
                },
                file: '4',
                next: '5'
            },
            5: {
                title: "New transform",
                morphs: {
                    'Spawn.Immovable': 2,
                    'Spawn.Movable': 1
                },
                file: '5',
                next: '6'
            },
            6: {
                title: "Buttons.. and doors",
                morphs: {
                    'Spawn.Movable': 2
                },
                file: '6',
                next: '7'
            },
            7: {
                title: "The way around",
                morphs: {
                    'Spawn.Immovable': 2,
                    'Spawn.Movable': 1
                },
                file: '7',
                next: '8'
            },
            8: {
                title: "Lasers hurt",
                morphs: {
                    'Spawn.Movable': 2
                },
                file: '8',
                next: '9'
            },
            9: {
                title: "Platforms move",
                morphs: {
                    'Spawn.Movable': 2,
                    'Spawn.Immovable': 2
                },
                file: '9',
                next: '10'
            },
            10: {
                title: "The need of a bridge",
                morphs: {
                    'Spawn.Floater': 2,
                    'Spawn.Movable': 1,
                    'Spawn.Immovable': 1
                },
                file: '10',
                next: '11'
            },
            11: {
                title: "Rise like a balloon",
                morphs: {
                    'Spawn.Upfloater': 1,
                    'Spawn.Floater': 1
                },
                file: '12',
                next: '12'
            },
            12: {
                title: "Protection is a must",
                morphs: {
                    'Spawn.Movable': 3
                },
                file: 't_3',
                next: '13'
            },
            13: {
                title: "Timing matters",
                morphs: {
                    'Spawn.Immovable': 4,
                },
                file: 't_6',
                next: '14'
            },
            14: {
                title: "Up we go with the elevator",
                morphs: {
                    'Spawn.Floater': 1,
                    'Spawn.Movable': 1,
                    'Spawn.Upfloater': 2
                },
                file: '11',
                next: '15'
            },
            15: {
                title: "Lasers are dangerous",
                morphs: {
                    'Spawn.Movable': 2,
                    'Spawn.Floater': 1
                },
                file: 't_0',
                next: '16'
            },
            16: {
                title: "Lasers are unforgiving",
                morphs: {
                    'Spawn.Movable': 2,
                    'Spawn.Immovable': 1,
                    'Spawn.Floater': 1
                },
                file: 't_1',
                next: '17'
            },
            17: {
                title: "Building walls",
                morphs: {
                    'Spawn.Upfloater': 1,
                    'Spawn.Immovable': 2
                },
                file: 't_2',
                next: '18'
            },
            18: {
                title: "Up and away",
                morphs: {
                    'Spawn.Movable': 1,
                    'Spawn.Immovable': 3,
                    'Spawn.Upfloater': 1
                },
                file: 't_7',
                next: '19'
            },
            19: {
                title: "That one laser..",
                morphs: {
                    'Spawn.Movable': 4,
                    'Spawn.Immovable': 1,
                    'Spawn.Floater': 2
                },
                file: 't_5',
                next: '20'
            },
            20: {
                title: "Sequence of lasers",
                morphs: {
                    'Spawn.Movable': 2,
                    'Spawn.Immovable': 1,
                    'Spawn.Floater': 2,
                    'Spawn.Upfloater': 1
                },
                file: 't_4',
                next: '21'
            },
            21: {
                title: "Short but dangerous",
                morphs: {
                    'Spawn.Movable': 1,
                    'Spawn.Immovable': 2
                },
                file: 't_8',
                next: 'end'
            }
        }
    }
}

module.exports = media;
