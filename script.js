function compute() {
    const lado1 = document.getElementById('lado1').value.trim();
    const lado2 = document.getElementById('lado2').value.trim();
    const lado3 = document.getElementById('lado3').value.trim();
    
    // Regular expression to check if the input is a valid number
    const isNumber = /^-?\d+(\.\d+)?$/;
    
    let tipo = '';

    if (!isNumber.test(lado1) || !isNumber.test(lado2) || !isNumber.test(lado3)) {
        tipo = 'Datos incorrectos';
    } else {
        const numLado1 = parseFloat(lado1);
        const numLado2 = parseFloat(lado2);
        const numLado3 = parseFloat(lado3);
        
        if (numLado1 <= 0 || numLado2 <= 0 || numLado3 <= 0) {
            tipo = 'Datos incorrectos';
        } else if (numLado1 + numLado2 <= numLado3 || numLado1 + numLado3 <= numLado2 || numLado2 + numLado3 <= numLado1) {
            tipo = 'No es triángulo';
        } else if (numLado1 === numLado2 && numLado2 === numLado3) {
            tipo = 'Equilátero';
        } else if (numLado1 === numLado2 || numLado2 === numLado3 || numLado1 === numLado3) {
            tipo = 'Isósceles';
        } else {
            tipo = 'Escaleno';
        }
    }
    
    document.getElementById('tipo-triangulo').textContent = tipo;
}
