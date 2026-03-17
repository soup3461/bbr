let Enemy = SpriteKind.Enemy
let Player = SpriteKind.Player
let Proj = SpriteKind.Projectile
let Eproj = SpriteKind.create()
effects.starField.startScreenEffect()
let enemies = 0
let spawning = false
//  opening cs:
let sue = sprites.create(assets.image`bunb`)
sue.setPosition(30, 40)
talk(sue, "Aaah, what a lovely time to be out on my space ship that I, a rabbit, managed to obtain through entirely legal means", "Bun")
let bbr = sprites.create(assets.image`bbr`)
bbr.setPosition(130, 40)
talk(bbr, "Did someone say an entirely legal and safe trip?", "???")
talk(sue, "Mayyybe, depends who's asking?", "Bun")
talk(bbr, "teehee, it's me, the Bad Bunny Rabbit! I am here to steal your ship!", "B.B.R.")
talk(sue, "NOO!! I don't have insurance on this ship that I stole- I mean only just obtained", "Bun")
talk(bbr, "Go my fleet of other Bad Bunny Rabbits! Take Her Ship!", "B.B.R")
sue.setFlag(SpriteFlag.Invisible, true)
bbr.setFlag(SpriteFlag.Invisible, true)
game.splash("Defend yourself!")
game.splash(`Use your arrows/WSAD
 to move`)
game.splash(`Aim and shoot with
 the mouse!`)
game.splash("Don't get hit!")
//  player setup
let p = sprites.create(assets.image`Pship`, Player)
p.scale = 1
p.setFlag(SpriteFlag.StayInScreen, true)
controller.moveSprite(p)
let pointer = sprites.create(assets.image`dot`)
browserEvents.spriteFollowMousePointer(pointer)
info.setLife(5)
spriteutils.setLifeImage(assets.image`Pship0`)
// extraEffects.create_spread_effect_on_anchor(p,extraEffects.create_full_presets_spread_effect_data(ExtraEffectPresetColor.POISON,ExtraEffectPresetShape.SPARK),10)
// browserEvents.mouse_any.on_event(browserEvents.MouseButtonEvent.PRESSED, on_event_pressed)
function actual_spawn() {
    
    let e = sprites.create(assets.image`eship`, Enemy)
    spriteutils.placeSpriteRandomlyOnEdge(e)
    spriteutils.followAndRotate(e, p, randint(40, 60), randint(50, 80))
}

actual_spawn()
events.spriteEvent(Proj, Enemy, events.SpriteEvent.StartOverlapping, function e_hit(proj: Sprite, enem: Sprite) {
    
    extraEffects.createSpreadEffectOnAnchor(enem, extraEffects.createFullPresetsSpreadEffectData(ExtraEffectPresetColor.Fire, ExtraEffectPresetShape.Spark), 10)
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
    info.changeScoreBy(100)
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
    info.changeLifeBy(-1)
    enem.destroy()
    extraEffects.createSpreadEffectOnAnchor(pship, extraEffects.createFullPresetsSpreadEffectData(ExtraEffectPresetColor.Poison, ExtraEffectPresetShape.Spark), 10)
}

sprites.onOverlap(Player, Enemy, p_hit)
sprites.onOverlap(Player, Eproj, p_hit)
game.onUpdate(function point() {
    transformSprites.rotateSprite(p, spriteutils.radiansToDegrees(spriteutils.angleFrom(p, pointer)))
    if (browserEvents.MouseAny.isPressed()) {
        timer.throttle("action", 75, function on_event_pressed() {
            let Pproj: Sprite;
            Pproj = sprites.create(assets.image`beam`, Proj)
            Pproj.setPosition(p.x, p.y)
            Pproj.setFlag(SpriteFlag.AutoDestroy, true)
            transformSprites.rotateSprite(Pproj, spriteutils.radiansToDegrees(spriteutils.angleFrom(Pproj, pointer)))
            spriteutils.setVelocityAtAngle(Pproj, spriteutils.angleFrom(Pproj, pointer), 200)
        })
    }
    
})
function talk(speaker: Sprite, tts: string, name: string) {
    animation.runMovementAnimation(speaker, animation.animationPresets(animation.bobbing), 500, false)
    story.printCharacterText(tts, name)
}

