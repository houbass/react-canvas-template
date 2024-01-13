

export function curvePatternFun(canvasSize ,yAxis, firstYShift, inputShifts) {
    const thisValus = []
    inputShifts.forEach((e, i) => {
        const segments = inputShifts.length;
        const segmentLength = canvasSize / segments;
        const cpx = (segmentLength * i) + (segmentLength / 2)

        // IF FOR FIRST ELEMENT
        let cpy1;
        if(i === 0) {
            cpy1 = yAxis + firstYShift
        } else{
            cpy1 = yAxis + (inputShifts[i - 1] * -1);
        }
        
        const cpy2 = yAxis + e
        const values = {
            start: {x: segmentLength * i, y: yAxis},
            cp1: {x: cpx, y: cpy1},
            cp2: {x: cpx, y: cpy2},
            end: {x: segmentLength * (i + 1), y: yAxis}
        }
        thisValus.push(values)
    });

    return thisValus;
}