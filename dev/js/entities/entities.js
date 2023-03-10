module.exports = {
    Intro: require('./actions/intro'),
    ChangeSpawn: require('./actions/changespawn'),
    EndLevel: require('./actions/endlevel'),

    Button: require('./scenery/button'),
    Door: require('./scenery/door'),

    Lava: require('./scenery/lava'),
    
    Laser: require('./scenery/laser'),
    LaserBlock: require('./scenery/laserblock'),

    Platform: require('./scenery/platform'),

    Player: require('./player'),

    Control: {
        Test: require('./control/test')
    },

    Spawn: {
        Test: require('./spawn/test'),
        Movable: require('./spawn/movable'),
        Immovable: require('./spawn/immovable'),
        Floater: require('./spawn/floater'),
        Upfloater: require('./spawn/upfloater'),
        Bouncer: require('./spawn/bouncy')
        //Float: require('./spawn/float'),
        //Spring: require('./spawn/spring')
    }
};
