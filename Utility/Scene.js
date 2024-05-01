class Scene {
    constructor() {
        this.cam = new Camera();

        this.g_globalRotationMatrix = new Matrix4();
        this.g_viewMatrix = new Matrix4();
        this.g_projectionMatrix = new Matrix4();
        this.globalRotationY = 90;

        // Rendering Globals
        this.g_shapesList = [];

        this.buildScene();
    }

    buildScene() {
      
        this.g_eyePos = new Vector3();
        this.g_lookAt = new Vector3();
        this.g_upVector = new Vector3([0, 1, 0]);

        let sky = new Cube([0, -50, 0], [0.5, 0.65, 0.95, 1.0], 50000, 50000, 50000, -2)
        sky.setLocalMatrix([0, 0, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
        this.g_shapesList.push(sky);

        // Base cube
        let c = new Cube([0, -.5, 0], [0.3, 0.45, 0.25, 1.0], 500, 500, 1, 0)
        c.setLocalMatrix([0, 0, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
        this.g_shapesList.push(c);

        let box = new Cube([0, -.5, 0], [0.3, 0.45, 0.25, 1.0], 50, 50, 50, 1)
        box.setLocalMatrix([0, 0, 0], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
        this.g_shapesList.push(box);
        let box2 = new Cube([.2, -.5, 0], [0.65, 0.40, 0.02, 1.0], 30,30,30, -2)
        box2.setLocalMatrix([0, 0, -.1], [0, 0, 0, 1], [1.0, 1.0, 1.0]);
        this.g_shapesList.push(box2);

    }

    renderScene() {
        
        this.g_globalRotationMatrix.setIdentity();
        this.g_globalRotationMatrix.rotate(this.globalRotationY, 0, 1, 0);
        gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, this.g_globalRotationMatrix.elements);
      
        this.g_viewMatrix.setLookAt(0, 0, -1,  0, 0, 0,  0, 1, 0)
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.g_viewMatrix.elements);
      
        this.g_projectionMatrix.setPerspective(80, canvas.width/canvas.height, .1, 500);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.g_projectionMatrix.elements);

        for(var i = 0; i < this.g_shapesList.length; i++) {  
          this.g_shapesList[i].render();
        }
    }
}