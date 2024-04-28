class Cylinder extends Shape3D {
  constructor(position, color, innerRadius, outerRadius, height, segments) {
    super(position, color);
    this.type='cylinder';
    this.innerRadius = innerRadius;
    this.outerRadius = outerRadius;
    this.height = height;
    this.segments = segments;

    this.generateSurfaces();
  }

  generateSurfaces() {
    let h = this.height/200;
    let xyz = this.position;
    let col = this.color;
    let sRad = this.outerRadius / 200;
    let bRad = this.innerRadius / 200;

    let angleStep = 360 / this.segments;
    for (var angle = 0; angle < 360; angle = angle + angleStep) {

      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [
        Math.cos((angle1 * Math.PI) / 180) * sRad,
        Math.sin((angle1 * Math.PI) / 180) * sRad,
      ];
      let vec2 = [
        Math.cos((angle2 * Math.PI) / 180) * sRad,
        Math.sin((angle2 * Math.PI) / 180) * sRad,
      ];
      let vec3 = [
        Math.cos((angle1 * Math.PI) / 180) * bRad,
        Math.sin((angle1 * Math.PI) / 180) * bRad,
      ];
      let vec4 = [
        Math.cos((angle2 * Math.PI) / 180) * bRad,
        Math.sin((angle2 * Math.PI) / 180) * bRad,
      ];
      let pt1 = [xyz[0] + vec1[0], xyz[2] + vec1[1]];
      let pt2 = [xyz[0] + vec2[0], xyz[2] + vec2[1]];
      let pt3 = [xyz[0] + vec3[0], xyz[2] + vec3[1]];
      let pt4 = [xyz[0] + vec4[0], xyz[2] + vec4[1]];

      // top
      let colChg = (Math.cos(angle1 * Math.PI / 180)) * .12 + 0.5;
      col = [this.color[0]*colChg, this.color[1]*colChg, this.color[2]*colChg, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1]+h, xyz[2],    
                         pt1[0], xyz[1]+h, pt1[1],  
                         pt2[0], xyz[1]+h, pt2[1]
      ])));
      // top side panel
      col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([pt1[0], xyz[1]+h, pt1[1],
                         pt2[0], xyz[1]+h, pt2[1],
                         pt3[0], xyz[1]+h/2, pt3[1],  
                         pt4[0], xyz[1]+h/2, pt4[1],  
      ])));
      // bottom side panel
      col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([pt3[0], xyz[1]+h/2, pt3[1],  
                         pt4[0], xyz[1]+h/2, pt4[1],
                         pt1[0], xyz[1], pt1[1],
                         pt2[0], xyz[1], pt2[1]  
      ]))); // bottom
      col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
      this.surfaces.push(new Shape3DSurface(this.position, col, 
        new Float32Array([xyz[0], xyz[1], xyz[2],    
                         pt1[0], xyz[1], pt1[1],  
                         pt2[0], xyz[1], pt2[1]
      ])));
      
    }
  }

  render() {
    super.render();
  }
}