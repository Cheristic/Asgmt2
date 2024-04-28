
class Shape{
    constructor(position, color, width, height) {
      this.position = position;
      this.color = color;
      this.width = width;
      this.height = height;

      this.buffer = null;
      this.vertices = null;

      this.matrix = new Matrix4().setIdentity();
    }

    generateVertices() {}
  
    render() {
      var rgba = this.color;
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
      if (this.buffer == null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log("Failed to create the buffer object");
            return -1;
        }
      }     
    }
}

class Shape3D {
    constructor(position, color) {
        this.position = position;
        this.color = color;

        this.surfaces = [];
        this.localMatrix = null; // store initial matrix commands
        this.parentMatrix = null; // final matrix -> given to children
        this.dynamicMatrix = new Matrix4(); // stores aggregation of matrix commands given at runtime
        this.frameMatrix = new Matrix4(); // the dynamic command at every frame for animation
        this.matrixBuffer = new Matrix4(); // aggregates all transforms

        this.children = [];
    }  

    setLocalMatrix(p, r, s) {
        this.localMatrix = new Matrix4();
    
        this.localMatrix.translate(p[0], p[1], p[2]); // pivot
        this.localMatrix.rotate(r[0], r[1], r[2], r[3]); // rotate
        this.localMatrix.scale(s[0], s[1], s[2]); // scale
    }

    prepareModelMatrix() {
      if (this.localMatrix == null) this.localMatrix = new Matrix4(); // not set externally
      if (this.parentMatrix == null) this.parentMatrix = new Matrix4(); // no parent
      this.matrixBuffer.setIdentity();

      // 1st parent matrix -> 2nd local matrix -> 3rd dynamic matrix
      this.matrixBuffer = this.matrixBuffer.multiply(this.parentMatrix);
      this.matrixBuffer = this.matrixBuffer.multiply(this.localMatrix);
      this.dynamicMatrix = this.dynamicMatrix.multiply(this.frameMatrix);
      this.matrixBuffer = this.matrixBuffer.multiply(this.dynamicMatrix);
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].parentMatrix = new Matrix4(this.matrixBuffer); // pass current matrix to children
      }
    }

    animation(time) {

    }

    render() {    
      this.prepareModelMatrix();

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrixBuffer.elements);
      for (let i = 0; i < this.surfaces.length; i++) {
          this.surfaces[i].render();
      }
    }
}

class Shape3DSurface {
    constructor(position, color, vertices) {
      this.position = position;
      this.color = color;

      this.buffer = null;
      this.vertices = vertices;
    }
  
    render() {
      var rgba = this.color;
    
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      if (this.buffer == null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log("Failed to create the buffer object");
            return -1;
        }
      } 
          
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length / 3);  
  
    }
}

  