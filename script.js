function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
      return;
    }
  
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    setGeometry(gl);
  
    var translation = [200, 150];
    var angleInRadians = 0;
    var scale = [1, 1];
  
    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: screen.width});
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: screen.height});

    function updatePosition(index) {
        return function(event, ui) {
        translation[index] = ui.value;
        drawScene();
        };
    }

    drawScene();
  
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(positionAttributeLocation);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);
    
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);
    
        gl.uniformMatrix3fv(matrixLocation, false, matrix);
    
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}
  
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
               0, -100,
             150,  125,
            -175,  100]),
        gl.STATIC_DRAW);
}
  
main();