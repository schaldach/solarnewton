let myCanvas
let selectedEntity
let Xcamera = 0
let Ycamera = 0
let XcentralView = 0
let YcentralView = 0
let cameraZoom = 4
let zoomOptions = [0.15, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5]
let centralView = 0
let cameraActive = true

function setup(){
    myCanvas = createCanvas(screen.width,screen.height)
    background("#171025")
    myCanvas.position(0,0,"fixed")
    frameRate(60)
    selectedEntity = createSelect()
    selectedEntity.position(20,20)
    everyEntity.forEach(entity => {
        selectedEntity.option(entity.name,everyEntity.indexOf(entity))
    })
    selectedEntity.changed(changeview)
}

function changeview(){
    centralView = selectedEntity.value()
    cameraActive = true
    Xcamera = 0
    Ycamera = 0
}

function mouseWheel(event){
    cameraZoom -= event.delta>0?Math.ceil(event.delta/100):Math.floor(event.delta/100)
    cameraZoom = cameraZoom<0?0:cameraZoom
    cameraZoom = cameraZoom>11?11:cameraZoom
}

function draw(){
    myCanvas = createCanvas(screen.width,screen.height)
    background("#171025")
    myCanvas.position(0,0,"fixed")
    if(keyIsDown(LEFT_ARROW)){
        cameraActive = false
        Xcamera+=30
    }
    if(keyIsDown(RIGHT_ARROW)){
        cameraActive = false
        Xcamera-=30
    }
    if(keyIsDown(DOWN_ARROW)){
        cameraActive = false
        Ycamera-=30
    }
    if(keyIsDown(UP_ARROW)){
        cameraActive = false
        Ycamera+=30
    }
    everyEntity.forEach(entity => {
        for(i=0; i<=13000; i++){
            let totalxacceleration = 0
            let totalyacceleration = 0
            everyEntity.forEach(secondentity => {
                if(secondentity.name !== entity.name){
                    let tangentratio = entity.simpley<=secondentity.simpley?(entity.simplex-secondentity.simplex)/(entity.simpley-secondentity.simpley):(entity.simpley-secondentity.simpley)/(entity.simplex-secondentity.simplex)
                    let angle = Math.atan(tangentratio)
                    let totalacceleration = (secondentity.simplegmass)/(dist(entity.simplex,entity.simpley,secondentity.simplex,secondentity.simpley)**2)
                    let control = entity.simpley>=secondentity.simpley&&entity.simplex>=secondentity.simplex?-1:1
                    totalxacceleration += entity.simpley<=secondentity.simpley?totalacceleration*Math.sin(angle):totalacceleration*Math.cos(angle)*control
                    totalyacceleration += entity.simpley<=secondentity.simpley?totalacceleration*Math.cos(angle):totalacceleration*Math.sin(angle)*control
                }
            })
            entity.xacceleration = totalxacceleration
            entity.yacceleration = totalyacceleration
            entity.xspeed += entity.xacceleration
            entity.yspeed += entity.yacceleration
            entity.realx += entity.xspeed
            entity.realy += entity.yspeed
        }
        entity.simplex = entity.realx/(10**9)
        entity.simpley = entity.realy/(10**9)
        if(cameraActive){
            XcentralView = everyEntity[centralView].simplex*zoomOptions[cameraZoom]
            YcentralView = everyEntity[centralView].simpley*zoomOptions[cameraZoom]
        }
        entity.x = entity.simplex*zoomOptions[cameraZoom]+screen.width/2-XcentralView+Xcamera
        entity.y = entity.simpley*zoomOptions[cameraZoom]+screen.height/2-YcentralView+Ycamera
        fill(entity.color)
        ellipse(entity.x, entity.y, entity.radius*2*zoomOptions[cameraZoom])
        entity["trail"].unshift(
            {
                x: entity.simplex,
                y: entity.simpley
            }
        )
        entity["trail"].length = entity["trail"].length>100?100:entity["trail"].length
        entity["trail"].forEach(mark => {
            if(dist(mark.x*zoomOptions[cameraZoom]+screen.width/2-XcentralView+Xcamera, mark.y*zoomOptions[cameraZoom]+screen.height/2-YcentralView+Ycamera, entity.x, entity.y)>entity.radius*zoomOptions[cameraZoom]){
                stroke(255)
                point(mark.x*zoomOptions[cameraZoom]+screen.width/2-XcentralView+Xcamera, mark.y*zoomOptions[cameraZoom]+screen.height/2-YcentralView+Ycamera)
                noStroke()
            }
        })
    })
}