function force(x, y){
    fx = 0
    fy = 0

    md = 10000


    for(p in particles){
        rx = x - particles[p].x
        ry = y - particles[p].y
        
        d = (Math.pow(rx, 2) + Math.pow(ry, 2))
        if(d < md) md = d

        fx += rx * particles[p].charge / constrain(d, 0.001, d)
        fy += ry * particles[p].charge / constrain(d, 0.001, d)

    }

    F = Math.sqrt((Math.pow(fx, 2) + Math.pow(fy, 2)))

    return [fx, fy, F, Math.sqrt(md)]
}

function Particle(x, y, c, m){
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.charge = c
    this.m = m
    this.lines = []

    this.drawLines = function(){
        for(i = 0; i < ln; i++){

            valid = true
        
            dx = this.x + 2 * innerRadius * Math.sin(Math.PI * 2 / ln * i)
            dy = this.y + 2 * innerRadius * Math.cos(Math.PI * 2 / ln * i)

            j = 0
            beginShape();
            while(valid){
                j++

                farray = force(dx, dy)

                fx = farray[0], fy = farray[1], f = farray[2], md = farray[3]

                if(this.charge < 0){
                    fx /= -f //* lineStep
                    fy /= -f// * lineStep
                } else {
                    fx /= f //* lineStep
                    fy /= f //* lineStep
                }

                vertex(dx, dy)

                dx += fx
                dy += fy

                valid = dx >= 0 && dx < width && dy >= 0 && dy < height && md > innerRadius && f != 0 && j < 10000
            }
            endShape();
        }
    }

    this.show = function(){
        fill(51)
        ellipse(this.x, this.y, this.m * (10 + innerRadius), this.m * (10 + innerRadius));
        if(this.charge < 0){
            fill(map(-this.charge, 150, 255, 1, 3), 100, 100)
        } else {
            fill(100, 100, map(this.charge, 150, 255, 1, 3))
        }
        ellipse(this.x, this.y, this.m * 10, this.m * 10);
    }

    this.update = function(){
        farray = force(this.x, this.y)
        fx = farray[0], fy = farray[1], f = farray[2]

        // line(this.x, this.y, this.x + fx * this.charge / this.m * 10000, this.y + fy * this.charge / this.m * 10000)

        this.vx += fx * this.charge / this.m
        this.vy += fy * this.charge / this.m

        this.x += this.vx
        this.y += this.vy

        if(!(this.x >= 0 && this.x < width && this.y >= 0 && this.y < height)){
            particles.splice(particles.indexOf(this), 1)
        }
    }
}

scale = 4

n = 5

ln = 8

innerRadius = 2

lineStep = 1

particles = []




function setup(){
    noStroke()
    createCanvas(innerWidth, innerHeight)

    for(i = 0; i < n; i++){
        if(random() < 0.5){
            particles.push(new Particle(random()*width / 3 + width / 3, random()*height/ 3 + height / 3, 1 + random() * 2, 1 + random() * 1))
        } else {
            particles.push(new Particle(random()*width / 3 + width / 3, random()*height/ 3 + height / 3, -(1 + random() * 2), 1 + random() * 1))
        }
    }
}

function draw(){
    background(51)

    noFill()
    stroke(255)
    particles.forEach(p => {
        p.drawLines()
    });

    noStroke()
    particles.forEach(p => {
        p.show()
    });

    
    stroke(0, 255, 0)
    particles.forEach(p => {
        p.update()
    });
    
}