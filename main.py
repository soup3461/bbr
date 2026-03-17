Enemy = SpriteKind.Enemy
Player = SpriteKind.player
Proj = SpriteKind.projectile
Eproj = SpriteKind.create()
effects.star_field.start_screen_effect()
enemies = 0
spawning = False




# opening cs:
sue = sprites.create(assets.image("bunb"))
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
game.splash("Use your arrows/WSAD\n to move")
game.splash("Aim and shoot with\n the mouse!")
game.splash("Don't get hit!")
# player setup
p = sprites.create(assets.image("Pship"), Player)
p.scale = 1
p.set_flag(SpriteFlag.STAY_IN_SCREEN, True)
controller.move_sprite(p)
pointer = sprites.create(assets.image("dot"))
browserEvents.sprite_follow_mouse_pointer(pointer)
info.set_life(5)
spriteutils.set_life_image(assets.image("""Pship0"""))

#extraEffects.create_spread_effect_on_anchor(p,extraEffects.create_full_presets_spread_effect_data(ExtraEffectPresetColor.POISON,ExtraEffectPresetShape.SPARK),10)
def on_event_pressed():
    Pproj = sprites.create(assets.image("beam"), Proj)
    Pproj.set_position(p.x, p.y)
    Pproj.set_flag(SpriteFlag.AUTO_DESTROY, True)
    transformSprites.rotate_sprite(Pproj, spriteutils.radians_to_degrees(spriteutils.angle_from(Pproj, pointer)))
    spriteutils.set_velocity_at_angle(Pproj, spriteutils.angle_from(Pproj, pointer), 200)
#browserEvents.mouse_any.on_event(browserEvents.MouseButtonEvent.PRESSED, on_event_pressed)


def enem_spawn():
    global spawning
    for i in range(randint(5, 7)):
        pause(randint(250, 500))
        actual_spawn()
        console.log(len(sprites.all_of_kind(Enemy)))
    spawning = False


def actual_spawn():
    global enemies
    e = sprites.create(assets.image("eship"), Enemy)
    spriteutils.place_sprite_randomly_on_edge(e)
    spriteutils.follow_and_rotate(e, p, randint(40,60), randint(50, 80))
actual_spawn()           

def e_hit(proj, enem):
    global spawning
    extraEffects.create_spread_effect_on_anchor(enem,extraEffects.create_full_presets_spread_effect_data(ExtraEffectPresetColor.FIRE,ExtraEffectPresetShape.SPARK),10)
    enem.destroy()
    if len(sprites.all_of_kind(Enemy)) < 2 and spawning == False:
            spawning = True
            timer.background(enem_spawn)
    proj.destroy()
    info.change_score_by(100)
events.sprite_event(Proj, Enemy, events.SpriteEvent.START_OVERLAPPING, e_hit)


def e_fire():
    for ship in sprites.all_of_kind(Enemy):
        if randint(1, 5) == 1:
            ebeam = sprites.create(assets.image("ebeam"), Eproj)
            ebeam.set_position(ship.x, ship.y)
            ebeam.set_flag(SpriteFlag.AUTO_DESTROY, True)
            transformSprites.rotate_sprite(ebeam, spriteutils.radians_to_degrees(spriteutils.angle_from(ebeam, p)))
            spriteutils.set_velocity_at_angle(ebeam, spriteutils.angle_from(ebeam, p), 200)
game.on_update_random_interval(500, 750, False , e_fire)

def p_hit(pship: Sprite, enem: Sprite):
    info.change_life_by(-1)
    enem.destroy()
    extraEffects.create_spread_effect_on_anchor(pship,extraEffects.create_full_presets_spread_effect_data(ExtraEffectPresetColor.POISON,ExtraEffectPresetShape.SPARK),10)
    
sprites.on_overlap(Player, Enemy, p_hit)
sprites.on_overlap(Player, Eproj, p_hit)
def point():
    transformSprites.rotate_sprite(p, spriteutils.radians_to_degrees(spriteutils.angle_from(p, pointer)))
    if browserEvents.mouse_any.is_pressed():
        timer.throttle("action", 75, on_event_pressed)
game.on_update(point)

def talk(speaker: Sprite, tts: string, name: string):
    animation.run_movement_animation(speaker, animation.animation_presets(animation.bobbing), 500, False)
    story.print_character_text(tts, name)
