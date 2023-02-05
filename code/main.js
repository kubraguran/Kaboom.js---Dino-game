import kaboom from "kaboom"


kaboom({
    background: [134, 135, 247],
    scale:1
})
loadSprite("steel", "sprites/steel.png")
loadSprite("moon", "sprites/moon.png")
loadSprite("cloud", "sprites/cloud.png")
loadSprite("sand", "sprites/sand.png")
loadSprite("bean", "sprites/bean.png")
loadSprite("snow", "sprites/snow.png")
loadSprite("spike","sprites/spike.png")
loadSprite("bomb", "sprites/bomb.png")
loadSprite("grape", "sprites/grape.png")
loadSprite("heart", "sprites/heart.png")
loadSprite("lemon", "sprites/lemon.png")
loadSprite("pizza", "sprites/pizza.png")
loadSprite("portal", "sprites/portal.png")
loadSprite("goldfly", "sprites/goldfly.png")
const SPEED = 400
const JUMP_FORCE = 800



  function goldflyEnemy(distance = 50, speed = 50, dir = 1) {
  return {
    id: "goldfly",
    require: ["pos", "area",],
    startingPos: vec2(0, 0),
    add() {
      this.startingPos = this.pos;
      this.on("collide", (obj, side) => {
        if (side === "left" || side === "right") {
          dir = -dir;
        }
      });
    },
   update() {
      if (Math.abs(this.pos.x - this.startingPos.x) >= distance) {
        dir = -dir;
      }
      this.move(speed * dir, 0);
    },
  };
}


loadSprite("dino", "sprites/dino.png", {

	sliceX: 9,
	anims: {
		"idle": {
			from: 0,
			to: 3,
			speed: 5,
			loop: true,
		},
		"run": {
			from: 4,
			to: 7,
			speed: 10,
			loop: true,
		},
		"jump": 8
	},
})


layer(["obj", "ui"], "obj")


scene("start", () => {

  add([
    text("Press enter to start.You have 1 life for each level.Press 'z' for destroy to ghosts", { size: 22 }),
    pos(vec2(700, 450)),
    origin("center"),
    color(255, 255, 255),
  ]);

  onKeyRelease("enter", () => {
    go("game");
  })
});

go("start");

  const healthScore = 1;





