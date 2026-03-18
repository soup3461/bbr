let Enemy = SpriteKind.Enemy
let Player = SpriteKind.Player
let Proj = SpriteKind.Projectile
let Eproj = SpriteKind.create()
let Food = SpriteKind.Food
effects.starField.startScreenEffect()
let enemies = 0
let spawning = false
let combo = 0
//  opening cs:
/** sue = sprites.create(assets.image("bunb"))
sue.set_position(30, 40)
talk(sue, "Aaah, what a lovely time to be out on my space ship that I, a rabbit, managed to obtain through entirely legal means", "Bun")
bbr = sprites.create(assets.image("bbr"))
bbr.set_position(130,40)
talk(bbr, "Did someone say an entirely legal and safe trip?", "???")
talk(sue, "Mayyybe, depends who's asking?", "Bun")
talk(bbr, "teehee, it's me, the Bad Bunny Rabbit! I am here to steal your ship!", "B.B.R.")
talk(sue, "NOO!! I don't have insurance on this ship that I stole- I mean only just obtained", "Bun")
talk(bbr, "Go my fleet of other Bad Bunny Rabbits! Take Her Ship!", "B.B.R")
sue.set_flag(SpriteFlag.INVISIBLE, True)
bbr.set_flag(SpriteFlag.INVISIBLE, True)
game.splash("Defend yourself!")
game.splash("Use your arrows/WSAD
 to move")
game.splash("Aim and shoot with
 the mouse or space!")
game.splash("Don't get hit!")
 */
//  player setup
let p = sprites.create(assets.image`Pship`, Player)
p.scale = 1
p.setFlag(SpriteFlag.StayInScreen, true)
controller.moveSprite(p)
let pointer = sprites.create(assets.image`dot`)
browserEvents.spriteFollowMousePointer(pointer)
info.setLife(5)
spriteutils.setLifeImage(assets.image`Pship0`)
let ctext = textsprite.create("x" + ("" + combo), 1, 4)
ctext.bottom = 120
ctext.left = 0
// extraEffects.create_spread_effect_on_anchor(p,extraEffects.create_full_presets_spread_effect_data(ExtraEffectPresetColor.POISON,ExtraEffectPresetShape.SPARK),10)
// browserEvents.mouse_any.on_event(browserEvents.MouseButtonEvent.PRESSED, on_event_pressed)
function actual_spawn() {
    
    let e = sprites.create(assets.image`eship`, Enemy)
    spriteutils.placeSpriteRandomlyOnEdge(e)
    spriteutils.followAndRotate(e, p, randint(40, 60), randint(50, 80))
}

actual_spawn()
events.spriteEvent(Proj, Enemy, events.SpriteEvent.StartOverlapping, function e_hit(proj: Sprite, enem: Sprite) {
    let life: Sprite;
    
    extraEffects.createSpreadEffectOnAnchor(enem, extraEffects.createFullPresetsSpreadEffectData(ExtraEffectPresetColor.Fire, ExtraEffectPresetShape.Spark), 10)
    let points = 100 + 10 * combo
    let ptext = textsprite.create("" + points)
    ptext.setPosition(enem.x, enem.y)
    ptext.vy = -50
    if (combo > 1) {
        ptext.scale = 1 + combo / 20
    }
    
    timer.after(250, function textdel() {
        ptext.destroy()
    })
    enem.destroy()
    if (sprites.allOfKind(Enemy).length < 2 && spawning == false) {
        spawning = true
        timer.background(function enem_spawn() {
            
            for (let i = 0; i < randint(5, 7); i++) {
                pause(randint(250, 500))
                actual_spawn()
                console.log(sprites.allOfKind(Enemy).length)
            }
            spawning = false
        })
    }
    
    proj.destroy()
    info.changeScoreBy(100 + 10 * combo)
    combo += 1
    if (randint(1, 5) == 1) {
        life = sprites.create(assets.image`Pship0`, Food)
        life.setPosition(enem.x, enem.y)
        life.lifespan = 3000
    }
    
})
sprites.onOverlap(Player, Food, function collect_life(player: Sprite, life: Sprite) {
    let points: any;
    let ptext: TextSprite;
    if (info.life() == 5) {
        points = 100 + 10 * combo
        info.changeScoreBy(100 + 10 * combo)
        ptext = textsprite.create("" + points)
        ptext.setPosition(life.x, life.y)
        ptext.vy = -50
        if (combo > 1) {
            ptext.scale = 1 + combo / 20
        }
        
        timer.after(250, function textdel() {
            ptext.destroy()
        })
    } else {
        info.changeLifeBy(1)
    }
    
    life.destroy()
})
game.onUpdateRandomInterval(500, 750, false, function e_fire() {
    let ebeam: Sprite;
    for (let ship of sprites.allOfKind(Enemy)) {
        if (randint(1, 5) == 1) {
            ebeam = sprites.create(assets.image`ebeam`, Eproj)
            ebeam.setPosition(ship.x, ship.y)
            ebeam.setFlag(SpriteFlag.AutoDestroy, true)
            transformSprites.rotateSprite(ebeam, spriteutils.radiansToDegrees(spriteutils.angleFrom(ebeam, p)))
            spriteutils.setVelocityAtAngle(ebeam, spriteutils.angleFrom(ebeam, p), 200)
        }
        
    }
})
function p_hit(pship: Sprite, enem: Sprite) {
    
    combo = 0
    info.changeLifeBy(-1)
    enem.destroy()
    extraEffects.createSpreadEffectOnAnchor(pship, extraEffects.createFullPresetsSpreadEffectData(ExtraEffectPresetColor.Poison, ExtraEffectPresetShape.Spark), 10)
}

sprites.onOverlap(Player, Enemy, p_hit)
sprites.onOverlap(Player, Eproj, p_hit)
game.onUpdate(function point() {
    transformSprites.rotateSprite(p, spriteutils.radiansToDegrees(spriteutils.angleFrom(p, pointer)))
    if (browserEvents.MouseAny.isPressed() || controller.A.isPressed()) {
        timer.throttle("action", 75, function on_event_pressed() {
            let Pproj: Sprite;
            Pproj = sprites.create(assets.image`beam`, Proj)
            Pproj.setPosition(p.x, p.y)
            Pproj.setFlag(SpriteFlag.AutoDestroy, true)
            transformSprites.rotateSprite(Pproj, spriteutils.radiansToDegrees(spriteutils.angleFrom(Pproj, pointer)))
            spriteutils.setVelocityAtAngle(Pproj, spriteutils.angleFrom(Pproj, pointer), 200)
        })
    }
    
    ctext.setText("X" + ("" + combo))
})
function talk(speaker: Sprite, tts: string, name: string) {
    animation.runMovementAnimation(speaker, animation.animationPresets(animation.bobbing), 500, false)
    story.printCharacterText(tts, name)
}

