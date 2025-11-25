export function getGPU() {
    try {
        const gl = document.createElement('canvas').getContext('webgl') ||
            document.createElement('canvas').getContext('experimental-webgl');
        const info = gl && gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : null;
        return renderer;
    } catch (error) {
        console.log("Error while getting GPU data: " + error)
    }
}

async function hashData(str) {
    try {
        const data = new TextEncoder().encode(str);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(buffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (error) {
        console.error("Hashing error:", error);
        return "hashing_failed";
    }
}

// CANVAS

function get2dCanvasData() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Creating a somewhat complex scene
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText("Browser Fingerprint 💯", 2, 15);
    ctx.fillStyle = 'rgba(100, 200, 0, 0.7)';
    ctx.fillText("Browser Fingerprint 💯", 4, 17);

    // Some shapes
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
    ctx.fill();
    return canvas.toDataURL();
}

function detectSpoofing() {
    // Randomization
    // Detecting it in Brave would require client-side workers
    const data1 = get2dCanvasData();
    const data2 = get2dCanvasData();
    if (data1 !== data2) {
        return true
    }

    // Test 2: Antialiasing
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, 20, 20);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = '16px "Arial"';
    ctx.fillText('m', 2, 15);

    const imageData = ctx.getImageData(0, 0, 20, 20).data;
    let hasAntialiasedPixels = false;

    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        const white = (r === 255 || g === 255 || b === 255);
        const black = (r === 0 || g === 0 || b === 0);

        if (!white && !black) {
            hasAntialiasedPixels = true;
            break;
        }
    }

    if (!hasAntialiasedPixels) {
        return true
    }
    return false
}

export async function getCanvas() {
    // Analysis
    const spoofing = detectSpoofing();
    const canvas_hash = await hashData(get2dCanvasData());
    return [canvas_hash, spoofing]
}

// WEBGL

export async function getWebgl() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    try {
        const gl = (
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')
        );

        if (!gl) {
            return false;
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = u_color;
            }
        `;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const vertices = [
            -0.75, -0.75,
             0.75, -0.75,
            -0.75,  0.75,
            -0.75,  0.75,
             0.75, -0.75,
             0.75,  0.75,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        const {
            drawingBufferWidth: width,
            drawingBufferHeight: height,
        } = gl;
        
        gl.viewport(0, 0, width, height);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const colors = [
            1.0, 0.0, 0.0, 1.0, // Red
            0.0, 1.0, 0.0, 1.0, // Green
            0.0, 0.0, 1.0, 1.0, // Blue
            1.0, 1.0, 0.0, 1.0, // Yellow
            0.0, 1.0, 1.0, 1.0, // Cyan
            1.0, 0.0, 1.0, 1.0, // Magenta
        ];


        gl.uniform4fv(colorUniformLocation, colors);
        

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        const dataURL = canvas.toDataURL();
        return await hashData(dataURL);

    } catch (error) {
        console.error("WebGL error:", error);
        return "webgl_error";
    }
}