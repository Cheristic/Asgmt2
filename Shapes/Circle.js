class Circle extends Shape {
    constructor(position, color, size, segments) {
      super(position, color, size, size);
      this.type='circle';
      this.segments = segments;
    }

    generateVertices() {
      let [x, y] = this.position;

      // Draw
      var d = this.width / 200.0; // delta

      let v = [];
      let angleStep = 360 / this.segments;
      for (var angle = 0; angle < 360; angle = angle + angleStep) {
        let centerPt = [x, y];
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1 = [
          Math.cos((angle1 * Math.PI) / 180) * d,
          Math.sin((angle1 * Math.PI) / 180) * d,
        ];
        let vec2 = [
          Math.cos((angle2 * Math.PI) / 180) * d,
          Math.sin((angle2 * Math.PI) / 180) * d,
        ];
        let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
        let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

        v.push(x, y, pt1[0], pt1[1], pt2[0], pt2[1]);
      }
      this.vertices = new Float32Array(v);
    }
  
    render() {
      super.render();
      if (this.vertices == null) {this.generateVertices();}

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2);
    }
  }