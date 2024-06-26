class Cube extends Shape3D {
  constructor(position, color, width, length, height) {
    super(position, color);
    this.type='cube';
    this.width = width;
    this.length = length;
    this.height = height;

    this.generateSurfaces();
  }

  generateSurfaces() {
    let w = this.width/200;
    let l = this.length/200;
    let h = this.height/200;
    let xyz = this.position;
    let col = this.color;
    this.surfaces.push(new Shape3DSurface(this.position, this.color, 
      new Float32Array([xyz[0]-w/2, xyz[1]+h, -l/2,    
        xyz[0]-w/2, xyz[1], -l/2,  
        xyz[0]+w/2, xyz[1]+h, -l/2,
        xyz[0]+w/2, xyz[1], -l/2
    ])));
    col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
    this.surfaces.push(new Shape3DSurface(this.position, col, 
      new Float32Array([
        xyz[0]+w/2, xyz[1]+h, -l/2,
        xyz[0]+w/2, xyz[1], -l/2,
        xyz[0]+w/2, xyz[1]+h, l/2,
        xyz[0]+w/2, xyz[1], l/2
    ])));
    col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
    this.surfaces.push(new Shape3DSurface(this.position, col, 
      new Float32Array([
        xyz[0]-w/2, xyz[1]+h, -l/2,
        xyz[0]+w/2, xyz[1]+h, -l/2,
        xyz[0]-w/2, xyz[1]+h, l/2,
        xyz[0]+w/2, xyz[1]+h, l/2
    ])));
    col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
    this.surfaces.push(new Shape3DSurface(this.position, col, 
      new Float32Array([
        xyz[0]-w/2, xyz[1]+h, l/2,
        xyz[0]-w/2, xyz[1], l/2,
        xyz[0]-w/2, xyz[1]+h, -l/2,
        xyz[0]-w/2, xyz[1], -l/2
    ])));
    col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
    this.surfaces.push(new Shape3DSurface(this.position, col, 
      new Float32Array([
        xyz[0]+w/2, xyz[1]+h, l/2,
        xyz[0]+w/2, xyz[1], l/2,
        xyz[0]-w/2, xyz[1]+h, l/2,
        xyz[0]-w/2, xyz[1], l/2
    ])));
    col = [col[0]*0.9, col[1]*0.9, col[2]*0.9, col[3]];
    this.surfaces.push(new Shape3DSurface(this.position, col, 
      new Float32Array([
        xyz[0]-w/2, xyz[1], -l/2,
        xyz[0]-w/2, xyz[1], l/2,
        xyz[0]+w/2, xyz[1], -l/2,
        xyz[0]+w/2, xyz[1], l/2
    ])));
  }

  render() {
    super.render();
  }
}