scene("game", (levelNumber = 0) => {



  function spawnCloud() {

	const dir = choose([LEFT, RIGHT])
	add([
		sprite("cloud", { flipX: dir.eq(LEFT) }),
		move(dir, rand(20, 60)),
		cleanup(),
		pos(dir.eq(LEFT) ? width() : 0, rand(-20, 480)),
		origin("top"),
		area(),
		z(-50),
	])

	wait(rand(6, 12), spawnCloud)

}
  spawnCloud()



    add([
    sprite("moon"),
    pos(950,40),
    layer("bg"),
  ])

  const healthPoint = add([
  text(healthScore),
  pos(100,50),
  layer("ui"),
  scale(1),
  {
    value: healthScore,
  }
  
])

  const player = add([
  sprite("dino"),
  scale(3),
  pos(25, 25),
	origin("center"),
  health(healthScore),
  area(),
  body(),
])

  
player.play("idle")

  add([
	rect(width(), 24),
	area(),
	outline(1),
	pos(0, height() - 24),
	solid(),
  
])

  player.onGround(() => {
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	} else {
		player.play("run")
	}
})
  
onKeyPress("space", () => {
	if (player.isGrounded()) {
		player.jump(JUMP_FORCE)
		player.play("jump")
	}
})


onKeyDown("left", () => {
	player.move(-SPEED, 0)
	player.flipX(true)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

onKeyDown("right", () => {
	player.move(SPEED, 0)
	player.flipX(false)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

onKeyRelease(["left", "right"], () => {
	if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	}
})


  const GUN_COOLDOWN_TIME = 1;
  let lastShootTime = time();
  const BULLET_SPEED = 500;
  

  onKeyPress("z", () => {
    if (time() - lastShootTime > GUN_COOLDOWN_TIME) {
      lastShootTime = time();
      bullet(player.pos, -1, "bullet");
    }
  });

 function bullet(bulletPos, direction, tag) {
    add([
      rect(7, 3),
      pos(bulletPos),
      origin("center"),
      color(255, 255, 255),
      area(),
      cleanup(),
      "missile",
      tag,
      {
        direction: 1,
      }
    ]);
  }


  
  bullet();
    onUpdate("missile", (missile) => {
     missile.move(BULLET_SPEED * missile.direction, 0);
  });


gravity(1600)

  
const LEVELS = [

  [
  "                                            ",
  "                                            ",
  "                                            ",
  "                                      ^     ",
  "         #                         = = =    ",
  "     = = =        /             =           ",
  "                     =     = =              ",
  "        = =     =                   =        ",
  "                                = = =       ",
  "       !           = = =                    ",
  "       =                                    " ,
  "             = = = =        =       *       ",
  "                     @          = = =       ",
  "                        = = =               ",
  "              @  &              # !          ",
  "= = = = = = = = = = = = = = = = = = = = = = ",
  ],
  [
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "                                            ",
  "         |                                  ",
  "         -           #                 ^    ",
  "=                    =            = = = =   ",
  "= =           *             = = =           ",
  "= = =       = = = *   =   =                 ",
  "= = = = @    &    =      &       @ !        ",
  "= = = = = - - - - - - - / -   = = = = - - - ",
  ],
  [
  "                                            ",
  "                                            ",
  "                                    ~       ",
  "                              - - - -       ",
  "          #                                 ",
  "      - - - - -                             ",
  "                           - - - -          ",
  "                                            ",
  "   - - - - -       / /                      ",
  "                                            ",
  "      &                    - - - - -        ",
  "   - - - - - -                              ",
  "                      -                     ",
  "                                            ",
  "      @          - - - -         &          ",
  "- - - - - - - - - - - - - - - - - - - - -  -",
  ]
  

]

  
const levelConf = {
  width: 32,
  height: 50,
  "=":() => [sprite("sand"), area(), solid()],
  "/":() => [sprite("steel"),area(),solid()],
  "-":() => [sprite("snow"),area(), solid()],
  "@":() => [sprite("grape"),pos(-20,-35),area(), "fruit"],
  "|":() => [sprite("lemon"),pos(0,-20),area(),"fruit"],
  "^":() => [sprite("portal"), pos(0,-15), area(), "portal"],
  "*":() => [sprite("spike"), pos(0,25),area(), "danger"],
  "!":() => [sprite("bomb"), pos(0,-40), area(), "bomb"],
  "#":() => [sprite("pizza"), pos(0,-20), area(), "fruit"],
  "&":() => 
 [sprite("goldfly"),pos(0,0),area(),cleanup(),solid(),origin("bot"),"goldfly", goldflyEnemy()],
  "~":() => [sprite("heart"), pos(0,-40), area(),"heart"]
  
  
}

const level = addLevel(LEVELS[levelNumber], levelConf);



  
player.onCollide("fruit", (fruit) => {
  destroy(fruit)
})


  player.onCollide("bomb", (bomb) => {
    shake(120)
    destroy(player)
    healthPoint.text = "YOU DIED! WAIT 2 SECOND"
     wait(2, () => {
       go("start")
        
      })
  })


player.onCollide("danger", (danger) => {
  player.hurt(1)
  healthPoint.value--
  healthPoint.text = healthPoint.value
  if(healthPoint.value === 0 ){
      healthPoint.text = "YOU DIED :( WAIT 2 SECOND"
     destroy(player)
     wait(2, () => {
       go("start")    
      })
  }
 
})

  player.on("death", () => {
    destroy(player)
    healthPoint.text = "YOU DIED :( WAIT 2 SECOND"
      wait(2, () => {
       go("start")
        
      })
})

   player.onCollide("goldfly", (goldfly) => {
    destroy(player)
    healthPoint.text = "BOOO, YOU DIED! WAIT 2 SECOND"
    wait(2, () => {
     go("start")
    })
  })

  
   onCollide("bullet", "goldfly", (bullet,goldfly) => {
    destroy(goldfly)
    addKaboom(bullet.pos)
  })
  

  player.onCollide("heart", (heart) => {
  healthPoint.text  = "YOU WON! WAIT 2 SECOND!"
  destroy(player)
  addKaboom(player.pos)
  wait(2, () => { 
  go("start")
})
  
})
  
player.onCollide("portal", (portal) => {
  let nextLevel = levelNumber + 1;
   if (nextLevel <= LEVELS.length){
     go("game", nextLevel,healthScore)
   }
})  


 
  
  
  player.onUpdate(() => {
		if (player.pos.y >= 800) {
			healthPoint.text = "YOU LOSE"
        wait(5, () => {
       go("start", healthPoint)
      })
		}
	})


  

  

})
