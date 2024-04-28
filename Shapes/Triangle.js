class Triangle extends Shape{
    constructor(position, color, width, height, type) {
      super(position, color, width, height);
      this.type='triangle';
      this.triangleType = type;
    }

    generateVertices() {
      // Draw
      var d = this.width/200.0; // delta
      var xy = this.position;

      if (this.triangleType == 0) { // equilateral
        this.vertices = new Float32Array([xy[0]-d/2, xy[1]-d/2, xy[0]+d/2, xy[1]-d/2, xy[0], xy[1]+d/2]);
      } else if (this.triangleType == 1) {
        this.vertices = new Float32Array([xy[0]-d/2, xy[1]+d/2, xy[0]+d/2, xy[1]+d/2, xy[0], xy[1]-d/2]);
      } else if (this.triangleType == 2) {
        this.vertices = new Float32Array([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
      } else if (this.triangleType == 3) {
        this.vertices = new Float32Array([xy[0], xy[1], xy[0]-d, xy[1], xy[0], xy[1]+d]);
      }
    }
  
    render() {
      super.render();
      if (this.vertices == null) {this.generateVertices();}

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
      
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/2);
      
    }
}
  